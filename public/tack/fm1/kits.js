// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2026 Charles Vestal
// Copyright (C) 2026 Chris Farrell (the FM-1's usual port names, and other ports asked only once allowed: from
//   fm-static, github.com/seajaysec/fm-static, by his permission under MPL-2.0: seajaysec/fm-static#1)
//
// Finding FM-1s on Web MIDI, one copy for every page: fm1-base's installer (through fm1ota.js) and backup page, and
// the FM-1 Screen Reader's page (fm1-reader web/reader.js). fm1-reader keeps a copy of this file, made and checked by
// its tools/sync_announce.sh: change it here.
//
// A port is asked who it is in one of two ways:
//  - The screen reader's HELLO (fm1-reader PROTOCOL.md): F0 7D 53 52 01 01 F7. 7D is the ID for non-commercial use,
//    which other gear ignores, so a HELLO goes to every port, ASK_TRIES times while the port stays plugged in. Every
//    firmware on fm1-base answers it (device/announce.c) with its name and the link to its words file, whatever its
//    port is called. M-VAVE's firmware and the update loader don't.
//  - The update protocol's identity query (fm1ota.js handshake): M-VAVE's own SysEx, which the stock firmware and the
//    loader answer too. It goes only to an askable port: one with a usual name (PORT_NAMES), one the user picked, or
//    one that answered a HELLO.
// A HELLO answer is told from the HELLO itself by the name in it: a loopback (macOS's IAC bus, a DAW's MIDI through)
// sends the HELLO back as it went out, with no name.

// port names asked without being picked (any case, part of the name). "FM1": the Open firmware's "FM1 Community"
const PORT_NAMES = ["fm-1", "fm1", "felucca", "ota", "composite", "sinco", "usb-midi"];
function usualName(name, names = PORT_NAMES) {
  const n = (name || "").toLowerCase();
  return names.some((p) => n.includes(p));
}

const livePorts = (map) => [...map.values()].filter((p) => p.state !== "disconnected");

// an input's output: the one with its name; else the only one with its name but for a number at the end (Windows
// numbers each port); else the only output there is. null: none
function outputFor(access, input) {
  const outs = livePorts(access.outputs);
  const bare = (s) => (s || "").replace(/\s+\d+$/, "");
  const same = outs.filter((o) => bare(o.name) === bare(input.name));
  return outs.find((o) => o.name === input.name) || (same.length === 1 ? same[0] : null) ||
    (outs.length === 1 ? outs[0] : null);
}

// every plugged-in input that has an output: [{ name, input, output }]
function pairs(access) {
  return livePorts(access.inputs).map((input) => ({ name: input.name || "", input, output: outputFor(access, input) }))
    .filter((p) => p.output);
}

// ---------------------------------------------------------------- the screen reader's HELLO (fm1-reader PROTOCOL.md)
const SR = [0x7D, 0x53, 0x52];
const SR_HELLO = 1, SR_BYE = 2, SR_WHERE = 3, SR_SAY = 16, SR_VER = 1;
const ASK_TRIES = 3;
const srFrame = (cmd, ...args) => [0xF0, ...SR, cmd, ...args, 0xF7];
const isSr = (d) => !!d && d[0] === 0xF0 && d[1] === SR[0] && d[2] === SR[1] && d[3] === SR[2];

// a HELLO answer -> { name, words } (words: the https link to its words file, or ""), or null when it is none: a
// HELLO sent back by a loopback has no name
function srHello(d) {
  if (!isSr(d) || d[4] !== SR_HELLO || d[d.length - 1] !== 0xF7) return null;
  const [name = "", words = ""] = String.fromCharCode(...Array.from(d.slice(6, d.length - 1)).filter((b) => b < 128))
    .split("\0");
  if (!name) return null;
  return { name, words: /^https:\/\/[^\s"']+\.json$/.test(words) ? words : "" };
}

// which outputs a HELLO goes to now: every output ASK_TRIES times after it appears, then only the ones that answered
// (a reader keeps those listening). Other gear on the computer gets three short SysEx it ignores, not one every two
// seconds. forget(id) when a port is unplugged or lost: it is asked again
class Asking {
  constructor(tries = ASK_TRIES) { this.tries = tries; this.n = new Map(); }
  due(output, answered = false) {
    const k = this.n.get(output.id) || 0;
    if (!answered && k >= this.tries) return false;
    this.n.set(output.id, k + 1);
    return true;
  }
  forget(id) { this.n.delete(id); }
  clear() { this.n.clear(); }
}

// one search: the port pairs that answer a HELLO -> [{ name, firmware, words, input, output }] (firmware: the name
// and version it gives, e.g. "X0X 1.1"). Asks up to `tries` times, `ms` apart, stopping when every port has answered;
// skip(name): ports not to ask. No BYE after it: a device stops by itself 5 s after the last HELLO, and a BYE would
// also stop a reader page that is listening to it
async function askAll(access, { ms = 500, tries = ASK_TRIES, skip = () => false } = {}) {
  const ps = pairs(access).filter((p) => !skip(p.name));
  const got = new Map();
  const ears = ps.map((p) => [p, (e) => {
    const h = srHello(e.data);
    if (h && !got.has(p.input)) got.set(p.input, { name: p.name, firmware: h.name, words: h.words, input: p.input, output: p.output });
  }]);
  for (const [p, f] of ears) {
    try { await p.input.open(); } catch (_) { /* taken: it answers nothing */ }
    p.input.addEventListener("midimessage", f);
  }
  try {
    for (let t = 0; t < tries && got.size < ps.length; t++) {
      const sent = new Set();
      for (const p of ps) {
        if (got.has(p.input) || sent.has(p.output)) continue;
        sent.add(p.output);
        try { p.output.send(srFrame(SR_HELLO, SR_VER)); } catch (_) { /* unplugged */ }
      }
      await new Promise((r) => setTimeout(r, ms));
    }
  } finally {
    for (const [p, f] of ears) p.input.removeEventListener("midimessage", f);
  }
  return [...got.values()];
}

// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2026 Charles Vestal
// Copyright (C) 2026 Leo Kuroshita (@kurogedelic), Hügelton Instruments
// Copyright (C) 2026 Chris Farrell (finding the FM-1 under any port name, M-VAVE's Open firmware's identities, resume's
//   return check: from fm-static, github.com/seajaysec/fm-static, by his permission under MPL-2.0:
//   seajaysec/fm-static#1)
//
// The FM-1 USB-MIDI update protocol (M-UPGRADE compatible) over WebMIDI. Ports are found with fm1ports.js.
// Step 1: the running firmware reads parts of the package and stages the update
// loader. Step 2: the loader reads the whole image and writes it. In both steps
// the device sends cmd 0x30 read requests on the logical image and we answer.


const HS_QUERY = [0xF0, 0x00, 0x32, 0x45, 0x00, 0x00, 0x00, 0x40, 0x7F, 0xF7];
const UPGRADE = [0xF0, 0x22, 0x24, 0x35, 0x7F, 0xF7];
const MAXDATA = 512;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const IS_OTA = (id) => /^ota-/i.test(id.model);

// M-VAVE's FM1 Open firmware (V10, 2026-10): its updater takes only a package it has been told about
// first (cmd 49 reads its state, cmd 50 arms it with the image length and the package's SHA-256); then
// the update runs as usual. Only M-VAVE's own FM-1 firmware is installed over it: its loader rewrites the
// whole flash, boot head included, which returns the FM-1 to stock.
const OPEN_RE = /^FM1_(OFFICIAL_OPEN|COMMUNITY_\d+)$/;
// M-VAVE's own Open firmware reports "FM-1_80000" and two digits (V14: FM-1_8000014; M-VAVE's Workbench treats it as
// open too); its update loader names itself "ota-FM1C_" and a build id in hex, not digits
const MVAVE_OPEN_RE = /^FM-1_80000\d\d$/;
const OPEN_LOADER_RE = /^ota-FM1C_[0-9a-f]+$/;
// The ports asked (fm1ports.js): a usual name (PORT_NAMES), a port the page allows (allow), one that appears during an
// update (see watch), or one that answers the screen reader's HELLO (answering: every fm1-base firmware does)
// M-VAVE's FM-1 firmware, any version: "FM-1_0" and two digits ("FM-1_016"; fm1-base's dev builds are
// "FM-1_x00", its releases longer; m-bootloader's installer is FM-1_099). Whether a package is safe to write is the device's to check
// (felucca-bsp chip/ota.c: a well-made writer, a bootable boot area), not a list of known files
const IS_STOCK = (product) => /^FM-1_0\d\d$/.test(product) && product !== "FM-1_099";

// errors carry a code the pages translate: notfound, model, stopped, noloader, lost, noreturn,
// mismatch (detail: the identity the device reports), badreq
function fail(code, msg, detail = "") { const e = new Error(msg); e.code = code; e.detail = detail; return e; }

function pack7(data) {
  const out = []; let acc = 0, nb = 0;
  for (const b of data) {
    acc |= b << nb; nb += 8;
    while (nb >= 7) { out.push(acc & 0x7F); acc >>>= 7; nb -= 7; }
  }
  if (nb) out.push(acc & 0x7F);
  return out;
}

function unpack7(s) {
  const out = []; let acc = 0, nb = 0;
  for (const b of s) {
    acc |= (b & 0x7F) << nb; nb += 7;
    while (nb >= 8) { out.push(acc & 0xFF); acc >>>= 8; nb -= 8; }
  }
  return out;
}

function response(addr, data, fl = 0) {
  const len = data.length;
  const body = [0x00, 0x59, 0x30, (len + 8) & 0xFF, ((len + 8) >> 8) & 0xFF, 0, fl,
    addr & 0xFF, (addr >>> 8) & 0xFF, (addr >>> 16) & 0xFF, (addr >>> 24) & 0xFF,
    len & 0xFF, (len >> 8) & 0xFF, 0, ...data];
  let s = 0;
  for (let i = 6; i < body.length; i++) s += body[i];
  body.push(~s & 0xFF);
  return [0xF0, ...pack7(body), 0xF7];
}

function parseRequest(pkt) {
  if (pkt[0] !== 0xF0 || pkt[pkt.length - 1] !== 0xF7) return null;
  const u = unpack7(pkt.slice(1, -1));
  if (u.length !== 15 || u[0] !== 0 || u[1] !== 0x59 || u[2] !== 0x30) return null;
  let s = 0;
  for (let i = 6; i < 14; i++) s += u[i];
  if ((~s & 0xFF) !== u[14]) return null;
  return { fl: u[6], addr: (u[7] | (u[8] << 8) | (u[9] << 16) | (u[10] << 24)) >>> 0, len: u[11] | (u[12] << 8) | (u[13] << 16) };
}

function parseIdentity(pkt) {
  const d = unpack7(pkt.slice(1, -1));
  if (d.length !== 34 || d[0] !== 0 || d[1] !== 0x59 || d[2] !== 0x11) return null;
  const txt = String.fromCharCode(...d.slice(6, 33)).replace(/\0+$/, "");
  if (OPEN_RE.test(txt)) return { text: txt, model: "FM-1", version: 0, open: true };
  if (OPEN_LOADER_RE.test(txt)) return { text: txt, model: "ota-FM1C", version: 0, open: true };
  const m = /^([^_]+)_(\d+)$/.exec(txt);
  if (!m) return null;
  return { text: txt, model: m[1], version: parseInt(m[2], 10), ...(MVAVE_OPEN_RE.test(txt) ? { open: true } : {}) };
}

// the resource region (device/res.c; fm1.toml resources): NAME-res.bin, written after an update as a restore is
// (web/backup): RES_REQ with the payload's length and CRC-32, then the FM-1's reads (the payload's offsets) until it
// reads RES_OK, or RES_FAIL | its code. After Melodee's web/fm1res.js and its installer step (Kerem Kilic, Ellic
// Studio; used in fm1-base under MPL-2.0 with permission)
const RES_REQ = 0x44, RES_MAGIC = 0x31534552, RES_HEAD = 32, RES_OK = 0xC0000000, RES_FAIL = 0xCF000000;
const CRC32_T = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(d) {                                // zlib's
  let c = 0xFFFFFFFF;
  for (let i = 0; i < d.length; i++) c = CRC32_T[(c ^ d[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
const rd32 = (b, o) => (b[o] | b[o + 1] << 8 | b[o + 2] << 16 | b[o + 3] << 24) >>> 0;
const le32 = (v) => [v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF];
// a NAME-res.bin, its header checked (magic, the header's CRC, the payload's length and CRC) -> {payload, crc};
// throws (code "resbad") on anything else (tools/fm1_resources.py payload_of)
function resPayload(region) {
  const bad = () => fail("resbad", "not a resource file, or a damaged one");
  if (region.length < RES_HEAD || rd32(region, 0) !== RES_MAGIC || rd32(region, 28) !== crc32(region.subarray(0, 28))) throw bad();
  const len = rd32(region, 4), crc = rd32(region, 8), payload = region.subarray(RES_HEAD, RES_HEAD + len);
  if (payload.length !== len || crc32(payload) !== crc) throw bad();
  return { payload, crc };
}

// one MIDI in/out pair with a SysEx queue
class Link {
  constructor(input, output) {
    this.input = input; this.output = output; this.q = []; this.waiter = null;
    input.onmidimessage = (ev) => {
      if (ev.data[0] !== 0xF0) return;
      this.q.push(Array.from(ev.data));
      if (this.waiter) { const w = this.waiter; this.waiter = null; w(); }
    };
  }
  get lost() { return this.input.state === "disconnected" || this.output.state === "disconnected"; }
  // false when the port is gone (unplugged): WebMIDI throws on a disconnected output
  send(bytes) {
    try { this.output.send(bytes); return true; } catch (_) { return false; }
  }
  drain() { this.q.length = 0; }
  async read(ms) {
    if (!this.q.length) {
      let tm;
      await Promise.race([new Promise((r) => { this.waiter = r; }), new Promise((r) => { tm = setTimeout(r, ms); })]);
      clearTimeout(tm);
      this.waiter = null;
    }
    return this.q.shift() || null;
  }
  close() { this.input.onmidimessage = null; }
}

async function handshake(link, tries = 3) {
  link.drain();
  for (let t = 0; t < tries; t++) {
    if (!link.send(HS_QUERY)) return null;
    const end = Date.now() + 1000;
    while (Date.now() < end) {
      const p = await link.read(end - Date.now());
      if (!p) break;
      const id = parseIdentity(p);
      if (id) return id;
    }
  }
  return null;
}

function frame(cmd, payload = []) {
  let s = 0;
  for (const b of payload) s += b;
  return [0xF0, ...pack7([0x00, 0x59, cmd, payload.length & 0xFF, payload.length >> 8, 0, ...payload, ~s & 0xFF]), 0xF7];
}

// send a command -> the payload of its reply, or null
async function query(link, cmd, payload = []) {
  link.drain();
  if (!link.send(frame(cmd, payload))) return null;
  const end = Date.now() + 1500;
  while (Date.now() < end) {
    const p = await link.read(end - Date.now());
    if (!p) break;
    if (p[0] !== 0xF0 || p[p.length - 1] !== 0xF7) continue;
    const u = unpack7(p.slice(1, -1));
    if (u.length < 7 || u[0] !== 0 || u[1] !== 0x59 || u[2] !== cmd) continue;
    let s = 0;
    for (let i = 6; i < u.length; i++) s += u[i];
    if ((s & 0xFF) === 0xFF) return u.slice(6, 6 + (u[3] | (u[4] << 8)));
  }
  return null;
}

class Updater {
  constructor(access, log) {
    this.access = access;
    this.log = log || (() => {});
    this.names = PORT_NAMES.slice();        // the usual names (setNames adds the user's own)
    this.allowed = new Set();               // ports the user picked although their names are none of the usual ones
    this.baseline = null;                   // the ports when an update started (watch)
    this.answered = new Set();              // ports found by answering() (a page may remember them, as the user's picks)
  }

  setNames(list) { this.names = [...PORT_NAMES, ...list.map((x) => String(x).trim().toLowerCase()).filter(Boolean)]; }
  allow(name) { this.allowed.add(name); }
  usual(name) { return usualName(name, this.names); }

  // the port names now: an FM-1 restarting into its update loader and back can come back under another name (the loader
  // has another USB id, and macOS names a port from its own cache, by USB id and socket). Until unwatch(), a port that
  // was not there now is asked too
  watch() { this.baseline = new Set(livePorts(this.access.inputs).map((i) => i.name || "")); }
  unwatch() { this.baseline = null; }

  // the port names that have an input and an output, whatever they are called (for a list to pick from)
  ports() { return [...new Set(pairs(this.access).map((p) => p.name))]; }

  // never probe other gear: a usual name, a port the user allowed or that answered a HELLO, or one that appeared during
  // an update
  askable(name) { return this.usual(name) || this.allowed.has(name) || (!!this.baseline && !this.baseline.has(name || "")); }

  // FM-1s on ports of any name: the ones that answer the screen reader's HELLO (fm1ports.js askAll; every fm1-base
  // firmware does), allowed from then on -> their port names (also kept in this.answered)
  async answering() {
    const got = await askAll(this.access, { skip: (n) => this.askable(n) });
    for (const g of got) { this.allow(g.name); this.answered.add(g.name); }
    return got.map((g) => g.name);
  }

  // find(), and when nothing answers on the ports asked, again after asking the others for a HELLO
  async findAny(filter) {
    return (await this.find(filter)) || ((await this.answering()).length ? await this.find(filter) : null);
  }

  // ask one port who it is (allowing it): -> its identity, or null
  async probe(name) {
    this.allow(name);
    const dev = await this.find(null, name);
    if (!dev) return null;
    dev.link.close();
    return dev.id;
  }

  // every in/out pair with the same port name that answers the handshake (only: the port called only)
  async find(filter, only) {
    for (const input of livePorts(this.access.inputs)) {
      if (only != null ? input.name !== only : !this.askable(input.name)) continue;
      const output = outputFor(this.access, input);
      if (!output) continue;
      try { await input.open(); await output.open(); } catch (_) { continue; }
      const link = new Link(input, output);
      const id = await handshake(link, 2);
      if (id && (!filter || filter(id))) return { link, id, name: input.name };
      link.close();
    }
    return null;
  }

  async waitFor(filter, ms) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      const dev = await this.find(filter);
      if (dev) return dev;
      await sleep(1000);
    }
    return null;
  }

  // serve read requests until the device asks for one of the finish addresses; stops early
  // when the port disappears (lost: true) instead of waiting out idleMs
  async serve(link, image, finishAddr, idleMs, onProgress) {
    let served = 0, bytes = 0, last = Date.now();
    for (;;) {
      const pkt = await link.read(1000);
      if (!pkt) {
        if (link.lost) return { served, finished: false, lost: true };
        if (Date.now() - last > idleMs) return { served, finished: false };
        continue;
      }
      const r = parseRequest(pkt);
      if (!r) continue;
      last = Date.now();
      if (r.addr === 0xE0000000 || r.addr === 0xF0000000) {
        link.send(response(r.addr, [...new TextEncoder().encode("success"), 0]));
        if (r.addr === finishAddr) return { served, finished: true };
        continue;
      }
      if (r.len > MAXDATA || r.addr + r.len > image.length) throw fail("badreq", `bad request ${r.addr.toString(16)}+${r.len}`);
      await sleep(10);
      if (!link.send(response(r.addr, Array.from(image.subarray(r.addr, r.addr + r.len)), r.fl))) {
        return { served, finished: false, lost: true };
      }
      served++;
      bytes += r.len;
      if (onProgress) onProgress(served, bytes);
    }
  }

  // full install: running firmware -> loader -> new firmware
  async install(image, product, onStep, sha256) {
    const step = onStep || (() => {});
    const dev = await this.findAny((id) => !IS_OTA(id));
    if (!dev) throw fail("notfound", "FM-1 not found (USB cable, and no other app using it?)");
    const [model] = product.split("_");
    if (dev.id.model !== model) { dev.link.close(); throw fail("model", `the device is ${dev.id.text}, the package is for ${product}`); }
    if (dev.id.open) await this.arm(dev, image, product, sha256);
    try { return await this.stages(dev, image, product, step); } finally { this.unwatch(); }
  }

  async stages(dev, image, product, step) {
    this.watch();
    step("start", dev.id.text);
    dev.link.send(UPGRADE);
    await sleep(2000);
    const s1 = await this.serve(dev.link, image, 0xE0000000, 8000, (n, b) => step("verify", n, b));
    dev.link.close();
    if (!s1.finished) throw fail(s1.lost ? "lost" : "stopped", `the device ${s1.lost ? "was disconnected" : "stopped"} after ${s1.served} requests: nothing was written`);
    step("loader");
    await sleep(3000);
    const ota = await this.waitFor(IS_OTA, 30000);
    if (!ota) throw fail("noloader", "the update loader did not appear. Replug the USB cable and press Install again: the device stays in update mode until it is finished.");
    const s2 = await this.write(ota, image, step);
    if (!s2.finished) throw fail(s2.lost ? "lost" : "stopped", `the loader ${s2.lost ? "was disconnected" : "stopped"} after ${s2.served} requests. Replug and press Install again to resume.`);
    step("reboot");
    await sleep(3000);
    const back = await this.waitFor((id) => !IS_OTA(id), 40000);
    if (!back) throw fail("noreturn", "the device did not come back: power-cycle it");
    back.link.close();
    if (back.id.text !== product) throw fail("mismatch", `installed, but the device reports ${back.id.text}`, back.id.text);
    step("done", back.id.text);
    return back.id.text;
  }

  // m-bootloader (github.com/jvitkauskas/m-bootloader, MIT) after an install: the running firmware (product)
  // stages the package's installer (no flash.bin: any well-made writer, felucca-bsp chip/ota.c) and resets; the bootloader
  // runs it, it rewrites the boot area [0, 0x4000) only and restarts into the firmware. It never talks to us:
  // we wait for the firmware to come back. A firmware that does not know it refuses it, and nothing is written.
  async installBoot(image, product, onStep) {
    this.watch();
    try { return await this.bootStages(image, product, onStep || (() => {})); } finally { this.unwatch(); }
  }

  async bootStages(image, product, step) {
    const dev = await this.waitFor((id) => !IS_OTA(id) && id.text === product, 40000);
    if (!dev) throw fail("noreturn", "the device did not come back: power-cycle it");
    step("bootstart");
    dev.link.send(UPGRADE);
    await sleep(2000);
    const s = await this.serve(dev.link, image, 0xE0000000, 8000);
    dev.link.close();
    if (!s.finished) throw fail(s.lost ? "lost" : "bootrefused", `m-bootloader: the device stopped after ${s.served} requests: nothing was written`);
    step("bootwrite");
    await sleep(3000);
    const back = await this.waitFor((id) => !IS_OTA(id), 40000);
    if (!back) throw fail("noreturn", "the device did not come back: power-cycle it");
    back.link.close();
    step("bootdone", back.id.text);
    return back.id.text;
  }

  // M-VAVE's Open firmware: allow the update of M-VAVE's own firmware (sha256: the package file's, hex)
  async arm(dev, image, product, sha256) {
    if (!IS_STOCK(product) || !/^[0-9a-f]{64}$/.test(sha256 || "")) {
      dev.link.close();
      throw fail("open", `This FM-1 runs M-VAVE's ${dev.id.text} firmware. Put the stock firmware back first ("Back to the stock firmware"), then install this.`, dev.id.text);
    }
    const cap = await query(dev.link, 49);
    if (!cap || cap.length !== 47 || String.fromCharCode(...cap.slice(0, 4)) !== "FMC1" || cap[6] !== 0) {
      dev.link.close();
      throw fail("stopped", `${dev.id.text} did not accept the update: nothing was written`);
    }
    const n = image.length;
    const tag = sha256.match(/../g).map((h) => parseInt(h, 16));
    const ack = await query(dev.link, 50, [1, cap[5], n & 0xFF, (n >>> 8) & 0xFF, (n >>> 16) & 0xFF, (n >>> 24) & 0xFF, ...tag]);
    if (!ack || ack.length !== 1 || ack[0] !== 0) {
      dev.link.close();
      throw fail("stopped", `${dev.id.text} refused the package: nothing was written`);
    }
  }

  // the resource region after an install (resPayload's file): once the FM-1 runs product, RES_REQ, then its reads
  // answered -> 0 written (or there already), else the FM-1's code (device/res.c: 2 transfer, 7 erase, 8 write,
  // 10 playing, 20 another build's, 21 the store's move not done, 22 the check). Throws noreturn, lost, stopped, badreq
  async installRes(region, product, onProgress) {
    const { payload, crc } = resPayload(region);
    const dev = await this.waitFor((id) => !IS_OTA(id) && id.text === product, 40000);
    if (!dev) throw fail("noreturn", "the device did not come back: power-cycle it");
    const { link } = dev;
    try {
      link.drain();
      link.send(frame(RES_REQ, [...le32(payload.length), ...le32(crc)]));
      let last = Date.now(), idle = 10000;                /* (the first read after the region's erase) */
      for (;;) {
        const pkt = await link.read(500);
        if (!pkt) {
          if (link.lost) throw fail("lost", "the device was disconnected");
          if (Date.now() - last > idle) throw fail("stopped", "the device stopped asking for the resources");
          continue;
        }
        const r = parseRequest(pkt);
        if (!r) continue;
        last = Date.now(); idle = 10000;
        const top = (r.addr & 0xFF000000) >>> 0;
        if (top === RES_OK || top === RES_FAIL) {
          link.send(response(r.addr, [...new TextEncoder().encode("success"), 0], r.fl));
          return top === RES_OK ? 0 : (r.addr & 0xFFFF) || 99;
        }
        if (r.len > MAXDATA || r.addr + r.len > payload.length) throw fail("badreq", `bad request ${r.addr.toString(16)}+${r.len}`);
        if (!link.send(response(r.addr, Array.from(payload.subarray(r.addr, r.addr + r.len)), r.fl))) throw fail("lost", "the device was disconnected");
        if (onProgress) onProgress(((r.addr + r.len) * 100) / payload.length);
      }
    } finally { link.close(); }
  }

  // step 2 with the loader found by find()/waitFor()
  async write(ota, image, step) {
    ota.link.send(UPGRADE);
    await sleep(2000);
    const s2 = await this.serve(ota.link, image, 0xF0000000, 180000, (n, b) => step("write", n, b));
    ota.link.close();
    return s2;
  }

  // resume: the device is already in update mode (loader) -> true when the write finished. With the product, the
  // FM-1 has to come back running it (as at the end of install)
  async resume(image, onStep, product) {
    const step = onStep || (() => {});
    const ota = await this.find(IS_OTA);
    if (!ota) return false;
    this.watch();
    try {
      if (!(await this.write(ota, image, step)).finished) return false;
      if (product) {
        step("reboot");
        await sleep(3000);
        const back = await this.waitFor((id) => !IS_OTA(id), 40000);
        if (!back) throw fail("noreturn", "the device did not come back: power-cycle it");
        back.link.close();
        if (back.id.text !== product) throw fail("mismatch", `written, but the device reports ${back.id.text}`, back.id.text);
        step("done", back.id.text);
      }
      return true;
    } finally { this.unwatch(); }
  }
}

/* SPDX-License-Identifier: GPL-3.0-only */
/* The kit bank page's logic, without the page: which files are kits, .zip files, and the bank's SysEx (app/kit_sysex.c,
 * as tools/fm1_kits.py speaks it). tests/kits_page_test.mjs runs this against the firmware's handler. make_web.py inlines
 * it after fm1ota.js, in one scope, so names here must not repeat that file's. */
const KT_HEAD = [0x7D, 0x4B, 0x54];
const KIT_SLOTS = 128, KIT_BYTES = 256, KIT_CHUNK = 64;
const KIT_SIZES = [255, 256];                 // what the LXR writes, and a whole slot. Any other .snd is audio, not a kit
const KIT_SAVED = 255;                        // what the LXR writes, and tools/fm1_kits.py --save
const BANK_FILE = /^\d{3}-.*\.snd$/i;         // what saving the bank writes
const EMPTY_KIT = /^initkit[\0 ]*$/i;         // an LXR project's unused slot. Their last few bytes differ, so copies don't catch them

/* sent: the kits that arrived, on a failure after the bank was erased */
function kitFail(code, message, sent) { return Object.assign(new Error(message), { code, sent }); }

const isSnd = (path) => /\.snd$/i.test(path);
const leaf = (path) => path.split("/").pop();
function kitPathOrder(a, b) {                 // as Python sorts paths: folder by folder, by code point
  const x = a.path.split("/"), y = b.path.split("/");
  for (let i = 0; i < Math.min(x.length, y.length); i++)
    if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return x.length - y.length;
}

/* A kit needs a name: a blank one can't be seen in the bank, and 0xFF first reads as an empty slot, which PRESET stops at */
function kitNamed(raw, stem) {
  if (raw[0] !== 0xFF && raw.subarray(0, 8).some((b) => b !== 0x20 && b !== 0)) return raw;
  const name = (stem.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "KIT").padEnd(8);
  const out = raw.slice();
  for (let i = 0; i < 8; i++) out[i] = name.charCodeAt(i);
  return out;
}

/* files: [{path, data}], data null when it could not be read -> what goes in the bank, as tools/fm1_kits.py picks it:
 * sorted by path, one of each kit unless the files came from saving a bank, where the copies hold their slots */
function kitsFrom(files) {
  const seen = new Set(), found = [], notKits = [];
  let copies = 0, empties = 0;
  for (const f of files.slice().sort(kitPathOrder)) {
    const base = leaf(f.path);
    if (!isSnd(base) || base.startsWith("._") || f.path.split("/").includes("__MACOSX")) continue;
    if (!f.data || f.data.length < KIT_SIZES[0] || f.data.length > KIT_SIZES[1]) { notKits.push(f.path); continue; }
    if (!BANK_FILE.test(base) && EMPTY_KIT.test(String.fromCharCode(...f.data.subarray(0, 8)))) { empties++; continue; }
    const same = f.data.join();
    if (seen.has(same) && !BANK_FILE.test(base)) { copies++; continue; }
    seen.add(same);
    const raw = new Uint8Array(KIT_BYTES);
    raw.set(f.data);
    found.push({ path: f.path, raw: kitNamed(raw, base.replace(/\.[^.]*$/, "")) });
  }
  return { kits: found.slice(0, KIT_SLOTS), notKits, copies, empties, over: Math.max(0, found.length - KIT_SLOTS) };
}

/* ------------------------------------------------------------- .zip: kit packs arrive as one, and the saved bank is one */
const ZIP_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function zipCrc(data) {
  let c = 0xFFFFFFFF;
  for (const b of data) c = ZIP_CRC[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
async function zipInflate(raw) {
  const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/* a .zip -> its .snd files as [{path, data}]. A kit that can't be read (encrypted, or too big to be a kit) has data null */
async function zipRead(bytes, prefix) {
  const damaged = () => kitFail("zip", `${prefix} is damaged, or is not a .zip file.`);
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.length);
  let end = -1;
  for (let i = bytes.length - 22; i >= 0 && i >= bytes.length - 22 - 0xFFFF && end < 0; i--)
    if (v.getUint32(i, true) === 0x06054B50) end = i;
  if (end < 0) throw damaged();
  const out = [], names = new TextDecoder();
  try {
    let at = v.getUint32(end + 16, true);
    for (let k = v.getUint16(end + 10, true); k > 0; k--) {
      if (v.getUint32(at, true) !== 0x02014B50) throw damaged();
      const flags = v.getUint16(at + 8, true), method = v.getUint16(at + 10, true), crc = v.getUint32(at + 16, true);
      const packed = v.getUint32(at + 20, true), size = v.getUint32(at + 24, true), local = v.getUint32(at + 42, true);
      const nameLen = v.getUint16(at + 28, true);
      const name = names.decode(bytes.subarray(at + 46, at + 46 + nameLen)).replace(/\\/g, "/");
      at += 46 + nameLen + v.getUint16(at + 30, true) + v.getUint16(at + 32, true);
      if (!isSnd(name)) continue;
      const path = `${prefix}/${name}`;
      if ((flags & 1) || (method !== 0 && method !== 8) || size > KIT_SIZES[1]) { out.push({ path, data: null }); continue; }
      if (v.getUint32(local, true) !== 0x04034B50) throw damaged();
      const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
      const raw = bytes.subarray(start, start + packed);
      const data = method ? await zipInflate(raw) : raw.slice();
      if (zipCrc(data) !== crc) throw damaged();
      out.push({ path, data });
    }
  } catch (e) {
    throw e.code === "zip" ? e : damaged();
  }
  return out;
}

/* [{name, data}] -> a .zip, stored without compression, as 256 bytes barely shrink */
function zipWrite(entries) {
  const le = (n, v) => Array.from({ length: n }, (_, i) => (v >>> (8 * i)) & 0xFF);
  const parts = [], dir = [];
  let at = 0;
  for (const { name, data } of entries) {
    const path = Array.from(name, (c) => c.charCodeAt(0) & 0x7F);
    const same = [...le(2, 20), 0, 0, 0, 0, 0, 0, 0x21, 0, ...le(4, zipCrc(data)), ...le(4, data.length), ...le(4, data.length),
                  ...le(2, path.length), 0, 0];       // the date is the format's earliest, so a saved bank's bytes depend on the kits only
    const head = [0x50, 0x4B, 3, 4, ...same, ...path];
    parts.push(Uint8Array.from(head), data);
    dir.push(0x50, 0x4B, 1, 2, ...le(2, 20), ...same, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...le(4, at), ...path);
    at += head.length + data.length;
  }
  parts.push(Uint8Array.from(dir), Uint8Array.from([0x50, 0x4B, 5, 6, 0, 0, 0, 0, ...le(2, entries.length), ...le(2, entries.length),
                                                    ...le(4, dir.length), ...le(4, at), 0, 0]));
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

/* ---------------------------------------------------------------------------------------------- the bank over SysEx */
const stopFirst = (sent) => kitFail("playing", `Tack is playing. Press PLAY on the FM-1 to stop it, then try again.${sent === undefined ? " Nothing changed." : ""}`, sent);

/* The FM-1 drops a SysEx that arrives while it still holds the one before, about one read in 3000, so a request that
 * can be repeated goes again. A reply that answers it starts with the first `same` bytes of the body, unless the status
 * says the FM-1 refused it: those replies carry nothing else */
async function kitAsk(link, cmd, body = [], { same = 0, wait = 5000, tries = 1 } = {}) {
  const message = [0xF0, ...KT_HEAD, cmd, ...body, 0xF7];
  for (let t = 0; t < tries; t++) {
    link.drain();
    if (!link.send(message)) break;
    for (const end = Date.now() + wait; ;) {
      const p = await link.read(end - Date.now());
      if (!p) break;
      if (p[1] !== KT_HEAD[0] || p[2] !== KT_HEAD[1] || p[3] !== KT_HEAD[2] || p[4] !== 0x7F || p[5] !== cmd) continue;
      const refused = p[6] !== 0 && p[6] !== 4;
      if (refused || body.slice(0, same).every((b, i) => p[7 + i] === b)) return p;
    }
    if (link.lost) break;
  }
  throw kitFail(link.lost ? "lost" : "silent", link.lost ? "The FM-1 was disconnected." : "The FM-1 stopped answering. Check that it runs Tack, and try again.");
}

/* a slot -> its 256 bytes, or null when it is empty */
async function slotRead(link, slot, sent) {
  const raw = new Uint8Array(KIT_BYTES);
  for (let part = 0; part < KIT_BYTES / KIT_CHUNK; part++) {
    const p = await kitAsk(link, 3, [slot, part], { same: 2, wait: 250, tries: 8 });
    if (p[6] === 1) throw stopFirst(sent);
    if (p[6] === 4) return null;
    if (p[6] !== 0 || p.length !== 10 + 2 * KIT_CHUNK) throw kitFail("read", `The FM-1 sent slot ${slot + 1} in a form this page can't read.`, sent);
    for (let i = 0; i < KIT_CHUNK; i++)
      raw[part * KIT_CHUNK + i] = parseInt(String.fromCharCode(p[9 + 2 * i], p[10 + 2 * i]), 16);
  }
  return raw;
}

/* the bank -> [{name, data}], the files `fm1 backup` writes: slot number, then the kit's name */
async function bankRead(link, onProgress = () => {}) {
  const files = [];
  for (let slot = 0; slot < KIT_SLOTS; slot++) {
    const raw = await slotRead(link, slot);
    onProgress((slot + 1) / KIT_SLOTS);
    if (!raw) continue;
    const name = String.fromCharCode(...raw.subarray(0, 8)).replace(/[^A-Za-z0-9]/g, "");
    files.push({ name: `${String(slot).padStart(3, "0")}-${name}.snd`, data: raw.subarray(0, KIT_SAVED) });
  }
  return files;
}

/* Erases the bank, writes the kits and reads them all back. Writes must be read back: their replies don't name a slot,
 * so a late reply to a repeated write can pass for the next write's, and hide a kit that never arrived */
async function bankSend(link, kits, onProgress = () => {}) {
  const erased = (await kitAsk(link, 1))[6];
  if (erased === 1) throw stopFirst();
  if (erased) throw kitFail("flash", "The FM-1 could not erase its kit bank.");
  for (let i = 0; i < kits.length; i++) {
    const hex = Array.from(kits[i].raw, (b) => b.toString(16).toUpperCase().padStart(2, "0")).join("");
    const body = [i, ...Array.from(hex, (c) => c.charCodeAt(0))];
    const st = (await kitAsk(link, 2, body, { wait: 1000, tries: 4 }).catch((e) => { e.sent = i; throw e; }))[6];
    if (st === 1) throw stopFirst(i);
    if (st) throw kitFail("flash", `The FM-1 refused ${leaf(kits[i].path)}.`, i);
    onProgress((i + 1) / (2 * kits.length), "writing");
  }
  for (let i = 0; i < kits.length; i++) {
    const back = await slotRead(link, i, i).catch((e) => { e.sent = i; throw e; });
    if (!back || back.some((b, k) => b !== kits[i].raw[k])) throw kitFail("check", `${leaf(kits[i].path)} did not arrive intact.`, i);
    onProgress((kits.length + i + 1) / (2 * kits.length), "checking");
  }
}

/* SPDX-License-Identifier: GPL-3.0-only */
/* The kit bank page: site/kits_body.html's controls on site/kits_core.js. make_web.py inlines this after that file and
 * fm1-base's fm1ports.js and fm1ota.js, which give Updater and IS_OTA */
const FIRMWARE_ID = "FM-1_47";
const PICKED_PORTS = "fm1-ports";             // the ports the user picked, shared with the install and backup pages
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const plural = (n, one) => `${n} ${one}${n === 1 ? "" : "s"}`;

let busy = false, chosen = null, access = null, lastSaid = 0, lastShare = -100;
let ports = [];
try { ports = JSON.parse(localStorage.getItem(PICKED_PORTS) || "[]").filter((x) => typeof x === "string"); } catch (_) { /* none */ }

function say(html, kind = "") {
  $("status").innerHTML = kind === "err" ? "" : html;
  $("alert").innerHTML = kind === "err" ? html : "";
  $("statusBox").className = "status" + (kind ? " " + kind : "");
  lastSaid = performance.now();
}
/* progress in words at most every 2 s, or every 10 percent: a screen reader reads each change */
function sayProgress(what, share) {
  const pct = Math.floor(share * 100);
  $("bar").hidden = false;
  $("bar").value = pct;
  if (performance.now() - lastSaid < 2000 && pct - lastShare < 10) return;
  lastShare = pct;
  say(`${esc(what)}: ${pct} percent`);
}
function setBusy(on) {
  busy = on;
  for (const id of ["files", "folder", "save"]) $(id).disabled = on;
  $("fill").disabled = on || !chosen || !chosen.kits.length;
  if (on) { $("ask").hidden = true; lastShare = -100; } else $("bar").hidden = true;
}
window.addEventListener("beforeunload", (e) => { if (busy) { e.preventDefault(); e.returnValue = ""; } });

function updater() {
  const up = new Updater(access);
  ports.forEach((n) => up.allow(n));
  return up;
}
/* after "not found": the ports the page did not ask, each with Try */
function showPorts(up) {
  const names = up.ports().filter((n) => !up.askable(n));
  $("portlist").replaceChildren(...names.map((n) => {
    const b = document.createElement("button"), li = document.createElement("li"), name = document.createElement("span");
    b.type = "button"; b.className = "quiet"; b.textContent = "Try";
    b.setAttribute("aria-label", `Try ${n}`);
    b.addEventListener("click", () => tryPort(n, b));
    name.textContent = n;
    li.append(name, b);
    return li;
  }));
  if (!names.length) { const li = document.createElement("li"); li.textContent = "No other MIDI ports."; $("portlist").append(li); }
  $("portpick").hidden = false;
}
async function tryPort(name, button) {
  if (busy) return;
  button.disabled = true;
  $("pickstatus").textContent = "Asking…";
  let id = null;
  try { id = await updater().probe(name); } catch (_) { /* no answer */ }
  button.disabled = false;
  if (!id) { $("pickstatus").textContent = `No FM-1 answered on ${name}.`; return; }
  ports.push(name);
  try { localStorage.setItem(PICKED_PORTS, JSON.stringify(ports)); } catch (_) { /* until the page is closed */ }
  $("pickstatus").textContent = `Found an FM-1 on ${name}. This browser remembers it. Press your button again.`;
}
async function connect() {
  if (!navigator.requestMIDIAccess) throw kitFail("nomidi", "This browser has no Web MIDI. Open this page in Chrome or Edge.");
  try { access = access || await navigator.requestMIDIAccess({ sysex: true }); }
  catch (_) { throw kitFail("denied", "MIDI with SysEx was not allowed. Allow MIDI in the site settings (the address bar), then try again."); }
  say("Looking for Tack…");
  $("portpick").hidden = true;
  const up = updater(), dev = await up.findAny((id) => !IS_OTA(id));
  if (!dev) {
    showPorts(up);
    throw kitFail("notfound", "Tack not found. Plug the FM-1 in with a USB data cable, close other apps that use its MIDI, and try again.");
  }
  if (dev.id.text.startsWith(FIRMWARE_ID)) return dev;
  dev.link.close();
  throw kitFail("model", `The FM-1 runs other firmware (${dev.id.text}), not Tack. Install Tack first.`);
}

async function readChoice(list) {
  const files = [];
  for (const f of list) {
    const path = f.webkitRelativePath || f.name;
    if (/\.zip$/i.test(path)) files.push(...await zipRead(new Uint8Array(await f.arrayBuffer()), path));
    else if (/\.snd$/i.test(path)) files.push({ path, data: f.size > KIT_BYTES ? null : new Uint8Array(await f.arrayBuffer()) });
  }
  return kitsFrom(files);
}
function describe({ kits, notKits, copies, empties, over }) {
  const notes = [];
  if (empties) notes.push(`${plural(empties, "empty Initkit slot")} left out`);
  if (copies) notes.push(`${copies === 1 ? "1 exact copy" : `${copies} exact copies`} left out`);
  if (over) notes.push(`${plural(over, "kit")} past the bank's ${KIT_SLOTS} slots left out`);
  if (notKits.length) notes.push(`${notKits.length === 1 ? "1 file is" : `${notKits.length} files are`} not a kit: ${notKits.slice(0, 5).map((p) => p.split("/").pop()).join(", ")}${notKits.length > 5 ? " and more" : ""}`);
  const named = kits.map((k) => esc(k.path.split("/").pop()));
  return `<b>${plural(kits.length, "kit")}</b>${kits.length > 1 ? `, from ${named[0]} to ${named[kits.length - 1]}` : kits.length ? `, ${named[0]}` : ""}.` +
    (notes.length ? ` ${esc(notes.join(". "))}.` : "");
}
async function choose(e, other) {
  chosen = null;
  $("ask").hidden = true;
  other.value = "";
  const info = $("fileInfo");
  info.hidden = true;
  const list = Array.from(e.target.files || []);
  if (list.length) {
    try {
      chosen = await readChoice(list);
      info.innerHTML = describe(chosen);
      info.hidden = !chosen.kits.length && !chosen.notKits.length;
      say(chosen.kits.length ? "Ready. Stop Tack first, then press Replace the bank." : "No kits there. Choose .SND files, a folder of them, or a .zip of them.", chosen.kits.length ? "" : "err");
    } catch (err) {
      say(esc(err.message), "err");
    }
  }
  setBusy(false);
}
$("files").addEventListener("change", (e) => choose(e, $("folder")));
$("folder").addEventListener("change", (e) => choose(e, $("files")));

$("fill").addEventListener("click", () => {
  if (busy || !chosen) return;
  $("askText").innerHTML = `Replace every kit on Tack with these ${plural(chosen.kits.length, "kit")}? The kits on the FM-1 now are erased. To keep them, press Save the bank first.`;
  $("ask").hidden = false;
  $("askYes").focus();
});
$("askNo").addEventListener("click", () => { $("ask").hidden = true; $("fill").focus(); });
$("askYes").addEventListener("click", async () => {
  if (busy || !chosen) return;
  setBusy(true);
  let dev = null;
  try {
    dev = await connect();
    say("Erasing the bank…");
    await bankSend(dev.link, chosen.kits, (share, step) => sayProgress(step === "writing" ? "Writing kits" : "Checking kits", share));
    say(`Done. Tack has ${plural(chosen.kits.length, "kit")}, and each one read back the same as its file. Turn <kbd>PRESET</kbd> to hear them.`);
  } catch (err) {
    const left = err.sent === undefined ? "" : ` ${err.sent ? `The first ${plural(err.sent, "kit")} arrived.` : "No kits arrived."} Press Replace the bank to send them all again.`;
    say(esc(err.message + left), "err");
  } finally {
    if (dev) dev.link.close();
    setBusy(false);
  }
});

$("save").addEventListener("click", async () => {
  if (busy) return;
  setBusy(true);
  let dev = null;
  try {
    dev = await connect();
    const files = await bankRead(dev.link, (share) => sayProgress("Reading the bank", share));
    if (!files.length) { say("The bank is empty, so there is nothing to save."); return; }
    const d = new Date(), pad = (v) => String(v).padStart(2, "0");
    const name = `tack-kits-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.zip`;
    const url = URL.createObjectURL(new Blob([zipWrite(files)], { type: "application/zip" }));
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    say(`Done. <b>${esc(name)}</b> is in your downloads, with ${plural(files.length, "kit")}. Choose that file above to put them back.`);
  } catch (err) {
    say(esc(err.message), "err");
  } finally {
    if (dev) dev.link.close();
    setBusy(false);
  }
});
