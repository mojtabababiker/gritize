"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";

import Bounded from "@/components/common/Bounded";

gsap.registerPlugin(useGSAP);

const TEXTS = [
  {
    text: "Practice, purpose, proof. All in one place—made for developers by a developer who gets it",
    size: "24px",
    className: "text-base md:text-2xl",
    speed: 4.66, // Speed of animation in seconds (how fast the text slides in)
  },
  {
    text: "We created Gritize to fill a void: a space where developers can train like pros",
    size: "32px",
    className: "text-xl sm:text-2xl lg:text-4xl",
    speed: 4.8,
  },
  {
    text: "Practice, purpose, proof. All in one place—made for developers by a developer who gets it",
    size: "24px",
    className: "text-xl md:text-2xl",
    speed: 4.82,
  },
  {
    text: "Your resume says potential. Gritize shows it, line by line, commit by commit",
    size: "28px",
    className: "text-xl md:text-3xl",
    speed: 5.5,
  },
  {
    text: "Grit isn't taught. It's trained—one challenge at a time",
    size: "24px",
    className: "text-sm md:text-2xl",
    speed: 4.65,
  },
  {
    text: "Pattern recognition over memorization",
    size: "28px",
    className: "text-xl md:text-3xl",
    speed: 5.4,
  },

  {
    text: "Grit isn't taught. It's trained—one challenge at a time",
    size: "18px",
    className: "text-xs md:text-lg",
    speed: 5.5,
  },
  {
    text: "Your breakthrough doesn’t wait for permission.",
    size: "24px",
    className: "text-lg md:text-2xl",
    speed: 4.5,
  },
];

function SlidingTextImage() {
  const [activeImage, setActiveImage] = useState("/images/show-1.gif");
  const images = [
    "/images/show-1.gif",
    "/images/show-2.gif",
    "/images/show-3.gif",
    "/images/show-4.gif",
  ];
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          opacity: 0,
          duration: 0.5,
          scale: 0,
          skewY: 10,
          onComplete: () => {
            gsap.to(imgRef.current, {
              opacity: 0.85,
              duration: 0.5,
              scale: 1,
              skewY: 0,
            });
            if (imgRef.current) imgRef.current.src = activeImage;
          },
        });
        setActiveImage((prev) => {
          const nextIndex = (images.indexOf(prev) + 1) % images.length;
          return images[nextIndex];
        });
      }
    }, 10000);
    return () => clearInterval(interval);
  });

  return (
    <Bounded className="showcase-container relative overflow-hidden pt-24 pb-12">
      <div className="group relative flex items-center justify-center overflow-hidden">
        {/* images */}
        <Image
          ref={imgRef}
          src={activeImage}
          alt="Playground GIF"
          width={1000}
          height={1000}
          className="relative z-30 opacity-85 aspect-video w-full h-auto max-w-[1080px] transition-opacity duration-500 ease-in-out"
          unoptimized
        />
        {TEXTS.map((text, index) => (
          <div
            key={`sliding-text-${index}`}
            className={clsx(
              "absolute w-full animate-slide-text text-surface/75",
              text.className
            )}
            style={{
              top: `calc(50% - ${index * 50 * (index % 2 === 0 ? -1 : 1)}px)`,
              // fontSize: text.size,
              animationDuration: `${text.speed}s`,
              animationDelay: `${index * 0.5}s`,
              animationPlayState: "var(--sliding-text-play-state)",
            }}
          >
            {text.text}
          </div>
        ))}
      </div>
    </Bounded>
  );
}

export default SlidingTextImage;
