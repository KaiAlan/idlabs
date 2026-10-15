"""Adapt saved Figma reference JSX to local assets and ordinary project CSS.

The fixed geometry belongs to the research figures and composed artwork. Page
sections flow normally; separate mobile geometry comes from the mobile design.
This helper has no runtime or Tailwind dependency.
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'design-context'
COMPONENTS = ROOT / 'components' / 'design'
COMPONENTS.mkdir(parents=True, exist_ok=True)
rules = {}
unhandled = set()
fonts = set()
ACTIVE = {
    '26-2432','26-470','26-482','26-497','26-2335','26-1160',
    '26-1636','26-1924','26-521','26-549','26-601','26-646','26-571','26-2450',
    '26-6413','26-6428','26-6436',
} | {child['id'].replace(':','-') for child in json.loads((SOURCE/'mobile-children.json').read_text())}
ALIAS_PATH = ROOT/'scripts'/'asset-aliases.json'
ALIASES = json.loads(ALIAS_PATH.read_text()) if ALIAS_PATH.exists() else {}

SIMPLE = {
    'relative': 'position:relative', 'absolute': 'position:absolute',
    'contents': 'display:contents', 'block': 'display:block',
    'inline-grid': 'display:inline-grid', 'flex': 'display:flex',
    'flex-col': 'flex-direction:column', 'flex-none': 'flex:none',
    'items-end': 'align-items:flex-end',
    'shrink-0': 'flex-shrink:0', 'items-center': 'align-items:center',
    'items-start': 'align-items:flex-start', 'justify-center': 'justify-content:center',
    'justify-between': 'justify-content:space-between', 'self-stretch': 'align-self:stretch',
    'content-stretch': 'align-content:stretch', 'place-items-start': 'place-items:start',
    'overflow-clip': 'overflow:clip', 'overflow-hidden': 'overflow:hidden',
    'max-w-none': 'max-width:none', 'min-w-full': 'min-width:100%',
    'min-w-px': 'min-width:1px', 'size-full': 'width:100%;height:100%',
    'w-full': 'width:100%', 'h-full': 'height:100%', 'h-0': 'height:0', 'w-0': 'width:0',
    'h-px': 'height:1px', 'left-px': 'left:1px', 'pt-px': 'padding-top:1px',
    'font-normal': 'font-weight:400', 'font-medium': 'font-weight:500',
    'font-bold': 'font-weight:700', 'italic': 'font-style:italic', 'not-italic': 'font-style:normal',
    'uppercase': 'text-transform:uppercase', 'text-right': 'text-align:right',
    'text-center': 'text-align:center', 'text-justify': 'text-align:justify',
    'text-black': 'color:#000', 'bg-white': 'background-color:#fff',
    'whitespace-nowrap': 'white-space:nowrap', 'whitespace-pre': 'white-space:pre',
    'whitespace-pre-wrap': 'white-space:pre-wrap', 'leading-none': 'line-height:1',
    'object-cover': 'object-fit:cover', 'object-bottom': 'object-position:bottom',
    'pointer-events-none': 'pointer-events:none', 'bg-clip-padding': 'background-clip:padding-box',
    'border-solid': 'border-style:solid', 'border-0': 'border-width:0',
    'border': 'border-width:1px', 'border-b': 'border-bottom-width:1px',
    'border-t': 'border-top-width:1px', 'col-1': 'grid-column-start:1',
    'row-1': 'grid-row-start:1', 'mask-alpha': 'mask-mode:alpha',
    'mask-intersect': 'mask-composite:intersect', 'mask-no-clip': 'mask-clip:no-clip',
    'mask-no-repeat': 'mask-repeat:no-repeat',
}

def value(v):
    v=v.replace('_', ' ')
    # CSS math requires whitespace around binary + and -.
    if 'calc(' in v:
        v=re.sub(r'(?<=[%\w)])([+-])(?=[\d.])', r' \1 ',v)
    return v

def compile_classes(tokens):
    props=[]; tx=None;ty=None;rotation=None;scale_y=None
    for token in tokens.split():
        if token in SIMPLE: props.append(SIMPLE[token]);continue
        if token.startswith('mix-blend-'):props.append('mix-blend-mode:'+token[10:]);continue
        if token.startswith('opacity-'):
            props.append('opacity:'+str(float(token[8:])/100));continue
        if token.startswith(('-translate-x-','-translate-y-')):
            axis=token[11];v=token[13:]
            # negative utilities: -translate-x-1/2 / -translate-x-full
            v=token.split('-')[-1];v='-100%' if v=='full' else '-50%'
            if '-x-' in token:tx=v
            else:ty=v
            continue
        if re.fullmatch(r'-?rotate-(?:\d+|\[.+\])', token):
            rotation=token.replace('rotate-','').replace('[','').replace(']','')
            if 'deg' not in rotation:rotation+='deg'
            continue
        if token=='-scale-y-100':scale_y='-1';continue
        if token.startswith('[') and token.endswith(']'):
            props.append(value(token[1:-1]));continue
        m=re.match(r'^(.*?)\[(.*)\]$', token)
        if m:
            prefix,v=m.groups();v=value(v)
            if prefix=='font-':
                descriptor=v.strip("'");family,_,style=descriptor.partition(':');family=family.replace('_',' ')
                fonts.add((family,style));family='Source Serif 4 Variable' if family=='Source Serif 4' else family;props.append(f'font-family:"{family}",serif')
                props.append('font-weight:400')
                if 'Italic' in style:props.append('font-style:italic')
                if 'Medium' in style:props.append('font-weight:500')
                if 'Bold' in style:props.append('font-weight:700')
                continue
            if prefix=='text-':
                props.append(('color:' if v.startswith(('#','rgb')) else 'font-size:')+v);continue
            if prefix=='bg-':props.append('background-color:'+v);continue
            if prefix=='size-':props.extend(['width:'+v,'height:'+v]);continue
            if prefix in ('px-','py-'):
                a,b=('left','right') if prefix=='px-' else ('top','bottom')
                props.extend([f'padding-{a}:{v}',f'padding-{b}:{v}']);continue
            mapping={'w-':'width','h-':'height','left-':'left','right-':'right','top-':'top','bottom-':'bottom','inset-':'inset','leading-':'line-height','tracking-':'letter-spacing','gap-':'gap','rounded-':'border-radius','p-':'padding','pt-':'padding-top','pb-':'padding-bottom','pl-':'padding-left','pr-':'padding-right','ml-':'margin-left','mt-':'margin-top','max-w-':'max-width','grid-cols-':'grid-template-columns','grid-rows-':'grid-template-rows','mask-position-':'mask-position','mask-size-':'mask-size','aspect-':'aspect-ratio','flex-':'flex','shadow-':'box-shadow'}
            if prefix in mapping:props.append(mapping[prefix]+':'+v);continue
            if prefix in ('blur-','drop-shadow-'):
                props.append('filter:'+('blur' if prefix=='blur-' else 'drop-shadow')+'('+v+')');continue
            if prefix.startswith('border-'):
                edge=prefix[len('border-'):-1];edge={'b':'bottom','t':'top','l':'left','r':'right'}.get(edge,'')
                prop='border'+('-'+edge if edge else '')+('-color' if v.startswith(('#','rgb','transparent')) else '-width')
                props.append(prop+':'+v);continue
        m=re.match(r'^(left|right|top|bottom|inset|mb|ml|mt)-(0|full|1/2|1/4|3/4)$',token)
        if m:
            p,v=m.groups();p={'mb':'margin-bottom','ml':'margin-left','mt':'margin-top'}.get(p,p)
            props.append(p+':'+{'0':'0','full':'100%','1/2':'50%','1/4':'25%','3/4':'75%'}[v]);continue
        unhandled.add(token)
    transform=[]
    if tx:transform.append('translateX('+tx+')')
    if ty:transform.append('translateY('+ty+')')
    if rotation:transform.append('rotate('+rotation+')')
    if scale_y:transform.append('scaleY('+scale_y+')')
    if transform:props.append('transform:'+' '.join(transform))
    return ';'.join(props)

def prepare(path):
    section=path.stem
    code=path.read_text()
    name='Design'+('Hero' if section=='hero' else section.replace('-','_'))
    code=re.sub(r'export default function \w+\(',f'export default function {name}(',code)
    if section=='26-2450':
        code=code.replace('{`Become impossible to `}</span>', 'Become impossible</span><br/><span className="font-[\'Instrument_Serif:Regular\'] leading-none not-italic text-[120px]">to </span>')
    if section=='26-2335':
        # Linear burn = invert(plus-lighter(invert(A), invert(B))).
        # This retains the original images and reproduces Figma's compositing.
        code=re.sub(r'(\s*<div className="[^"]+" data-node-id="26:2336")',r'\n      <div data-cover-material>\1',code,count=1)
        code=re.sub(r'(\s*<div className="[^"]+" data-node-id="26:2344")',r'\n      </div>\n      <div data-cover-texture />\1',code,count=1)
    code=re.sub(r'const (\w+) = "https://www\.figma\.com/api/mcp/asset/[^\"]+";',lambda m:f'const {m[1]} = "/assets/{section}-{m[1]}.'+re.search(r'\.(svg|png|jpg|webp)"',m[0]).group(1)+'";',code)
    code=re.sub(r'/assets/([^"\s]+)',lambda m:'/assets/'+ALIASES.get(m[1],m[1]),code)
    svg_names=set(re.findall(r'const (\w+) = "[^"]+\.svg";',code))
    def preserve_svg_dimensions(m):
        tag=m[0]
        src=re.search(r'src=\{(\w+)\}',tag)
        if not src or src[1] not in svg_names:return tag
        return re.sub(r'className="([^"]*)"',lambda c:'className="'+' '.join(t for t in c[1].split() if t not in ('size-full','w-full','h-full'))+'"',tag)
    code=re.sub(r'<img\b[^>]+/>',preserve_svg_dimensions,code)
    count=0
    def class_replace(m):
        nonlocal count
        count+=1
        cname='d'+section.replace('-','_')+'_'+str(count)
        rules[cname]=compile_classes(m[1])
        return 'className="'+cname+'"'
    code=re.sub(r'className="([^\"]*)"',class_replace,code)
    # The root always fills a document-flow section with an explicit aspect ratio.
    # Decorative SVGs use their exported intrinsic geometry, never global image sizing.
    code=re.sub(r'<img ([^>]*?)src=\{(\w+)\}([^>]*?)/>',lambda m:'<img '+m[1]+'src={'+m[2]+'}'+m[3]+' decoding="async" draggable={false} />',code)
    # Whitespace in Figma's JSX is intentional; all body copy remains selectable.
    (COMPONENTS/(section+'.tsx')).write_text('/* Figma '+section+' — local assets, plain CSS. */\n'+code)
    return name

for p in sorted(SOURCE.glob('*.tsx')):
    if p.stem in ACTIVE:prepare(p)
for p in COMPONENTS.glob('*.tsx'):
    if p.stem not in ACTIVE:p.unlink()
css='/* Fixed geometry for original Figma artwork and editorial figures. */\n'
css+='\n'.join('.'+k+'{'+v+'}' for k,v in rules.items())+'\n'
(ROOT/'app'/'design.css').write_text(css)
(SOURCE/'fonts-used.json').write_text(json.dumps(sorted(fonts),indent=2))
print(json.dumps({'components':len(list(COMPONENTS.glob('*.tsx'))),'rules':len(rules),'unhandled':sorted(unhandled)}))
