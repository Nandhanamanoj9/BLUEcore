import React, { useState } from 'react';
import ShowcaseRow from './ShowcaseRow';
import TechnicalSpecsModal from './common/TechnicalSpecsModal';
import { SHOWCASE } from '../data/siteData';
import AnimatedHeading from './common/AnimatedHeading';
import { useSiteImages } from '../context/SiteImagesContext';

const SHOWCASE_SLOT_MAP = [
  'showcase_wall_panels',
  'showcase_door_design',
  'showcase_ceiling_design'
];

export function Showcase() {
  const [selectedSpecItem, setSelectedSpecItem] = useState(null);
  const { getSlotImage } = useSiteImages();

  const dynamicShowcase = SHOWCASE.map((item, index) => {
    const slotId = SHOWCASE_SLOT_MAP[index];
    const dynamicImage = slotId ? getSlotImage(slotId, item.image) : item.image;
    return {
      ...item,
      image: dynamicImage
    };
  });

  return (
    <section id="showcase">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="label">In Detail</p>
          <AnimatedHeading as="h2">Signature Applications</AnimatedHeading>
        </div>
        <div id="showcaseRows">
          {dynamicShowcase.map((item, index) => (
            <ShowcaseRow
              key={index}
              item={item}
              index={index}
              onOpenSpecs={setSelectedSpecItem}
            />
          ))}
        </div>
      </div>

      <TechnicalSpecsModal
        item={selectedSpecItem}
        onClose={() => setSelectedSpecItem(null)}
      />
    </section>
  );
}

export default Showcase;
