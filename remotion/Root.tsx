import { Composition } from 'remotion'
import { SnapSummary, snapSummaryDefaults } from './compositions/SnapSummary'
import { PoetryAnalysisReel, poetryReelDefaults } from './compositions/PoetryAnalysisReel'
import { MathsFormulaReel, mathsReelDefaults } from './compositions/MathsFormulaReel'
import { ProductBriefTeaser, productTeaserDefaults } from './compositions/ProductBriefTeaser'
import { ConceptMapBloom, conceptMapBloomDefaults } from './compositions/ConceptMapBloom'
import { FPS, THIRTY_SECONDS } from './theme'

export const RemotionRoot = () => (
  <>
    <Composition
      id="SnapSummary"
      component={SnapSummary}
      durationInFrames={THIRTY_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={snapSummaryDefaults}
    />
    <Composition
      id="PoetryAnalysisReel"
      component={PoetryAnalysisReel}
      durationInFrames={THIRTY_SECONDS}
      fps={FPS}
      width={1080}
      height={1080}
      defaultProps={poetryReelDefaults}
    />
    <Composition
      id="MathsFormulaReel"
      component={MathsFormulaReel}
      durationInFrames={THIRTY_SECONDS}
      fps={FPS}
      width={1080}
      height={1080}
      defaultProps={mathsReelDefaults}
    />
    <Composition
      id="ProductBriefTeaser"
      component={ProductBriefTeaser}
      durationInFrames={THIRTY_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={productTeaserDefaults}
    />
    <Composition
      id="ConceptMapBloom"
      component={ConceptMapBloom}
      durationInFrames={THIRTY_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={conceptMapBloomDefaults}
    />
  </>
)
