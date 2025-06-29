import _0x284800 from '../../config.cjs';
const ping = async (_0x212d45, _0x4dcc41) => {
  const _0x3b18a9 = _0x284800.PREFIX;
  const _0x15c85c = _0x212d45.body.startsWith(_0x3b18a9) ? _0x212d45.body.slice(_0x3b18a9.length).split(" ")[0x0].toLowerCase() : '';
  if (_0x15c85c === "ping") {
    const _0x41d1ac = performance.now();
    await _0x212d45.React('⏳');
    await _0x4dcc41.sendPresenceUpdate("composing", _0x212d45.from);
    await new Promise(_0x138015 => setTimeout(_0x138015, 0x5dc));
    await _0x4dcc41.sendPresenceUpdate("paused", _0x212d45.from);
    const _0x30dd76 = performance.now();
    const _0x8f8555 = Math.round(_0x30dd76 - _0x41d1ac);
    const _0x43d97d = ("\n╭━━━〔 *PONG!* 〕━━━╮\n┃ ⚡ *Status:* Online\n┃ ⏱️ *Response:* " + _0x8f8555 + " ms\n┃ " + getFancyMessage() + "\n╰━━━━━━━━━━━━━━╯\n    ").trim();
    let _0x23ea47;
    try {
      _0x23ea47 = await _0x4dcc41.profilePictureUrl(_0x212d45.sender, "image");
    } catch (_0x205b68) {
      _0x23ea47 = "https://i.ibb.co/7yzjwvJ/default.jpg";
    }
    await _0x4dcc41.sendMessage(_0x212d45.from, {
      'image': {
        'url': _0x23ea47
      },
      'caption': _0x43d97d
    }, {
      'quoted': _0x212d45
    });
  }
};
function getFancyMessage() {
  const _0x48e7aa = ["⚡ Zooming through the wires!", "💨 Too fast to catch!", "🚀 Full throttle response!", "✨ Lightning mode activated!", "🌐 Instant like magic!"];
  return _0x48e7aa[Math.floor(Math.random() * _0x48e7aa.length)];
}
export default ping;
