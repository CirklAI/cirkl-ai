'use client';

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import {
    ShieldAlert,
    ShieldCheck,
    Upload,
    FileText,
    Bug,
    Zap,
    AlertTriangle,
    RotateCcw
} from "lucide-react";
import { motion } from "motion/react";

type Suspicion = {
    pattern: string;
    match_text: string | null;
    weight: number;
    malware_type: string;
    signature: string;
};

type ScanResult = {
    is_executable: boolean;
    ngram_score: number;
    suspicions: (string | Suspicion)[];
    sha256_hash: string | null;
    malware_type: string;
    verdict: string;
    detection_reason: string | null;
    filename: string | null;
    entropy: number;
    malware_family: string | null;
};

function ThreatOverview({ result }: { result: ScanResult }) {
    const isClean = result.verdict.toLowerCase() === 'clean';
    const isSuspicious = result.verdict.toLowerCase().includes('suspicious');

    return (
        <Card className="bg-card border-border">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    {isClean ? (
                        <div className="p-3 bg-green-500/20 rounded-full">
                            <ShieldCheck className="w-8 h-8 text-green-400" />
                        </div>
                    ) : (
                        <div className="p-3 bg-red-500/20 rounded-full">
                            <ShieldAlert className="w-8 h-8 text-red-400" />
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">Threat Assessment</h3>
                        <p className="text-muted-foreground">Security scan results</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                            className={`${isClean
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : isSuspicious
                                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                }`}
                        >
                            {result.verdict}
                        </Badge>
                    </div>

                    {result.detection_reason && (
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-secondary-foreground">Detection Reason</span>
                            <span
                                className="text-purple-400 text-right text-sm max-w-sm">{result.detection_reason}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="text-secondary-foreground">File Name</span>
                        <span className="text-secondary-foreground font-mono text-sm">{result.filename || "Unknown"}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function FileProperties({ result }: { result: ScanResult }) {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-mini-card/20 rounded-lg">
                        <FileText className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">File Properties</h3>
                        <p className="text-muted-foreground text-sm">Basic file information</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-mini-card/50 rounded-lg p-3">
                        <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Executable</div>
                        <div className="text-foreground font-medium">
                            {result.is_executable ? "Yes" : "No"}
                        </div>

                        {!result.is_executable ? (
                            <p className="text-red-400 text-sm">
                                Notice: Celestial is designed for executables, scanning non-executable files is
                                experimental.
                            </p>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="bg-mini-card/50 rounded-lg p-3">
                        <div className="text-muted-foreground text-xs uppercase tracking-wide mb-2">SHA256 Hash</div>
                        <div className="text-secondary-foreground font-mono text-sm break-all bg-card p-3 rounded">
                            {result.sha256_hash || "Not available"}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function getMalwareColor(result: ScanResult) {
    switch (result.malware_type) {
        case "Clean":
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        case "UnknownVirusMalicious":
            return 'bg-red-500/20 text-red-400 border-red-500/30';
        case "Ransomware":
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case "CredentialStealerGeneric":
            return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case "TokenStealerGeneric":
            return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
        case "ForkBombGeneric":
            return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case "RegeditGeneric":
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case "TrojanGeneric":
            return 'bg-red-600/20 text-red-400 border-red-500/30';
        default:
            return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
}

function SecurityAnalysis({ result }: { result: ScanResult }) {
    const ngramLevel = result.ngram_score >= 0.02 ? 'high' : result.ngram_score >= 0.005 ? 'medium' : 'low';
    const entropyLevel = result.entropy >= 7.0 ? 'high' : result.ngram_score >= 4.0 ? 'medium' : 'low';
    const malwareColor = getMalwareColor(result);
    const malwareClassification = result.malware_family + "." + result.malware_type;

    return (
        <Card className="bg-card border-border">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Zap className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Security Analysis</h3>
                        <p className="text-muted-foreground text-sm">Advanced threat detection metrics</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-mini-card/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-muted-foreground">N-Gram Score</span>
                            <Badge className={`${ngramLevel === 'high'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : ngramLevel === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                    : 'bg-green-500/20 text-green-400 border-green-500/30'
                                }`}>
                                {result.ngram_score.toFixed(2)} ({ngramLevel})
                            </Badge>
                        </div>
                        <div className="w-full bg-card rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${ngramLevel === 'high' ? 'bg-red-500/80' :
                                    ngramLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${Math.min((result.ngram_score / 0.02) * 100, 100)}%` }}
                            ></div>
                        </div>

                        {result.entropy !== 0.0 ? (
                            <>
                                <div className="flex justify-between items-center mb-2 mt-2">
                                    <span className="text-neutral-300">Randomness Score</span>
                                    <Badge className={`${entropyLevel === 'high'
                                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                        : entropyLevel === 'medium'
                                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                                        }`}>
                                        {result.entropy.toFixed(2)} ({entropyLevel})
                                    </Badge>
                                </div>

                                <div className="w-full bg-neutral-700 rounded-full h-2 mt-2">
                                    <div
                                        className={`h-2 rounded-full ${entropyLevel === 'high' ? 'bg-red-500/80' :
                                            entropyLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${Math.min((result.entropy / 8.0) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="bg-mini-card/50 rounded-lg p-4 mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-secondary-foreground">Malware Classification</span>
                            <Badge className={`${malwareColor}`}>
                                {malwareClassification.includes("null") || malwareClassification.includes("Failed") ? 'Likely Clean (Unable to classify)' : malwareClassification}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function SuspiciousStrings({ result }: { result: ScanResult }) {
    const suspicions = result.suspicions.map(s => {
        if (typeof s === 'string') {
            try {
                return JSON.parse(s);
            } catch {
                return { pattern: s, weight: 0, match_text: null };
            }
        }
        return s;
    });

    return (
        <Card className="bg-card border-border">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Bug className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Suspicions</h3>
                        <p className="text-muted-foreground text-sm">Assumptions about the file</p>
                    </div>
                </div>

                {suspicions.length > 0 ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400 text-sm font-medium">
                                Found {suspicions.length} suspicious actions
                            </span>
                        </div>

                        <div className="bg-secondary/50 rounded-lg p-3 max-h-64 overflow-y-auto">
                            {suspicions.map((suspicion, i) => (
                                <div key={i} className="bg-card p-3 rounded-lg mb-3 last:mb-0">
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-orange-300">{suspicion.pattern}</span>
                                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                                            Weight: {suspicion.weight}
                                        </Badge>
                                    </div>
                                    {suspicion.match_text && (
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Match: <code className="font-mono">{suspicion.match_text}</code>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                        <ShieldCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-green-400 font-medium">No suspicious actions immediately detected</p>
                        <p className="text-muted-foreground text-sm">This file contains no (<i>known</i>) suspicious activity
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [hasStartedScan, setHasStartedScan] = useState(false);

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            setToken(localStorage.getItem('auth_token'));
        }
    }, []);

    const scanFile = async (file: File) => {
        setLoading(true);
        setError(null);
        setResult(null);
        setHasStartedScan(true);

        const fileBytes = await file.arrayBuffer();

        try {
            const response = await fetch("/api/v1/scan", {
                method: "POST",
                body: fileBytes,
                headers: {
                    "Content-Type": "application/octet-stream",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to scan file");
            } else {
                const resultWithFilename = {
                    ...data,
                    filename: data.filename || file.name
                };
                setResult(resultWithFilename);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const resetScan = () => {
        setSelectedFile(null);
        setResult(null);
        setError(null);
        setHasStartedScan(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-background text-foreground">
            <div className="container mx-auto mt-10 sm:px-6 px-4 py-8">
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center h-[85vh] space-y-6"
                    >
                        <div className="p-6 bg-card/20 rounded-full">
                            <div
                                className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>

                        <div className="text-center space-y-4">
                            <Loader className="text-3xl" text="Analyzing File" />

                            <p className="text-sm text-muted-foreground/70">Please wait while we complete the analysis...</p>
                        </div>
                    </motion.div>
                )}

                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="mb-8 bg-card border-border">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-400">Scan Error</h3>
                                        <p className="text-red-300">{error}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {!loading && !hasStartedScan && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card border={false} className="mb-8 bg-transparent flex flex-col items-center justify-center h-[80vh] space-y-6">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <div className="p-4 bg-secondary/20 rounded-full w-fit mx-auto mb-4">
                                        <Upload className="w-12 h-12 text-purple-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground mb-2">Upload File for Scanning</h2>
                                    <p className="text-muted-foreground mb-6">Select a file to analyze for potential threats,
                                        max 500mb</p>

                                    <div className="max-w-md mx-auto space-y-4">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="w-full p-4 bg-background text-foreground rounded-2xl border border-border hover:bg-secondary/20 transition-colors focus:outline-none focus:border-ring"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        />

                                        <button
                                            onClick={() => {
                                                if (!selectedFile) {
                                                    setError("Please select a file to scan.");
                                                    return;
                                                }

                                                if (!token) {
                                                    setError("Please sign in to use this!");
                                                    return;
                                                }

                                                scanFile(selectedFile).then();
                                            }}
                                            className="w-full bg-primary-foreground cursor-pointer hover:bg-secondary px-6 py-4 rounded-lg font-semibold text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!selectedFile}
                                        >
                                            Start Scan
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {result && !loading && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.15
                                }
                            }
                        }}
                        className="space-y-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-2xl font-bold text-foreground mb-2 mt-6">Scan Results</h2>
                            <p className="text-muted-foreground">Comprehensive security analysis completed</p>

                            <motion.button
                                onClick={resetScan}
                                className="mt-4 inline-flex items-center gap-2 bg-primary-foreground hover:bg-popover-hover px-6 py-3 rounded-lg font-semibold text-secondary-foreground transition-all duration-200 cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                            >
                                <RotateCcw className="w-4 h-4" />
                                Scan Again
                            </motion.button>
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                            }}
                        >
                            <ThreatOverview result={result} />
                        </motion.div>
                        <motion.div
                            className="grid md:grid-cols-2 gap-6"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                            }}
                        >
                            <FileProperties result={result} />
                            <SecurityAnalysis result={result} />
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                            }}
                        >
                            <SuspiciousStrings result={result} />
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
