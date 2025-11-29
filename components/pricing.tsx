'use client';

import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(true);

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
            featured: false,
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
                'Priority support',
                'Advanced heuristics'
            ],
            cta: 'Choose Pro',
            featured: true,
            badge: 'Most Popular'
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
                'SLA guarantees'
            ],
            cta: 'Contact Sales',
            featured: false,
        },
    ];

    return (
        <section className="py-24 sm:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight mb-6">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                        Choose the perfect plan for your security needs. <br className="hidden sm:block" />
                        No hidden fees, ever.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-foreground" : "text-muted-foreground")}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative h-8 w-14 rounded-full bg-muted transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-checked={isAnnual}
                            role="switch"
                        >
                            <div
                                className={cn(
                                    "absolute top-1 left-1 h-6 w-6 rounded-full bg-background shadow-sm transition-transform duration-300",
                                    isAnnual ? "translate-x-6" : "translate-x-0"
                                )}
                            />
                        </button>
                        <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-foreground" : "text-muted-foreground")}>
                            Yearly <span className="ml-1.5 inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Save 50%</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={cn(
                                "relative flex flex-col p-8 rounded-3xl border bg-card transition-all duration-300",
                                tier.featured 
                                    ? "border-primary/50 shadow-2xl lg:-mt-4 lg:-mb-4 z-10 bg-card/50 backdrop-blur-sm"
                                    : "border-border hover:border-primary/20 hover:shadow-lg"
                            )}
                        >
                            {tier.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                                    <Sparkles className="w-3 h-3" />
                                    {tier.badge}
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                                <p className="text-sm text-muted-foreground mt-2 min-h-10">{tier.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-foreground tracking-tight">
                                    {isAnnual ? tier.price.annual : tier.price.monthly}
                                </span>
                                {tier.price.monthly !== 'Free' && tier.price.monthly !== 'Custom' && (
                                    <span className="text-muted-foreground">/mo</span>
                                )}
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {tier.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button 
                                className={cn(
                                    "w-full h-12 rounded-xl font-semibold text-base transition-all", 
                                    tier.featured ? "shadow-primary/25 shadow-lg" : ""
                                )}
                                variant={tier.featured ? "default" : "outline"}
                            >
                                {tier.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
