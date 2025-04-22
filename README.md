# 🎬 Movie Booking App

A full-stack **movie ticket booking application** built using:

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: AWS DynamoDB
- **CI/CD**: Jenkins (Build & Push Docker Images)
- **Deployment**: AWS ECS (Fargate)
- **Containerization**: Docker + Docker Compose

---

## 📁 Project Structure

```
movie-booking/
|└── frontend.dockerfile
| └── backend.dockerfile
├── client/                    # React frontend
│   
├── server/                    # Node.js backend and using dynamo db
├── docker-compose.yml
├── Jenkinsfile                # CI/CD pipeline
├── README.md
```

---

## 🔧 Local Setup Instructions

### 1. Clone the Repository


### 2. Start Frontend & Backend

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
npm start or npx nodemon index.js
```

---

## 🐳 Docker Setup (Local)

You can run both frontend and backend using Docker Compose.

### 1. Docker Compose Command

```bash
docker-compose up --build
```




#### Authentication

| Endpoint           | Method | Description           |
|--------------------|--------|-----------------------|
| api/auth/signup     | POST   | Register new user     |
| api/auth/signin       | POST   | Login with credentials|

#### Movies

| Endpoint           | Method | Description           |
|--------------------|--------|-----------------------|
| api/auth/getMovies | GET    | List all movies       |
| api/auth/addMovies | POST   | Add  movies           |


> Add all other API for other workflows

> [ You can integrate Swagger later for UI-based docs.]

---

## ⚙️ Jenkins Pipeline Overview

### 🔁 Workflow

1. Jenkins pulls code from GitHub repo
2. Builds Docker images for frontend and backend using Dockerfiles
3. Pushes images to DockerHub or ECR
4. Deploys the latest containers to AWS ECS (Fargate)

---


### AWS Credentials

> Used `.env` file (not committed) with:
```
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

These were injected into Jenkins pipeline securely. Backend connects to DynamoDB using AWS SDK.

---

## Author

**Harish284** – Full-Stack Cloud DevOps Engineer  
🔗 GitHub: [github.com/harish284](https://github.com/harish284)

---

## 📄 License

MIT © 2025 Harish284
