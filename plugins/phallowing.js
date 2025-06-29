const config = require('../config.cjs');
import _0x44557c from 'node-fetch';
async function fetchJson(_0x3660f5, _0x5187d2 = {}) {
  const _0x205f09 = await _0x44557c(_0x3660f5, {
    'method': "GET",
    'headers': {
      'Content-Type': "application/json",
      ..._0x5187d2.headers
    },
    ..._0x5187d2
  });
  if (!_0x205f09.ok) {
    throw new Error("HTTP error! status: " + _0x205f09.status);
  }
  return await _0x205f09.json();
}
const play = async (_0x4351fd, _0x5c4550) => {
  const _0x599191 = _0x5493d8.PREFIX;
  const _0x232e16 = _0x4351fd.body.startsWith(_0x599191) ? _0x4351fd.body.slice(_0x599191.length).split(" ")[0x0].toLowerCase() : '';
  const _0x37b511 = _0x4351fd.body.slice(_0x599191.length + _0x232e16.length).trim();
  if (_0x232e16 === "play") {
    if (!_0x37b511) {
      return _0x4351fd.reply("🎶 Tell me the song you're in the mood for! 🎶");
    }
    try {
      await _0x5c4550.sendMessage(_0x4351fd.from, {
        'text': "🔎 Finding \"" + _0x37b511 + "\"..."
      }, {
        'quoted': _0x4351fd
      });
      let _0x361d0c = await fetchJson("https://api.agatz.xyz/api/ytsearch?message=" + encodeURIComponent(_0x37b511));
      let _0x34b281 = _0x361d0c.data[0x0];
      if (!_0x34b281) {
        return _0x4351fd.reply("Hmm, couldn't find that tune. 😔 Maybe try again?");
      }
      let _0x27db28 = await fetchJson("https://api.nexoracle.com/downloader/yt-audio2?apikey=free_key@maher_apis&url=" + _0x34b281.url);
      let _0x86bbcf = _0x27db28.result.audio;
      if (!_0x86bbcf) {
        return _0x4351fd.reply("⚠️ Couldn't grab the audio. Let's try later! 😔");
      }
      await _0x5c4550.sendMessage(_0x4351fd.from, {
        'audio': {
          'url': _0x86bbcf
        },
        'fileName': _0x34b281.title + '.mp3',
        'mimetype': 'audio/mpeg',
        'contextInfo': {
          'forwardingScore': 0x5,
          'isForwarded': true,
          'forwardedNewsletterMessageInfo': {
            'newsletterName': "🎀 King-Sandesh -Md Music Box 🎀",
            'newsletterJid': "120363402220977044@newsletter"
          },
          'externalAdReply': {
            'title': "🎧 Now playing: " + _0x34b281.title + " 🎧",
            'body': ".mp3 audio delivered",
            'thumbnailUrl': _0x34b281.thumbnail || "https://files.catbox.moe/og4tsk.jpg",
            'mediaType': 0x1,
            'renderLargerThumbnail': true,
            'thumbnailHeight': 0x1f4,
            'thumbnailWidth': 0x1f4
          }
        }
      }, {
        'quoted': _0x4351fd
      });
    } catch (_0x3f6ce8) {
      console.error("Error in play command:", _0x3f6ce8);
      _0x4351fd.reply("Hmm, something went wrong. 😅 Let's try again!");
    }
  }
};
export default play;
