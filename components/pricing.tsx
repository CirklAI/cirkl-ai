'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(false);

    const tiers = [
        {
            name: 'Essential',
            price: {
                monthly: 'Free',
                annual: 'Free',
            },
            description: 'Perfect for getting started with security.',
            features: [
                'Advanced web scanning',
                'Real-time threat detection',
                'Zero data retention'
            ],
            cta: 'Get Essential',
        },
        {
            name: 'Pro',
            price: {
                monthly: '$4.99',
                annual: '$2.49',
            },
            description: 'Built for professionals who demand more.',
            features: [
                'Everything in Essential',
                'Native desktop experience',
                'Priority support'
            ],
            cta: 'Choose Pro',
            featured: true
        },
        {
            name: 'Business',
            price: {
                monthly: 'Custom',
                annual: 'Custom',
            },
            description: 'Designed for teams and businesses.',
            features: [
                'Everything in Pro',
                'Private cloud deployment',
                'Sub-second¹ scans'
            ],
            cta: 'Talk to Sales',
        },
    ];

    return (
        <section className="py-32 bg-background">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-6xl font-bold text-foreground tracking-tight mb-6 leading-none">
                        Ready when you are.
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Choose the plan that fits you perfectly.
                    </p>
                </div>

                <div className="flex justify-center mb-20">
                    <div className="bg-muted rounded-full p-2">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-8 py-3 rounded-full text-base font-medium transition-all ${!isAnnual
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-8 py-3 rounded-full text-base font-medium transition-all ${isAnnual
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`bg-card rounded-3xl border transition-all duration-300 hover:shadow-lg h-full flex flex-col ${tier.featured
                                ? 'border-accent shadow-lg transform lg:scale-105'
                                : 'border-border hover:border-primary/50'
                                }`}
                        >
                            <div className="p-10 flex flex-col flex-grow">
                                <div className="text-center mb-10">
                                    <h3 className="text-3xl font-bold text-card-foreground mb-4">
                                        {tier.name}
                                    </h3>
                                    <div className="mb-4">
                                        <span className="text-6xl font-bold text-card-foreground tracking-tight">
                                            {isAnnual ? tier.price.annual : tier.price.monthly}
                                        </span>
                                        {tier.name !== 'Essential' && tier.name !== 'Max' && (
                                            <span className="text-xl text-muted-foreground font-medium">
                                                /month
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {tier.description}
                                    </p>
                                </div>

                                <div className="space-y-6 mb-12 flex-grow">
                                    {tier.features.map((feature, i) => (
                                        <div key={i} className="flex items-start">
                                            <Check className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
                                            <span className="text-card-foreground text-lg leading-relaxed">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    className={`w-full py-8 px-16 rounded-2xl text-lg font-semibold transition-all ${tier.featured
                                        ? 'shadow-sm'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                        }`}
                                >
                                    {tier.cta}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
