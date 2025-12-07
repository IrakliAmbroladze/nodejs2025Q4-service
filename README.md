# Home Library Service

A RESTful API service for managing a personal music library. Built with NestJS, PostgreSQL, TypeORM, and Docker.

## Prerequisites

- **Docker** >= 20.x ([Install Docker](https://docs.docker.com/engine/install/))
- **Docker Compose** >= 2.x
- **Node.js** >= 24.10.0 (for local development only)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/IrakliAmbroladze/nodejs2025Q4-service.git
cd nodejs2025Q4-service
git checkout develop
npm install
```

### 2. Configure Environment Variables

Create a `.env` and `.env.local` files in the root directory:

```
cat > .env << 'EOF'
PORT=4000

CRYPT_SALT=10
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

NODE_ENV=production

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library
EOF

cat > .env.local << 'EOF'
PORT=4000

CRYPT_SALT=10
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

NODE_ENV=development

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library
EOF

```

> **Note:** For local development, create `.env.local` with `POSTGRES_HOST=localhost`

### 3. Start with Docker Compose

```bash
# Build and start containers
docker-compose up -d

```

### 4. Run Database Migrations

```bash
npm run migration:run
```

### 5. Access the Application

- **API Base URL:** `http://localhost:4000`
- **Swagger Documentation:** `http://localhost:4000/doc`


## Running Tests

```bash
npm test
```


## API Endpoints

All endpoints are available at `http://localhost:4000`

### Users (`/user`)

```bash
# Get all users
GET /user

# Get user by ID
GET /user/:id

# Create user
POST /user
Body: { "login": "username", "password": "password" }

# Update password
PUT /user/:id
Body: { "oldPassword": "old", "newPassword": "new" }

# Delete user
DELETE /user/:id
```

### Artists (`/artist`)

```bash
# Get all artists
GET /artist

# Get artist by ID
GET /artist/:id

# Create artist
POST /artist
Body: { "name": "Artist Name", "grammy": true }

# Update artist
PUT /artist/:id
Body: { "name": "Updated Name", "grammy": false }

# Delete artist
DELETE /artist/:id
```

### Albums (`/album`)

```bash
# Get all albums
GET /album

# Get album by ID
GET /album/:id

# Create album
POST /album
Body: { "name": "Album Name", "year": 2024, "artistId": "uuid-or-null" }

# Update album
PUT /album/:id
Body: { "name": "Updated Name", "year": 2024, "artistId": "uuid-or-null" }

# Delete album
DELETE /album/:id
```

### Tracks (`/track`)

```bash
# Get all tracks
GET /track

# Get track by ID
GET /track/:id

# Create track
POST /track
Body: { "name": "Track Name", "duration": 300, "artistId": "uuid-or-null", "albumId": "uuid-or-null" }

# Update track
PUT /track/:id
Body: { "name": "Updated Name", "duration": 300, "artistId": "uuid-or-null", "albumId": "uuid-or-null" }

# Delete track
DELETE /track/:id
```

### Favorites (`/favs`)

```bash
# Get all favorites (returns full objects, not IDs)
GET /favs

# Add to favorites
POST /favs/track/:id
POST /favs/album/:id
POST /favs/artist/:id

# Remove from favorites
DELETE /favs/track/:id
DELETE /favs/album/:id
DELETE /favs/artist/:id
```

## API Response Status Codes

| Code | Description |
|------|-------------|
| 200  | Success (GET, PUT) |
| 201  | Created (POST) |
| 204  | No Content (DELETE) |
| 400  | Bad Request (invalid UUID or missing fields) |
| 403  | Forbidden (wrong password) |
| 404  | Not Found |
| 422  | Unprocessable Entity (entity doesn't exist when adding to favorites) |

## Architecture

### Application Structure

```
src/
├── config/
│   └── typeorm.config.ts      # Database configuration
├── migrations/                # Database migrations
├── users/                     # Users module
│   ├── entities/
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── artists/                   # Artists module
├── albums/                    # Albums module
├── tracks/                    # Tracks module
├── favorites/                 # Favorites module
└── main.ts                    # Application entry point
```

## Database Schema

### Tables and Relations

```sql
users (id, login, password, version, createdAt, updatedAt)

artists (id, name, grammy)
  ↓ One-to-Many
albums (id, name, year, artistId [FK → artists])
  ↓ One-to-Many
tracks (id, name, duration, artistId [FK → artists], albumId [FK → albums])

favorites (id, entityId, entityType)
```

### Foreign Key Constraints

- `albums.artistId` → `artists.id` (ON DELETE SET NULL)
- `tracks.artistId` → `artists.id` (ON DELETE SET NULL)
- `tracks.albumId` → `albums.id` (ON DELETE SET NULL)

When an artist or album is deleted, related references are automatically set to `null`.

## Environment Variables

| Variable | Description | Default | Docker Value |
|----------|-------------|---------|--------------|
| `PORT` | Application port | `4000` | `4000` |
| `NODE_ENV` | Environment | `development` | `production` |
| `POSTGRES_HOST` | PostgreSQL host | `localhost` | `postgres` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` | `5432` |
| `POSTGRES_USER` | Database user | `postgres` | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgres` | `postgres` |
| `POSTGRES_DB` | Database name | `home_library` | `home_library` |

## Docker Image

### Check Image Size

```bash
docker images | grep home-library

```

### Pull from Docker Hub

```bash
docker pull irakliambroladze/home-library-service:latest
```

### Container Keeps Restarting

```bash
# Check application logs
docker-compose logs -f app

```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Rebuild
docker-compose build --no-cache

# Start fresh
docker-compose up -d

# Run migrations
npm run migration:run
```

## Local Development (without Docker)

### Setup

```bash
# Install dependencies
npm install

# Start local PostgreSQL (Docker)
docker run -d \
  --name postgres-local \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=home_library \
  -p 5432:5432 \
  postgres:16-alpine

# Create .env.local
cat > .env.local << EOF
PORT=4000
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library
EOF

# Run migrations
npm run migration:run

# Start application
npm run start:dev
```

