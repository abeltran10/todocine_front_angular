# TODO CINE (Angular)

This is the web client for the [Todo Cine API](https://github.com/abeltran10/todocine_backend), built with Angular 21. The application allows users to browse a vast catalog of movies, manage their favourites, and keep track of award-winning films.

## Requirements

Framework: Angular CLI 21.1.0

Environment: Node.js 24.13.0

Styling: Bootstrap 5 & Font Awesome 6 (Icons)

State Management: Service-based (BehaviorSubjects & Observables)

Authentication: JWT (JSON Web Tokens) with automated interceptors

## Architecture Pattern

The project follows a Modular Clean Architecture to ensure scalability and separation of concerns:

### Core Layer (/app/core)

The "brain" of the application. Contains singleton services and universal configurations.

- /enum: Strongly typed constants for Cines, and Regions.

- /guards: Security layer with AuthGuard (protected routes) and PublicGuard (login/register).

- /interceptors: Automatically injects the JWT Bearer Token into every HTTP request.

- /services: Centralized API communication logic.

- /models: TypeScript interfaces matching the Backend DTOs.

### Features Layer (/app/features)

Contains the functional modules of the app (e.g., Home, User Profile, Favoritos). Each feature is isolated to keep the project organized.

### Shared Layer (/app/shared)

Reusable resources used across multiple features.

- /common: Generic components like Notification, Paginator.

- /layout: Global structure components like Navbar.


## Last release

- [v2.0.1](https://github.com/abeltran10/todocine_front_angular/releases/tag/v2.0.1)

## Commands

### Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/app`. The application will automatically reload whenever you modify any of the source files.


### Building

To build the project run:

```bash
npm run build
```
This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.


## UI
### Login
<img width="1315" height="548" alt="Captura desde 2026-01-27 16-23-45" src="https://github.com/user-attachments/assets/493c9a5a-7916-4991-aa8c-af0bb090174f" />

### Search
<img width="1315" height="548" alt="Captura desde 2026-01-27 16-23-59" src="https://github.com/user-attachments/assets/a8b7b51d-28c0-48a3-b63c-fb4515aaae79" />

### Results search
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-37-40" src="https://github.com/user-attachments/assets/ff57ceac-b5a6-4496-9f7c-b9c27ab7764a" />

### Paginator
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-37-51" src="https://github.com/user-attachments/assets/8aee4a11-a916-490c-91c9-f2d8c1aa3814" />

### Movies in theaters
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-38-23" src="https://github.com/user-attachments/assets/1fe71228-3ce0-486e-8671-1dbcdc57d923" />

### Awards
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-38-42" src="https://github.com/user-attachments/assets/546d6df5-13a5-4466-bc4a-2687c304c290" />

### Movie detail
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-38-53" src="https://github.com/user-attachments/assets/bdf4ede4-60ef-4f28-beca-f343e807057b" />

### Favourites
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-39-20" src="https://github.com/user-attachments/assets/6abf8630-f218-440d-97cb-5503bc02aba6" />

### Winner insert form (ADMIN)
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-39-51" src="https://github.com/user-attachments/assets/05783da2-d9b2-4611-83d1-50edf760f01f" />









