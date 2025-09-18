'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Bug, FileText, RotateCcw, ShieldAlert, ShieldCheck, Upload, Zap } from "lucide-react";
import {Button} from "@/components/ui/button";

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

    return (
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full ${isClean ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {isClean ? <ShieldCheck className="w-8 h-8 text-green-400"/> : <ShieldAlert className="w-8 h-8 text-red-400"/>}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white">Threat Assessment</h3>
                        <p className="text-neutral-400">Security scan results</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Status</span>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isClean ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {result.verdict}
                        </div>
                    </div>

                    {result.detection_reason && (
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-neutral-300">Detection Reason</span>
                            <span className="text-violet-400 text-right text-sm max-w-sm">{result.detection_reason}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="text-neutral-300">File Name</span>
                        <span className="text-neutral-300 font-mono text-sm">{result.filename || "Unknown"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FileProperties({ result }: { result: ScanResult }) {
    return (
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-neutral-700/40 rounded-lg">
                        <FileText className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">File Properties</h3>
                        <p className="text-neutral-400 text-sm">Basic file information</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-neutral-900/60 rounded-lg p-3">
                        <div className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Executable</div>
                        <div className="text-white font-medium">{result.is_executable ? "Yes" : "No"}</div>
                        {!result.is_executable && (
                            <p className="text-red-400 text-sm mt-1">
                                Note: Designed for executables; non-executable file scanning is experimental.
                            </p>
                        )}
                    </div>
                    <div className="bg-neutral-900/60 rounded-lg p-3">
                        <div className="text-neutral-400 text-xs uppercase tracking-wide mb-2">SHA256 Hash</div>
                        <div className="text-neutral-300 font-mono text-sm break-all bg-neutral-800 p-3 rounded">
                            {result.sha256_hash || "Not available"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const getMalwareColorClass = (malwareType: string) => {
    const colorMap: { [key: string]: string } = {
        "Clean": 'bg-green-500/20 text-green-400',
        "UnknownVirusMalicious": 'bg-red-500/20 text-red-400',
        "Ransomware": 'bg-yellow-500/20 text-yellow-400',
        "CredentialStealerGeneric": 'bg-purple-500/20 text-purple-400',
        "TokenStealerGeneric": 'bg-pink-500/20 text-pink-400',
        "ForkBombGeneric": 'bg-orange-500/20 text-orange-400',
        "RegeditGeneric": 'bg-blue-500/20 text-blue-400',
        "TrojanGeneric": 'bg-red-600/20 text-red-400',
    };
    return colorMap[malwareType] || 'bg-neutral-700/40 text-neutral-300';
};

function SecurityAnalysis({ result }: { result: ScanResult }) {
    const getLevelClass = (score: number, thresholds: { high: number; medium: number }) => {
        if (score >= thresholds.high) return { level: 'high', color: 'bg-red-500/20 text-red-400', barColor: 'bg-red-500' };
        if (score >= thresholds.medium) return { level: 'medium', color: 'bg-yellow-500/20 text-yellow-400', barColor: 'bg-yellow-500' };
        return { level: 'low', color: 'bg-green-500/20 text-green-400', barColor: 'bg-green-500' };
    };

    const ngram = getLevelClass(result.ngram_score, { high: 0.02, medium: 0.005 });
    const entropy = getLevelClass(result.entropy, { high: 7.0, medium: 4.0 });
    const malwareClassification = `${result.malware_family || 'N/A'}.${result.malware_type || 'N/A'}`;
    const displayClassification = malwareClassification.includes("null") || malwareClassification.includes("Failed") ? 'Unable to classify' : malwareClassification;

    return (
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Zap className="w-6 h-6 text-purple-400"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Security Analysis</h3>
                        <p className="text-neutral-400 text-sm">Advanced threat detection metrics</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-neutral-900/60 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-neutral-400">N-Gram Score</span>
                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${ngram.color}`}>
                                {result.ngram_score.toFixed(2)} ({ngram.level})
                            </div>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${ngram.barColor}`} style={{ width: `${Math.min((result.ngram_score / 0.02) * 100, 100)}%` }}></div>
                        </div>

                        {result.entropy !== 0.0 && (
                            <>
                                <div className="flex justify-between items-center mb-2 mt-4">
                                    <span className="text-neutral-400">Randomness Score</span>
                                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${entropy.color}`}>
                                        {result.entropy.toFixed(2)} ({entropy.level})
                                    </div>
                                </div>
                                <div className="w-full bg-neutral-700 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${entropy.barColor}`} style={{ width: `${Math.min((result.entropy / 8.0) * 100, 100)}%` }}></div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="bg-neutral-900/60 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-300">Malware Classification</span>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMalwareColorClass(result.malware_type)}`}>
                                {displayClassification}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SuspiciousStrings({ result }: { result: ScanResult }) {
    const suspicions = result.suspicions.map(s => {
        if (typeof s === 'string') {
            try { return JSON.parse(s); }
            catch { return { pattern: s, weight: 0, match_text: null }; }
        }
        return s;
    });

    return (
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Bug className="w-6 h-6 text-orange-400"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Suspicions</h3>
                        <p className="text-neutral-400 text-sm">Potential indicators of compromise</p>
                    </div>
                </div>

                {suspicions.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400"/>
                            <span className="text-orange-400 text-sm font-medium">
                                Found {suspicions.length} suspicious item{suspicions.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="bg-neutral-900/60 rounded-lg p-3 max-h-64 overflow-y-auto space-y-3">
                            {suspicions.map((suspicion, i) => (
                                <div key={i} className="bg-neutral-800 p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-orange-300">{suspicion.pattern}</span>
                                        <div className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full">
                                            Weight: {suspicion.weight}
                                        </div>
                                    </div>
                                    {suspicion.match_text && (
                                        <p className="text-neutral-400 text-sm mt-1">
                                            Match: <code className="font-mono bg-neutral-700 p-1 rounded">{suspicion.match_text}</code>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                        <ShieldCheck className="w-8 h-8 text-green-400 mx-auto mb-2"/>
                        <p className="text-green-400 font-medium">No Suspicious Items Found</p>
                        <p className="text-neutral-400 text-sm">The file appears to be clean.</p>
                    </div>
                )}
            </div>
        </div>
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
                setResult({ ...data, filename: data.filename || file.name });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
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
        <div className="bg-black text-white min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 py-8">

                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
                        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold">Analyzing File</h2>
                            <p className="text-neutral-400">Please wait while the analysis is completed...</p>
                        </div>
                    </motion.div>
                )}

                {error && !loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
                        <div className="bg-red-900/50 border border-red-700 rounded-2xl p-6">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-red-400"/>
                                <div>
                                    <h3 className="text-lg font-semibold text-red-400">Scan Error</h3>
                                    <p className="text-red-300">{error}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!loading && !hasStartedScan && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[80vh] text-center">
                        <div className="p-4 bg-transparent rounded-full mb-4">
                            <Upload className="w-12 h-12 text-accent"/>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Upload File for Analysis</h2>
                        <p className="text-neutral-400 mb-6 max-w-md">Select a file to scan for potential threats. Maximum file size is 500MB.</p>
                        <div className="max-w-md w-full space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            />
                            <Button
                                onClick={() => {
                                    if (!selectedFile) { setError("Please select a file to scan."); return; }
                                    if (!token) { setError("Authentication required. Please sign in."); return; }
                                    scanFile(selectedFile).then();
                                }}
                                className="w-full text-white"
                                size="lg"
                                disabled={!selectedFile}
                            >
                                Start Scan
                            </Button>
                        </div>
                    </motion.div>
                )}

                {result && !loading && (
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-center">
                            <h2 className="text-3xl font-bold text-white mt-6 mb-2">Scan Results</h2>
                            <p className="text-neutral-400">Comprehensive security analysis complete.</p>
                            <Button onClick={resetScan} variant="secondary" className="mt-4 text-blue-400">
                                <RotateCcw className="w-4 h-4 mr-2"/>
                                Scan Another File
                            </Button>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <ThreatOverview result={result}/>
                        </motion.div>

                        <motion.div className="grid md:grid-cols-2 gap-6" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <FileProperties result={result}/>
                            <SecurityAnalysis result={result}/>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <SuspiciousStrings result={result}/>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
