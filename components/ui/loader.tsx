"use client";
import { motion } from "motion/react";
import React from "react";

interface LoaderProps {
    text: string;
    className?: string;
}

export const Loader = ({ text, className }: LoaderProps) => {
    return (
        <div className={`font-sans font-bold [--shadow-color:var(--color-neutral-500)] dark:[--shadow-color:var(--color-neutral-100)] ${className || ""}`}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{
                        textShadow: [
                            "0 0 0 var(--shadow-color)",
                            "0 0 1px var(--shadow-color)",
                            "0 0 0 var(--shadow-color)",
                        ],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: i * 0.05,
                        ease: "easeInOut",
                        repeatDelay: 2,
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </div>
    );
};
