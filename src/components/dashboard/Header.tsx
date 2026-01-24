import React from "react";

// Named Export ရော Default Export ပါ ထည့်ပေးထားသည်
export const Header = () => {
  return (
    <header className="w-full border-b bg-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">MindLink Hub</h1>
      </div>
    </header>
  );
};

export default Header;
