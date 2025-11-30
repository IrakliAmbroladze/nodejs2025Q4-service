import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Album } from './entities/album.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlbumsService {
  constructor(private readonly db: DatabaseService) {}

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    };

    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.db.albums;
  }

  findOne(id: string): Album {
    const album = this.db.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const albumIndex = this.db.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    const updatedAlbum: Album = {
      id,
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
      artistId: updateAlbumDto.artistId ?? null,
    };

    this.db.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string): void {
    const albumIndex = this.db.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }
    this.db.albums.splice(albumIndex, 1);
  }

  exists(id: string): boolean {
    return this.db.albums.some((album) => album.id === id);
  }
}
