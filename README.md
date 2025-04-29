
# 📚 LawConnect – MERN Stack Legal Consultation Platform

## 🧾 Project Overview

**LawConnect** is a basic MERN stack web application that allows:
- **Clients** to book appointments (via Google Meet) with lawyers.
- **Lawyers** to receive and manage scheduled meetings.
- Both clients and lawyers to access legal resources.
- A contact form for users to get in touch.
- A basic AI-powered legal book (static for now, optional AI integration).

> 💡 This is a minimal functional prototype for an academic assignment.

---

## 🧱 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: (Optional for now)
- **Meet Scheduling**: Google Calendar API
- **AI Legal Book**: (Optional integration using OpenAI)

---

## 📄 Pages Overview

| Page                     | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `/` (Home)               | Landing page for clients & lawyers, brief info and navigation.             |
| `/contact`              | Contact Us form: name, email, message fields.                               |
| `/legal-book`           | Static legal guide. Optional: searchable with basic AI responses.           |
| `/schedule-meet`        | Form for clients to schedule a Meet with a lawyer.                          |
| `/consultation`         | Lawyer's view of incoming meeting links with basic info.                    |

---

## 🔌 API Endpoints

> All endpoints are prefixed with `/api`

### 🔹 Contact Form

| Method | Endpoint         | Description                           |
|--------|------------------|---------------------------------------|
| POST   | `/api/contact`   | Submit contact form (name, email, message) |

---

### 🔹 Schedule Google Meet

| Method | Endpoint                  | Description                            |
|--------|---------------------------|----------------------------------------|
| POST   | `/api/meet/schedule`      | Client schedules a meet with lawyer (name, email, date, time) |
| GET    | `/api/meet/all`           | Lawyer fetches all upcoming meets      |

---

### 🔹 AI Legal Book (Optional)

| Method | Endpoint              | Description                                      |
|--------|-----------------------|--------------------------------------------------|
| POST   | `/api/legalbook/query`| (Optional) Takes a legal question and returns AI-generated answer |

---

### 🛠️ Additional Notes (Backend)

- Backend uses `Google Calendar API` to generate Meet links.
- MongoDB is used to store all meet appointments.
- No authentication or email verification implemented (yet) for simplicity.
- Environment variables stored in `.env`:
  ```env
  MONGO_URI=your_mongodb_uri
  GOOGLE_CLIENT_ID=xxx
  GOOGLE_CLIENT_SECRET=xxx
  GOOGLE_REFRESH_TOKEN=xxx
  GOOGLE_CALENDAR_ID=primary
  ```

---

## 🛠️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/lawconnect.git
   cd lawconnect
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. **Start development servers**
   ```bash
   # Backend
   cd server
   npm run dev

   # Frontend
   cd ../client
   npm run dev
   ```

