import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
  index,
}: {
  feature: Feature;
  tagline: string;
  exploreButton: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <article
      ref={ref}
      className="w-full border-t border-[rgba(6,2,10,0.15)]"
      data-feature-index={index}
    >
      <motion.div
        className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-5 pb-16 lg:gap-20 lg:px-16 lg:pb-28"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Info Header */}
        <motion.div
          className="flex h-16 items-center gap-5 text-base leading-[1.5] font-semibold text-[#06020a] lg:gap-6 lg:text-xl"
          variants={itemVariants}
        >
          <span className="shrink-0">{feature.number}</span>
          <span className="shrink-0">{feature.tag}</span>
        </motion.div>

        {/* Content: Stacked on mobile, horizontal on desktop */}
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
          {/* Text Content */}
          <div className="flex w-full flex-col gap-6 lg:flex-1 lg:gap-8">
            {/* Title and Description */}
            <div className="flex flex-col gap-3 lg:gap-4">
              <motion.div className="flex items-center" variants={itemVariants}>
                <span className="text-base leading-[1.5] font-semibold text-[#06020a]">
                  {tagline}
                </span>
              </motion.div>

              <motion.div
                className="flex flex-col gap-5 text-[#06020a] lg:gap-6"
                variants={itemVariants}
              >
                <h2 className="font-sora text-[44px] leading-[1.2] font-semibold tracking-[-0.44px] lg:text-[60px] lg:tracking-[-0.6px]">
                  {feature.title}
                </h2>
                <p className="text-base leading-[1.5] font-normal lg:text-xl">
                  {feature.description}
                </p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div className="flex items-center gap-6" variants={itemVariants}>
              {/* Primary Button with border */}
              <a
                href="#explore"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(6,2,10,0.15)] px-3 py-1.5 text-sm font-medium text-[#06020a] transition-colors hover:bg-black/5"
                aria-label={`${exploreButton} ${feature.title}`}
              >
                {exploreButton}
              </a>

              {/* Secondary Button with icon */}
              <a
                href="#explore"
                className="inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium text-[#06020a] transition-colors hover:opacity-70 lg:text-lg"
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
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            className="relative aspect-square w-full overflow-hidden rounded-lg lg:size-[600px] lg:shrink-0"
            variants={itemVariants}
          >
            <img
              src={feature.image}
              alt={feature.imageAlt}
              className="size-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </motion.div>
    </article>
  );
};

export default function WhoWeHelpContent({
  features,
  tagline,
  exploreButton,
}: WhoWeHelpContentProps) {
  return (
    <section className="flex w-full flex-col items-center bg-[#ced8e0]" aria-label="Who we help">
      {features.map((feature, index) => (
        <FeatureSection
          key={feature.number}
          feature={feature}
          tagline={tagline}
          exploreButton={exploreButton}
          index={index}
        />
      ))}
    </section>
  );
}
