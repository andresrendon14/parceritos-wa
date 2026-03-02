const { Client, LocalAuth } = require('whatsapp-web.js');
const http = require('http');

// Servidor para que Railway no apague el bot
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Bot Parceritos Online');
}).listen(process.env.PORT || 8080);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('ready', () => console.log('¡BOT VINCULADO CON ÉXITO!'));

async function iniciar() {
    console.log('--- ARRANCANDO SISTEMA ---');
    await client.initialize();
    
    // Esperamos 8 segundos y pedimos el código
    setTimeout(async () => {
        try {
            console.log('GENERANDO CÓDIGO DE VINCULACIÓN...');
            const code = await client.requestPairingCode('573042755395');
            console.log('\n*****************************************');
            console.log('TU CÓDIGO ES: ' + code);
            console.log('TU CÓDIGO ES: ' + code);
            console.log('TU CÓDIGO ES: ' + code);
            console.log('*****************************************\n');
        } catch (e) {
            console.log('Error: Revisa si ya estás conectado.');
        }
    }, 8000);
}

iniciar();