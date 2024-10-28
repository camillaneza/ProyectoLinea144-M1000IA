// components/Header.tsx

import Logo from "/public/Logo.svg";

export function Header() {
  return (
    <header className="flex justify-center items-center p-4 bg-black shadow-md">
      <img src={Logo.src} alt="Logo" className="h-12 w-12 ml-8 mr-4" />
      <h1 className="text-3xl font-bold text-white">AI Prediction</h1>
    </header>
  );
}
