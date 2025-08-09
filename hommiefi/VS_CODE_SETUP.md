# VS Code Setup Guide for Hommiefi

## Prerequisites

1. **Node.js 18 or later** - Download from [nodejs.org](https://nodejs.org/)
2. **PostgreSQL** - Download from [postgresql.org](https://www.postgresql.org/) or use a cloud service like Neon
3. **Git** - Download from [git-scm.com](https://git-scm.com/)
4. **VS Code** - Download from [code.visualstudio.com](https://code.visualstudio.com/)

## Required VS Code Extensions

Install these extensions in VS Code:

1. **TypeScript and JavaScript Language Features** (built-in)
2. **ES7+ React/Redux/React-Native snippets**
3. **Tailwind CSS IntelliSense**
4. **Auto Rename Tag**
5. **Bracket Pair Colorizer 2**
6. **ESLint**
7. **Prettier - Code formatter**
8. **PostgreSQL** (for database management)
9. **Thunder Client** (for API testing)

## Project Setup

### 1. Clone and Setup
```bash
# Clone the repository (if you have it in git)
git clone <your-repo-url>
cd hommiefi

# Install dependencies
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/hommiefi"
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=hommiefi

# Session Secret (generate a random string)
SESSION_SECRET="your_very_long_random_secret_key_here"

# Development Settings
NODE_ENV=development
```

### 3. Database Setup

**Option A: Local PostgreSQL**
```bash
# Create database
createdb hommiefi

# Push schema to database
npm run db:push
```

**Option B: Neon Database (Recommended)**
1. Sign up at [neon.tech](https://neon.tech/)
2. Create a new database
3. Copy the connection string to your `.env` file
4. Run: `npm run db:push`

### 4. Seed Sample Data (Optional)
```bash
# Start the server first
npm run dev

# In another terminal, seed the database
curl -X POST http://localhost:5000/api/admin/seed
```

## Running the Application

### Development Mode
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server with hot reload
- WebSocket server for real-time features

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Database operations
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (GUI)
```

## Project Structure

```
hommiefi/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── db.ts             # Database setup
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   └── replitAuth.ts     # Authentication
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema
├── package.json
└── .env                  # Environment variables
```

## VS Code Configuration

### Recommended Settings
Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Debugging Configuration
Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      },
      "runtimeArgs": ["-r", "tsx/cjs"]
    }
  ]
}
```

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Code Changes**
   - Frontend: Files in `client/src/` auto-reload
   - Backend: Server restarts automatically

3. **Database Changes**
   ```bash
   # Modify schema in shared/schema.ts
   npm run db:push
   ```

4. **Test API Endpoints**
   - Use Thunder Client extension in VS Code
   - Or use `curl` commands
   - Or test in browser at `http://localhost:5000`

## Features Overview

The Hommiefi platform includes:

- **Loop**: Item sharing and borrowing marketplace
- **Gigs**: Local job postings and applications
- **Vibe**: Social connection and hangout matching
- **Haven**: Safe spaces for mothers with children
- **Thread**: Community discussion forum
- **Chat**: Real-time messaging system
- **Profile**: User profile management
- **Settings**: App preferences and privacy controls

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your DATABASE_URL in `.env`
   - Ensure PostgreSQL is running
   - Verify database exists

2. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   npx kill-port 5000
   ```

3. **Module Not Found Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **TypeScript Errors**
   - Check that all imports are correct
   - Run `npm run build` to see detailed errors
   - Ensure shared types are properly exported

### Performance Tips

1. **Use React DevTools** for component debugging
2. **Enable TypeScript strict mode** for better error catching
3. **Use Drizzle Studio** for database inspection
4. **Monitor Network tab** for API performance

## Deployment

For production deployment:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
3. **Deploy to your preferred platform** (Vercel, Netlify, Railway, etc.)

## Support

- Check the console for error messages
- Use VS Code's integrated terminal for commands
- Inspect the database using Drizzle Studio: `npm run db:studio`
- Test API endpoints using Thunder Client extension