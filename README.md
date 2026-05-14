# LeLo_InterView

LeLo_InterView is a modern web application built with **Next.js**, designed to streamline interview creation, participation, and feedback. It leverages **Firebase**, **NextAuth**, and **TailwindCSS** with support from **shadcn/ui** components for a stylish, responsive experience.

## 🌐 Live Production Link
👉 **[https://view-in-ai-2.vercel.app/](https://view-in-ai-2.vercel.app/)**

## ✨ Features

- 🔐 Authentication with Sign In / Sign Up pages
- 🎤 Resume-based Interview Creation
- 📋 Interview Feedback & Scoring
- 📄 Resume Analysis + ATS Scoring
- 🧠 Smart AI integration (via Vapi)

- ⚙️ Firebase + NextAuth for backend services
- ✨ Smooth UI/UX with shadcn/ui + Tailwind

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Firebase](https://firebase.google.com/)
- [Vapi API](https://vapi.ai/) 

## Getting Started



```
git clone https://github.com/yourusername/lelo_interview.git
cd lelo_interview
```

## 2. Install Dependencies

npm install
or
yarn install

## 3. Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 4.Run the Development Server
```
npm run dev
```

## 5. Project Structure

```
lelo_interview/
├── app/                  # Application routes
│   ├── (auth)/           # Sign in / Sign up pages
│   ├── (root)/           # Main app routes like dashboard, interview
│   └── api/              # API routes (e.g., Vapi)
├── components/           # UI components (if applicable)
├── constants/            # Global constants
├── types/                # TypeScript definitions
├── public/               # Static assets
├── styles/               # Global styles
├── .env.local            # Environment variables (not committed)
├── package.json
└── tsconfig.json
```


## 6. Scripts
```
npm run dev – Start the development server

npm run build – Build for production

npm run lint – Lint the project
```

<b><u>Contributing</u></b>

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.