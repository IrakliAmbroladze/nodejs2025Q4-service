import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = this.artistRepository.create(createArtistDto);
    return await this.artistRepository.save(newArtist);
  }

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    Object.assign(artist, updateArtistDto);
    return await this.artistRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Artist not found');
    }
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.artistRepository.count({ where: { id } });
    return count > 0;
  }
}
