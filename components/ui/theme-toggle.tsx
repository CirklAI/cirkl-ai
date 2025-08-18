"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { IconMoon, IconSun } from "@tabler/icons-react"
import ButtonIcon from "@/components/ui/button-icon"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const handleThemeToggle = () => setTheme(theme === "dark" ? "light" : "dark")

    return (
        <ButtonIcon
            icon={theme === "dark" ? IconSun : IconMoon}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            onClick={handleThemeToggle}
            size={24}
            aria-label="Toggle theme"
        />
    )
}
