'use client';
import React, { useState, useEffect } from 'react';

export default function Footer() {
    const [isOnline, setIsOnline] = useState(true);
    const [statusText, setStatusText] = useState('All systems operational');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await fetch('/version');
                if (response.ok) {
                    setIsOnline(true);
                    setStatusText('All systems operational');
                } else {
                    setIsOnline(false);
                    setStatusText('Service degraded');
                }
            } catch {
                setIsOnline(false);
                setStatusText('Service unavailable');
            }
        };

        checkStatus().then();
        const interval = setInterval(checkStatus, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="bg-background border-t">
            <div className="max-w-6xl mx-auto px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left space-y-3">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Celestial
                        </h1>
                        <p className="text-xl font-medium text-muted-foreground">
                            Cirkl Labs
                        </p>
                        <p className="text-muted-foreground">
                            © {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                        <span className="text-sm font-medium">{statusText}</span>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                        <p><sup>1</sup> Tested with 2mb files</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
