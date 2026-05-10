# Notes App (TCC_ELyu)

## Prasyarat
- Node.js
- MySQL (user: root, password: kosong)

## Setup database
1. Pastikan MySQL berjalan.
2. Jalankan file schema:
   - `mysql -u root < database.sql`

File ini akan membuat database `ual_note` dan tabel `notes`.

## Jalankan backend
1. `cd backend`
2. `npm install`
3. `npm start`

Server berjalan di `http://localhost:3000`.

## Jalankan frontend
- Buka `frontend/index.html` di browser, atau gunakan Live Server.

Frontend akan memakai API `http://localhost:3000/notes`.

## Endpoint API
- `GET /notes`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`
