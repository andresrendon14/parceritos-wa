const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('--- ¡ESCANEA ESTO AHORA MISMO! ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Los Parceritos están ACTIVOS en WhatsApp!');
});

client.on('message', msg => {
    if (msg.body.toLowerCase() === '!ping') {
        msg.reply('¡Pong! 🏓 El chatbot de Los Parceritos está vivo.');
    }
});

client.initialize();
