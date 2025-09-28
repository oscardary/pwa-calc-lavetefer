// src/components/TopBar.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "@/lib/auth/useAuth";
import { useUser } from "../context/UserContext";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function TopBar() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  async function handleSignOut() {
    await signOut();
    setShowLogoutModal(false);
    navigate("/login");
  }

  function truncate(text: string, max: number) {
    return text.length > max ? text.slice(0, max) + "..." : text;
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        Lavetefer

        {/* Menú de usuario */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition">
              {user ? (
                <span className="text-sm font-medium text-gray-700">
                  👋 Hola, <strong>{truncate(user?.nick || "X", 8)}</strong>
                </span>
              ) : (
                <span className="text-sm text-gray-600">Menú</span>
              )}
              <span className="text-gray-600 text-xs">⌄</span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            className="min-w-[200px] bg-white rounded-lg shadow-md border border-gray-200 p-2"
            sideOffset={8} >
            {user ? (
              <>
                
                {/* Opciones del usuario */}
                <DropdownMenu.Item asChild>
                  <Link
                    to="/"
                    className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    Inicio
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                  >
                    Ajustes
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />

                {/* Cerrar sesión */}
                <DropdownMenu.Item asChild>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </DropdownMenu.Item>
              </>
            ) : (
              <DropdownMenu.Item asChild>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                >
                  Iniciar sesión
                </Link>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      
      {/* Modal de confirmación logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar tu sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        confirmColor="bg-red-600 hover:bg-red-700"
        onConfirm={handleSignOut}
        onCancel={() => setShowLogoutModal(false)}
      />
    </header>
  )
}

