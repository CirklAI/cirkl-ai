import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const fileBytes = await request.arrayBuffer();

    const authHeader = request.headers.get('Authorization');
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    } else {
        return new Response("Unauthorized: No valid token provided", { status: 401 });
    }

    if(!fileBytes) {
        return new Response("No file provided", {status: 400});
    }

    if(fileBytes.byteLength < 1) {
        return new Response("File too small", {status: 400});
    }

    const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024 * 1024;
    if(fileBytes.byteLength > MAX_FILE_SIZE_BYTES) {
        return new Response(`Request too large: Max size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`, {status: 413});
    }

    try {
        const response = await fetch("https://api.cirkl.ai/scan", {
            method: "POST",
            body: fileBytes,
            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": `Bearer ${token}`
            },
        });

        const rawText = await response.text();

        let scanJsonParsed;
        try {
            scanJsonParsed = JSON.parse(rawText);
        } catch {
            return new Response("External service returned invalid JSON", { status: 502 });
        }

        const scanResult = JSON.stringify(scanJsonParsed);

        return new Response(scanResult, {
            status: 200,
            headers: {"Content-Type": "application/json"},
        });
    } catch(error) {
        if(error instanceof Error) {
            console.error('ERROR during scan request:', error.message);
            console.error('STACK:', error.stack);
        } else {
            console.error("Unknown scan error:", error);
        }

        return new Response("Internal server error, application could not recover", {status: 500});
    }
}