# 🎬 Movie Reserve Backend

A backend system for a movie reservation service built using **Node.js**, **Express**, and **PostgreSQL**. This service allows users to sign up, log in, browse movies, view showtimes, and make payments for movie reservations. Authentication is handled using **Passport**, and payment integration is done through **M-Pesa**.
## 🚀 Project Goal

This personal project is designed to explore the implementation of complex business logic such as scheduling, user roles, and payment integration. It serves as a practical demonstration of building a feature-rich backend with real-world use cases like authentication, role management, and revenue reporting.

---

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: `pg`
- **Authentication**: Passport.js (Local + Google OAuth)
- **Security**: Bcrypt for password hashing
- **Payments**: M-Pesa Integration

---

## 🔐 Authentication & Authorization

- **Auth System**: Passport.js
- **Roles**:
  - `admin`: Manage movies, showtimes, and view reports.
  - `user`: Browse movies and showtimes, make payments.
  - `guest`: Unauthenticated visitors.

Google OAuth and local login are both supported. Passwords are securely hashed using bcrypt.

---

## 🎞️ Movie and Showtime Management

Admins can manage movie listings and showtimes.

### Movies
Each movie includes:
- `title`
- `description`
- `genre`
- `poster_url`

### Showtimes
Each showtime includes:
- Associated `movie_id`
- `start_time`
- (Planned: screen or theater location)

---

## 💳 Payment & Reservation (Current)

While seat-specific reservation is not yet implemented, users can:
- Browse movies and showtimes by date
- Make a payment via **M-Pesa** for a selected showtime

Each payment:
- Is linked to a `user` and `showtime`
- Is securely processed and recorded

(⚠️ Seat selection and conflict handling will be added in future updates.)

---

## 📊 Admin Reporting

Admins can:
- View all reservations
- See payment information per showtime
- Monitor system revenue

(Planned: Capacity and seat-level insights)


---

## 📦 Installation & Setup

### Prerequisites
- Node.js
- PostgreSQL

### Setup Instructions

```bash
# Clone the repo
git clone https://github.com/your-username/movie-reserve-backend.git
cd movie-reserve-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in .env with DB credentials, M-Pesa API keys, Google OAuth keys, etc.
