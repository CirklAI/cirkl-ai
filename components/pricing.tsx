'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function Pricing() {
    const [isAnnual, setIsAnnual] = useState(false);

    const tiers = [
        {
            name: 'Basic',
            price: {
                monthly: 'Free',
                annual: 'Free',
            },
            description: 'For individuals starting out.',
            features: ['Web-based file scanning', 'Basic threat analysis', 'Community support'],
            cta: 'Start for Free',
        },
        {
            name: 'Premium',
            price: {
                monthly: '$4.99',
                annual: '$2.49',
            },
            description: 'For power users and professionals.',
            features: [
                'Everything in Basic',
                'Full desktop application',
                'Priority email support',
                'Cloud integration'
            ],
            cta: 'Get Started',
        },
        {
            name: 'Enterprise',
            price: {
                monthly: 'Custom',
                annual: 'Custom',
            },
            description: 'For businesses and organizations.',
            features: [
                'Everything in Premium',
                'On-premise deployment',
                'API access',
                'Dedicated support',
                'Custom integrations',
            ],
            cta: 'Contact Sales',
        },
    ];

    return (
        <section id="pricing" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">Flexible Pricing for Everyone</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Choose the plan that&apos;s right for you.
                    </p>
                </motion.div>

                <div className="flex items-center justify-center space-x-2 bg-muted p-1 rounded-lg max-w-xs mx-auto mb-8">
                    <Button
                        onClick={() => setIsAnnual(false)}
                        variant={!isAnnual ? 'default' : 'ghost'}
                        className="w-full"
                    >
                        Monthly
                    </Button>
                    <Button
                        onClick={() => setIsAnnual(true)}
                        variant={isAnnual ? 'default' : 'ghost'}
                        className="w-full"
                    >
                        Annual (Save 50%)
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle>{tier.name}</CardTitle>
                                    <div className="text-4xl font-bold">
                                        {isAnnual ? tier.price.annual : tier.price.monthly}
                                        {tier.name !== 'Basic' && tier.name !== 'Enterprise' && (
                                            <span className="text-lg font-normal text-muted-foreground">/mo</span>
                                        )}
                                    </div>
                                    <CardDescription>{tier.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <ul className="space-y-4">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-primary" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <div className="p-6">
                                    <Button className="w-full">{tier.cta}</Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
