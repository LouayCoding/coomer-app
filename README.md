# Coomer Content Browser

A modern Next.js application for browsing and searching creator content from multiple platforms. Built with TypeScript, Tailwind CSS, and featuring a sleek dark theme inspired by Vercel and modern web design.

## 🚀 Features

- **Browse Posts** - View latest content from all creators
- **Search & Filter** - Search by keywords and filter by platform (OnlyFans, Fansly, Patreon, etc.)
- **Creator Profiles** - View all posts from specific creators
- **Responsive Design** - Beautiful UI that works on all devices
- **Dark Theme** - Modern dark interface with orange accent colors
- **Pagination** - Navigate through large datasets efficiently

## 🏗️ Architecture

### 3-Layer System
```
Browser (React) → Next.js API Routes → Coomer API
     ↓                    ↓                ↓
  UI Layer          Proxy Layer      External API
```

### Key Features
- **Server-side API Proxy** - Handles authentication and gzip decompression
- **TypeScript** - Full type safety across the application
- **Client-side Filtering** - Fast creator search without extra API calls
- **Optimized Images** - Lazy loading and responsive images

## 📁 Project Structure

```
coomer-app/
├── app/
│   ├── api/                    # Server-side API routes
│   │   ├── posts/route.ts     # Posts endpoint
│   │   ├── creators/route.ts  # Creators list
│   │   └── creator/[service]/[id]/route.ts
│   ├── creators/page.tsx      # Creators list page
│   ├── creator/[service]/[id]/page.tsx  # Creator detail
│   ├── page.tsx               # Home/Posts page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── Header.tsx             # Navigation header
│   ├── SearchBar.tsx          # Search component
│   ├── PostCard.tsx           # Post display card
│   ├── CreatorCard.tsx        # Creator display card
│   ├── LoadingSpinner.tsx     # Loading indicator
│   └── Pagination.tsx         # Pagination controls
├── lib/
│   ├── api-client.ts          # API client with gzip handling
│   └── constants.ts           # API configuration
└── types/
    └── api.ts                 # TypeScript type definitions
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Design

The application features a modern dark theme with:
- **Primary Background**: `#0a0a0a`
- **Card Background**: `#1a1a1a`
- **Accent Color**: `#ff9000` (Orange)
- **Border Color**: `#2a2a2a`

Inspired by Vercel's clean design and modern content platforms.

## 🔧 API Integration

The app uses a proxy pattern to communicate with the Coomer API:

### Authentication
Uses session cookie for authenticated requests.

### Headers
Special headers required for DDoS protection bypass:
- `Accept: text/css` (not `application/json`)
- Custom User-Agent
- Session cookie

### Gzip Handling
All responses are gzip-compressed and automatically decompressed server-side.

## 📱 Pages

- **/** - Browse all posts with search and filtering
- **/creators** - View all creators with client-side search
- **/creator/[service]/[id]** - View posts from specific creator

## 🚀 Build & Deploy

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel:
```bash
vercel deploy
```

## 📝 License

This project is for educational purposes.
