import { useEffect } from "react";

const imgPanda = "/panda.png";

const bulletItems = [
  "Build a customized dashboard using our AI in an instant.",
  "Build a customized dashboard using our AI in an instant.",
  "Build a customized dashboard using our AI in an instant.",
  "Build a customized dashboard using our AI in an instant.",
];

// Gradient without animation — applied to elements that need both fade-in + shimmer
const gradientClip: React.CSSProperties = {
  background: "linear-gradient(90deg, #555 0%, #1a1a1a 20%, #999 40%, #e0e0e0 50%, #999 60%, #1a1a1a 80%, #555 100%)",
  backgroundSize: "300% 100%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

interface BuildingAccountProps {
  onComplete: () => void;
}

export function BuildingAccount({ onComplete }: BuildingAccountProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden"
      style={{ background: "white" }}
    >
      <style>{`
        @keyframes shimmer {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1); }
        }
        .float-panda { animation: floatY 3.5s ease-in-out infinite; }
        .dot-pulse   { animation: dotPulse 1.4s ease-in-out infinite both; }
      `}</style>

      <div className="flex flex-col gap-12 items-start justify-center" style={{ width: 800 }}>
        {/* Header — fades in */}
        <div
          className="flex flex-col gap-6 items-start w-full text-[#0a0a0a]"
          style={{ animation: "fadeSlideIn 0.5s ease 0ms both" }}
        >
          <h1 className="font-bold whitespace-nowrap flex-shrink-0" style={{ fontSize: 36, lineHeight: "40px" }}>
            Building account
          </h1>
          <p className="text-base text-[#0a0a0a] leading-6">
            Visualize track and manage your events. Module has forms for requests. You can add an additional line right here.
          </p>
        </div>

        {/* Body */}
        <div className="flex gap-[54px] items-center w-full flex-shrink-0">
          <div className="flex flex-1 flex-col gap-[10px] items-start min-w-0">
            {/* "Creating collections" — fades in then shimmers */}
            <div
              className="flex items-center gap-2 flex-shrink-0"
              style={{ animation: "fadeSlideIn 0.5s ease 150ms both" }}
            >
              <p
                className="font-normal text-base leading-6"
                style={{ ...gradientClip, animation: "fadeSlideIn 0.5s ease 150ms both, shimmer 2.4s 650ms linear infinite" }}
              >
                Creating collections
              </p>
              <div className="flex items-center gap-1 mb-0.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="dot-pulse inline-block rounded-full bg-[#6e6e6e]"
                    style={{ width: 5, height: 5, animationDelay: `${i * 160}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Bullet list — each item fades in then shimmers */}
            <ul className="block text-base leading-6 list-disc flex-shrink-0" style={{ width: 416 }}>
              {bulletItems.map((item, i) => {
                const fadeDelay = 250 + i * 100;
                const shimmerStart = fadeDelay + 500;
                return (
                  <li
                    key={i}
                    className="mb-0 ms-6"
                    style={{
                      ...gradientClip,
                      animation: `fadeSlideIn 0.5s ease ${fadeDelay}ms both, shimmer 2.4s ${shimmerStart}ms linear infinite`,
                    }}
                  >
                    <span className="leading-6">{item}</span>
                  </li>
                );
              })}
            </ul>

            {/* Footer note */}
            <p
              className="text-base leading-6 flex-shrink-0"
              style={{ color: "#737373", width: 359, animation: "fadeSlideIn 0.5s ease 700ms both" }}
            >
              Building the account might take a few minutes. Please leave this window open.
            </p>
          </div>

          {/* Panda — floats */}
          <div className="relative flex-shrink-0 float-panda" style={{ width: 292, height: 251 }}>
            <div className="absolute inset-0 overflow-hidden">
              <img
                alt="Panda"
                className="absolute max-w-none h-full"
                style={{ left: "-5.69%", top: 0, width: "110.41%" }}
                src={imgPanda}
              />
            </div>
            <div className="absolute inset-0 mix-blend-color" style={{ background: "rgba(52, 39, 53, 0.76)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
