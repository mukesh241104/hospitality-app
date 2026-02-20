# React Hospitality App

A hospitality-focused frontend built with React, Vite, and Tailwind CSS. The application integrates Supabase for authentication and allows users to search hotels, add them to a comparison list, and view analytical charts.

## Features
- **Authentication**: Secure JWT-based flows powered by **Supabase Auth**.
- **Real-time API Integration**: Live hotel data fetched from the **Hotelbeds Content API**.
- **Live Image Content**: Authentic property photography served via the **Hotelbeds CDN**.
- **Intuitive Search**: Lightweight, client-side filtered search for specific properties and locations.
- **Detailed Property Views**: Dedicated pages showing full property descriptions and amenities.
- **Interactive Analytics**: Side-by-side hotel comparison charts (Price & Rating) built with **Recharts**.
- **Performance Optimized**: Built with **Vite** for sub-second hot module replacement and lightning-fast production builds.
- **Premium Aesthetics**: A custom, responsive UI system utilizing **Tailwind CSS 4.0** and **Framer Motion** for fluid animations.

## Prerequisites
- Node.js (v18+)
- Local Supabase instance or Supabase Cloud project
- Hotelbeds API Developer keys

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hospitality-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_HOTELBEDS_API_KEY=your_api_key
   VITE_HOTELBEDS_API_SECRET=your_api_secret
   VITE_HOTELBEDS_ENDPOINT=https://api.test.hotelbeds.com
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## Docker Deployment (Bonus)
A `Dockerfile` is provided for containerization.
1. Build the image:
   ```bash
   docker build -t hospitality-app .
   ```
2. Run the container:
   ```bash
   docker run -p 8080:8080 hospitality-app
   ```

## Tech Stack Breakdown

### 🎨 Styling & Layout
- **Tailwind CSS 4.0**: Used for the entire design system. It allows for a very clean, utility-first approach that ensures the app is fully responsive and loads incredibly fast.
- **Glassmorphism**: Implemented subtle "frosted glass" effects (using backdrop blurs and semi-transparent borders) on the search bar and navigation to give it a high-end, modern aesthetic.

### ✨ Animations
- **Framer Motion**: Used for all the fluid motion you see. It handles the staggered entry animations when hotels load, the smooth page transitions, and the interactive hover effects on the cards.

### 📊 Data Visualization
- **Recharts**: A powerful charting library used specifically on the Compare page to render the interactive bar charts for price and rating comparisons.

### 🖼️ Icons & Typography
- **Lucide React**: A suite of clean, lightweight SVG icons (like the stars, map pins, and hotel icons).
- **Plus Jakarta Sans**: A premium, modern font fetched via Google Fonts that provides a cleaner and more professional look than standard system fonts.

### 📸 Imagery
- **Hotelbeds CDN**: The app dynamically pulls the actual property photos from the official Hotelbeds image servers to ensure the content is authentic.

### ⚙️ Backend & Infrastructure
- **React 19 & Vite 7**: The core frontend engine.
- **Supabase**: Open-source Firebase alternative (PostgreSQL + Auth).
- **CryptoJS**: SHA-256 hashing for secure API signature generation.
- **Docker**: Single-command deployment using Nginx for static hosting.

## API Architecture Note
To handle **CORS** security policy without a dedicated backend server, this application utilizes a **Vite Proxy** (`/hotelbeds-api`) in development. It also implements the mandatory Hotelbeds **X-Signature** protocol by generating a time-based SHA-256 hash using your API Secret on every request.

---
*Built for the React Hospitality Assignment - 2026*
