"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { UserInfo } from "@/components/auth-form";
import { useSidebar } from "@/lib/hooks/useSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { isSidebarOpen } = useSidebar();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserInfo = localStorage.getItem("user_info");
      if (storedUserInfo) {
        try {
          setUserInfo(JSON.parse(storedUserInfo));
        } catch (error) {
          console.error("Failed to parse user info:", error);
          setUserInfo(null);
          localStorage.removeItem("user_info");
          localStorage.removeItem("auth_token");
        }
      } else {
        setUserInfo(null);
      }
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <Header />
        <Sidebar
          userInfo={userInfo}
        />
        <main
          className={`flex-1 transition-all duration-300 ease-in-out pt-16 ${
            isSidebarOpen ? "md:ml-64" : "ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </>
  );
}
