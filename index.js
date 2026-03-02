const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', () => {
    console.log('--- GENERANDO CÓDIGO DE VINCULACIÓN... ---');
});

client.on('ready', () => {
    console.log('¡BOT VINCULADO EXITOSAMENTE!');
});

async function iniciar() {
    console.log('Iniciando sistema...');
    await client.initialize();
    
    setTimeout(async () => {
        try {
            console.log('SOLICITANDO CÓDIGO A WHATSAPP...');
            const code = await client.requestPairingCode('573042755395');
            console.log('\n=========================================');
            console.log('CÓDIGO DE VINCULACIÓN: ' + code);
            console.log('=========================================\n');
        } catch (e) {
            console.log('Error o ya estás vinculado.');
        }
    }, 5000);
}

iniciar();