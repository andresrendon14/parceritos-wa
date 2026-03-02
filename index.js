const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('GENERANDO QR (Si no lo puedes leer, espera el código abajo)...');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('-----------------------------------------');
    console.log('¡EL PARCE ESTÁ VIVO Y CONECTADO! 🚀');
    console.log('-----------------------------------------');
});

client.on('message', async (message) => {
    if (message.body.toLowerCase() === 'hola') {
        await message.reply('¡Habla pues parce! ¿En qué le puedo colaborar? 🇨🇴');
    }
});

async function iniciar() {
    await client.initialize();
    setTimeout(async () => {
        try {
            console.log('SOLICITANDO CÓDIGO DE VINCULACIÓN...');
            const code = await client.requestPairingCode('573042755395');
            console.log('\n*****************************************');
            console.log('TU CÓDIGO DE VINCULACIÓN ES:');
            console.log('>>>>  ' + code + '  <<<<');
            console.log('*****************************************\n');
        } catch (err) {
            console.log('Error o ya vinculado.');
        }
    }, 10000);
}

iniciar();