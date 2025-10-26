"use client";

import {
  IconScan,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";
import { useSidebar } from "@/lib/hooks/useSidebar";
import { UserInfo, AuthForm } from "./auth-form";
import Link from "next/link";
import { useState } from "react";

const sidebarItems = [
  {
    label: "Home",
    icon: <IconHome size={18} />,
    href: "/",
  },
  {
    label: "New Scan",
    icon: <IconScan size={18} />,
    href: "/dashboard",
  },
];

export default function Sidebar({
  userInfo,
}: {
  userInfo: UserInfo | null;
}) {
  const { isSidebarOpen } = useSidebar();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    window.dispatchEvent(new Event("local-storage"));
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    window.dispatchEvent(new Event("local-storage"));
  };

  return (
    <>
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-sidebar/80 backdrop-blur-xl border-r-2 border-border
          transition-transform duration-300 ease-in-out z-[999] flex flex-col overflow-hidden
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4">
          {userInfo ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm">
                {userInfo.full_name.charAt(0)}
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold text-sm truncate">
                  {userInfo.full_name}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {userInfo.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md hover:bg-neutral-700"
                title="Logout"
              >
                <IconLogout size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full text-center p-2 rounded-md bg-accent hover:bg-accent-hover"
            >
              Login / Register
            </button>
          )}
        </div>
        <div className="flex-grow p-4">
          <nav>
            <ul>
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-700"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <AuthForm
              onClose={() => setShowAuthModal(false)}
              onSuccess={handleAuthSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}
