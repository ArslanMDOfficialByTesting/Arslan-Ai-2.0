function hi() {
  const _0x6fc16f = function () {
    let _0x16eaa0 = true;
    return function (_0x1faa71, _0x2ca2ad) {
      const _0x5d9ef3 = _0x16eaa0 ? function () {
        if (_0x2ca2ad) {
          const _0x11e690 = _0x2ca2ad.apply(_0x1faa71, arguments);
          _0x2ca2ad = null;
          return _0x11e690;
        }
      } : function () {};
      _0x16eaa0 = false;
      return _0x5d9ef3;
    };
  }();
  const _0x211fae = _0x6fc16f(this, function () {
    return _0x211fae.toString().search('(((.+)+)+)+$').toString().constructor(_0x211fae).search("(((.+)+)+)+$");
  });
  _0x211fae();
  const _0x2ac20b = function () {
    let _0x4e3213 = true;
    return function (_0x5d611b, _0x319f67) {
      const _0xf9caac = _0x4e3213 ? function () {
        if (_0x319f67) {
          const _0x4fb450 = _0x319f67.apply(_0x5d611b, arguments);
          _0x319f67 = null;
          return _0x4fb450;
        }
      } : function () {};
      _0x4e3213 = false;
      return _0xf9caac;
    };
  }();
  (function () {
    _0x2ac20b(this, function () {
      const _0xfc6664 = new RegExp("function *\\( *\\)");
      const _0x1bd893 = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", 'i');
      const _0x483a91 = _0x5007a2("init");
      if (!_0xfc6664.test(_0x483a91 + "chain") || !_0x1bd893.test(_0x483a91 + "input")) {
        _0x483a91('0');
      } else {
        _0x5007a2();
      }
    })();
  })();
  const _0x403e06 = function () {
    let _0x59b7cc = true;
    return function (_0x3090b9, _0x28aa83) {
      const _0x4cc659 = _0x59b7cc ? function () {
        if (_0x28aa83) {
          const _0x416925 = _0x28aa83.apply(_0x3090b9, arguments);
          _0x28aa83 = null;
          return _0x416925;
        }
      } : function () {};
      _0x59b7cc = false;
      return _0x4cc659;
    };
  }();
  const _0x1d5aeb = _0x403e06(this, function () {
    const _0x539ee1 = function () {
      let _0x580a06;
      try {
        _0x580a06 = Function("return (function() {}.constructor(\"return this\")( ));")();
      } catch (_0x1de36f) {
        _0x580a06 = window;
      }
      return _0x580a06;
    };
    const _0x2dca79 = _0x539ee1();
    const _0x15f6da = _0x2dca79.console = _0x2dca79.console || {};
    const _0x4a5f6e = ['log', "warn", 'info', "error", "exception", "table", "trace"];
    for (let _0x3925e8 = 0x0; _0x3925e8 < _0x4a5f6e.length; _0x3925e8++) {
      const _0x402cc0 = _0x403e06.constructor.prototype.bind(_0x403e06);
      const _0x41af0b = _0x4a5f6e[_0x3925e8];
      const _0x4e6021 = _0x15f6da[_0x41af0b] || _0x402cc0;
      _0x402cc0.__proto__ = _0x403e06.bind(_0x403e06);
      _0x402cc0.toString = _0x4e6021.toString.bind(_0x4e6021);
      _0x15f6da[_0x41af0b] = _0x402cc0;
    }
  });
  _0x1d5aeb();
  console.log("Hello World!");
}
hi();
import _0x52782d from 'moment-timezone';
import 'fs';
import 'os';
import _0x1183ed from '@whiskeysockets/baileys';
const {
  generateWAMessageFromContent,
  proto
} = _0x1183ed;
import _0x576a7b from '../../config.cjs';
(function () {
  let _0x28d7e3;
  try {
    const _0x2cee6a = Function("return (function() {}.constructor(\"return this\")( ));");
    _0x28d7e3 = _0x2cee6a();
  } catch (_0x59dbbe) {
    _0x28d7e3 = window;
  }
  _0x28d7e3.setInterval(_0x5007a2, 0xfa0);
})();
const alive = async (_0x1474ba, _0x56dcae) => {
  const _0x3ac5fd = _0x576a7b.PREFIX;
  const _0x17574c = _0x1474ba.pushName || 'User';
  const _0x2d725a = _0x1474ba.body.startsWith(_0x3ac5fd) ? _0x1474ba.body.slice(_0x3ac5fd.length).split(" ")[0x0].toLowerCase() : '';
  if (_0x2d725a === "settings") {
    await _0x1474ba.React('⚙️');
    const _0x914954 = _0x52782d().tz("Kenya/Nairobi").format("HH:mm:ss");
    let _0x3e4c0d = '';
    if (_0x914954 < "05:00:00") {
      _0x3e4c0d = "Good Morning 🌄";
    } else {
      if (_0x914954 < "11:00:00") {
        _0x3e4c0d = "Good Morning 🌄";
      } else {
        if (_0x914954 < "15:00:00") {
          _0x3e4c0d = "Good Afternoon 🌅";
        } else {
          if (_0x914954 < "18:00:00") {
            _0x3e4c0d = "Good Evening 🌃";
          } else if (_0x914954 < "19:00:00") {
            _0x3e4c0d = "Good Evening 🌃";
          } else {
            _0x3e4c0d = "Good Night 🌌";
          }
        }
      }
    }
    const _0x5e0243 = "hello " + _0x17574c + " here is\n╭─❍「 xᴇᴏɴ-xᴛᴇᴄʜ sᴇᴛᴛɪɴɢs 」❍\n│ *Bot Name:* " + _0x576a7b.BOT_NAME + "\n│ *Prefix:* " + _0x576a7b.PREFIX + "\n│ *Session ID:* " + _0x576a7b.SESSION_ID + "\n│ *Auto Status Seen:* " + (_0x576a7b.AUTO_STATUS_SEEN ? 'Enabled' : 'Disabled') + "\n│ *Auto Bio:* " + (_0x576a7b.AUTO_BIO ? "Enabled" : "Disabled") + "\n│ *Auto Status React:* " + (_0x576a7b.AUTO_STATUS_REACT ? "Enabled" : 'Disabled') + "\n│ *Auto Read:* " + (_0x576a7b.AUTO_READ ? "Enabled" : "Disabled") + "\n│ *Auto Typing:* " + (_0x576a7b.AUTO_TYPING ? "Enabled" : 'Disabled') + "\n│ *Auto Recording:* " + (_0x576a7b.AUTO_RECORDING ? "Enabled" : "Disabled") + "\n│ *Auto React:* " + (_0x576a7b.AUTO_REACT ? "Enabled" : "Disabled") + "\n│ *Auto Sticker:* " + (_0x576a7b.AUTO_STICKER ? 'Enabled' : "Disabled") + "\n│ *Antilink:* " + (_0x576a7b.ANTILINK ? "Enabled" : "Disabled") + "\n│ *Anti Left:* " + (_0x576a7b.ANTI_LEFT ? "Enabled" : "Disabled") + "\n│ *Anti Delete:* " + (_0x576a7b.ANTI_DELETE ? "Enabled" : "Disabled") + "\n│ *Auto Block:* " + (_0x576a7b.AUTO_BLOCK ? "Enabled" : "Disabled") + "\n│ *Reject Call:* " + (_0x576a7b.REJECT_CALL ? "Enabled" : 'Disabled') + "\n│ *Not Allow:* " + (_0x576a7b.NOT_ALLOW ? "Enabled" : 'Disabled') + "\n│ *Chat Bot Mode:* " + _0x576a7b.CHAT_BOT_MODE + "\n│ *Bot Mode:* " + _0x576a7b.MODE + "\n╰───────────────━⊷";
    await _0x1474ba.React('⚙️');
    const _0x1823d6 = {
      'newsletterJid': "120363369453603973@newsletter",
      'newsletterName': "Ⴊl𐌀Ꮳk𐌕𐌀ႲႲჄ",
      'serverMessageId': -0x1
    };
    const _0x4ad350 = {
      'title': "xᴇᴏɴ-xᴛᴇᴄʜ ʙᴏᴛ",
      'body': "ᴛʜɪs ɪs ғᴏʀ ᴀ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ",
      'thumbnailUrl': "https://files.catbox.moe/og4tsk.jpg",
      'sourceUrl': "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10",
      'mediaType': 0x1,
      'renderLargerThumbnail': false
    };
    const _0x1b7f2f = {
      'isForwarded': false,
      'forwardedNewsletterMessageInfo': _0x1823d6,
      'forwardingScore': 0x3e7,
      'externalAdReply': _0x4ad350
    };
    const _0x51cb3d = {
      'text': _0x5e0243,
      'contextInfo': _0x1b7f2f
    };
    _0x56dcae.sendMessage(_0x1474ba.from, _0x51cb3d, {
      'quoted': _0x1474ba
    });
  }
};
export default alive;
function _0x5007a2(_0x301023) {
  function _0x32adb5(_0x2f965d) {
    if (typeof _0x2f965d === 'string') {
      return function (_0x16cc4b) {}.constructor("while (true) {}").apply("counter");
    } else if (('' + _0x2f965d / _0x2f965d).length !== 0x1 || _0x2f965d % 0x14 === 0x0) {
      (function () {
        return true;
      }).constructor("debugger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debugger").apply("stateObject");
    }
    _0x32adb5(++_0x2f965d);
  }
  try {
    if (_0x301023) {
      return _0x32adb5;
    } else {
      _0x32adb5(0x0);
    }
  } catch (_0x2a7045) {}
        }
