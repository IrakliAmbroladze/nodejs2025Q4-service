import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Track } from './entities/track.entity';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TracksService {
  constructor(private readonly db: DatabaseService) {}

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    };

    this.db.tracks.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return this.db.tracks;
  }

  findOne(id: string): Track {
    const track = this.db.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const trackIndex = this.db.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack: Track = {
      id,
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId ?? null,
      albumId: updateTrackDto.albumId ?? null,
      duration: updateTrackDto.duration,
    };

    this.db.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string): void {
    const trackIndex = this.db.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }
    this.db.tracks.splice(trackIndex, 1);
  }

  exists(id: string): boolean {
    return this.db.tracks.some((track) => track.id === id);
  }
}
