# HabitVault - Your Personal Habit Tracking Portal

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg?style=flat-square&logo=vercel)](https://habitvault-portal-launch.vercel.app/)

HabitVault is a modern, user-friendly web application designed to help you build and maintain positive habits. Track your daily progress, visualize your journey, and stay motivated with personalized insights.

## 🌟 Features

- **Intuitive Dashboard**: Clean and organized view of your daily habits and progress
- **Smart Habit Tracking**: Track habits with flexible scheduling options (daily, weekly, custom)
- **Visual Analytics**: Comprehensive analytics to visualize your habit completion rates and trends
- **Motivational Elements**: Daily quotes and personalized greetings to keep you motivated
- **Responsive Design**: Seamless experience across desktop and mobile devices

## 🚀 Live Demo

Visit the live application: [HabitVault Portal](https://habitvault-portal-launch.vercel.app/)

## 🛠️ Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: TailwindCSS + ShadcnUI
- **State Management**: TanStack Query (React Query)
- **Backend & Authentication**: Supabase
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **UI Components**: Radix UI

## 🏗️ Project Structure

```
habitvault-portal/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── habits/        # Habit-specific components
│   │   └── ui/           # Generic UI components
│   ├── pages/            # Application pages/routes
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and service layer
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/              # Static assets
└── ...config files     # Various configuration files
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/habitvault-portal.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Key Features Explained

### Dashboard
- Quick overview of all habits
- Today's habits with completion tracking
- Motivational quotes and progress insights
- Easy habit creation and management

### Analytics
- Habit completion trends
- Success rate visualization
- Historical data analysis
- Custom date range filtering

### Habit Management
- Create and edit habits
- Set custom schedules
- Track completion history
- Add notes and reflections

## 🔐 Security

- Secure authentication via Supabase
- Protected API routes
- Environment variable protection
- Secure data storage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for beautiful UI components
- [Supabase](https://supabase.com/) for backend services
- [Vercel](https://vercel.com/) for hosting and deployment

---

Built with ❤️ using React, TypeScript, and Supabase
