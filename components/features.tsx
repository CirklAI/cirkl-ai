'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, BrainCircuit, Layers } from 'lucide-react';

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: 'Comprehensive Detection',
        description: 'Identify a wide range of threats, including viruses, ransomware, trojans, and credential stealers.',
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-primary" />,
        title: 'Advanced Heuristic Analysis',
        description: 'Leverage advanced algorithms to detect even the most sophisticated and obfuscated malware.',
    },
    {
        icon: <Layers className="w-8 h-8 text-primary" />,
        title: 'In-Depth Reporting',
        description: 'Receive detailed reports on file properties, threat assessments, and suspicious activities.',
    },
];

export function Features() {
    return (
        <section id="features" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">Why Choose Celestial?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Powerful features designed to give you peace of mind.
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full">
                                <CardHeader>
                                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                                        {feature.icon}
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
