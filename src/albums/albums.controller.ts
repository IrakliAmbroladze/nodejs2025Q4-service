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
import { AlbumsService } from './albums.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { validate as isUUID } from 'uuid';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.albumsService.create(createAlbumDto);
  }

  @Get()
  async findAll() {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album ID (not UUID)');
    }
    return await this.albumsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album ID (not UUID)');
    }
    return await this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album ID (not UUID)');
    }
    await this.albumsService.remove(id);
  }
}
