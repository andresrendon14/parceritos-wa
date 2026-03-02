const { Client, LocalAuth } = require('whatsapp-web.js');
const http = require('http');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Esto mantiene vivo el bot en Railway
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('El Parce esta vivo');
}).listen(process.env.PORT || 8080);

client.on('qr', () => {
    console.log('--- GENERANDO CÓDIGO... ---');
});

client.on('ready', () => console.log('¡BOT VINCULADO!'));

async function iniciar() {
    console.log('Iniciando sistema...');
    await client.initialize();
    
    setTimeout(async () => {
        try {
            console.log('SOLICITANDO CÓDIGO A WHATSAPP...');
            const code = await client.requestPairingCode('573042755395');
            console.log('\n=========================================');
            console.log('TU CÓDIGO ES: ' + code);
            console.log('=========================================\n');
        } catch (e) { 
            console.log('Error al pedir código:', e.message); 
        }
    }, 5000);
}

iniciar();