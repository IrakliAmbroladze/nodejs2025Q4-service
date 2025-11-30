import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ArtistsService {
  constructor(private readonly db: DatabaseService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.db.artists.push(newArtist);
    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    return this.db.artists;
  }

  async findOne(id: string): Promise<Artist> {
    const artist = this.db.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artistIndex = this.db.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist: Artist = {
      id,
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy,
    };

    this.db.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  async remove(id: string): Promise<void> {
    const artistIndex = this.db.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }
    this.db.artists.splice(artistIndex, 1);
    this.db.deleteArtist(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.db.artists.some((artist) => artist.id === id);
  }
}
