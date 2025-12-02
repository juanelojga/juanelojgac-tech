import React, { useState } from "react";

export interface ChallengeTab {
  id: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface ChallengesProps {
  tabs: ChallengeTab[];
  defaultTabId?: string;
}

export default function Challenges({ tabs, defaultTabId }: ChallengesProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id || "tab-1");

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let newIndex = currentIndex;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      newIndex = tabs.length - 1;
    }

    if (newIndex !== currentIndex) {
      setActiveTab(tabs[newIndex].id);
      // Focus the new tab
      setTimeout(() => {
        const newTab = document.querySelector(`[data-tab-id="${tabs[newIndex].id}"]`);
        if (newTab instanceof HTMLElement) {
          newTab.focus();
        }
      }, 0);
    }
  };

  return (
    <section
      id="challenges"
      className="bg-color-scheme-3-background px-[5%] py-16 md:py-24 lg:py-28"
      aria-labelledby="challenges-section"
    >
      <div className="container mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
          {/* Tabs Menu */}
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="col-start-1 col-end-2 row-start-1 row-end-2 grid grid-cols-1 items-center gap-y-10"
            id="challenges-tablist"
          >
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`trigger-${tab.id}`}
                data-tab-id={tab.id}
                onClick={() => handleTabClick(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`text-color-scheme-3-text flex h-[130px] cursor-pointer flex-col items-start justify-center overflow-hidden border-0 border-l-2 px-0 py-0 pl-8 text-left whitespace-normal transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === tab.id ? "border-white" : "border-transparent"
                }`}
              >
                <h3 className="font-sora mb-3 w-full text-2xl leading-[1.3] font-semibold tracking-[-0.4px] md:mb-4 md:text-3xl lg:text-3xl">
                  {tab.heading}
                </h3>
                <p className="md:text-md w-full text-base leading-[1.5]">{tab.description}</p>
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div
            className="relative flex max-h-full w-full items-center justify-center overflow-hidden"
            id="challenges-content"
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                role="tabpanel"
                aria-labelledby={`trigger-${tab.id}`}
                id={`panel-${tab.id}`}
                tabIndex={0}
                data-tab-id={tab.id}
                className={`transition-opacity duration-300 focus-visible:outline-none ${
                  activeTab === tab.id ? "block opacity-100" : "hidden opacity-0"
                }`}
              >
                <img
                  src={tab.image}
                  alt={tab.imageAlt}
                  className="size-full max-w-[600px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
