import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoritesResponse } from './entities/favorites.entity';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const favorites = await this.favoriteRepository.find();

    const artistIds = favorites
      .filter((f) => f.entityType === 'artist')
      .map((f) => f.entityId);
    const albumIds = favorites
      .filter((f) => f.entityType === 'album')
      .map((f) => f.entityId);
    const trackIds = favorites
      .filter((f) => f.entityType === 'track')
      .map((f) => f.entityId);

    const artists = [];
    for (const id of artistIds) {
      try {
        const artist = await this.artistsService.findOne(id);
        artists.push(artist);
      } catch {
        // Skip if not found
      }
    }

    const albums = [];
    for (const id of albumIds) {
      try {
        const album = await this.albumsService.findOne(id);
        albums.push(album);
      } catch {
        // Skip if not found
      }
    }

    const tracks = [];
    for (const id of trackIds) {
      try {
        const track = await this.tracksService.findOne(id);
        tracks.push(track);
      } catch {
        // Skip if not found
      }
    }

    return { artists, albums, tracks };
  }

  async addTrack(id: string): Promise<void> {
    const exists = await this.tracksService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    const existing = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'track' },
    });

    if (!existing) {
      const favorite = this.favoriteRepository.create({
        entityId: id,
        entityType: 'track',
      });
      await this.favoriteRepository.save(favorite);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const result = await this.favoriteRepository.delete({
      entityId: id,
      entityType: 'track',
    });
    if (result.affected === 0) {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  async addAlbum(id: string): Promise<void> {
    const exists = await this.albumsService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    const existing = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'album' },
    });

    if (!existing) {
      const favorite = this.favoriteRepository.create({
        entityId: id,
        entityType: 'album',
      });
      await this.favoriteRepository.save(favorite);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const result = await this.favoriteRepository.delete({
      entityId: id,
      entityType: 'album',
    });
    if (result.affected === 0) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  async addArtist(id: string): Promise<void> {
    const exists = await this.artistsService.exists(id);
    if (!exists) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    const existing = await this.favoriteRepository.findOne({
      where: { entityId: id, entityType: 'artist' },
    });

    if (!existing) {
      const favorite = this.favoriteRepository.create({
        entityId: id,
        entityType: 'artist',
      });
      await this.favoriteRepository.save(favorite);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const result = await this.favoriteRepository.delete({
      entityId: id,
      entityType: 'artist',
    });
    if (result.affected === 0) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }
}
