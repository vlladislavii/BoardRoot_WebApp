// One-off generator: writes a valid one-page placeholder PDF per game into
// frontend/public/rulebooks/ so the "Download Rulebook" feature always resolves.
// Replace these files with the real rulebooks when available.
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "rulebooks");
mkdirSync(outDir, { recursive: true });

const games = [
    ["7-wonders", "7 Wonders"],
    ["catan", "Catan"],
    ["ticket-to-ride", "Ticket to Ride"],
    ["pandemic", "Pandemic"],
    ["terraforming-mars", "Terraforming Mars"],
    ["wingspan", "Wingspan"],
    ["scythe", "Scythe"],
    ["gloomhaven", "Gloomhaven"],
    ["codenames", "Codenames"],
    ["root", "Root"],
    ["azul", "Azul"],
];

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

function buildPDF(title) {
    const lines = [
        { size: 22, dy: 0, s: `${title} - Rulebook` },
        { size: 12, dy: 36, s: "Placeholder PDF bundled with BoardRoot." },
        { size: 12, dy: 18, s: "The Download Rulebook feature serves this file." },
        { size: 12, dy: 18, s: "Replace it with the real rulebook when available." },
    ];
    let stream = "BT\n72 740 Td\n";
    for (const t of lines) {
        stream += `/F1 ${t.size} Tf\n0 -${t.dy} Td\n(${esc(t.s)}) Tj\n`;
    }
    stream += "ET";
    const streamLen = Buffer.byteLength(stream, "latin1");

    const objs = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        `<< /Length ${streamLen} >>\nstream\n${stream}\nendstream`,
    ];

    let pdf = "%PDF-1.4\n";
    const offsets = [];
    objs.forEach((body, i) => {
        offsets[i] = Buffer.byteLength(pdf, "latin1");
        pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
    });

    const xrefPos = Buffer.byteLength(pdf, "latin1");
    pdf += "xref\n0 6\n0000000000 65535 f \n";
    offsets.forEach((off) => {
        pdf += String(off).padStart(10, "0") + " 00000 n \n";
    });
    pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
    return Buffer.from(pdf, "latin1");
}

for (const [slug, title] of games) {
    writeFileSync(join(outDir, `${slug}.pdf`), buildPDF(title));
    console.log(`wrote ${slug}.pdf`);
}
console.log(`Done -> ${outDir}`);
