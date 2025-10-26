'use client';

import React from 'react';
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
            <section className="border-t border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32 text-center">
                    <h2 className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight">
                        Advanced. Inside out.
                    </h2>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground">
                        Powerful features designed to give you peace of mind.
                    </p>
                </div>
            </section>

            {features.map((feature, index) => (
                <section
                    key={index}
                    className="relative border-t"
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="mb-8 flex justify-center">{feature.icon}</div>
                            <h3 className="text-4xl font-bold text-foreground">{feature.title}</h3>
                            <p className="mt-6 text-lg text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                </section>
            ))}

            <div className="w-full border-b border-zinc-200 dark:border-zinc-800" />
        </div>
    );
}

