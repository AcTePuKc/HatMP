#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { check } = require('./l10n-checker');
const root = path.resolve(__dirname, '..');
const escape = value => (value !== null && typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? '')).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderReport(report) {
    const rows = report.issues.map(issue => `<article data-severity="${escape(issue.severity)}" data-locale="${escape(issue.locale)}">
<div class="row"><b class="${escape(issue.severity)}">${escape(issue.severity.toUpperCase())}</b><span>${escape(issue.locale)} · ${escape(issue.type)}</span></div>
<h3>${escape(issue.key || '(file)')}</h3><p>${escape(issue.message)}</p>
<p class="location">${escape(path.relative(report.root, issue.file))}:${issue.line}</p>
${issue.value !== undefined || issue.source !== undefined ? `<details><summary>Compare source and translation</summary><div class="comparison"><section><h4>English / source</h4><pre>${escape(issue.source ?? 'Dynamic or unavailable — inspect the source file and game.')}</pre><small>${escape(issue.referenceFile ? path.relative(report.root, issue.referenceFile) + ':' + issue.referenceLine : '')}</small></section><section><h4>Translation</h4><pre>${escape(issue.value ?? '(missing)')}</pre></section></div></details>` : ''}</article>`).join('\n');
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>HatMP translation check</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#11151d;color:#e7edf7;font:16px/1.5 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:28px}h1{margin:0}h2{font-size:1.2rem}h3{font-size:1rem;overflow-wrap:anywhere;margin:8px 0}h4{margin:0 0 8px}.muted,.location,small{color:#aebbd0}.stats{display:flex;gap:18px;flex-wrap:wrap;margin:20px 0}.error{color:#ff9f9f}.warning{color:#f3ce80}.info{color:#91c9ef}table{border-collapse:collapse;width:100%;margin-bottom:20px}th,td{text-align:left;padding:7px;border-bottom:1px solid #344055}.filters{position:sticky;top:0;z-index:1;background:#11151df5;padding:14px 0;display:flex;gap:12px;flex-wrap:wrap}input,select{font:inherit;padding:8px;border:1px solid #52617c;border-radius:5px;background:#202938;color:inherit}input{flex:1;min-width:180px}article{background:#1b2432;border:1px solid #344055;border-radius:8px;padding:18px;margin:14px 0}article[hidden]{display:none}.row{display:flex;gap:18px}.location{font:14px monospace;overflow-wrap:anywhere}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:18px;padding-top:14px}pre{white-space:pre-wrap;overflow-wrap:anywhere;margin:0;font:14px/1.6 monospace}summary{cursor:pointer;color:#9fd5fa}.note{padding:14px;background:#202938;border-radius:6px}@media(max-width:650px){.comparison{grid-template-columns:1fr}main{padding:16px}table{font-size:13px}}
</style></head><body><main><h1>HatMP translation check</h1><p class="muted">Generated ${escape(report.generatedAt)} · Read-only analysis · ${escape(report.options.prefix ? 'Key prefix: ' + report.options.prefix : 'All catalog keys')}</p>
<div class="stats"><b class="error">${report.counts.error} errors</b><b class="warning">${report.counts.warning} review items</b><b class="info">${report.counts.info} unverified/source notes</b></div>
<p class="note">Errors identify likely breakages. Missing translations use the game's English fallback. Source-only missing keys are included by default, even when they have not been added to the English catalog. Unverified means the checker cannot establish a reliable source reference; it does not mean the key is wrong. This tool does not judge translation quality or visual fit.</p>
<table><thead><tr><th>Language</th><th>Catalog keys</th><th>Missing</th><th>Source keys scanned</th><th>Source keys missing</th><th>Text compared</th><th>Dynamic checks</th><th>Unverified</th></tr></thead><tbody>${report.summaries.map(s => `<tr><td>${escape(s.locale)}</td><td>${s.keys}</td><td>${s.missing}</td><td>${s.sourceKeys ?? 0}</td><td>${s.sourceMissing ?? 0}</td><td>${s.compared}</td><td>${s.dynamic}</td><td>${s.noReference}</td></tr>`).join('')}</tbody></table>
${report.summaries.some(s => Object.keys(s.missingByScope || {}).length) ? `<h2>Missing source keys by room or scope</h2><table><thead><tr><th>Language</th><th>Room / scope</th><th>Missing source keys</th></tr></thead><tbody>${report.summaries.flatMap(s => Object.entries(s.missingByScope || {}).map(([scope, count]) => `<tr><td>${escape(s.locale)}</td><td>${escape(scope)}</td><td>${count}</td></tr>`)).join('')}</tbody></table>` : ''}
<div class="filters"><input id="search" type="search" aria-label="Search keys, messages and text" placeholder="Search a key, message, or text…"><select id="severity" aria-label="Severity"><option value="actionable">Errors and review items</option><option value="all">Everything</option><option value="error">Errors only</option><option value="warning">Review only</option><option value="info">Unverified/source notes</option></select><select id="locale" aria-label="Language"><option value="all">All languages</option>${[...new Set(report.issues.map(i => i.locale))].map(l => `<option value="${escape(l)}">${escape(l)}</option>`).join('')}</select></div><p id="visible" role="status"></p>${rows}<p id="empty" hidden>No matching issues.</p>
<script>
const entries = Array.from(document.querySelectorAll('article')).map(node => ({node, text:node.textContent.toLocaleLowerCase()}));
function filter(){const query=document.getElementById('search').value.toLocaleLowerCase(), severity=document.getElementById('severity').value, locale=document.getElementById('locale').value;let count=0;entries.forEach(({node,text})=>{const level=node.dataset.severity;node.hidden=!((severity==='all'||severity==='actionable'&&level!=='info'||level===severity)&&(locale==='all'||node.dataset.locale===locale)&&text.includes(query));if(!node.hidden)count++;});document.getElementById('visible').textContent=count+' of '+entries.length+' issues shown';document.getElementById('empty').hidden=count!==0;}
['search','severity','locale'].forEach(id=>document.getElementById(id).addEventListener('input',filter));filter();
</script></main></body></html>`;
}

function main(args) {
    const options = {};
    let output = path.join(__dirname, 'reports', 'l10n-report');
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--help') {
            console.log('Usage: npm run l10n --prefix tools -- [--locale bg,es] [--prefix room.13.] [--catalog-only] [--out path/basename]\nWrites an offline HTML report and JSON. Exit 1 = likely breakages; exit 0 = no errors (review items may remain).\nBy default, checks English catalog keys and statically discovered source keys. --catalog-only skips source scanning.');
            return;
        }
        if (arg === '--include-source') options.includeSource = true;
        else if (arg === '--catalog-only') options.includeSource = false;
        else if (['--locale', '--prefix', '--out'].includes(arg)) {
            const value = args[++i];
            if (!value || value.startsWith('--')) throw new Error('Missing value for ' + arg);
            if (arg === '--locale') {
                options.locales = value.split(',');
                if (!options.locales.every(l => /^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(l))) throw new Error('Use locale codes such as bg,es or pt-BR.');
            } else if (arg === '--prefix') options.prefix = value;
            else output = path.resolve(value).replace(/\.(?:html|json)$/i, '');
        } else throw new Error('Unknown option: ' + arg);
    }
    const report = check(root, options);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output + '.json', JSON.stringify(report, null, 2) + '\n');
    fs.writeFileSync(output + '.html', renderReport(report));
    for (const summary of report.summaries) console.log(`${summary.locale}: ${summary.keys} catalog keys; ${summary.sourceKeys ?? 0} source keys scanned; ${summary.missing} missing (${summary.sourceMissing ?? 0} from source); ${summary.compared} source texts compared; ${summary.dynamic} dynamic placeholder checks; ${summary.noReference} unverified.`);
    console.log(`${report.counts.error} errors, ${report.counts.warning} review items, ${report.counts.info} source notes.`);
    for (const issue of report.issues.filter(i => i.severity === 'error').slice(0, 8)) console.log(`${path.relative(root, issue.file)}:${issue.line} [${issue.locale}] ${issue.key}: ${issue.message}`);
    console.log('HTML: ' + output + '.html\nJSON: ' + output + '.json');
    process.exitCode = report.counts.error ? 1 : 0;
}
if (require.main === module) {
    try { main(process.argv.slice(2)); }
    catch (error) { console.error('Translation check failed: ' + error.message); process.exitCode = 2; }
}
module.exports = { renderReport, main };
