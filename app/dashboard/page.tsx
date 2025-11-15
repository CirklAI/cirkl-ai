"use client";

import {motion, Variants} from "framer-motion";
import {useEffect, useState} from "react";
import {
    Activity,
    AlertTriangle,
    Binary,
    Bug,
    ClipboardCheck,
    FileText,
    Footprints,
    Gavel,
    Hash,
    Percent,
    RotateCcw,
    Ruler,
    Scale,
    ShieldAlert,
    ShieldCheck,
    Sigma,
    Telescope,
    Tornado,
    Weight,
    Zap,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dropzone} from "@/components/ui/dropzone";

type ScanResult = {
    is_executable: boolean;
    ngram_score: number;
    suspicious_imports: string[];
    file_hash: string | null;
    malware_type: string;
    verdict: string;
    detection_reason: string | null;
    filename: string | null;
    entropy: number;
    malware_family: string | null;
    suspicion_score: number;
    byte_frequency_anomaly: number;
    chi_square_score: number;
    longest_repeating_sequence: number;
    unique_byte_ratio: number;
    anomalous_patterns: string[];
    steganography_indicators_present: boolean;
    steganography_score: number;
};

const boolToString = (value: boolean) => (value ? 'Yes' : 'No');

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
                        <span className="text-muted-foreground flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4 text-primary"/> Status
                        </span>
                        <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${isClean ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                            {result.verdict}
                        </div>
                    </div>

                    {result.detection_reason && (
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Gavel className="w-4 h-4 text-accent"/> Detection Reason
                            </span>
                            <span className="text-accent text-right text-sm max-w-sm">{result.detection_reason}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Weight className="w-4 h-4 text-primary"/> Suspicion Score
                        </span>
                        <span className="text-foreground font-medium">{result.suspicion_score.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary"/> File Name
                        </span>
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
                        <FileText className="w-6 h-6 text-foreground"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">File Properties</h3>
                        <p className="text-neutral-400 text-sm">Basic file information</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-popover rounded-lg p-3 flex items-center justify-between">
                        <div className="flex flex-col">
                            <div className="text-neutral-400 text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                                <Binary className="w-4 h-4 text-accent"/> Executable
                            </div>
                            <div className="text-white font-medium">{boolToString(result.is_executable)}</div>
                        </div>
                        {!result.is_executable && (
                            <p className="text-red-400 text-sm max-w-xs text-right">
                                Note: Non-executable file scanning is experimental.
                            </p>
                        )}
                    </div>

                    <div className="bg-popover rounded-lg p-3">
                        <div className="text-neutral-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-accent"/> File Hash (SHA256)
                        </div>
                        <div className="text-neutral-300 font-mono text-sm break-all bg-card p-3 rounded">
                            {result.file_hash || "Not available"}
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
        "Ransomware": 'bg-destructive/20 text-destructive',
        "CredentialStealerGeneric": 'bg-destructive/20 text-destructive',
        "TokenStealerGeneric": 'bg-destructive/20 text-destructive',
        "ForkBombGeneric": 'bg-destructive/20 text-destructive',
        "RegeditGeneric": 'bg-secondary/20 text-secondary-foreground',
        "TrojanGeneric": 'bg-destructive/20 text-destructive',
        "PE32_MALWARE": 'bg-destructive/20 text-destructive',
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

    const malwareClassification = result.malware_type || 'N/A';
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
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Footprints className="w-4 h-4 text-accent"/> N-Gram Score
                            </span>
                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${ngram.color}`}>
                                {result.ngram_score.toFixed(4)} ({ngram.level})
                            </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${ngram.barColor}`}
                                 style={{width: `${ngramWidth}%`}}></div>
                        </div>

                        {result.entropy !== 0.0 && (
                            <>
                                <div className="flex justify-between items-center mb-2 mt-4">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Tornado className="w-4 h-4 text-accent"/> Randomness Score (Entropy)
                                    </span>
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
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Bug className="w-4 h-4 text-accent"/> Malware Classification
                            </span>
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

function StatisticalAnalysis({result}: { result: ScanResult }) {
    return (
        <div className="bg-card/50 border border-border rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-secondary/30 rounded-lg">
                        <Sigma className="w-6 h-6 text-foreground"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Statistical Analysis</h3>
                        <p className="text-muted-foreground text-sm">Low-level data distribution metrics</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center bg-popover rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <Percent className="w-5 h-5 text-accent"/>
                            <span className="text-muted-foreground">Unique Byte Ratio</span>
                        </div>
                        <span className="text-foreground font-medium">{result.unique_byte_ratio.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center bg-popover rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <Ruler className="w-5 h-5 text-primary"/>
                            <span className="text-muted-foreground">Longest Repeat Sequence</span>
                        </div>
                        <span className="text-foreground font-medium">{result.longest_repeating_sequence} bytes</span>
                    </div>

                    <div className="flex justify-between items-center bg-popover rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <Scale className="w-5 h-5 text-accent"/>
                            <span className="text-muted-foreground">Chi-Square Score</span>
                        </div>
                        <span className="text-foreground font-medium">{result.chi_square_score.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center bg-popover rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-accent"/>
                            <span className="text-muted-foreground">Byte Frequency Anomaly</span>
                        </div>
                        <span className="text-foreground font-medium">{result.byte_frequency_anomaly.toFixed(6)}</span>
                    </div>

                    <div className="flex items-start gap-3 bg-popover rounded-lg p-3">
                        <Telescope className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"/>
                        <div className="flex-grow">
                            <div className="text-white font-medium mb-1">Steganography Indicators</div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-sm">Potential Hidden Data</span>
                                <div
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${result.steganography_indicators_present ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                                    {boolToString(result.steganography_indicators_present)}
                                </div>
                            </div>
                            {result.steganography_indicators_present && (
                                <p className="text-accent text-sm mt-1">
                                    Score: {result.steganography_score.toFixed(3)}
                                </p>
                            )}
                        </div>
                    </div>

                    {result.anomalous_patterns.length > 0 && (
                        <div className="bg-popover rounded-lg p-3">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-5 h-5 text-destructive"/>
                                <div className="text-neutral-400 text-xs uppercase tracking-wide">Anomalous Patterns Detected</div>
                            </div>
                            <div className="space-y-1">
                                {result.anomalous_patterns.map((pattern, i) => (
                                    <span key={i}
                                          className="inline-block bg-card text-xs text-destructive px-2 py-1 rounded-full mr-2">
                                        {pattern}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

function SuspiciousImports({result}: { result: ScanResult }) {
    const suspiciousImports = (result.suspicious_imports || []).filter(
        importName => importName.toLowerCase() !== 'no'
    );

    return (
        <div className="bg-card/50 border border-border rounded-2xl">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-destructive/20 rounded-lg">
                        <Bug className="w-6 h-6 text-destructive"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Suspicious Imports</h3>
                        <p className="text-muted-foreground text-sm">Potential indicators of compromise</p>
                    </div>
                </div>

                {suspiciousImports.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-destructive"/>
                            <span className="text-destructive text-sm font-medium">
                                Found {suspiciousImports.length} suspicious import{suspiciousImports.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="bg-popover rounded-lg p-3 max-h-64 overflow-y-auto space-y-3">
                            {suspiciousImports.map((importName, i) => (
                                <div key={i} className="bg-card p-3 rounded-lg flex justify-between items-center">
                                    <span className="font-mono text-sm text-destructive">{importName}</span>
                                    <div
                                        className="bg-destructive/20 text-destructive text-xs px-2 py-0.5 rounded-full">
                                        Import
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
                        <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2"/>
                        <p className="text-primary font-medium">No Suspicious Imports Found</p>
                        <p className="text-muted-foreground text-sm">The file appears to contain no suspicious imports.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
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
        if(typeof window !== "undefined" && window.localStorage) {
            setToken(localStorage.getItem("auth_token"));
        }
    }, []);

    const scanFile = async(file: File) => {
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
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseText = await response.text();

            try {
                const data = JSON.parse(responseText);
                if(!response.ok) {
                    setError(data.error || responseText || "An unknown error occurred");
                } else {
                    const mappedData = {
                        ...data,
                        suspicious_imports: data.suspicious_imports || data.suspicions || [],
                        file_hash: data.file_hash || data.sha256_hash || null,
                        filename: data.filename || file.name,
                        byte_frequency_anomaly: data.byte_frequency_anomaly ?? 0,
                        chi_square_score: data.chi_square_score ?? 0,
                        longest_repeating_sequence: data.longest_repeating_sequence ?? 0,
                        unique_byte_ratio: data.unique_byte_ratio ?? 0,
                        anomalous_patterns: data.anomalous_patterns ?? [],
                        steganography_indicators_present: data.steganography_indicators_present ?? false,
                        steganography_score: data.steganography_score ?? 0,
                    };
                    setResult(mappedData);
                }
            } catch {
                console.error("Client failed to parse JSON response:", responseText);
                setError(`An unexpected server response was received`);
            }
        } catch(err) {
            setError(err instanceof Error ? err.message : "A network error occurred");
        } finally {
            setLoading(false);
        }
    };

    const resetScan = () => {
        setSelectedFile(null);
        setResult(null);
        setError(null);
        setHasStartedScan(false);
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

                        <motion.div className="grid md:grid-cols-2 gap-6"
                                    variants={resultItemVariants}>
                            <StatisticalAnalysis result={result}/>
                            <SuspiciousImports result={result}/>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
