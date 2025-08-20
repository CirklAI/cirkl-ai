'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-lg font-semibold">Cirkl Labs</p>
                        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
