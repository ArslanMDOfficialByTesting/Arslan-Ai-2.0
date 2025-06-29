const fetch = require('node-fetch');
const config = require('../config.cjs');

module.exports = {
  command: 'apk',
  handler: async (sock, m, sender, text) => {
    const prefix = config.PREFIX || '.';
    const appQuery = text?.split(' ').slice(1).join(' ');

    if (!appQuery) {
      return sock.sendMessage(m.from, {
        text: `📦 *APK Search Help*\n\nUse like this:\n${prefix}apk Instagram`
      }, { quoted: m });
    }

    await sock.sendMessage(m.from, { text: "🔍 Searching APK..." }, { quoted: m });

    try {
      const searchUrl = `https://api.apkpure.net/v1/search?q=${encodeURIComponent(appQuery)}&limit=1`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData || !searchData.data || searchData.data.length === 0) {
        return sock.sendMessage(m.from, { text: "❌ No results found for that app." }, { quoted: m });
      }

      const app = searchData.data[0];
      const detailUrl = `https://api.apkpure.net/v1/apps/${app.package_name}`;
      const detailResponse = await fetch(detailUrl);
      const appData = await detailResponse.json();

      if (!appData || !appData.data) {
        return sock.sendMessage(m.from, { text: "⚠️ Failed to fetch app details." }, { quoted: m });
      }

      const info = appData.data;

      const caption = `*📱 App Name:* ${info.name}\n*🧾 Description:* ${info.description?.slice(0, 200) || 'N/A'}...\n*📁 Size:* ${info.size}\n*📦 Package:* ${info.package_name}\n*📥 Download:* ${info.download_link || "Unavailable"}`;

      await sock.sendMessage(m.from, {
        image: { url: info.icon },
        caption
      }, { quoted: m });

    } catch (err) {
      console.error("APK Plugin Error:", err);
      await sock.sendMessage(m.from, { text: "❌ An error occurred while searching." }, { quoted: m });
    }
  }
};
