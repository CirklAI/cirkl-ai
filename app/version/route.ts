export async function GET() {
  const version = 1;
  
  try {
    return new Response(JSON.stringify(version), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('ERROR during version proxy request:', error.message);
    } else {
      console.error("Unknown version proxy error:", error);
    }
    return new Response(JSON.stringify({ error: "Internal server error during version proxy" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
