// Generates public/og-image.png — run with: node scripts/generate-og-image.mjs
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 1200, H = 630;

// CRC32
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (~c) >>> 0;
}
function mkChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

// Build raw scanlines — teal #1DAFB6 → purple #7928A3 gradient
const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 3)] = 0; // filter: None
  for (let x = 0; x < W; x++) {
    const tx = x / (W - 1); // horizontal gradient
    const ty = y / (H - 1); // subtle vertical darkening
    const dark = 1 - ty * 0.15;
    const r = Math.round((0x1d + (0x79 - 0x1d) * tx) * dark);
    const g = Math.round((0xaf + (0x28 - 0xaf) * tx) * dark);
    const b = Math.round((0xb6 + (0xa3 - 0xb6) * tx) * dark);
    const off = y * (1 + W * 3) + 1 + x * 3;
    raw[off] = r; raw[off + 1] = g; raw[off + 2] = b;
  }
}

const compressed = deflateSync(raw, { level: 9 });

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2; // bit depth 8, RGB

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  mkChunk("IHDR", ihdr),
  mkChunk("IDAT", compressed),
  mkChunk("IEND", Buffer.alloc(0)),
]);

const dest = join(__dirname, "../public/og-image.png");
writeFileSync(dest, png);
console.log(`Generated ${dest} (${png.length} bytes)`);
