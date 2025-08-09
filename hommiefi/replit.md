# Overview

Hommiefi is a hyperlocal community platform that connects neighbors for mutual aid, resource sharing, and social interaction. The application provides multiple interaction modes including Loop (item sharing), Gigs (local jobs), Vibe (social hangouts), and Haven (safe spaces for mothers). Built as a full-stack web application with modern React frontend and Express backend, it emphasizes community building through location-based features and trust-building mechanisms.

## Recent Updates (Jan 2025)
- ✅ Full market-ready application with comprehensive functionality
- ✅ Real-time chat system with WebSocket integration
- ✅ Emergency HelpOut API endpoints and notifications system
- ✅ Complete API integration for all frontend components
- ✅ Database seeding with realistic sample data
- ✅ TypeScript error resolution and code quality improvements
- ✅ VS Code setup guide for development workflow
- ✅ Production-ready deployment configuration

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for development and bundling
- **Routing**: Wouter for client-side routing with page-based organization
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design system
- **Styling**: Tailwind CSS with custom color scheme (coral, teal, ivory) and Poppins font family
- **Build System**: Vite with custom path aliases (@/ for src, @shared for shared types)

## Backend Architecture
- **Framework**: Express.js with TypeScript for API endpoints and middleware
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit's OpenID Connect integration with session-based auth using passport.js
- **Real-time**: WebSocket server integration for live features
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful endpoints with proper error handling and request logging middleware

## Database Design
- **ORM**: Drizzle with PostgreSQL dialect for schema definition and migrations
- **Schema Structure**: 
  - Users table with profile information, trust scores, and community points
  - Feature-specific tables (loopItems, gigs, vibeSessions, havenGroups)
  - Social features (conversations, messages, notifications, threadPosts)
  - Session storage for authentication state
- **Relationships**: Proper foreign key relationships with Drizzle relations
- **Validation**: Zod schemas for runtime validation integrated with Drizzle

## Authentication System
- **Provider**: Replit's OIDC with automatic user provisioning
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Middleware**: Custom authentication middleware for protected routes
- **User Model**: Automatic user creation/update based on OIDC claims

## Component Architecture
- **Design System**: shadcn/ui components with custom theming
- **Layout**: Mobile-first responsive design with bottom navigation
- **State Pattern**: Server state via React Query, local state via React hooks
- **Component Organization**: Feature-based components in attached_assets, reusable UI components

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL hosting with connection pooling via @neondatabase/serverless
- **Connection Management**: WebSocket support for serverless PostgreSQL connections

## Authentication Services
- **Replit OIDC**: Primary authentication provider with automatic user management
- **OpenID Client**: Standard OIDC implementation for secure authentication flow

## Development Tools
- **Replit Integration**: 
  - Vite plugin for runtime error handling in development
  - Cartographer plugin for code mapping and debugging
  - Development banner for external access
- **Build Tools**: ESBuild for server bundling, Vite for client bundling

## UI and Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom color palette
- **Lucide React**: Modern icon library for consistent iconography
- **Font Integration**: Google Fonts (Poppins) for typography

## Client-side Libraries
- **TanStack Query**: Advanced server state management with caching and synchronization
- **React Hook Form**: Form handling with validation integration
- **Wouter**: Lightweight client-side routing
- **Class Variance Authority**: Type-safe component variant management

## Server-side Libraries
- **Drizzle Kit**: Database schema management and migrations
- **Express Session**: Session middleware with PostgreSQL storage
- **Passport.js**: Authentication middleware for OIDC integration
- **WebSocket**: Real-time communication capabilities