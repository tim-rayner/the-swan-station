import { Hieroglphic } from "../../../types/countdown-enums";

export default function Glyph({ hieroglyph }: { hieroglyph: Hieroglphic }) {
  switch (hieroglyph) {
    case Hieroglphic.REED_LEAF:
      return <div className="icon glyph1"></div>;
    case Hieroglphic.CURLED_STAFF:
      return <div className="icon glyph2"></div>;
    case Hieroglphic.FEATHER:
      return <div className="icon glyph3"></div>;
    case Hieroglphic.VULTURE:
      return <div className="icon glyph4">𓄿</div>;
    case Hieroglphic.ARM:
      return <div className="icon glyph5"></div>;
    default:
      return null;
  }
}
