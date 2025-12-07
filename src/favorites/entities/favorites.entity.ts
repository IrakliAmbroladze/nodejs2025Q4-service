import { Artist } from '../../artists/entities/artist.entity';
import { Album } from '../../albums/entities/album.entity';
import { Track } from '../../tracks/entities/track.entity';

export type Favorites = {
  artists: string[];
  albums: string[];
  tracks: string[];
};

export type FavoritesResponse = {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};
