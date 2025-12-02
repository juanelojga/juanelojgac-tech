import clsx from "clsx";
import React from "react";

import FeatureSection, { type Feature } from "./FeatureSection";

interface WhoWeHelpContentProps {
  features: Feature[];
  tagline: string;
}

export default function WhoWeHelpContent({ features, tagline }: WhoWeHelpContentProps) {
  return (
    <section
      className="bg-[#ced8e0]"
      aria-label="Who we help"
      id="who-we-help"
      data-testid="who-we-help"
    >
      <div className="sticky top-0">
        {features.map((feature, index) => {
          const featureId = `feature-${feature.number.toLowerCase()}`;
          return (
            <React.Fragment key={feature.number}>
              <div className="relative -top-32 h-0" id={featureId} />
              <div
                className={clsx(
                  "relative border-t border-[rgba(6,2,10,0.15)] bg-[#ced8e0] pb-8 md:pb-14 lg:sticky lg:pb-0",
                  { "top-0 lg:top-20 lg:mb-48": index === 0 },
                  { "lg:top-40 lg:-mt-32 lg:mb-32": index === 1 },
                  { "lg:top-60 lg:-mt-16 lg:mb-16": index === 2 },
                  { "lg:top-0": index === 3 }
                )}
              >
                <FeatureSection feature={feature} tagline={tagline} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
