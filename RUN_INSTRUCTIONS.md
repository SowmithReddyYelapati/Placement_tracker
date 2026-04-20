# 🚀 Placement Intelligence System - Run Instructions

This guide provides step-by-step instructions to get the application running on your local machine.

## Prerequisites
- **Java 17+** (For Spring Boot Backend)
- **Maven** (For building the backend)
- **Node.js v18+** & **npm** (For the React Frontend)
- **PostgreSQL** (Database)

---

## 🗄️ 1. Database Setup (PostgreSQL)

1. Ensure PostgreSQL is installed and running on your default port (`5432`).
2. Log in to PostgreSQL (using `psql` or a tool like pgAdmin).
3. Create the required database:
   ```sql
   CREATE DATABASE placement_db;
   ```
   *(Note: Based on `application.properties`, the application expects the username and password to be `postgres` by default. If your credentials differ, update them in `backend-spring/src/main/resources/application.properties` before running).*

---

## ⚙️ 2. Backend Setup (Spring Boot)

1. Open a new terminal.
2. Navigate to the Spring Boot backend directory:
   ```bash
   cd tracker/backend-spring
   ```
3. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```
4. The backend will start on `http://localhost:8080`.
   *Hibernate will automatically create the required database tables (users, applications, resumes, companies, reminders) when the app starts.*

---

## 💻 3. Frontend Setup (React + Vite)

1. Open a new terminal.
2. Navigate to the frontend directory:
   ```bash
   cd tracker/frontend
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to the link provided by Vite (usually `http://localhost:5173`).

---

## 👩‍💻 4. Testing the Application

1. Open the frontend in your browser.
2. **Note for Preview:** Since login features are partially mocked for preview, you can click "Enter Dashboard" on the placeholder login page to simulate a logged-in session.
3. Access the Sidebar to navigate through:
   - **Dashboard / Applications**: Track the status of your applications.
   - **Resumes**: Upload links to your resumes and portfolios.
   - **Company Intelligence**: Add data and notes on different companies.
   - **Analytics**: View dynamic charts on your application funnel.
   - **AI Assistant**: Input a company name to generate personalized interview preparation strategies.
