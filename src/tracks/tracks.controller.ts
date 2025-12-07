import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { validate as isUUID } from 'uuid';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTrackDto: CreateTrackDto) {
    return await this.tracksService.create(createTrackDto);
  }

  @Get()
  async findAll() {
    return await this.tracksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID (not UUID)');
    }
    return await this.tracksService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID (not UUID)');
    }
    return await this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID (not UUID)');
    }
    await this.tracksService.remove(id);
  }
}
