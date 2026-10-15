"""Deduplicate byte-identical original artwork, preserving every pixel and SVG.

Keep the source-to-local mapping so the authoring helper can be rerun safely.
Assets are never recompressed, traced, or visually altered.
"""
import hashlib
import json
import pathlib
import re

ROOT=pathlib.Path(__file__).resolve().parents[1]
files=sorted((ROOT/'public/assets').iterdir())
source_files=list((ROOT/'app').rglob('*.css'))+list((ROOT/'components').rglob('*.tsx'))
references=set()
for p in source_files:
    references.update(re.findall(r'/assets/([^\s\"\'`)}]+)',p.read_text()))
groups={}
for p in files:
    if p.is_file():groups.setdefault(hashlib.sha256(p.read_bytes()).hexdigest(),[]).append(p)
mapping_path=ROOT/'scripts/asset-aliases.json'
aliases=json.loads(mapping_path.read_text()) if mapping_path.exists() else {}
retained=set()
for group in groups.values():
    used=[p for p in group if p.name in references]
    if not used:continue
    canonical=used[0]
    # Keep the material names readable in CSS.
    for p in used:
        if p.name.startswith(('paper-','footer-')):canonical=p;break
    retained.add(canonical.name)
    for p in group:aliases[p.name]=canonical.name
for p in source_files:
    text=p.read_text()
    text=re.sub(r'/assets/([^\s\"\'`)}]+)',lambda m:'/assets/'+aliases.get(m[1],m[1]),text)
    p.write_text(text)
for p in files:
    if p.name not in retained:p.unlink()
mapping_path.write_text(json.dumps(aliases,indent=2)+'\n')
print(json.dumps({'originalFiles':len(files),'retainedFiles':len(retained),'retainedMB':round(sum(p.stat().st_size for p in (ROOT/'public/assets').iterdir())/1e6,2)}))
