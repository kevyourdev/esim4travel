# CLAUDE.md - eSIM4Travel Development Guide
## Project Overview
eSIM4Travel is a React + Express e-commerce platform for travel eSIM data plans. Uses neo-brutalist design system with Tailwind CSS.
## Development Workflow
### Claude SDK Usage
This project is built using the Claude Code SDK located at `/autonomous-coding/`. When making changes:
1. Create detailed summaries when switching contexts or sessions
2. Include: files modified, features implemented, pending tasks
3. Reference the session summaries in `autonomous-coding/session*-summary.txt`
### Running the App
```bash
# Frontend (Vite + React)
cd frontend && npm run dev  # runs on port 5173

# Backend (Express + SQLite)
cd backend && npm run dev   # runs on port 3001
```
## Code Conventions
### React Patterns
- Use Context API for global state (see `/frontend/src/context/`)
- Persist user preferences to localStorage
- Follow existing patterns: ThemeContext, WishlistContext, RecentlyViewedContext
### API
- Backend API runs on `http://localhost:3001/api`
- TODO: Extract to environment config (currently hardcoded in 13+ files)
### Styling
- Neo-brutalist design: bold 2px borders, hard shadows, playful colors
- Tailwind CSS with custom config in index.html
- Dark mode via `darkMode: 'class'` - toggle adds/removes `dark` class on `<html>`
### File Structure
```
frontend/
├── src/
│   ├── components/    # Reusable components (Header, Footer, etc.)
│   ├── context/       # React Context providers
│   ├── pages/         # Route pages
│   └── App.jsx        # Routes and provider hierarchy
backend/
├── server.js          # Express server
├── routes/            # API route handlers
└── database/          # SQLite database
```
## Git
- Repository: https://github.com/kevyourdev/esim4travel
- Commit messages: descriptive, no AI attribution
- Push only when explicitly requested
## Known Issues / TODOs
- API URL hardcoded to localhost:3001 in multiple files
- No API response caching (consider SWR or React Query)
- Missing rate limiting and CSRF protection
- N+1 query pattern in DestinationDetailPage
