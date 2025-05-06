// stream-test.js
import fetch from "node-fetch"; // npm install node-fetch@2

async function run() {
  const res = await fetch("http://localhost:3000/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Hello chunked world" }),
  });

  console.log("Status:", res.status);
  console.log("Transfer‑Encoding:", res.headers.get("transfer-encoding")); // should be "chunked"

  // Listen to 'data' events on the Node Readable
  res.body.on("data", (chunk) => {
    process.stdout.write("⧉ chunk: " + chunk.toString());
  });
  res.body.on("end", () => console.log("\n✅ Stream ended"));
  res.body.on("error", (err) => console.error("Stream error:", err));
}

run().catch(console.error);
