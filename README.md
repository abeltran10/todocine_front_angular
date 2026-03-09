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

    /enum: Strongly typed constants for Awards, Cines, and Regions.

    /guards: Security layer with AuthGuard (protected routes) and PublicGuard (login/register).

    /interceptors: Automatically injects the JWT Bearer Token into every HTTP request.

    /services: Centralized API communication logic.

    /models: TypeScript interfaces matching the Backend DTOs.

### Features Layer (/app/features)

Contains the functional modules of the app (e.g., Home, User Profile, Favoritos). Each feature is isolated to keep the project organized.

### Shared Layer (/app/shared)

Reusable resources used across multiple features.

    /common: Generic components like notification.

    /layout: Global structure components like Navbar, Paginator.


## Last release

- [v1.1.0](https://github.com/abeltran10/todocine_front_angular/releases/tag/v1.1.0)

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

<img width="1315" height="548" alt="Captura desde 2026-01-27 16-23-45" src="https://github.com/user-attachments/assets/493c9a5a-7916-4991-aa8c-af0bb090174f" />
<img width="1315" height="548" alt="Captura desde 2026-01-27 16-23-59" src="https://github.com/user-attachments/assets/a8b7b51d-28c0-48a3-b63c-fb4515aaae79" />
<img width="1356" height="927" alt="Captura desde 2026-01-27 16-24-42" src="https://github.com/user-attachments/assets/313754b7-85ad-430c-aec8-cc45d202cba3" />
<img width="1356" height="927" alt="Captura desde 2026-01-27 16-24-54" src="https://github.com/user-attachments/assets/6d2ce765-67d9-4f92-999d-1c4b2d529c37" />
<img width="1356" height="927" alt="Captura desde 2026-01-27 16-25-22" src="https://github.com/user-attachments/assets/6d7a6772-c00b-4f01-9ba8-2e8c86e3259e" />
<img width="1356" height="927" alt="Captura desde 2026-01-27 16-25-37" src="https://github.com/user-attachments/assets/df1eb23e-37b1-4b10-9dac-0bcbad0599e1" />



