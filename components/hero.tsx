'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MacbookScroll } from '@/components/ui/macbook';

export function Hero() {
    return (
        <div className="relative w-full bg-background overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center pt-32 pb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight"
                    >
                        Next-Generation Malware Detection
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground"
                    >
                        Celestial provides cutting-edge analysis to protect your systems from advanced threats.
                        Scan files, identify risks, and stay ahead of the curve.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 flex justify-center gap-4"
                    >
                        <Link href="/dashboard">
                            <Button size="lg">Scan a File</Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="outline">Learn More</Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
            <div className="relative">
                <MacbookScroll
                    src="/ui.png"
                    showGradient={false}
                    title="Security, at your fingertips."
                />
            </div>
        </div>
    );
}
