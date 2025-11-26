import React from "react";

export interface Feature {
  number: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface FeatureSectionProps {
  feature: Feature;
  tagline: string;
}

export default function FeatureSection({ feature, tagline }: FeatureSectionProps) {
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
}
