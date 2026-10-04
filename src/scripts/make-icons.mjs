// Generates the app icons: a British flag with the words "English Quiz" below it.
// Run with `npm run icons` (inside src/). Writes the PWA PNGs (the favicon is the 192px PNG: text needs a font, so no SVG favicon).
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

const NAVY = '#012169';
const RED = '#C8102E';

// Union Jack, 60x30 units, scaled to 360x180 and placed at (76, 36).
const flag = `
  <g transform="translate(76 36) scale(6)">
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clip-path="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="${NAVY}"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="${RED}" stroke-width="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="${RED}" stroke-width="6"/>
    </g>
  </g>
  <rect x="76" y="36" width="360" height="180" fill="none" stroke="${NAVY}" stroke-width="6"/>`;

// "English Quiz" on two lines, bold sans-serif (rendered with a system font when the PNGs are generated).
const FONT = "font-family=\"Arial Black, Arial, Helvetica, sans-serif\" font-weight=\"900\" fill=\"" + NAVY + "\" text-anchor=\"middle\"";
const word = `
  <text x="256" y="338" font-size="96" textLength="400" lengthAdjust="spacingAndGlyphs" ${FONT}>English</text>
  <text x="256" y="450" font-size="104" textLength="270" lengthAdjust="spacingAndGlyphs" ${FONT}>Quiz</text>`;

const icon = (maskable) => {
  const content = `${flag}${word}`;
  // Maskable icons get a full-bleed background and the content inside the safe zone.
  const body = maskable ? `<g transform="translate(256 256) scale(0.74) translate(-256 -256)">${content}</g>` : content;
  const bg = maskable ? '<rect width="512" height="512" fill="#fff"/>' : '<rect width="512" height="512" rx="96" fill="#fff"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${bg}${body}</svg>`;
};

const png = (svg, size) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: size }, font: { loadSystemFonts: true, defaultFontFamily: 'Arial' } }).render().asPng();

fs.writeFileSync(path.join(publicDir, 'pwa-192.png'), png(icon(false), 192));
fs.writeFileSync(path.join(publicDir, 'pwa-512.png'), png(icon(false), 512));
fs.writeFileSync(path.join(publicDir, 'pwa-512-maskable.png'), png(icon(true), 512));
console.log('icons written to', publicDir);
