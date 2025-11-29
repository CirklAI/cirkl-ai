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
        <div className="bg-card border border-border rounded-xl h-full flex flex-col">
            <div className="p-4 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg ${isClean ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                        {isClean ? <ShieldCheck className="w-6 h-6 text-primary"/> :
                            <ShieldAlert className="w-6 h-6 text-destructive"/>}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-lg">Threat Assessment</h3>
                        <p className="text-xs text-muted-foreground">Security scan results</p>
                    </div>
                </div>

                <div className="space-y-3 grow">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground text-sm flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4 text-primary"/> Status
                        </span>
                        <div
                            className={`px-2.5 py-1 rounded-md text-xs font-medium ${isClean ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                            {result.verdict}
                        </div>
                    </div>

                    {result.detection_reason && (
                        <div className="p-3 bg-muted/30 rounded-lg">
                            <span className="text-muted-foreground text-xs flex items-center gap-1.5 mb-1.5">
                                <Gavel className="w-4 h-4 text-accent"/> Detection Reason
                            </span>
                            <p className="text-accent text-xs leading-relaxed">{result.detection_reason}</p>
                        </div>
                    )}

                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg mt-auto">
                        <span className="text-muted-foreground text-sm flex items-center gap-2">
                            <Weight className="w-4 h-4 text-primary"/> Suspicion Score
                        </span>
                        <span className="text-foreground font-medium text-sm">{result.suspicion_score.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FileProperties({result}: { result: ScanResult }) {
    return (
        <div className="bg-card border border-border rounded-xl h-full flex flex-col">
            <div className="p-4 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-secondary/30 rounded-lg">
                        <FileText className="w-6 h-6 text-foreground"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-lg">File Properties</h3>
                        <p className="text-xs text-muted-foreground">Basic file information</p>
                    </div>
                </div>

                <div className="space-y-3 grow">
                     <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-muted-foreground text-xs mb-1">Filename</div>
                         <div className="text-foreground font-mono text-xs break-all">{result.filename || "Unknown"}</div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex flex-col">
                            <div className="text-muted-foreground text-xs mb-0.5 flex items-center gap-1.5">
                                <Binary className="w-4 h-4 text-accent"/> Executable
                            </div>
                            <div className="text-white text-sm font-medium">{boolToString(result.is_executable)}</div>
                        </div>
                        {!result.is_executable && (
                            <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-1 rounded">
                                Experimental
                            </span>
                        )}
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 mt-auto">
                        <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1.5">
                            <Hash className="w-4 h-4 text-accent"/> SHA256 Hash
                        </div>
                        <div className="text-neutral-300 font-mono text-[10px] break-all leading-tight">
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
        <div className="bg-card border border-border rounded-xl h-full flex flex-col">
            <div className="p-4 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-secondary/30 rounded-lg">
                        <Zap className="w-6 h-6 text-accent"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-lg">Security Analysis</h3>
                        <p className="text-xs text-muted-foreground">Advanced detection metrics</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 grow min-h-0">
                    <div className="md:col-span-2 flex flex-col gap-3 h-full min-h-0">
                        <div className="bg-muted/30 rounded-lg p-3 flex-1 flex flex-col justify-center min-h-0">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Footprints className="w-4 h-4 text-accent"/> N-Gram
                                </span>
                                <div className={`px-2 py-0.5 rounded text-xs font-medium ${ngram.color}`}>
                                    {result.ngram_score.toFixed(4)}
                                </div>
                            </div>
                            <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
                                <div className={`h-full rounded-full ${ngram.barColor}`}
                                     style={{width: `${ngramWidth}%`}}></div>
                            </div>
                        </div>

                        {result.entropy !== 0.0 && (
                            <div className="bg-muted/30 rounded-lg p-3 flex-1 flex flex-col justify-center min-h-0">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Tornado className="w-4 h-4 text-accent"/> Entropy
                                    </span>
                                    <div className={`px-2 py-0.5 rounded text-xs font-medium ${entropy.color}`}>
                                        {result.entropy.toFixed(2)}
                                    </div>
                                </div>
                                <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
                                    <div className={`h-full rounded-full ${entropy.barColor}`}
                                         style={{width: `${entropyWidth}%`}}></div>
                                </div>
                            </div>
                        )}

                        {result.longest_repeating_sequence > 0 && (
                            <div className="bg-muted/30 rounded-lg p-3 flex-1 flex flex-col justify-center min-h-0">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Ruler className="w-4 h-4 text-accent"/> Longest Sequence
                                    </span>
                                    <div className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                                        {result.longest_repeating_sequence}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-1 bg-muted/30 rounded-lg p-3 flex flex-col justify-center items-center text-center h-full">
                         <div className="text-muted-foreground text-sm mb-3 flex items-center gap-2">
                            <Bug className="w-5 h-5 text-accent"/> Malware Classification
                        </div>
                        <div
                            className={`px-4 py-3 rounded-lg text-center text-base font-medium w-full ${getMalwareColorClass(result.malware_type)}`}>
                            {displayClassification}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatisticalAnalysis({result}: { result: ScanResult }) {
    return (
        <div className="bg-card border border-border rounded-xl h-full flex flex-col">
            <div className="p-4 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-secondary/30 rounded-lg">
                        <Sigma className="w-5 h-5 text-foreground"/>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white text-base">Statistical</h3>
                            <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                Experimental
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Data distribution</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 grow content-start">
                    <div className="flex flex-col justify-center bg-muted/30 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Percent className="w-3.5 h-3.5 text-accent"/>
                            <span className="text-muted-foreground text-[10px]">Unique Ratio</span>
                        </div>
                        <span className="text-foreground font-medium text-xs pl-5">{result.unique_byte_ratio.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col justify-center bg-muted/30 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Scale className="w-3.5 h-3.5 text-accent"/>
                            <span className="text-muted-foreground text-[10px]">Chi-Square</span>
                        </div>
                        <span className="text-foreground font-medium text-xs pl-5">{result.chi_square_score.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col justify-center bg-muted/30 rounded-lg p-2 col-span-2">
                         <div className="flex items-center gap-1.5 mb-1">
                            <Activity className="w-3.5 h-3.5 text-accent"/>
                            <span className="text-muted-foreground text-[10px]">Byte Anomaly</span>
                        </div>
                        <span className="text-foreground font-medium text-xs pl-5">{result.byte_frequency_anomaly.toFixed(4)}</span>
                    </div>

                     <div className="bg-muted/30 rounded-lg p-2 col-span-2">
                        <div className="flex justify-between items-center mb-1">
                             <div className="flex items-center gap-1.5">
                                <Telescope className="w-3.5 h-3.5 text-primary"/>
                                <span className="text-muted-foreground text-[10px]">Steganography</span>
                             </div>
                             <div
                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${result.steganography_indicators_present ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                                {boolToString(result.steganography_indicators_present)}
                            </div>
                        </div>
                        {result.steganography_indicators_present && (
                            <div className="text-right text-[10px] text-accent">
                                Score: {result.steganography_score.toFixed(3)}
                            </div>
                        )}
                    </div>

                    {result.anomalous_patterns.length > 0 && (
                        <div className="bg-muted/30 rounded-lg p-2 col-span-2 mt-auto">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-destructive"/>
                                <span className="text-[10px] text-muted-foreground">Patterns</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {result.anomalous_patterns.slice(0, 3).map((pattern, i) => (
                                    <span key={i}
                                          className="bg-background text-[10px] text-destructive px-1.5 py-0.5 rounded border border-destructive/20">
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
        <div className="bg-card border border-border rounded-xl h-full flex flex-col">
            <div className="p-4 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-destructive/20 rounded-lg">
                        <Bug className="w-5 h-5 text-destructive"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-base">Suspicious Imports</h3>
                        <p className="text-xs text-muted-foreground">Indicators of compromise</p>
                    </div>
                </div>

                {suspiciousImports.length > 0 ? (
                    <div className="grow flex flex-col min-h-0">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-destructive"/>
                            <span className="text-destructive text-xs font-medium">
                                Found {suspiciousImports.length} item{suspiciousImports.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2 overflow-y-auto grow space-y-1.5 custom-scrollbar">
                            {suspiciousImports.map((importName, i) => (
                                <div key={i} className="bg-background p-2 rounded border border-border flex justify-between items-center group hover:border-destructive/50 transition-colors">
                                    <span className="font-mono text-[10px] text-destructive truncate mr-2">{importName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center grow flex flex-col items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-primary mb-2"/>
                        <p className="text-primary text-sm font-medium">Clean</p>
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
        <div className={`bg-background text-white h-full md:h-[90vh] mt-5 overflow-y-auto md:overflow-hidden p-4`}>
            <div className="max-w-[1600px] mx-auto h-full flex flex-col">

                {loading && (
                    <div className="grow flex flex-col items-center justify-center space-y-8">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-primary border-r-primary/50 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Analyzing File</h2>
                            <p className="text-muted-foreground text-sm">Scanning for threats and anomalies...</p>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="max-w-md mx-auto mt-8">
                        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-destructive"/>
                                <div>
                                    <h3 className="font-semibold text-destructive">Scan Error</h3>
                                    <p className="text-sm text-destructive/80">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !hasStartedScan && (
                    <div className="grow flex flex-col items-center justify-center">
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
                                variants={resultContainerVariants} className="flex flex-col h-full pb-2">

                        <motion.div variants={resultItemVariants}
                                    className="flex justify-between items-center mb-4 shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-white">Scan Results</h2>
                                <p className="text-xs text-muted-foreground">{result.filename}</p>
                            </div>
                            <Button onClick={resetScan} variant="outline" size="sm" className="h-8">
                                <RotateCcw className="w-3.5 h-3.5 mr-2"/>
                                New Scan
                            </Button>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 grow md:min-h-0 h-auto md:h-full">
                            <div className="md:col-span-3 flex flex-col gap-3 h-auto md:h-full min-h-0">
                                <motion.div variants={resultItemVariants} className="h-[220px] md:h-[45%]">
                                    <ThreatOverview result={result}/>
                                </motion.div>
                                <motion.div variants={resultItemVariants} className="h-[280px] md:h-[55%]">
                                    <FileProperties result={result}/>
                                </motion.div>
                            </div>

                             <div className="md:col-span-6 flex flex-col gap-3 h-auto md:h-full min-h-0">
                                <motion.div variants={resultItemVariants} className="h-[300px] md:h-[40%]">
                                    <SecurityAnalysis result={result}/>
                                </motion.div>
                                <motion.div variants={resultItemVariants} className="h-[400px] md:h-[60%]">
                                    <SuspiciousImports result={result}/>
                                </motion.div>
                            </div>

                             <div className="md:col-span-3 flex flex-col gap-3 h-auto md:h-full min-h-0">
                                <motion.div variants={resultItemVariants} className="h-[300px] md:h-full">
                                    <StatisticalAnalysis result={result}/>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
