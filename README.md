
# PhD Scholar Portal

A web-based portal designed to streamline and manage the academic journey of PhD scholars. This application facilitates efficient tracking of research progress, document management, and communication between scholars and their supervisors.

## Features

- **User Authentication**: Secure login and registration for scholars and supervisors.
- **Research Progress Tracking**: Monitor milestones, submissions, and approvals throughout the PhD journey.
- **Document Management**: Upload, store, and manage research documents and reports.
- **Communication Module**: Integrated messaging system for seamless interaction between scholars and supervisors.
- **Dashboard Analytics**: Visual representation of progress metrics and timelines.

## Tech Stack

- **Frontend**: Next.js 13 with App Router, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kaushal1014/phd_scholar.git
   cd phd_scholar
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**:

   Create a `.env` file in the root directory and add the following:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Folder Structure

```
phd_scholar/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                 # Utility functions and libraries
├── public/              # Static assets
├── server/              # Backend API routes and logic
├── types/               # TypeScript type definitions
├── .env                 # Environment variables
├── next.config.mjs      # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project metadata and scripts
```

## License

This project is licensed under the [MIT License](LICENSE).

