
# Task Management

**TODO**:

- [ ] Build Task Hierarchy from DB
- [ ] add more tests and code coverage
- [ ] add costs for each task

### Prerequisites

- Docker
- Docker Compose

### Project Structure

The application consists of three main components:

1.  **Backend**: Go API server
2.  **Frontend**: React web application
3.  **Database**: PostgreSQL database

## Running the Application with Docker

#### Build and Start All Services


```bash
make  up
```

#### Access the Application

- Frontend: http://localhost:80
- Backend API: http://localhost:8080
- PostgreSQL Database: localhost:5432

### Features:

- Live user mouse tracking
- Retrieve and Create tasks
- Promote or move Tasks (Backend only)
- Added tests to simulate multiple parallel requests to this
- Mark all tasks as complete (including subtasks) (Backend only)