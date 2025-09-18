'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import MagicText from "@/components/ui/magic-text";

export default function Hero() {
    return (
        <div className="relative w-full bg-background overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center pt-32 pb-16">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-3xl sm:text-4xl lg:text-4xl font-bold text-muted-foreground tracking-tight"
                    >
                        Celestial
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="relative"
                    >
                        <MagicText text={"A piece of mind."} />
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="mt-8 flex justify-center gap-4"
                    >
                        <Image src="/ui.png" alt="" width="672" height="456" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-8 flex justify-center gap-4"
                    >
                        <Link href="/dashboard">
                            <Button size="lg">Scan a File</Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
