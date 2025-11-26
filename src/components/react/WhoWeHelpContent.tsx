import clsx from "clsx";
import React from "react";

interface Feature {
  number: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface WhoWeHelpContentProps {
  features: Feature[];
  tagline: string;
  exploreButton: string;
}

const FeatureSection = ({
  feature,
  tagline,
  exploreButton,
}: {
  feature: Feature;
  tagline: string;
  exploreButton: string;
}) => {
  const featureId = `feature-${feature.number.toLowerCase()}`;

  return (
    <div className="px-[5%]">
      <div className="mx-auto max-w-[1280px]">
        <a
          href={`#${featureId}`}
          className="flex h-16 w-full items-center text-[#06020a] underline"
        >
          <span className="mr-5 font-semibold md:mr-6 md:text-xl">{feature.number}</span>
          <h3 className="font-semibold md:text-xl">{feature.tag}</h3>
        </a>
        <div className="py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
            <div>
              <p className="mb-3 font-semibold text-[#06020a] md:mb-4">{tagline}</p>
              <h2 className="font-sora mb-5 text-[44px] leading-[1.2] font-semibold tracking-[-0.44px] text-[#06020a] md:mb-6 md:text-[60px] md:tracking-[-0.6px] lg:text-[60px]">
                {feature.title}
              </h2>
              <p className="text-base leading-[1.5] text-[#06020a] md:text-xl">
                {feature.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <a
                  href={`#${featureId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(6,2,10,0.15)] px-6 py-3 text-sm font-medium text-[#06020a] transition-colors hover:bg-black/5"
                  aria-label={`${exploreButton} ${feature.title}`}
                >
                  {exploreButton}
                </a>
                <a
                  href={`#${featureId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium text-[#06020a] transition-colors hover:opacity-70 lg:text-base"
                  aria-label={`${exploreButton} ${feature.title}`}
                >
                  {exploreButton}
                  <svg
                    className="size-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.17188 17.9998L15.1719 11.9998L9.17188 5.99976"
                      stroke="#06020a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src={feature.image}
                className="h-[25rem] w-full rounded-lg object-cover sm:h-[30rem] lg:h-[60vh]"
                alt={feature.imageAlt}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WhoWeHelpContent({
  features,
  tagline,
  exploreButton,
}: WhoWeHelpContentProps) {
  return (
    <section className="bg-[#ced8e0]" aria-label="Who we help">
      <div className="sticky top-0">
        {features.map((feature, index) => {
          const featureId = `feature-${feature.number.toLowerCase()}`;
          return (
            <React.Fragment key={feature.number}>
              <div className="relative -top-32 h-0" id={featureId} />
              <div
                className={clsx(
                  "relative border-t border-[rgba(6,2,10,0.15)] bg-[#ced8e0] pb-8 md:pb-14 lg:sticky lg:pb-0",
                  { "top-0 lg:mb-48": index === 0 },
                  { "lg:top-16 lg:-mt-32 lg:mb-32": index === 1 },
                  { "lg:top-32 lg:-mt-16 lg:mb-16": index === 2 },
                  { "lg:top-0 lg:mb-16": index === 3 }
                )}
              >
                <FeatureSection feature={feature} tagline={tagline} exploreButton={exploreButton} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
