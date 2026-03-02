const { Client } = require('whatsapp-web.js'); // Sin LocalAuth para limpiar todo
const http = require('http');

// Servidor para engañar a Railway
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Limpiando Sesion...');
}).listen(process.env.PORT || 8080);

const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('ready', () => console.log('¡BOT VINCULADO!'));

async function iniciar() {
    console.log('--- FORZANDO NUEVA VINCULACION ---');
    await client.initialize();
    
    setTimeout(async () => {
        try {
            console.log('SOLICITANDO CODIGO FRESCO...');
            const code = await client.requestPairingCode('573042755395');
            console.log('\n*****************************************');
            console.log('NUEVO CODIGO: ' + code);
            console.log('NUEVO CODIGO: ' + code);
            console.log('*****************************************\n');
        } catch (e) {
            console.log('Error critico:', e.message);
        }
    }, 10000);
}

iniciar();