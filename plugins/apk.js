import fetch from 'node-fetch';
const config = require('../config.cjs');

const apkSearch = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "apk" || cmd === "apksearch") {
    if (!text) {
      return m.reply("🔍 Please provide an app name to search. Example:\n\n.apk Instagram");
    }

    await m.React("🔎");

    try {
      const searchUrl = `https://api.apkpure.net/v1/search?q=${encodeURIComponent(text)}&limit=1`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData || !searchData.data || searchData.data.length === 0) {
        return m.reply("❌ No results found for your query.");
      }

      const app = searchData.data[0];
      const detailUrl = `https://api.apkpure.net/v1/apps/${app.package_name}`;
      const detailResponse = await fetch(detailUrl);
      const appData = await detailResponse.json();

      if (!appData || !appData.data) {
        return m.reply("⚠️ Could not fetch app details.");
      }

      const info = appData.data;
      const message = `*📦 App Name:* ${info.name}\n*🧾 Description:* ${info.description?.slice(0, 200)}...\n*📁 Size:* ${info.size}\n*🆔 Package:* ${info.package_name}\n*📥 Download:* ${info.download_link || "Unavailable"}`;

      await Matrix.sendMessage(m.from, {
        image: { url: info.icon },
        caption: message
      }, { quoted: m });

      await m.React("✅");

    } catch (err) {
      console.error("APK Search Error:", err);
      await m.reply("❌ An error occurred while fetching app info.");
      await m.React("❌");
    }
  }
};

export default apkSearch;
