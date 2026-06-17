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

- [v3.0.1](https://github.com/abeltran10/todocine_front_angular/releases/tag/v3.0.1)

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
<img width="1467" height="495" alt="Captura desde 2026-06-17 20-02-13" src="https://github.com/user-attachments/assets/9b2a6c00-5e51-4841-bf2c-01be8ac197cb" />

### Search results
<img width="873" height="928" alt="Captura desde 2026-06-17 20-04-17" src="https://github.com/user-attachments/assets/490577f2-2337-4424-9236-d95bf266e4a2" />


### Paginator
<img width="1421" height="786" alt="Captura desde 2026-06-14 21-50-55" src="https://github.com/user-attachments/assets/3684f956-d4e5-4434-9312-3ff584bcde75" />


### Movies in theaters
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-38-23" src="https://github.com/user-attachments/assets/1fe71228-3ce0-486e-8671-1dbcdc57d923" />

### Awards
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-38-42" src="https://github.com/user-attachments/assets/546d6df5-13a5-4466-bc4a-2687c304c290" />

### Movie detail
<img width="1261" height="907" alt="Captura desde 2026-06-17 20-03-18" src="https://github.com/user-attachments/assets/6e6a4db8-21ec-4acc-be7a-1b67f8e30a17" />



### Favourites
<img width="873" height="940" alt="Captura desde 2026-06-17 20-05-11" src="https://github.com/user-attachments/assets/5897b74d-eb51-43e0-9f67-2c6847fb2e9f" />


### Winner insert form (ADMIN)
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-39-51" src="https://github.com/user-attachments/assets/05783da2-d9b2-4611-83d1-50edf760f01f" />

### Public Lists

<img width="1361" height="602" alt="Captura desde 2026-06-14 22-09-59" src="https://github.com/user-attachments/assets/17ce2ef3-7f3b-42ca-be5a-3fa9d40311c4" />

<img width="1368" height="625" alt="Captura desde 2026-05-15 13-54-09" src="https://github.com/user-attachments/assets/27e0e347-42b0-4b8e-b6ff-49eae338d290" />



### Private Lists
<img width="1115" height="588" alt="Captura desde 2026-06-17 20-10-14" src="https://github.com/user-attachments/assets/db2a0b5d-477a-487f-b141-55ec9aed8120" />

<img width="1155" height="929" alt="Captura desde 2026-06-17 20-05-55" src="https://github.com/user-attachments/assets/d93c73ad-22b8-458c-b75b-73e37f92fb35" />


### Paginator in List's table of movies

<img width="1202" height="656" alt="Captura desde 2026-06-14 22-08-05" src="https://github.com/user-attachments/assets/8a63bb4f-6b14-4710-96fd-c09af9d59354" />


### Users' opinions about a list
<img width="1415" height="363" alt="Captura desde 2026-06-14 22-00-41" src="https://github.com/user-attachments/assets/667eed00-1458-41ca-865b-791ee0e8ab1f" />
















