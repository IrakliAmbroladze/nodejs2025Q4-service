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
}
