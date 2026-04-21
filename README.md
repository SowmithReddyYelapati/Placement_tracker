# 🚀 Placement Intelligence System (PlaceTrack)

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)
![Tailwind CSS](https://img.shields.io/badge/Design-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwindcss)

**Placement Intelligence System** is a high-performance, AI-driven platform designed to modernize the job hunting experience. Engineered with a futuristic "Neural" design system, it provides students and professionals with advanced tracking, intelligence gathering, and AI-powered interview preparation.

---

## ✨ Key Features

### 🌌 Neural Dashboard & Analytics
- **Dynamic Application Funnel**: Visualize your recruitment progress with high-fidelity charts using `Recharts`.
- **Application Priority Tracking**: Focus on the most important opportunities with smart filtering.
- **Glassmorphic UI**: Experience a premium, smooth interface with micro-animations powered by `Framer Motion`.

### 🤖 AI Interview Intelligence
- **Smart Preparation**: Input a company name to generate personalized interview strategies and technical focus areas.
- **Context-Aware Insights**: AI Assistant provides tactical telemetry for your specific career path.

### 💼 Intelligent Management
- **Resume Versioning**: Track multiple resumes and portfolio links in one centralized vault.
- **Company Intelligence**: Build a knowledge base for every target company, including interview notes and culture insights.
- **Smart Reminders**: Never miss a deadline with integrated notification systems.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS (Neural Aesthetic)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **State/API**: Axios, React Router

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: SQLite (Default) / PostgreSQL (Sequelize ORM)
- **Auth**: JWT & Bcrypt

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18+)

### 1. Backend Setup (Node.js)
```bash
cd backend
npm install
# Copy the example environment variables file
cp .env.example .env
# Start the backend server
npm run dev
```
*The server will start on `http://localhost:5000`.*

### 2. Frontend Setup (React/Vite)
```bash
cd frontend
npm install
# Copy the example environment variables file
cp .env.example .env
# Start the frontend dev server
npm run dev
```
*Access the UI at `http://localhost:5173`.*

---

## 🌍 Deployment

### Deploying the Backend on Render
1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository and select the `backend` folder as the root directory (or specify `backend` in the build/start commands if Render uses the root directory: Build Command `cd backend && npm install`, Start Command `cd backend && npm start`).
3. Set the following Environment Variables in Render:
   - `PORT=5000`
   - `JWT_SECRET=your_secure_random_string`
4. Deploy the service. Once deployed, note down the URL (e.g., `https://placement-backend.onrender.com`).

### Deploying the Frontend on Vercel
1. Create a new **Project** on [Vercel](https://vercel.com/).
2. Connect your GitHub repository.
3. Vercel will automatically detect **Vite**.
4. Set the Root Directory to `frontend`.
5. Add the following Environment Variable in Vercel:
   - `VITE_API_URL` = `<YOUR_RENDER_BACKEND_URL>/api` (e.g., `https://placement-backend.onrender.com/api`)
6. Click **Deploy**. The `vercel.json` included in the project ensures React Router handles page navigation correctly.

---

## 🎨 Design Philosophy: "Neural Pulse"
The system utilizes a proprietary **Neural Pulse** design language, characterized by:
- **Ultra-Premium Light/Dark Modes**: Intelligently balanced HSL color palettes.
- **Visual Telemetry**: Information density handled through modern bento-grid layouts.
- **Tactile Feedback**: Subtle micro-interactions and transitions for a premium software feel.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by Sowmith Reddy Yelapati
