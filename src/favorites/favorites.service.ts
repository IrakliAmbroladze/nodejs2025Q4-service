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

  findAll(): FavoritesResponse {
    const artists = this.db.favorites.artists
      .map((id) => {
        try {
          return this.artistsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((artist) => artist !== null);

    const albums = this.db.favorites.albums
      .map((id) => {
        try {
          return this.albumsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((album) => album !== null);

    const tracks = this.db.favorites.tracks
      .map((id) => {
        try {
          return this.tracksService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((track) => track !== null);

    return { artists, albums, tracks };
  }

  addTrack(id: string): void {
    if (!this.tracksService.exists(id)) {
      throw new UnprocessableEntityException('Track does not exist');
    }
    if (!this.db.favorites.tracks.includes(id)) {
      this.db.favorites.tracks.push(id);
    }
  }

  removeTrack(id: string): void {
    const index = this.db.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }
    this.db.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string): void {
    if (!this.albumsService.exists(id)) {
      throw new UnprocessableEntityException('Album does not exist');
    }
    if (!this.db.favorites.albums.includes(id)) {
      this.db.favorites.albums.push(id);
    }
  }

  removeAlbum(id: string): void {
    const index = this.db.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }
    this.db.favorites.albums.splice(index, 1);
  }

  addArtist(id: string): void {
    if (!this.artistsService.exists(id)) {
      throw new UnprocessableEntityException('Artist does not exist');
    }
    if (!this.db.favorites.artists.includes(id)) {
      this.db.favorites.artists.push(id);
    }
  }

  removeArtist(id: string): void {
    const index = this.db.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }
    this.db.favorites.artists.splice(index, 1);
  }
}
