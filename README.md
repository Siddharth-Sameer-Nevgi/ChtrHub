# 🚀 ChtrHub - Next.js Chatting Platform

A modern real-time chat application built with Next.js, featuring secure authentication and seamless collaboration.

## ✨ Features

* 🔐 **Secure Authentication**

  * OTP-based signup/login

  * Email verification

  * Password reset functionality

* 💬 **Real-time Communication**

  * Instant messaging via Socket.IO

* 🏠 **Room Management**

  * Create, join, and delete chat rooms

  * Unique room IDs for private conversations

## 🛠️ Tech Stack

* **Frontend**: Next.js 14, JavaScript, CSS

* **Backend**: Next.js API Routes

* **Realtime**: Socket.IO

* **Database**: MongoDB (via Mongoose)

* **Authentication**: NextAuth.js, JWT

* **Email**: Nodemailer

* **Deployment**: Vercel

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18.x or later)

* npm

* MongoDB atlas account

### Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/Siddharth-Sameer-Nevgi/ChtrHub.git
   cd ChtrHub
   ```

2. **Install dependencies for the main application:**

   ```
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following variables:

   ```
   MONGO_URL=your_mongodb_connection_string
   SESSION_SECRET=your_jwt_secret_key
   MAIL_SERVICE=your_email_service_provider (e.g., gmail)
   MAIL_USER=your_email_address
   MAIL_PASS=your_email_password_or_app_password
   ```

4. **Run the development server:**

   ```
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

5. **Set up and run the WebSocket server:**
   The WebSocket server is in the `webSocket.js` file. You'll need to run this separately.

   ```
   node webSocket.js
   ```

   The WebSocket server will run on `http://localhost:3002`.

## 📂 Project Structure

Here is an overview of the key directories and files in the project:

```
ChtrHub/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   │   ├── api/          # API endpoints for users, rooms, etc.
│   │   ├── (pages)/      # Page components (home, login, signup, room)
│   │   ├── layout.js     # Main layout for the application
│   │   └── page.js       # Main entry page
│   ├── auth/             # Authentication logic (OTP handler)
│   ├── components/       # Reusable React components (Navbar, Footer, etc.)
│   ├── dbconfig/         # Database connection configuration
│   ├── mailHandler/      # Email sending logic
│   ├── models/           # Mongoose schemas for users and rooms
│   └── middleware.js     # Middleware for handling protected routes
├── webSocket.js          # WebSocket server setup
└── package.json          # Project dependencies and scripts
```
