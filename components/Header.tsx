"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="header">
      <div className="header-container flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-900 transition-colors">
        <div className="logo flex items-center space-x-2">
          <div className="logo-icon text-blue-600">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2L2 7v2h20V7L12 2zM4 10v10h16V10H4zM9 12h2v6H9v-6zm4 0h2v6h-2v-6z"/>
            </svg>
          </div>
          <span className="logo-text text-xl font-bold text-gray-900 dark:text-gray-100">
            SecureBank
          </span>
        </div>
      </div>
    </header>
  );
}
