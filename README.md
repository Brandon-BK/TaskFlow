# TaskFlow

TaskFlow is a modern Kanban | Trello-style project management application built as a CS50x Final Project.

The application allows users to create projects, manage tasks, track progress, and organize workflows through a clean and responsive interface.

---

# Features

- User authentication with Firebase
- Create and manage projects
- Create, edit, and delete tasks
- Task priority levels
- Task status management
- Kanban board workflow
- Real-time database updates
- Responsive modern UI
- Toast notifications and modal interactions

---

# Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript (ES6 Modules)

## Backend / Services
- Firebase Authentication
- Firebase Firestore

---

# Project Structure

```bash id="9f0c4t"
TaskFlow/
│
├── index.html
├── styles.css
├── app.js
└── README.md
```

---

# Getting Started

## Clone the repository

```bash id="2cv9yt"
git clone https://github.com/yourusername/taskflow.git
```

---

## Navigate into the project

```bash id="tvjlwm"
cd taskflow
```

---

## Run the project

Since the project uses ES Modules, run it using a local server.

### VS Code Live Server
Install the Live Server extension and click:

```bash id="r0d5qq"
Go Live
```

---

### Python HTTP Server

```bash id="j9zk7k"
python -m http.server 5500
```

Open:

```bash id="x7h5lw"
http://localhost:5500
```

---

# Firebase Setup

Enable the following Firebase services:
- Authentication (Email/Password)
- Cloud Firestore

Update the Firebase configuration inside `app.js`.

---

# Learning Outcomes

This project helped improve understanding of:
- Firebase Authentication
- Firestore database integration
- CRUD operations
- Real-time applications
- DOM manipulation
- Responsive design
- State management

---

# Future Improvements

- Drag-and-drop tasks
- Team collaboration
- Search functionality
- Notifications
- TypeScript migration
- React migration

---

# Author

Brandon Kisibu

- GitHub: https://github.com/Brandon-BK
- edX username: brandon0611
