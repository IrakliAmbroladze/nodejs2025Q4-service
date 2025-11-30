import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Track } from '../tracks/entities/track.entity';
import { Album } from '../albums/entities/album.entity';

@Injectable()
export class DatabaseService {
  users: User[] = [];
  artists: Artist[] = [];
  tracks: Track[] = [];
  albums: Album[] = [];
  favorites = {
    artists: [] as string[],
    albums: [] as string[],
    tracks: [] as string[],
  };

  deleteArtist(artistId: string): void {
    const artistFavIndex = this.favorites.artists.indexOf(artistId);
    if (artistFavIndex !== -1) {
      this.favorites.artists.splice(artistFavIndex, 1);
    }

    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });

    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  deleteAlbum(albumId: string): void {
    const albumFavIndex = this.favorites.albums.indexOf(albumId);
    if (albumFavIndex !== -1) {
      this.favorites.albums.splice(albumFavIndex, 1);
    }

    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }

  deleteTrack(trackId: string): void {
    const trackFavIndex = this.favorites.tracks.indexOf(trackId);
    if (trackFavIndex !== -1) {
      this.favorites.tracks.splice(trackFavIndex, 1);
    }
  }
}
