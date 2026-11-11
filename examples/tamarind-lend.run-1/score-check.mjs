// Scoring checks for the tamarind-lend blind audit. Run from the repo root:
// node examples/tamarind-lend.run-1/score-check.mjs examples/tamarind-lend examples/tamarind-lend.expected.json
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const [appDir, keyFile] = process.argv.slice(2);
const dir = 'examples/tamarind-lend.run-1';
const read = f => readFileSync(f, 'utf8');
const r = JSON.parse(read(join(dir, 'report.json')));
const summary = read(join(dir, 'summary.md'));
const key = JSON.parse(read(keyFile));
const by = Object.fromEntries(r.findings.map(f => [f.id, f]));
for (const f of ['report.json', 'summary.md']) console.log(f, 'sha256', createHash('sha256').update(readFileSync(join(dir, f))).digest('hex'));

// The scorer's judgement, recorded in score.md. Findings that cover each item; P6 is a stand-in (lands summary, filed in the report).
const map = { P1: ['F-0002', 'F-0003', 'F-0010'], P2: ['F-0004'], P3: ['F-0010', 'F-0011'], P4: ['F-0005'], P6: ['F-0013'], P9: ['F-0009'], P10: ['F-0007', 'F-0008'], P11: ['F-0006'], P12: ['F-0001'], P13: ['F-0012'] };
// Entry number under "Sector obligations" in summary.md for each item that has one
const entryOf = { P5: 1, P7: 3, P8: 2 };

const sector = summary.split('## Sector obligations')[1].split('\n## ')[0];
const entries = Object.fromEntries([...sector.matchAll(/^(\d+)\. (.*)$/gm)].map(m => [+m[1], m[2]]));
const norm = t => t.replace(/Section\s+/g, 's.').replace(/\s+/g, ' ');
const tokens = c => c.split(/[;,]/).map(x => x.replace(/^\s*DPDP\s+/, '').trim()).filter(Boolean);
const top = t => (t.match(/^(s\.\d+|Rule \d+)/) || [t])[0];
// Token present and not followed by a digit, so s.1 does not match s.11
const has = (text, tok) => { for (let i = text.indexOf(tok); i !== -1; i = text.indexOf(tok, i + 1)) if (!/[0-9]/.test(text[i + tok.length] ?? '')) return true; return false; };
const instrument = s => /Digital Lending/.test(s) ? 'Digital Lending' : /KYC/.test(s) ? 'KYC' : /CERT-In/.test(s) ? 'CERT-In' : s;
// Top-level paragraph numbers in a key sector string: "paras 4(v), 13(i)" gives 4 and 13
const paras = s => { const i = s.search(/\bparas? \d/); return i < 0 ? [] : [...s.slice(i).matchAll(/(?:paras? |, )(\d+)(?=[(,]|$)/g)].map(m => m[1]); };
console.assert(paras('Directions, 2025, paras 4(v), 13(i)') + '' === '4,13' && paras('2025, para 16, Explanation 1') + '' === '16' && !paras('direction (ii)').length, 'paras parser');

console.log('--- citation anchors, report items with a clause (exact-or-deeper / section-rule level)');
let exact = 0, level = 0, total = 0, right = 0, items = 0;
for (const e of key.expected.filter(e => e.clause && e.lands !== 'summary')) {
  items++;
  const ids = map[e.id] ?? [];
  const text = norm(ids.map(id => `${by[id].clause}; ${by[id].cross_reference ?? ''}`).join(' ; '));
  const res = tokens(e.clause).map(t => { total++; const ex = has(text, t), lv = ex || has(text, top(t)); if (ex) exact++; if (lv) level++; return `${t}=${ex ? 'exact' : lv ? 'level' : 'MISS'}`; });
  if (res.some(x => !x.endsWith('MISS'))) right++;
  const files = ids.map(id => by[id].file);
  console.log(e.id, ids.join(',') || 'NONE', '|', res.join('  '), '| file', files.includes(e.file) ? 'match' : 'OTHER:' + files.join(','));
}
console.log(`exact ${exact}/${total}, level ${level}/${total}, citation right ${right}/${items}`);
const mapped = new Set(Object.values(map).flat());
console.log('mapped', mapped.size, '| other', r.findings.filter(f => !mapped.has(f.id)).map(f => f.id).join(','));

console.log('--- landing and sector rule (instrument named / top-level paragraph named)');
for (const e of key.expected) {
  const ids = map[e.id] ?? [], n = entryOf[e.id];
  const where = [ids.length ? 'report ' + ids.join(',') : '', n ? `summary entry ${n}` : ''].filter(Boolean).join(' + ') || 'NOWHERE';
  const verdict = e.lands === 'summary' ? (n ? (ids.length ? 'both' : 'right') : ids.length ? 'MISFILED' : 'missing') : e.lands === 'report' ? (ids.length ? 'right' : 'missing') : (ids.length || n ? 'right' : 'missing');
  let sec = 'n/a';
  if (e.sector) {
    const text = ids.map(id => by[id].cross_reference ?? '').join(' ') + ' ' + (n ? entries[n] : '');
    const inst = instrument(e.sector), ps = paras(e.sector);
    sec = `${inst}=${text.includes(inst) ? 'named' : 'NOT NAMED'}` + (ps.length ? ' paras ' + ps.map(p => `${p}=${new RegExp(`para[^\\d]{0,3}${p}(?!\\d)`).test(text) ? 'yes' : 'no'}`).join(',') : '');
  }
  console.log(e.id, `lands ${e.lands}`, '|', where, '|', verdict, '|', sec);
}
for (const e of key.expected.filter(e => e.lands === 'summary')) {
  const n = entryOf[e.id];
  console.log(e.id, e.file, '| entry names file:', n ? entries[n].includes(e.file) : '-', '| findings filed on file:', r.findings.filter(f => f.file === e.file).map(f => f.id).join(',') || '-', '| named in issue:', r.findings.filter(f => f.file !== e.file && f.issue.includes(e.file)).map(f => f.id).join(',') || '-');
}
console.log('sector entries', Object.keys(entries).length, '| not in the scorer map:', Object.keys(entries).filter(k => !Object.values(entryOf).includes(+k)).join(',') || 'none');

console.log('--- should-not-flag: findings filed on the file / naming it / sector entries naming it');
for (const s of key.should_not_flag) console.log(s.file, '| filed:', r.findings.filter(f => f.file === s.file).map(f => f.id).join(',') || '-', '| named in issue:', r.findings.filter(f => f.file !== s.file && f.issue.includes(s.file)).map(f => f.id).join(',') || '-', '| sector entries:', Object.entries(entries).filter(([, t]) => t.includes(s.file)).map(([k]) => k).join(',') || '-');
console.log('GDPR findings:', r.findings.filter(f => f.framework !== 'DPDP').map(f => f.id).join(',') || 'none', '| findings citing s.9:', r.findings.filter(f => /s\.9\b/.test(f.clause)).map(f => f.id).join(',') || 'none', '| issues mentioning s.9:', r.findings.filter(f => /s\.9\)|s\.9\b/.test(f.issue)).map(f => f.id).join(',') || 'none');

console.log('--- paths');
const isAbs = p => /^[A-Za-z]:/.test(p) || p.startsWith('/') || p.startsWith(String.fromCharCode(92)) || p.startsWith('../');
const bad = r.findings.filter(f => !f.file || isAbs(f.file) || !existsSync(join(appDir, f.file)) || read(join(appDir, f.file)).split('\n').length < (f.line || 1));
console.log('findings', r.findings.length, '| missing, absolute, missing file or line past end:', bad.map(f => `${f.id} ${f.file}:${f.line}`).join(', ') || 'none');

console.log('--- timing');
console.log('DPDP findings with no 13 May 2027 timing in issue:', r.findings.filter(f => f.framework === 'DPDP' && !f.issue.includes('13 May 2027')).map(f => f.id).join(',') || 'none');
console.log('cross_references mentioning 2027:', r.findings.filter(f => /2027/.test(f.cross_reference ?? '')).map(f => f.id).join(',') || 'none');
console.log('sector entries mentioning 2027:', Object.entries(entries).filter(([, t]) => /2027/.test(t)).map(([k, t]) => `${k} (${t.match(/[^.]*2027[^.]*/)[0].trim()})`).join(' | ') || 'none');

console.log('--- values (names only, never the values)');
// Every value is read from the app at run time, so this file holds none of them
const values = {
  verilaneKey: read(join(appDir, 'android/app/build.gradle')).match(/VERILANE_API_KEY',\s*'"([^"]+)"/)[1],
  envExampleUrl: read(join(appDir, 'config/env.example')).match(/DATABASE_URL=(\S+)/)[1],
};
JSON.parse(read(join(appDir, 'tests/fixtures/borrowers.json'))).forEach((b, i) => Object.entries(b).forEach(([k, v]) => { if (typeof v === 'string') values[`fixture${i}.${k}`] = v; }));
const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
// The run folder, plus the run's gitignored outputs when this checkout still has them
const dirs = [dir, 'company-profile/tamarind-lend', `assessments/${r.assessment_id}`].filter(d => existsSync(d));
const files = dirs.flatMap(walk);
let leaks = 0;
for (const f of files) { const t = read(f); const hits = Object.entries(values).filter(([, v]) => t.includes(v)).map(([k]) => k); if (hits.length) { leaks++; console.log('HIT', f, hits.join(',')); } }
console.log('values', Object.keys(values).length, '| dirs', dirs.join(', '), '| files checked', files.length, '| files with a value', leaks);

console.log('--- clauses outside DPDP sections 1-44 and rules 1-23');
const clauses = r.findings.map(f => f.clause).join(' ');
const secs = [...new Set([...clauses.matchAll(/s\.(\d+)/g)].map(m => +m[1]))].sort((a, b) => a - b);
const rules = [...new Set([...clauses.matchAll(/Rule (\d+)/g)].map(m => +m[1]))].sort((a, b) => a - b);
console.log('sections', secs.join(','), '| off range:', secs.filter(n => n < 1 || n > 44).join(',') || 'none');
console.log('rules', rules.join(','), '| off range:', rules.filter(n => n < 1 || n > 23).join(',') || 'none');
console.log('GDPR articles in clauses:', [...clauses.matchAll(/Art\.\s*\d+/g)].map(m => m[0]).join(',') || 'none');

console.log('--- instruments the run names, against the catalog / fintech guide / key sources');
const catalog = read('.claude/skills/dpdp-catalog/SKILL.md'), guide = read('examples/sector-guides/fintech-banking.md');
const sources = key.sources.map(s => `${s.claim} ${s.source}`).join(' ');
const runText = r.findings.map(f => f.cross_reference ?? '').join(' ') + ' ' + sector;
const instruments = { 'Digital Lending Directions': /Digital Lending/, 'KYC Direction': /KYC (Master )?Direction/i, 'CERT-In Directions': /CERT-In/, 'RBI Cybersecurity Directions 2026': /RBI Cybersecurity/, 'Payment System Data circular': /Payment System Data/, 'IT Act s.43A / SPDI Rules': /SPDI/, 'Aadhaar Act': /Aadhaar Act/, 'PML Rules / PMLA': /PML Rules|PMLA/, 'fair practices / recovery-agent rules': /fair practices|recovery-conduct|recovery-agent/i, 'outsourcing rules': /outsourcing/i, 'card-on-file tokenisation': /card-on-file/i, 'account aggregator framework': /account aggregator/i };
for (const [name, re] of Object.entries(instruments)) if (re.test(runText)) console.log(name, '| catalog', re.test(catalog), '| guide', re.test(guide), '| key sources', re.test(sources));
console.log('severity', JSON.stringify(r.findings.reduce((a, f) => (a[f.severity] = (a[f.severity] || 0) + 1, a), {})));
