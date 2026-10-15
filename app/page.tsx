import DesignFrame from '../components/DesignFrame';
import MobilePage from '../components/MobilePage';
import MobileClosing from '../components/MobileClosing';
import Hero from '../components/design/26-2432';
import Manifesto from '../components/manifesto/Manifesto';
import ResearchCover from '../components/design/26-2335';
import ResearchField from '../components/ResearchField';
import ClaimOne from '../components/design/26-1160';
import ClaimTwo from '../components/design/26-1636';
import ClaimThree from '../components/design/26-1924';
import Craft from '../components/design/26-521';
import PostDissection from '../components/dissection/PostDissection';
import Proof from '../components/design/26-646';
import Statistics from '../components/design/26-571';
import Footer from '../components/design/26-2450';

export default function Home() {
  return (
    <main className="landing-page">
      <h1 className="sr-only">Identity Labs — The world’s first content science lab.</h1>
      <div className="desktop-layout">
        <DesignFrame height={800} label="The world’s first content science lab" id="introduction" className="paper"><Hero /></DesignFrame>
        <Manifesto />
        <DesignFrame height={800} label="The science of viral posts" id="research-cover" className=""><ResearchCover /></DesignFrame>
        <div className="research-sequence">
          <ResearchField />
        <DesignFrame height={4314} label="Claim 1: Virality is not luck, it is engineering" id="science" className="paper"><ClaimOne /></DesignFrame>
        <DesignFrame height={3808} label="Claim 2: Depth, quality, and impact are measurable" id="depth" className="paper"><ClaimTwo /></DesignFrame>
        <DesignFrame height={3076} label="Claim 3: Audience is built as a compounding function" id="audience" className="paper"><ClaimThree /></DesignFrame>
        </div>
        <DesignFrame height={1294} label="The craft of creation" id="craft" className="paper"><Craft /></DesignFrame>
        <PostDissection />
        <DesignFrame height={800} label="Our writers are followed by the people you are trying to reach" id="proof" className="paper"><Proof /></DesignFrame>
        <DesignFrame height={800} label="Four years of proof, measured" id="results" className="paper"><Statistics /></DesignFrame>
        <DesignFrame height={1445} label="Become impossible to ignore" id="company" className=""><Footer /></DesignFrame>
      </div>
      <div className="mobile-layout">
        <DesignFrame width={390} height={10184} label="Identity Labs — mobile landing page"><MobilePage /></DesignFrame>
        <MobileClosing />
      </div>
    </main>
  );
}
