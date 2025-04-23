# 🎬 Movie Booking App

A full-stack **movie ticket booking application** built using:

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: AWS DynamoDB
- **CI/CD**: Jenkins (Build & Push Docker Images)
- **Deployment**: AWS ECS (Fargate) or AWS EBS
- **Containerization**: Docker + Docker Compose

---

## 📁 Project Structure

```
movie-booking/
├── client/                    # React frontend
├── server/                    # Node.js backend using DynamoDB
├── frontend.dockerfile
├── backend.dockerfile
├── docker-compose.yml
├── Jenkinsfile                # CI/CD pipeline
├── README.md
```

---

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/harish284/movie-booking.git
cd Movie_ticket_booking
```

### 2. Start Frontend & Backend (Locally)

#### Frontend

```bash
cd client
npm install
npm run dev
```

#### Backend

```bash
cd server
npm install
npm start
# OR
npx nodemon index.js
```

---

## 🐳 Docker Setup (Local)

You can run both frontend and backend using Docker Compose.

### Docker Compose Command

```bash
docker-compose up --build
```

This builds and runs both the React frontend and Node.js backend in isolated containers.

---

## 🐳 Docker Lifecycle for Movie Booking App

This project uses **Docker Compose** for building and managing both frontend and backend services.

### 🔄 Lifecycle Steps

1. **Dockerfile Setup**
   - `frontend.dockerfile` → React app from `client/`
   - `backend.dockerfile` → Node.js app from `server/`

2. **Docker Compose Configuration**
   - `docker-compose.yml` handles:
     - Building both images
     - Mapping ports (`80` → frontend, `5000` → backend)
     - Bridging containers on a shared internal network

```yaml
version: "3.8"

services:
  frontend:
    build:
      context: ./client
      dockerfile: ../frontend.dockerfile  
    ports:
      - "80:80"
    networks:
      - frontend_network
  
  backend:
    build:
      context: ./server
      dockerfile: ../backend.dockerfile  
    ports:
      - "5000:5000"
    networks:
      - frontend_network 

networks:
  frontend_network:
    driver: bridge
```

3. **Run the App (Locally)**

```bash
docker-compose up --build
```

4. **Production Deployment**
   - Jenkins builds and pushes Docker images to DockerHub or AWS ECR

---

## 🔐 Authentication API

| Endpoint           | Method | Description           |
|--------------------|--------|-----------------------|
| `/api/auth/signup` | POST   | Register new user     |
| `/api/auth/signin` | POST   | Login with credentials|

---

## 🎬 Movie API

| Endpoint              | Method | Description       |
|-----------------------|--------|-------------------|
| `/api/auth/getMovies` | GET    | List all movies   |
| `/api/auth/addMovies` | POST   | Add new movie     |

> More APIs for booking, payments, user roles, etc., can be added  
> Swagger integration can be added for API testing/documentation

---

##  Jenkins Pipeline Overview

### 🔁 Workflow

1. Jenkins pulls code from GitHub
2. Uses `docker-compose` to build frontend & backend images
3. Pushes images to DockerHub or AWS ECR
4. Triggers ECS Fargate deployment using latest images

---

## 🔐 AWS Credentials (Secure)

Stored securely via Jenkins credentials or ECS Task Definitions:

```
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

These are used in the backend to connect to **AWS DynamoDB** using the AWS SDK.

---

## Author

**Harish S** – Full-Stack Cloud DevOps Engineer  
🔗 GitHub: [github.com/harish284](https://github.com/harish284)

---

## 📄 License

MIT © 2025 Harish284
