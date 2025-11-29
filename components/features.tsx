'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, BrainCircuit, Layers, Zap } from 'lucide-react';

const features = [
    {
        icon: <ShieldCheck className="w-12 h-12 text-primary" />,
        title: 'Security at your fingertips',
        description: `
        Instantly spot and stop threats all without leaving your dashboard. 
        Everything you need to stay secure, right where you need it.`,
    },
    {
        icon: <BrainCircuit className="w-12 h-12 text-primary" />,
        title: 'Smart Algorithms',
        description: `
        Smarter protection that looks beyond signatures. 
        Our algorithms adapt in real time, catching even the most hidden and evolving threats -
        all seamlessly integrated for you.`,
    },
    {
        icon: <Layers className="w-12 h-12 text-primary" />,
        title: 'Transparent',
        description: `
        Detailed insights on files, threats, and activity are always at your fingertips -
        giving you the clarity to act with confidence.`,
    },
    {
        icon: <Zap className="w-12 h-12 text-primary" />,
        title: 'Always ready',
        description: `
        Threats are blocked the moment they appear -
        so your system stays fast, smooth, and secure without interruption.`,
    },
];

export default function Features() {
    return (
        <div className="w-full">
            <section className="border-t border-zinc-200 dark:border-zinc-800 py-28 sm:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 sm:mb-24">
                        <h2 className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight">
                            Advanced. Inside out.
                        </h2>
                        <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground">
                            Powerful features designed to give you peace of mind.
                        </p>

                        <div className="mt-12 relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
                            <Image
                                src="/ui.png"
                                alt="Application Interface"
                                width={1200}
                                height={800}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-x-24 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col items-start text-left">
                                <div className="mb-6">{feature.icon}</div>
                                <h3 className="text-3xl font-bold text-foreground mb-4">{feature.title}</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

