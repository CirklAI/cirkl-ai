import React from "react";

interface MagicTextProps {
    text: string;
}

export default function MagicText({text}: MagicTextProps) {
    return (
        <div className="relative">
            <h1
                className="absolute inset-0 text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-medium tracking-tight
                bg-clip-text text-transparent
                bg-[linear-gradient(to_right,#00ffff_0%,#0088ff_25%,#8844ff_50%,#ff0000_75%,#ff8800_100%)]
                blur-3xl opacity-100"
                aria-hidden="true"
            >
                {text}
            </h1>

            <h1
                className="absolute inset-0 text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-medium tracking-tight
                bg-clip-text text-transparent
                bg-[linear-gradient(to_right,#00ffff_0%,#0088ff_25%,#8844ff_50%,#ff0000_75%,#ff8800_100%)]
                blur-xl opacity-100"
                aria-hidden="true"
            >
                {text}
            </h1>

            <h1
                className="absolute inset-0 text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-medium tracking-tight
                bg-clip-text text-transparent
                bg-[linear-gradient(to_right,#44ffff_0%,#4499ff_25%,#9966ff_50%,#ff4444_75%,#ffaa44_100%)]
                blur-sm opacity-100"
                aria-hidden="true"
            >
                {text}
            </h1>

            <h1
                className="relative text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-medium tracking-tight
                bg-clip-text text-transparent
                bg-[linear-gradient(to_right,#ffffff_0%,#ccffff_25%,#ccddff_50%,#ffcccc_75%,#ffddaa_100%)]"
            >
                {text}
            </h1>
        </div>
    );
}
