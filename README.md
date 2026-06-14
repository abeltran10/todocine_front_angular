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

- [v2.1.8](https://github.com/abeltran10/todocine_front_angular/releases/tag/v2.1.8)

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
<img width="1421" height="611" alt="Captura desde 2026-06-14 21-50-23" src="https://github.com/user-attachments/assets/fa0a30e6-2a66-412c-84a0-c0536530cd7a" />


### Results search
<img width="1197" height="928" alt="Captura desde 2026-06-14 22-05-29" src="https://github.com/user-attachments/assets/d929c30b-2cb1-423d-943d-3bb947644cb2" />


### Paginator
<img width="1421" height="786" alt="Captura desde 2026-06-14 21-50-55" src="https://github.com/user-attachments/assets/3684f956-d4e5-4434-9312-3ff584bcde75" />


### Movies in theaters
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-38-23" src="https://github.com/user-attachments/assets/1fe71228-3ce0-486e-8671-1dbcdc57d923" />

### Awards
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-38-42" src="https://github.com/user-attachments/assets/546d6df5-13a5-4466-bc4a-2687c304c290" />

### Movie detail
<img width="1421" height="922" alt="Captura desde 2026-06-14 21-51-25" src="https://github.com/user-attachments/assets/b0ad560f-be8d-4797-a072-e30af17c72ab" />


### Favorites
<img width="1197" height="921" alt="Captura desde 2026-06-14 22-04-27" src="https://github.com/user-attachments/assets/1417a3bf-9943-49c1-a2d1-b03792248dd6" />


### Winner insert form (ADMIN)
<img width="1155" height="824" alt="Captura desde 2026-03-13 20-39-51" src="https://github.com/user-attachments/assets/05783da2-d9b2-4611-83d1-50edf760f01f" />

### Public Lists

<img width="1368" height="550" alt="Captura desde 2026-05-15 13-53-57" src="https://github.com/user-attachments/assets/b8ea9689-010b-477f-8c53-22f55420f0fe" />
<img width="1368" height="625" alt="Captura desde 2026-05-15 13-54-09" src="https://github.com/user-attachments/assets/27e0e347-42b0-4b8e-b6ff-49eae338d290" />



### Private List

<img width="1368" height="625" alt="Captura desde 2026-05-15 13-54-27" src="https://github.com/user-attachments/assets/cc3bfdba-9d69-4da7-9315-a44e6de44700" />
<img width="1415" height="925" alt="Captura desde 2026-06-14 22-01-30" src="https://github.com/user-attachments/assets/afa8b89c-8837-4a59-a74e-5e13117bdc9e" />


### Paginator in List's table of movies

<img width="1202" height="656" alt="Captura desde 2026-06-14 22-08-05" src="https://github.com/user-attachments/assets/8a63bb4f-6b14-4710-96fd-c09af9d59354" />


### Users's opinions about a list

<img width="1269" height="929" alt="Captura desde 2026-06-13 18-14-25" src="https://github.com/user-attachments/assets/5d5df8af-71e1-4531-9cea-2a934e239972" />
<img width="1175" height="645" alt="Captura desde 2026-06-13 18-16-22" src="https://github.com/user-attachments/assets/26576eb6-f210-4fbc-b569-a79bbc8f235b" />















