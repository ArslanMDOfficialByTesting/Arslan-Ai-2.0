import fetch from 'node-fetch';
import config from '../config.cjs';
import { getBuffer } from '../lib/myfunc.js';

const downloadapk = async (m, Matrix, args, command) => {
  const prefix = config.PREFIX || '.';

  if (!args || !args.length) {
    return m.reply(`❌ *Usage:* ${prefix + command} <app name>\n📥 Example: ${prefix + command} Instagram`);
  }

  try {
    const query = args.join(' ');
    const api = `https://vihangayt.me/tools/searchapk?q=${encodeURIComponent(query)}`;

    const response = await fetch(api);
    const json = await response.json();

    if (!json.status || !json.result || json.result.length === 0) {
      return m.reply('❌ APK not found. Try a different name.');
    }

    const app = json.result[0];
    const downloadApi = `https://vihangayt.me/tools/downloadapk?pkg=${app.package}`;

    const downRes = await fetch(downloadApi);
    const downJson = await downRes.json();

    if (!downJson.status || !downJson.result?.url) {
      return m.reply('❌ Failed to fetch download URL.');
    }

    const thumb = await getBuffer(app.icon);

    const caption = `📱 *App Name:* ${app.name}
📦 *Package:* ${app.package}
⭐ *Rating:* ${app.rating}
🔗 *URL:* ${downJson.result.url}`;

    await Matrix.sendMessage(m.from, {
      image: thumb,
      caption,
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    return m.reply('❌ An error occurred while fetching the APK.');
  }
};

export default downloadapk;
