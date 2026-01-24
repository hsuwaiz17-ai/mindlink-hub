// File: /workspaces/mindlink-hub/src/components/dashboard/Header.tsx
import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">MindLink Hub</h1>
              <p className="text-slate-500 text-sm">AI-Powered Learning Assistant</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-slate-700 hover:text-indigo-600 transition font-medium">
              Home
            </a>
            <a href="#" className="text-slate-700 hover:text-indigo-600 transition font-medium">
              History
            </a>
            <a href="#" className="text-slate-700 hover:text-indigo-600 transition font-medium">
              Settings
            </a>
          </nav>
          
          <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm hover:shadow font-medium">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};
