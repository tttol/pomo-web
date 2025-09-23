# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server

## Architecture Overview

This is a Next.js 15 application with AWS Amplify Gen 2 backend integration for "pomo-web" (likely a Pomodoro timer web application).

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Language**: Japanese (lang="ja" set in layout)

### Backend Stack (AWS Amplify Gen 2)
- **Auth**: Email-based authentication configured in `amplify/auth/resource.ts`
- **Data**: GraphQL API with Todo model in `amplify/data/resource.ts`
- **Authorization**: Currently allows guest access to Todo operations

### Key Architectural Notes

- Uses Turbopack for both development and production builds
- AWS Amplify backend defined in `amplify/backend.ts` with modular auth and data resources
- Todo model includes only `content` field with guest authorization
- TypeScript path mapping configured with `@/*` alias pointing to project root
- The data model includes sample code comments for adding CRUD operations

### File Structure Patterns

- Frontend pages and components in `app/` directory (App Router)
- Amplify backend resources in `amplify/` with separate auth and data modules
- Type definitions auto-generated from Amplify schema