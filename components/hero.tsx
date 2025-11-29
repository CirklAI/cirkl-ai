'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <div className="relative w-full h-screen overflow-hidden select-none">
            <div
                className="absolute -top-[25%] -right-[25%] w-full h-full"
            >
                <Image
                    src="/logo-bg.svg"
                    alt=""
                    fill
                    className="object-contain object-top-right"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-3xl sm:text-4xl font-bold text-muted-foreground tracking-tight"
                >
                    Celestial
                </motion.h1>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground tracking-tight mt-2"
                >
                    A piece of mind while using your computer
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-8"
                >
                    <Link href="/dashboard">
                        <Button size="lg">Scan a File</Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}