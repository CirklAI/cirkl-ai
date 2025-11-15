import { NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api";

export async function POST(request: NextRequest) {
    const fileBytes = await request.arrayBuffer();
    const authHeader = request.headers.get("Authorization");
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
    } else {
        return new Response(
            JSON.stringify({ error: "Unauthorized: No valid token provided" }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    if (!fileBytes || fileBytes.byteLength < 1) {
        return new Response(
            JSON.stringify({ error: "No valid file provided" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;
    if (fileBytes.byteLength > MAX_FILE_SIZE_BYTES) {
        return new Response(
            JSON.stringify({
                error: `Request too large: Max size is ${
                    MAX_FILE_SIZE_BYTES / (1024 * 1024)
                }MB`,
            }),
            {
                status: 413,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    try {
        const response = await fetch(API_BASE_URL + "/scan", {
            method: "POST",
            body: fileBytes,
            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": `Bearer ${token}`,
            },
        });

        const rawText = await response.text();

        try {
            JSON.parse(rawText);
        } catch {
            console.error("External API returned non-JSON response:", rawText);
            return new Response(rawText, { status: response.status });
        }

        return new Response(rawText, {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("ERROR during scan proxy request:", error.message);
        } else {
            console.error("Unknown scan proxy error:", error);
        }

        return new Response(
            JSON.stringify({
                error: "Internal server error during scan proxy",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
}
