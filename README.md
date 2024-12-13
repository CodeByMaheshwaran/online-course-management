# 🎓 Online Course Management System

The **Online Course Management System** is a role-based authentication platform built using **Spring Security** and **JWT (JSON Web Tokens)**. It supports **Administrator**, **Faculty**, and **Student** roles, each with specific permissions and access views.

## 🔐 Role-Based Authentication
- The system implements **role-based authentication** to differentiate access for different users:
  - **Administrator** 👩‍💼: Full access to manage users and view enrollment trends.
  - **Faculty** 👨‍🏫: Access to manage courses and view students enrolled in their courses.
  - **Student** 👩‍🎓: Access to view profile and enrolled courses.

## 👨‍🏫 Faculty Profile and Student List
- When a **Faculty** member logs in, the system displays:
  - The **faculty's profile**.
  - A list of **students** enrolled in the courses handled by the faculty.

## 👩‍🎓 Student Profile and Enrolled Courses
- Upon **Student** login, the system shows:
  - The **student's profile**.
  - A list of **faculty** associated with the courses the student is enrolled in.

## 🧑‍💼 Admin Profile and Enrollment Trends
- The **Administrator** profile displays:
  - **Admin's personal details**.
  - **Enrollment trends** visualized in **graphical representation** (charts, graphs).
  - Admin can track trends across various courses and time periods.

## 🛠️ User Management
- The **Administrator** can perform **user management** tasks such as:
  - **Registering** new users.
  - **Updating** existing user details.
  - **Deleting** users, ensuring smooth administration of the platform.
