const fs = require("fs");
const path = require("path");
const http = require("http");
const qrcode = require("qrcode-terminal");
const AdmZip = require("adm-zip");
const { Client, LocalAuth } = require("whatsapp-web.js");

const PORT = process.env.PORT || 3000;
const AUTH_DATA_PATH = process.env.AUTH_DATA_PATH || path.resolve(__dirname, "auth");
const EXIT_AFTER_AUTH = process.env.EXIT_AFTER_AUTH === "1";
const AUTH_ZIP_B64 = process.env.AUTH_ZIP_B64 || "";

// Optional bootstrap (Railway first deploy): restore auth from base64 zip into AUTH_DATA_PATH
function restoreAuthIfNeeded() {
  if (!AUTH_ZIP_B64) return;
  try {
    if (!fs.existsSync(AUTH_DATA_PATH)) fs.mkdirSync(AUTH_DATA_PATH, { recursive: true });
    const hasContent = fs.readdirSync(AUTH_DATA_PATH, { withFileTypes: true }).length > 0;
    if (hasContent) return;

    const zipPath = path.join(AUTH_DATA_PATH, "__auth.zip");
    fs.writeFileSync(zipPath, Buffer.from(AUTH_ZIP_B64, "base64"));
    new AdmZip(zipPath).extractAllTo(AUTH_DATA_PATH, true);
    try { fs.unlinkSync(zipPath); } catch {}
    console.log("[BOOT] Sesión restaurada en:", AUTH_DATA_PATH);
  } catch (e) {
    console.log("[BOOT] No pude restaurar AUTH_ZIP_B64:", e?.message || e);
  }
}
restoreAuthIfNeeded();

http.createServer((req,res)=>{
  if (req.url === "/health" || req.url === "/ready") {
    res.writeHead(200, {"Content-Type":"text/plain"});
    return res.end("ok");
  }
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end("ok");
}).listen(PORT, ()=> console.log("[HTTP] Listening on", PORT));

let executablePath;
try { executablePath = require("puppeteer").executablePath(); } catch {}

console.log("[INIT] AUTH_DATA_PATH =", AUTH_DATA_PATH);
console.log("[INIT] Chrome =", executablePath || "(no detectado)");

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: AUTH_DATA_PATH }),
  authTimeoutMs: 180000,
  puppeteer: {
    headless: false,
    executablePath,
    defaultViewport: null,
    slowMo: 25,
    timeout: 0,
    protocolTimeout: 600000,
    dumpio: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--start-maximized",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-features=IsolateOrigins,site-per-process"
    ],
  }
});

client.on("qr", (qr)=>{
  console.log("\n[QR] Escanéalo con: WhatsApp > Dispositivos vinculados > Vincular dispositivo\n");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", ()=> console.log("[AUTH] OK (sesión guardada)"));
client.on("ready", ()=>{
  console.log("[READY] Bot listo ✅");
  if (EXIT_AFTER_AUTH) setTimeout(()=>process.exit(0), 1500);
});
client.on("auth_failure", (m)=> console.log("[AUTH_FAILURE]", m));
client.on("disconnected", (r)=> console.log("[DISCONNECTED]", r));

client.initialize();
