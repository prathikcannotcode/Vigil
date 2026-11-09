// Scoring checks for the kadamba-fit cold audit. Run from the repo root:
// node examples/kadamba-fit.run-1/score-check.mjs examples/kadamba-fit examples/kadamba-fit.expected.json
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [appDir, keyFile] = process.argv.slice(2);
const dir = 'examples/kadamba-fit.run-1';
const r = JSON.parse(readFileSync(join(dir, 'report.json'), 'utf8'));
const key = JSON.parse(readFileSync(keyFile, 'utf8'));
const by = Object.fromEntries(r.findings.map(f => [f.id, f]));
// Which findings cover which planted issue: the scorer's judgement, recorded in score.md
const map = { P1: ['F-0002'], P2: ['F-0007', 'F-0012'], P3: ['F-0011'], P4: ['F-0010'], P5: ['F-0008'], P6: ['F-0020', 'F-0021', 'F-0022', 'F-0023', 'F-0026'], P7: ['F-0005'], P8: ['F-0017'], P9: ['F-0015'], P10: ['F-0006'], P11: ['F-0004', 'F-0016'], P12: ['F-0024'], P13: ['F-0003'], P14: ['F-0001'], P15: ['F-0027'], P16: ['F-0009'] };

const norm = t => t.replace(/Section\s+/g, 's.').replace(/\s+/g, ' ');
const tokens = c => c.split(/[;,]/).map(x => x.replace(/^\s*(DPDP|GDPR)\s+/, '').trim()).filter(Boolean).map(x => x.startsWith('CERT-In') ? 'CERT-In' : x);
const top = t => (t.match(/^(s\.\d+|Rule \d+|Art\. \d+)/) || [t])[0];
// Token present and not followed by a digit, so s.1 does not match s.11
const has = (text, tok) => { for (let i = text.indexOf(tok); i !== -1; i = text.indexOf(tok, i + 1)) if (!/[0-9]/.test(text[i + tok.length] ?? '')) return true; return false; };

let exact = 0, level = 0, total = 0, sheetRight = 0;
console.log('--- citation anchors (exact-or-deeper / top-level)');
for (const e of key.expected) {
  const text = norm(map[e.id].map(id => `${by[id].clause}; ${by[id].cross_reference ?? ''}`).join(' ; '));
  const res = tokens(e.clause).map(t => { total++; const ex = has(text, t), lv = ex || has(text, top(t)); if (ex) exact++; if (lv) level++; return `${t}=${ex ? 'exact' : lv ? 'level' : 'MISS'}`; });
  if (res.some(x => !x.endsWith('MISS'))) sheetRight++;
  const files = map[e.id].map(id => by[id].file);
  console.log(e.id, map[e.id].join(','), '|', res.join('  '), '| file', files.includes(e.file) ? 'match' : 'OTHER:' + files.join(','));
}
console.log(`exact ${exact}/${total}, top-level ${level}/${total}, run-sheet citation right ${sheetRight}/${key.expected.length}`);
const mapped = new Set(Object.values(map).flat());
console.log('mapped', mapped.size, 'other', r.findings.filter(f => !mapped.has(f.id)).map(f => f.id).join(','));

console.log('--- should-not-flag: findings filed on the file / naming it');
for (const s of key.should_not_flag) console.log(s.file, '| filed:', r.findings.filter(f => f.file === s.file).map(f => f.id).join(',') || '-', '| named in issue:', r.findings.filter(f => f.file !== s.file && f.issue.includes(s.file)).map(f => f.id).join(',') || '-');
console.log('Singapore/ap-southeast-1/backup mentions:', r.findings.filter(f => /Singapore|ap-southeast|backup\.yaml/i.test(f.issue + f.recommendation)).map(f => f.id).join(',') || 'none');

console.log('--- paths');
const isAbs = p => /^[A-Za-z]:/.test(p) || p.startsWith('/') || p.startsWith(String.fromCharCode(92)) || p.startsWith('../');
const bad = r.findings.filter(f => f.file && (isAbs(f.file) || !existsSync(join(appDir, f.file)) || readFileSync(join(appDir, f.file), 'utf8').split('\n').length < (f.line || 1)));
console.log('findings with file', r.findings.filter(f => f.file).length, '| absolute, missing or line past end:', bad.map(f => `${f.id} ${f.file}:${f.line}`).join(', ') || 'none');

console.log('--- commencement: DPDP cited but no 13 May 2027 timing in issue');
console.log(r.findings.filter(f => (f.framework === 'DPDP' || /DPDP|s\.\d|Rule \d/.test(f.cross_reference ?? '')) && !f.issue.includes('13 May 2027')).map(f => f.id).join(',') || 'none');

console.log('--- values (names only, never the values)');
// Every value is read from the app at run time, so this file holds none of them
const encoded = readFileSync(join(appDir, 'deploy/secrets.yaml'), 'utf8').match(/DATABASE_URL: (\S+)/)[1];
const decoded = Buffer.from(encoded, 'base64').toString();
const values = {
  secretEncoded: encoded,
  secretDecoded: decoded,
  secretUserinfo: decoded.split('@')[0].split('//')[1],
  secretHost: decoded.split('@')[1].split(':')[0],
  envExampleUrl: readFileSync(join(appDir, 'config/env.example'), 'utf8').match(/DATABASE_URL=(\S+)/)[1],
};
JSON.parse(readFileSync(join(appDir, 'tests/fixtures/members.json'), 'utf8')).forEach((m, i) => Object.assign(values, { [`fixture${i}.email`]: m.email, [`fixture${i}.phone`]: m.phone, [`fixture${i}.name`]: m.full_name }));
const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(dir).filter(f => !f.endsWith('score-check.mjs') && !f.endsWith('score.md'));
let leaks = 0;
for (const f of files) { const t = readFileSync(f, 'utf8'); const hits = Object.entries(values).filter(([, v]) => t.includes(v)).map(([k]) => k); if (hits.length) { leaks++; console.log('HIT', f, hits.join(',')); } }
console.log('files checked', files.length, '| files with a value', leaks);

console.log('--- clauses outside the catalogs');
const all = r.findings.map(f => `${f.clause} ${f.cross_reference ?? ''}`).join(' ');
const onMap = n => [[1, 10], [12, 22], [24, 26], [28, 28], [30, 30], [32, 39], [44, 49], [77, 84]].some(([a, b]) => n >= a && n <= b);
const arts = [...new Set([...all.matchAll(/Art\.\s*(\d+)/g)].map(m => +m[1]))].sort((a, b) => a - b);
console.log('articles', arts.join(','), '| off map:', arts.filter(a => !onMap(a)).join(',') || 'none');
console.log('other instruments:', [...new Set([...all.matchAll(/(CERT-In[^;,]*|CCPA[^;,]*|RBI[^;,]*|IT Act[^;,]*)/g)].map(m => m[1].trim()))].join(' | ') || 'none');
const sar = JSON.parse(readFileSync(join(dir, 'findings.sarif'), 'utf8'));
const uris = sar.runs[0].results.map(x => x.locations[0].physicalLocation.artifactLocation.uri);
console.log('SARIF results', uris.length, '| absolute uris', uris.filter(isAbs).length);
console.log('severity', JSON.stringify(r.findings.reduce((a, f) => (a[f.severity] = (a[f.severity] || 0) + 1, a), {})));
