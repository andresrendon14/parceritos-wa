const { Client } = require('whatsapp-web.js');
const http = require('http');

// Mantiene el bot encendido en Railway
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Servidor Activo');
}).listen(process.env.PORT || 8080);

const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
    }
});

// LA SOLUCIÓN: Solo pedimos el código cuando WhatsApp nos avisa que ya cargó la página
client.on('qr', async () => {
    console.log('--- WHATSAPP CARGADO. PIDIENDO CÓDIGO... ---');
    try {
        const code = await client.requestPairingCode('573042755395');
        console.log('\n=========================================');
        console.log('>>> CÓDIGO DEFINITIVO: ' + code + ' <<<');
        console.log('=========================================\n');
    } catch (err) {
        console.log('Error al generar código:', err.message);
    }
});

client.on('ready', () => {
    console.log('¡EL PARCE ESTÁ CONECTADO Y LISTO!');
});

console.log('Iniciando navegador web oculto... (Paciencia, esto puede tomar unos 30 a 60 segundos)');
client.initialize();