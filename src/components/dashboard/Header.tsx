import React from "react";

export const Header = () => {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="text-xl font-bold tracking-tight">MindLink Hub</span>
        </div>
      </div>
    </header>
  );
};
