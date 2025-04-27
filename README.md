# Emoti AI

## Overview
Emoti AI is an AI-powered emotional well-being platform designed to support users in managing their mental health. It offers features such as personalized chatbot interactions, guided thought records, meditation assistance, emotional tracking, and therapeutic suggestions. The platform integrates **Next.js** for the frontend, **Supabase** for database management, and **Google's Gemini API** for AI-driven insights.

## Try it out - 
https://emoti-a-isupport-zqfg.vercel.app/

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [Yarn](https://yarnpkg.com/) or npm
- [Supabase](https://supabase.com/) account and project setup
- [Prisma](https://www.prisma.io/) CLI
- [Gemini API](https://ai.google.dev/) access

## Installation

### 1. Install Dependencies
```sh
yarn install
# or
npm install
```

### 2. Setup Environment Variables
Create a .env file and a .env.local file in the root directory and add the following environment variables:<br/>
DATABASE_URL=your_supabase_postgres_database_url<br/>
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url<br/>
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key<br/>
GEMINI_API_KEY=your_google_gemini_api_key<br/>
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key<br/>


### 3. Setup the Database
Ensure Prisma is installed and generate the database schema:<br/>

npx prisma migrate dev --name init<br/>

If running for the first time, apply the schema:<br/>
npx prisma db push<br/>

Generate Prisma Client:<br/>

npx prisma generate


### 4. Run the Application
```sh
yarn dev
# or
npm run dev