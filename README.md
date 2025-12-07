# Home Library Service

A RESTful API service for managing a personal music library built with NestJS. Users can manage Artists, Albums, Tracks, and maintain a Favorites collection.

## Features

- **CRUD Operations** for Users, Artists, Albums, and Tracks
- **Favorites Management** - Add/remove items to/from favorites
- **Data Validation** - Request validation using DTOs and class-validator
- **UUID Validation** - All IDs are validated as UUIDs
- **Cascading Deletes** - Automatic cleanup of references when entities are deleted
- **Password Security** - User passwords are never exposed in responses
- **In-Memory Storage** - Fast data access with easy migration path to databases
- **Error Handling** - Proper HTTP status codes (200, 201, 204, 400, 403, 404, 422)

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/IrakliAmbroladze/nodejs2025Q4-service
```

## Installing NPM modules

```
npm install
```

## Running application

Create `.env` file in the root directory:

```env
PORT=4000
```

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

## Architecture

The application follows a modular architecture:

```
src/
├── database/
├── users/
├── artists/
├── albums/
├── tracks/
└── favorites/
```

Each module contains:

- **Controller** - Handles HTTP requests and responses
- **Service** - Business logic and data operations
- **Entities** - TypeScript interfaces for data models
- **DTOs** - Data Transfer Objects for validation

## API Endpoints

### Users (`/user`)

| Method | Endpoint    | Description          | Status Codes       |
| ------ | ----------- | -------------------- | ------------------ |
| GET    | `/user`     | Get all users        | 200                |
| GET    | `/user/:id` | Get user by ID       | 200, 400, 404      |
| POST   | `/user`     | Create new user      | 201, 400           |
| PUT    | `/user/:id` | Update user password | 200, 400, 403, 404 |
| DELETE | `/user/:id` | Delete user          | 204, 400, 404      |

### Artists (`/artist`)

| Method | Endpoint      | Description       | Status Codes  |
| ------ | ------------- | ----------------- | ------------- |
| GET    | `/artist`     | Get all artists   | 200           |
| GET    | `/artist/:id` | Get artist by ID  | 200, 400, 404 |
| POST   | `/artist`     | Create new artist | 201, 400      |
| PUT    | `/artist/:id` | Update artist     | 200, 400, 404 |
| DELETE | `/artist/:id` | Delete artist     | 204, 400, 404 |

### Albums (`/album`)

| Method | Endpoint     | Description      | Status Codes  |
| ------ | ------------ | ---------------- | ------------- |
| GET    | `/album`     | Get all albums   | 200           |
| GET    | `/album/:id` | Get album by ID  | 200, 400, 404 |
| POST   | `/album`     | Create new album | 201, 400      |
| PUT    | `/album/:id` | Update album     | 200, 400, 404 |
| DELETE | `/album/:id` | Delete album     | 204, 400, 404 |

### Tracks (`/track`)

| Method | Endpoint     | Description      | Status Codes  |
| ------ | ------------ | ---------------- | ------------- |
| GET    | `/track`     | Get all tracks   | 200           |
| GET    | `/track/:id` | Get track by ID  | 200, 400, 404 |
| POST   | `/track`     | Create new track | 201, 400      |
| PUT    | `/track/:id` | Update track     | 200, 400, 404 |
| DELETE | `/track/:id` | Delete track     | 204, 400, 404 |

### Favorites (`/favs`)

| Method | Endpoint           | Description                  | Status Codes  |
| ------ | ------------------ | ---------------------------- | ------------- |
| GET    | `/favs`            | Get all favorites            | 200           |
| POST   | `/favs/track/:id`  | Add track to favorites       | 201, 400, 422 |
| DELETE | `/favs/track/:id`  | Remove track from favorites  | 204, 400, 404 |
| POST   | `/favs/album/:id`  | Add album to favorites       | 201, 400, 422 |
| DELETE | `/favs/album/:id`  | Remove album from favorites  | 204, 400, 404 |
| POST   | `/favs/artist/:id` | Add artist to favorites      | 201, 400, 422 |
| DELETE | `/favs/artist/:id` | Remove artist from favorites | 204, 400, 404 |
