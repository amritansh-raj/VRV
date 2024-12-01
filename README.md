# Role-Based Dashboard System

This project implements a **Role-Based Dashboard System** with personalized dashboards and access privileges based on user roles. The application provides distinct functionality for **Admin**, **Manager**, and **User** roles. It is built using **Next.js**, **Tailwind CSS**, and other modern tools.

---

## Features

### Role-Based Access

- **Admin**
  - Manage all users: Change roles (User ↔ Manager) and delete users.
- **Manager**
  - Modify rights of individual users.
  - Add, update, and delete tasks for their team.
- **User**
  - Add, update, and delete personal tasks.

### Personalized Dashboards

Each role has a unique dashboard displaying relevant statistics:

- **Admin Dashboard**: Overview of all users, tasks, and managers.
- **Manager Dashboard**: Insights on team activity and task statuses.
- **User Dashboard**: Task management and progress tracking.

---

## Tech Stack

- **Next.js** for frontend development
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Hook Form** for form handling
- **JSON Server** for mock API during development
- **Lucide Icons** for enhanced visuals

---

## **Demo Credentials**

Use the following credentials to test the RBAC UI:

### **Admin**

- **Email**: `admin@gmail.com`
- **Password**: `admin@123`

### **Manager**

- **Email**: `manager@gmail.com`
- **Password**: `manager@123`

### **User**

- **Email**: `user@gmail.com`
- **Password**: `user@123`

### **Prerequisites**

- Node.js (>=14.x.x)
- npm or bun

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/amritansh-raj/VRV.git
   cd VRV
   ```
