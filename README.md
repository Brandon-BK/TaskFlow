# TaskFlow

TaskFlow is a modern Kanban-style project management application built as a CS50x Final Project.

The platform enables users to manage projects, organize tasks, track productivity, and maintain workflow visibility through a clean and responsive interface powered by Firebase and modern JavaScript.

---

# Overview

TaskFlow is designed to provide a focused workspace for managing tasks and projects efficiently.

The application supports:
- User authentication
- Project organization
- Task management
- Priority tracking
- Kanban workflows
- Real-time updates
- Responsive layouts

The project was developed using:
- HTML5
- CSS3
- Vanilla JavaScript (ES6 Modules)
- Firebase Authentication
- Firebase Firestore

---

# Features

## Authentication
- User registration
- Secure login/logout
- Firebase Authentication integration
- Personalized user sessions

---

## Project Management
- Create multiple projects
- Add project descriptions
- Assign project colors
- Organize tasks by project

---

## Task Management
- Create tasks
- Edit tasks
- Delete tasks
- Update task statuses
- Add task notes
- Set due dates
- Assign task priorities

### Priority Levels
- High
- Medium
- Low

### Task States
- To Do
- In Progress
- Done

---

## Productivity Dashboard
The sidebar provides:
- Total task count
- In-progress task count
- Completed task count

---

## User Interface
- Responsive design
- Modern dark-themed UI
- Interactive modals
- Toast notifications
- Smooth animations and transitions
- Kanban board layout

---

# Technical Highlights

## Real-Time Firestore Updates

The application uses Firestore snapshot listeners to provide real-time updates to tasks and projects.

```js id="z1l3yw"
onSnapshot(collection(db, 'tasks'), snap => {
  tasks = snap.docs.map(...)
})
```

---

## Modular JavaScript Architecture

The application uses:
- ES6 modules
- state-driven rendering
- reusable UI rendering functions

---

## User-Based Data Filtering

Projects and tasks are filtered using the authenticated user ID to ensure users only access their own data.

```js id="v4tqjn"
.filter(t => t.uid === currentUser.uid)
```

---

# Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript (ES6 Modules)

## Backend / Services
- Firebase Authentication
- Firebase Firestore

## Design
- Custom CSS architecture
- Responsive design principles
- CSS animations and transitions

## Fonts
- Syne
- DM Sans

---

# Project Structure

```bash id="gq7l5f"
TaskFlow/
│
├── index.html
├── styles.css
├── app.js
├── README.md
│
└── assets/
    └── screenshots/
```

---

# Getting Started

## Clone the Repository

```bash id="v5c54m"
git clone https://github.com/yourusername/taskflow.git
```

---

## Navigate Into the Project

```bash id="96b7h8"
cd taskflow
```

---

## Run the Application

Since the project uses ES Modules (`type="module"`), it should be run using a local server.

### Option 1 — VS Code Live Server
Install the Live Server extension and run the project using:

```bash id="j2d4cc"
Go Live
```

---

### Option 2 — Python HTTP Server

```bash id="mdw4tt"
python -m http.server 5500
```

Then open:

```bash id="4m0gx8"
http://localhost:5500
```

---

# Firebase Setup

This project uses Firebase for:
- Authentication
- Firestore Database

## Required Firebase Services
Enable:
- Firebase Authentication (Email/Password)
- Cloud Firestore

---

## Firebase Configuration

Inside `app.js`:

```js id="p4ksg9"
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};
```

---

# Core Functionalities

| Feature | Status |
|---|---|
| Authentication | Complete |
| Real-Time Database | Complete |
| Task CRUD Operations | Complete |
| Project CRUD Operations | Complete |
| Kanban Workflow | Complete |
| Filtering System | Complete |
| Responsive Design | Complete |
| Toast Notifications | Complete |

---

# Responsive Design

The application is optimized for:
- Desktop devices
- Tablets
- Mobile devices

Responsive layouts dynamically adjust:
- Sidebar visibility
- Kanban columns
- Content spacing

---

# Design System

## Theme Colors

| Purpose | Color |
|---|---|
| Accent | `#e8ff47` |
| Secondary Accent | `#47c8ff` |
| Danger | `#ff5f5f` |
| Background | `#0c0c0f` |

---

# Learning Outcomes

This project strengthened understanding of:
- Firebase Authentication
- Firestore database integration
- Real-time applications
- DOM manipulation
- State management
- Responsive CSS architecture
- CRUD operations
- UI/UX design principles
- Frontend application structure

---

# Future Improvements

## Planned Features
- Drag-and-drop task management
- Team collaboration
- Search functionality
- Activity tracking
- Notifications
- File uploads
- User profile management
- Role-based permissions

---

## Technical Improvements
- TypeScript migration
- React or Next.js migration
- Unit testing
- End-to-end testing
- CI/CD pipeline integration
- Backend API abstraction

---

# CS50x Final Project

This application was developed as part of the Harvard CS50x Final Project.

The objective was to design and build a polished real-world application demonstrating:
- Frontend engineering
- Authentication systems
- Database integration
- Application architecture
- Responsive design
- User experience principles

---

# Author

Your Name

- GitHub: 
- LinkedIn: www.linkedin.com/in/brandon-kisibu-b96a6b226

