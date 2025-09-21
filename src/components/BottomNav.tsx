import { NavLink } from "react-router-dom";
import { Calculator, ListChecks, Pill } from "lucide-react";

export default function BottomNav() {
  const navItems = [
    { to: "/calculadora", label: "Calculadora", icon: Calculator },
    { to: "/mis-listas", label: "Listas", icon: ListChecks },
    { to: "/mis-medicamentos", label: "Medicamentos", icon: Pill },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex justify-around py-2">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${
              isActive ? "text-blue-600" : "text-gray-500"
            }`
          }
        >
          <Icon className="w-6 h-6 mb-1" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
