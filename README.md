# TechStock Tracker

Production-level MERN stack Inventory and Order Management System for an electronic product design and development company.

## Stack

- Frontend: React (JSX), Tailwind CSS, Axios, React Router
- Backend: Node.js, Express.js, JWT auth, Mongoose
- Database: MongoDB

## Roles

- `admin`
- `user`

## Major Features

- User registration and login with JWT
- Role-based route protection
- Product inventory CRUD
- Cart system (`add`, `view`, `remove`)
- Order system (`place`, `view`, `update`, `delete`)
- User order update/delete window: 6 hours
- Admin order approval/rejection
- Low stock warning when quantity `< 25`
- Admin dashboard cards and reports
- Feedback and contact support pages
- Toast notifications and loading spinners

## Folder Structure

```text
root
 |-- backend
 |      |-- config
 |      |-- controllers
 |      |-- middleware
 |      |-- models
 |      |-- routes
 |      |-- server.js
 |
 |-- frontend
        |-- src
             |-- components
             |-- pages
             |-- context
             |-- services
             |-- App.jsx
             |-- main.jsx
```

## Mongoose Models

- `User`: `name`, `email`, `password`, `role`
- `Product`: `name`, `description`, `price`, `category`, `quantity`, `image`, `createdAt`
- `Order`: `userId`, `products`, `totalPrice`, `orderDate`, `status`
- `Cart`: `userId`, `items`
- `Feedback`: `name`, `email`, `message`

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Cart

- `POST /api/cart/add`
- `GET /api/cart`
- `DELETE /api/cart/:id`

### Orders

- `POST /api/orders`
- `GET /api/orders`
- `PUT /api/orders/:id`
- `DELETE /api/orders/:id`

### Feedback

- `POST /api/feedback`

### Reports (admin)

- `GET /api/reports/dashboard`
- `GET /api/reports/inventory`
- `GET /api/reports/purchases`

## Environment Variables

### Backend (`backend/.env`)

```env
MONGO_URI=mongodb://127.0.0.1:27017/techstock_tracker
JWT_SECRET=replace_with_secure_secret
PORT=5000
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Run Instructions

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

- If port `5000` is busy, backend auto-retries on the next free port.
- If backend runs on another port, update `frontend/.env` (`VITE_API_BASE_URL`).
- MongoDB must be running before backend startup.