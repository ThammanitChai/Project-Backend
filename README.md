[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iG82Gnyy)

## API Overview

- **Authentication**
  - `POST /api/v1/auth/register` – register a new user (name, tel, email, password)
  - `POST /api/v1/auth/login` – login with email & password
  - `GET /api/v1/auth/logout` – logout
  - `GET /api/v1/auth/me` – get current user (protected)

- **Spaces (co-working)**
  - `GET /api/v1/spaces` – list all co-working spaces (public)
  - `POST /api/v1/spaces` – create new space (admin only)
  - `GET /api/v1/spaces/:id` – get a space by id
  - `PUT /api/v1/spaces/:id` – update a space (admin only)
  - `DELETE /api/v1/spaces/:id` – delete a space (admin only)

- **Reservations**
  - `GET /api/v1/reservations` – get reservations for current user (admin sees all)
  - `GET /api/v1/spaces/:spaceId/reservations` – get reservations for a specific space
  - `POST /api/v1/spaces/:spaceId/reservations` – make a reservation (max 3/user)
  - `PUT /api/v1/reservations/:id` – update own reservation (admin can update any)
  - `DELETE /api/v1/reservations/:id` – delete own reservation (admin can delete any)
