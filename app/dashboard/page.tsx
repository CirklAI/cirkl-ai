"use client";

import {motion, Variants} from "framer-motion";
import React, {useEffect, useState} from "react";
import {AlertTriangle, Bug, FileText, RotateCcw, ShieldAlert, ShieldCheck, Zap,} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useSidebar} from "@/lib/hooks/useSidebar";
import {Dropzone} from "@/components/ui/dropzone";

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

function ThreatOverview({result}: { result: ScanResult }) {
    const isClean = result.verdict.toLowerCase() === 'clean';

    return (
        <div className="bg-card/50 border border-border rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full ${isClean ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                        {isClean ? <ShieldCheck className="w-8 h-8 text-primary"/> :
                            <ShieldAlert className="w-8 h-8 text-destructive"/>}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white">Threat Assessment</h3>
                        <p className="text-muted-foreground">Security scan results</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${isClean ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                            {result.verdict}
                        </div>
                    </div>

                    {result.detection_reason && (
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-muted-foreground">Detection Reason</span>
                            <span className="text-accent text-right text-sm max-w-sm">{result.detection_reason}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">File Name</span>
                        <span className="text-foreground font-mono text-sm">{result.filename || "Unknown"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FileProperties({result}: { result: ScanResult }) {
    return (
        <div className="bg-card/50 border border-border rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-popover rounded-lg">
                        <FileText className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">File Properties</h3>
                        <p className="text-neutral-400 text-sm">Basic file information</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-popover rounded-lg p-3">
                        <div className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Executable</div>
                        <div className="text-white font-medium">{result.is_executable ? "Yes" : "No"}</div>
                        {!result.is_executable && (
                            <p className="text-red-400 text-sm mt-1">
                                Note: Designed for executables; non-executable file scanning is experimental.
                            </p>
                        )}
                    </div>
                    <div className="bg-popover rounded-lg p-3">
                        <div className="text-neutral-400 text-xs uppercase tracking-wide mb-2">SHA256 Hash</div>
                        <div className="text-neutral-300 font-mono text-sm break-all bg-card p-3 rounded">
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
        "Clean": 'bg-primary/20 text-primary',
        "UnknownVirusMalicious": 'bg-destructive/20 text-destructive',
        "Ransomware": 'bg-accent/20 text-accent',
        "CredentialStealerGeneric": 'bg-accent/20 text-accent',
        "TokenStealerGeneric": 'bg-accent/20 text-accent',
        "ForkBombGeneric": 'bg-destructive/20 text-destructive',
        "RegeditGeneric": 'bg-secondary/20 text-secondary-foreground',
        "TrojanGeneric": 'bg-destructive/20 text-destructive',
    };
    return colorMap[malwareType] || 'bg-muted/20 text-muted-foreground';
};

function SecurityAnalysis({result}: { result: ScanResult }) {
    const ngramWidth = Math.min((result.ngram_score / 0.02) * 100, 100);
    const entropyWidth = Math.min((result.entropy / 8.0) * 100, 100);

    const getLevelClass = (score: number, thresholds: { high: number; medium: number }) => {
        if(score >= thresholds.high) return {
            level: 'high',
            color: 'bg-destructive/20 text-destructive',
            barColor: 'bg-destructive'
        };
        if(score >= thresholds.medium) return {
            level: 'medium',
            color: 'bg-accent/20 text-accent',
            barColor: 'bg-accent'
        };
        return {level: 'low', color: 'bg-primary/20 text-primary', barColor: 'bg-primary'};
    };

    const ngram = getLevelClass(result.ngram_score, {high: 0.02, medium: 0.005});
    const entropy = getLevelClass(result.entropy, {high: 7.0, medium: 4.0});
    const malwareClassification = `${result.malware_family || 'N/A'}.${result.malware_type || 'N/A'}`;
    const displayClassification = malwareClassification.includes("null") || malwareClassification.includes("Failed") ? 'Unable to classify' : malwareClassification;

    return (
        <div className="bg-card/50 border border-border rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-popover rounded-lg">
                        <Zap className="w-6 h-6 text-accent"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Security Analysis</h3>
                        <p className="text-muted-foreground text-sm">Advanced threat detection metrics</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-popover rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-muted-foreground">N-Gram Score</span>
                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${ngram.color}`}>
                                {result.ngram_score.toFixed(2)} ({ngram.level})
                            </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${ngram.barColor}`}
                                 style={{width: `${ngramWidth}%`}}></div>
                        </div>

                        {result.entropy !== 0.0 && (
                            <>
                                <div className="flex justify-between items-center mb-2 mt-4">
                                    <span className="text-muted-foreground">Randomness Score</span>
                                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${entropy.color}`}>
                                        {result.entropy.toFixed(2)} ({entropy.level})
                                    </div>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${entropy.barColor}`}
                                         style={{width: `${entropyWidth}%`}}></div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="bg-popover rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Malware Classification</span>
                            <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getMalwareColorClass(result.malware_type)}`}>
                                {displayClassification}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SuspiciousStrings({result}: { result: ScanResult }) {
    const suspicions = result.suspicions.map(s => {
        if(typeof s === 'string') {
            try {
                return JSON.parse(s);
            } catch {
                return {pattern: s, weight: 0, match_text: null};
            }
        }
        return s;
    });

    return (
        <div className="bg-card/50 border border-border rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-destructive/20 rounded-lg">
                        <Bug className="w-6 h-6 text-destructive"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Suspicions</h3>
                        <p className="text-muted-foreground text-sm">Potential indicators of compromise</p>
                    </div>
                </div>

                {suspicions.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-destructive"/>
                            <span className="text-destructive text-sm font-medium">
                Found {suspicions.length} suspicious item{suspicions.length > 1 ? 's' : ''}
              </span>
                        </div>
                        <div className="bg-popover rounded-lg p-3 max-h-64 overflow-y-auto space-y-3">
                            {suspicions.map((suspicion, i) => (
                                <div key={i} className="bg-card p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-destructive">{suspicion.pattern}</span>
                                        <div
                                            className="bg-destructive/20 text-destructive text-xs px-2 py-0.5 rounded-full">
                                            Weight: {suspicion.weight}
                                        </div>
                                    </div>
                                    {suspicion.match_text && (
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Match: <code
                                            className="font-mono bg-muted p-1 rounded">{suspicion.match_text}</code>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
                        <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2"/>
                        <p className="text-primary font-medium">No Suspicious Items Found</p>
                        <p className="text-muted-foreground text-sm">The file appears to be clean.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const {setShowingResults} = useSidebar();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [hasStartedScan, setHasStartedScan] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const resultContainerVariants: Variants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const resultItemVariants: Variants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {type: "spring", stiffness: 200, damping: 30},
        },
    };


    useEffect(() => {
        setShowingResults(false);
    }, [setShowingResults]);

    useEffect(() => {
        if(typeof window !== "undefined" && window.localStorage) {
            setToken(localStorage.getItem("auth_token"));
        }
    }, []);

    const scanFile = async(file: File) => {
        setLoading(true);
        setError(null);
        setResult(null);
        setHasStartedScan(true);
        setShowingResults(false);

        const fileBytes = await file.arrayBuffer();

        try {
            const response = await fetch("/api/v1/scan", {
                method: "POST",
                body: fileBytes,
                headers: {
                    "Content-Type": "application/octet-stream",
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseText = await response.text();

            try {
                const data = JSON.parse(responseText);
                if(!response.ok) {
                    setError(data.error || responseText || "An unknown error occurred");
                    setShowingResults(false);
                } else {
                    setResult({...data, filename: data.filename || file.name});
                    setShowingResults(true);
                }
            } catch {
                console.error("Client failed to parse JSON response:", responseText);
                setError(`An unexpected server response was received`);
                setShowingResults(false);
            }
        } catch(err) {
            setError(err instanceof Error ? err.message : "A network error occurred");
            setShowingResults(false);
        } finally {
            setLoading(false);
        }
    };

    const resetScan = () => {
        setSelectedFile(null);
        setResult(null);
        setError(null);
        setHasStartedScan(false);
        setShowingResults(false);
    };

    return (
        <div className={`bg-background text-white min-h-screen`}>
            <div className="container mx-auto px-4 sm:px-6 py-8">

                {loading && (
                    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
                        <div
                            className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold">Analyzing File</h2>
                            <p className="text-muted-foreground">Please wait while the analysis is completed...</p>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="max-w-md mx-auto">
                        <div className="bg-destructive/20 border mt-4 border-destructive/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-destructive"/>
                                <div>
                                    <h3 className="text-lg font-semibold text-destructive">Scan Error</h3>
                                    <p className="text-destructive/80">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !hasStartedScan && (
                    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
                        <div className="max-w-lg w-full space-y-6">
                            <Dropzone onFileChange={setSelectedFile}/>
                            <Button
                                onClick={() => {
                                    if(!selectedFile) {
                                        setError("Please select a file to scan.");
                                        return;
                                    }
                                    if(!token) {
                                        setError("Please sign in with the Login/Register button in sidebar");
                                        return;
                                    }
                                    scanFile(selectedFile).then();
                                }}
                                className="w-full text-white"
                                size="lg"
                                disabled={!selectedFile}
                            >
                                Start Scan
                            </Button>
                        </div>
                    </div>
                )}

                {result && !loading && (
                    <motion.div initial="hidden" animate="visible"
                                variants={resultContainerVariants} className="space-y-6">
                        <motion.div variants={resultItemVariants}
                                    className="text-center">
                            <h2 className="text-3xl font-bold text-white mt-6 mb-2">Scan Results</h2>
                            <p className="text-muted-foreground">Comprehensive security analysis complete.</p>
                            <Button onClick={resetScan} className="mt-4">
                                <RotateCcw className="w-4 h-4 mr-2"/>
                                Scan Another File
                            </Button>
                        </motion.div>

                        <motion.div variants={resultItemVariants}>
                            <ThreatOverview result={result}/>
                        </motion.div>

                        <motion.div className="grid md:grid-cols-2 gap-6"
                                    variants={resultItemVariants}>
                            <FileProperties result={result}/>
                            <SecurityAnalysis result={result}/>
                        </motion.div>

                        <motion.div variants={resultItemVariants}>
                            <SuspiciousStrings result={result}/>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

