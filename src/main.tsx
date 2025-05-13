
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for Supabase environment variables and show warning in console if missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    '%c⚠️ Supabase Configuration Missing',
    'background: #ffcc00; color: #000000; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    '\n\nYou need to set up your Supabase environment variables:\n' +
    '1. Create a .env file in the project root\n' +
    '2. Add these variables:\n' +
    '   VITE_SUPABASE_URL=your-supabase-url\n' +
    '   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key\n' +
    '3. Restart the development server\n\n' +
    'Get your API keys from the Supabase dashboard: https://app.supabase.com'
  );
}

createRoot(document.getElementById("root")!).render(<App />);
