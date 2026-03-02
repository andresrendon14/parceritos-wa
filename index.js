const { Client, LocalAuth } = require('whatsapp-web.js');
const http = require('http');

// Mantiene el contenedor encendido
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Sistema Parceritos Operativo');
}).listen(process.env.PORT || 8080);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Quitamos el QR para que no ensucie la pantalla
client.on('qr', () => {
    console.log('--- SISTEMA LISTO: GENERANDO TU NÚMERO... ---');
});

client.on('ready', () => console.log('¡BOT CONECTADO CON ÉXITO!'));

async function iniciar() {
    console.log('Iniciando procesos de Los Parceritos...');
    await client.initialize();
    
    // Espera de seguridad para generar el código
    setTimeout(async () => {
        try {
            const code = await client.requestPairingCode('573042755395');
            console.log('\n=========================================');
            console.log('TU CÓDIGO DE VINCULACIÓN ES: ' + code);
            console.log('=========================================\n');
        } catch (e) {
            console.log('Estado: El bot ya podría estar vinculado.');
        }
    }, 10000);
}

iniciar();