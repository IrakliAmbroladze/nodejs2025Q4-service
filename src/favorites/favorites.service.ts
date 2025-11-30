import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesResponse } from './entities/favorites.entity';
import { DatabaseService } from '../database/database.service';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const artists = await Promise.all(
      this.db.favorites.artists.map(async (id) => {
        try {
          return await this.artistsService.findOne(id);
        } catch {
          return null;
        }
      }),
    );

    const albums = await Promise.all(
      this.db.favorites.albums.map(async (id) => {
        try {
          return await this.albumsService.findOne(id);
        } catch {
          return null;
        }
      }),
    );

    const tracks = await Promise.all(
      this.db.favorites.tracks.map(async (id) => {
        try {
          return await this.tracksService.findOne(id);
        } catch {
          return null;
        }
      }),
    );

    return {
      artists: artists.filter((artist) => artist !== null),
      albums: albums.filter((album) => album !== null),
      tracks: tracks.filter((track) => track !== null),
    };
  }

  async addTrack(id: string): Promise<void> {
    const exists = await this.tracksService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Track does not exist');
    }
    if (!this.db.favorites.tracks.includes(id)) {
      this.db.favorites.tracks.push(id);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const index = this.db.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }
    this.db.favorites.tracks.splice(index, 1);
  }

  async addAlbum(id: string): Promise<void> {
    const exists = await this.albumsService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Album does not exist');
    }
    if (!this.db.favorites.albums.includes(id)) {
      this.db.favorites.albums.push(id);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const index = this.db.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }
    this.db.favorites.albums.splice(index, 1);
  }

  async addArtist(id: string): Promise<void> {
    const exists = await this.artistsService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Artist does not exist');
    }
    if (!this.db.favorites.artists.includes(id)) {
      this.db.favorites.artists.push(id);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const index = this.db.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }
    this.db.favorites.artists.splice(index, 1);
  }
}
