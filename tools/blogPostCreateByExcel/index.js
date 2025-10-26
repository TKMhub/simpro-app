#!/usr/bin/env node
/*
  BlogPost importer from Excel/CSV
  - Default file: tools/blogPostCreateByExcel/blog_posts.csv
  - Supports: .csv (built-in), .xlsx (requires `npm i xlsx`)
*/

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

// Prisma Client (generated output)
const { PrismaClient } = require('../../lib/generated/prisma');
const prisma = new PrismaClient({ log: ['error'] });

function parseArgs(argv) {
  const args = { file: path.join(process.cwd(), 'tools/blogPostCreateByExcel/blog_posts.csv'), dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--file') args.file = path.resolve(argv[++i]);
  }
  return args;
}

function parseBool(v, def = false) {
  if (v === undefined || v === null || v === '') return def;
  const s = String(v).trim().toLowerCase();
  return ['true', '1', 'yes', 'y'].includes(s);
}

function parseIntSafe(v, def = 0) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

function parseDateSafe(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

// Minimal CSV parser: handles commas and double quotes
function parseCsv(content) {
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  while (i < content.length) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        field += ch;
        i++;
        continue;
      }
    } else {
      if (ch === '"') { inQuotes = true; i++; continue; }
      if (ch === ',') { row.push(field); field = ''; i++; continue; }
      if (ch === '\n') { row.push(field); rows.push(row); row = []; field=''; i++; continue; }
      if (ch === '\r') { // handle CRLF
        if (content[i+1] === '\n') { row.push(field); rows.push(row); row=[]; field=''; i+=2; continue; }
        else { i++; continue; }
      }
      field += ch; i++; continue;
    }
  }
  // last field
  row.push(field);
  rows.push(row);
  // trim possible trailing empty line
  if (rows.length && rows[rows.length - 1].every(c => c === '')) rows.pop();
  return rows;
}

function normalizeHeader(headerCells) {
  return headerCells.map((h) => String(h || '').trim());
}

function rowToObject(header, row) {
  const obj = {};
  for (let i = 0; i < header.length; i++) {
    const key = header[i];
    if (!key) continue;
    obj[key] = row[i] === undefined ? '' : row[i];
  }
  return obj;
}

function normalizeRecord(obj) {
  const required = ['title', 'slug', 'author', 'notionPageId'];
  for (const k of required) {
    if (!obj[k] || String(obj[k]).trim() === '') {
      throw new Error(`必須項目 ${k} が空です`);
    }
  }

  const rec = {
    title: String(obj.title).trim(),
    slug: String(obj.slug).trim(),
    author: String(obj.author).trim(),
    notionPageId: String(obj.notionPageId).trim(),
  };

  if (obj.category && String(obj.category).trim() !== '') rec.category = String(obj.category).trim();

  if (obj.tags !== undefined) {
    const tags = String(obj.tags)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    rec.tags = tags;
  } else {
    rec.tags = [];
  }

  if (obj.status) {
    const s = String(obj.status).trim().toLowerCase();
    rec.status = s === 'published' ? 'published' : s === 'archived' ? 'archived' : 'draft';
  }

  if (obj.isPublic !== undefined) rec.isPublic = parseBool(obj.isPublic);

  if (obj.goodCount !== undefined && obj.goodCount !== '') rec.goodCount = parseIntSafe(obj.goodCount, 0);

  if (obj.headerImagePath && String(obj.headerImagePath).trim() !== '') rec.headerImagePath = String(obj.headerImagePath).trim();

  if (obj.publishedAt) {
    const d = parseDateSafe(obj.publishedAt);
    if (d) rec.publishedAt = d;
  }

  return rec;
}

async function readXlsx(filePath) {
  let XLSX;
  try {
    XLSX = require('xlsx');
  } catch (e) {
    throw new Error('xlsx パッケージが見つかりません。`npm i xlsx` を実行してください。');
  }
  const wb = XLSX.readFile(filePath);
  const first = wb.SheetNames[0];
  const sheet = wb.Sheets[first];
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  return json;
}

async function readCsv(filePath) {
  let raw = await fsp.readFile(filePath, 'utf8');
  // Strip UTF-8 BOM if present
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  return parseCsv(raw);
}

async function main() {
  const { file, dryRun } = parseArgs(process.argv);
  const ext = path.extname(file).toLowerCase();
  if (!fs.existsSync(file)) {
    console.error(`入力ファイルが見つかりません: ${file}`);
    process.exit(1);
  }

  let rows;
  if (ext === '.xlsx') rows = await readXlsx(file);
  else if (ext === '.csv') rows = await readCsv(file);
  else {
    console.error('対応拡張子は .xlsx または .csv です');
    process.exit(1);
  }

  if (!rows || rows.length < 2) {
    console.error('データ行がありません（ヘッダー含め2行以上必要です）');
    process.exit(1);
  }

  const header = normalizeHeader(rows[0]);
  const dataRows = rows.slice(1).filter(r => r && r.some(c => String(c).trim() !== ''));

  const records = [];
  for (const r of dataRows) {
    const obj = rowToObject(header, r);
    try {
      const rec = normalizeRecord(obj);
      records.push(rec);
    } catch (e) {
      console.warn(`スキップ: ${e.message} 行=${JSON.stringify(obj)}`);
    }
  }

  console.log(`読み込み: ${records.length} 件（ファイル: ${path.basename(file)}）`);
  if (dryRun) {
    console.log('dry-run のため書き込みは行いません。先頭1件プレビュー:');
    console.dir(records[0], { depth: null });
    await prisma.$disconnect();
    return;
  }

  if (records.length === 0) {
    console.log('書き込み対象レコードがありません。処理を終了します。');
    await prisma.$disconnect();
    return;
  }

  // Deduplicate within this batch by slug / notionPageId
  const seenSlug = new Set();
  const seenNotion = new Set();
  const batch = [];
  for (const rec of records) {
    const s = rec.slug;
    const n = rec.notionPageId;
    if (seenSlug.has(s) || seenNotion.has(n)) {
      console.warn(`バッチ内重複によりスキップ: slug=${s} notionPageId=${n}`);
      continue;
    }
    seenSlug.add(s);
    seenNotion.add(n);
    batch.push(rec);
  }

  // Filter out rows that already exist in DB (by slug or notionPageId) for clearer reporting
  const existing = await prisma.blogPost.findMany({
    where: { OR: [ { slug: { in: batch.map(r => r.slug) } }, { notionPageId: { in: batch.map(r => r.notionPageId) } } ] },
    select: { slug: true, notionPageId: true }
  });
  const existingSlug = new Set(existing.map(e => e.slug));
  const existingNotion = new Set(existing.map(e => e.notionPageId));
  const toCreate = batch.filter(r => !existingSlug.has(r.slug) && !existingNotion.has(r.notionPageId));
  const preSkipped = batch.length - toCreate.length;
  if (preSkipped > 0) {
    console.warn(`既存重複によりスキップ: ${preSkipped} 件（DBに既に存在）`);
  }

  if (toCreate.length === 0) {
    console.log('新規作成対象がありません。処理を終了します。');
    await prisma.$disconnect();
    return;
  }

  const res = await prisma.blogPost.createMany({ data: toCreate, skipDuplicates: true });
  console.log(`作成: ${res.count} 件（重複はスキップ）`);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try { await prisma.$disconnect(); } catch {}
  process.exit(1);
});
