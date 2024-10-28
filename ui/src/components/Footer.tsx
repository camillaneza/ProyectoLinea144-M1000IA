// components/Footer.tsx

import Logo from "/public/Logo.svg";
import LoginLogo from "/public/Login_Logo.png";

export function Footer() {
    return (
      <footer className="flex flex-col items-center p-6 bg-black text-white space-y-4">
        {/* Logos */}
        <div className="flex space-x-4">
          <img src={Logo.src} alt="Logo" className="h-14 w-15" />
          <img src={LoginLogo.src} alt="Login Logo" className="h-14 w-15" />
        </div>
        {/* Nombres de las integrantes */}
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Integrantes del equipo:</h2>
          <ul className="space-y-1">
            <li>Mónica Alfaro</li>
            <li>Luciana Simón</li>
            <li>Susana Romero</li>
            <li>Luisa Martínez</li>
            <li>Camila Fernández</li>
            <li>Grace Delgado</li>
          </ul>
        </div>
        <p className="text-sm mt-4">&copy; {new Date().getFullYear()} AI Prediction. Todos los derechos reservados.</p>
      </footer>
    );
  }
  