import { IconProps } from "@tabler/icons-react";
import React from "react";

interface ButtonIconProps {
    icon: React.ComponentType<IconProps>;
    title?: string;
    size?: number;
}

export default function ButtonIcon({
    icon: IconComponent,
    title = "",
    size = 24,
    ...props
}: ButtonIconProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
            {...props}
        >
            <IconComponent size={size} />
            {title && (
                <span className="text-xs text-primary text-center leading-tight">
                    {title}
                </span>
            )}
        </button>
    );
}