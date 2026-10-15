"""Compose the selected desktop sequence and the supplied mobile layout."""
import pathlib,json,re

ROOT=pathlib.Path(__file__).resolve().parents[1]
desktop=[
 ('26-2432','Hero',800,'The world’s first content science lab','introduction'),
 ('26-470','ManifestoOne',800,'Manifesto: attention and audience','manifesto'),
 ('26-482','ManifestoTwo',800,'Manifesto: virality can be engineered','manifesto-two'),
 ('26-497','ManifestoThree',800,'Manifesto: ideas shape the world','manifesto-three'),
 ('26-2335','ResearchCover',800,'The science of viral posts','research-cover'),
 ('26-1160','ClaimOne',4314,'Claim 1: Virality is not luck, it is engineering','science'),
 ('26-1636','ClaimTwo',4314,'Claim 2: Depth, quality, and impact are measurable','depth'),
 ('26-1924','ClaimThree',3076,'Claim 3: Audience is built as a compounding function','audience'),
 ('26-521','Craft',1294,'The craft of creation','craft'),
 ('26-549','Post',800,'One post, dissected','dissection'),
 ('26-601','PostAnnotations',800,'The anatomy of a post','post-annotations'),
 ('26-646','Proof',800,'Our writers are followed by the people you are trying to reach','proof'),
 ('26-571','Statistics',800,'Four years of proof, measured','results'),
 ('26-2450','Footer',1445,'Become impossible to ignore','company'),
]
imports="import DesignFrame from '../components/DesignFrame';\nimport MobilePage from '../components/MobilePage';\nimport MobileClosing from '../components/MobileClosing';\n"
imports+='\n'.join(f"import {name} from '../components/design/{key}';" for key,name,*_ in desktop)
parts=[]
for key,name,height,label,id in desktop:
 paper='' if key in ['26-2335','26-2450'] else 'paper'
 parts.append(f'        <DesignFrame height={{{height}}} label="{label}" id="{id}" className="{paper}"><{name} /></DesignFrame>')
page=imports+'''\n\nexport default function Home() {
  return (
    <main className="landing-page">
      <h1 className="sr-only">Identity Labs — The world’s first content science lab.</h1>
      <div className="desktop-layout">
'''+ '\n'.join(parts)+'''
      </div>
      <div className="mobile-layout">
        <DesignFrame width={390} height={10184} label="Identity Labs — mobile landing page"><MobilePage /></DesignFrame>
        <MobileClosing />
      </div>
    </main>
  );
}
'''
(ROOT/'app/page.tsx').write_text(page)

children=json.loads((ROOT/'design-context/mobile-children.json').read_text())
imports="import Texture from './design/26-6413';\nimport Spiral from './design/26-6428';\nimport Construction from './design/26-6436';\n"
fragments=[]
for child in children:
 key=child['id'].replace(':','-');path=ROOT/'components/design'/f'{key}.tsx'
 if not path.exists():continue
 name='Mobile'+key.replace('-','_')
 imports+=f"import {name} from './design/{key}';\n"
 source=path.read_text()
 rootclass=re.search('className="([^"]+)"',source).group(1)
 css=(ROOT/'app/design.css').read_text()
 rule=re.search(r'\.'+rootclass+r'\{([^}]+)',css).group(1)
 if 'display:contents' in rule:
  fragments.append(f'        <{name} />')
 else:
  fragments.append(f'        <div className="mobile-fragment" style={{{{left:{child["x"]},top:{child["y"]},width:{child["width"]},height:{child["height"]}}}}}><{name} /></div>')
mobile=imports+'''
export default function MobilePage() {
  return (
    <div className="mobile-page">
      <div className="mobile-introduction"><Texture /></div>
      <div className="mobile-research">
'''+ '\n'.join(fragments)+'''
      </div>
      <div className="mobile-spiral"><Spiral /></div>
      <div className="mobile-cover"><Construction /></div>
      <p className="mobile-wordmark">Identity<em>Labs</em></p>
      <p className="mobile-corner-copy">world’s first<br/>content science firm</p>
    </div>
  );
}
'''
(ROOT/'components/MobilePage.tsx').write_text(mobile)
print('Assembled desktop sections:',len(desktop),'mobile fragments:',len(fragments))
