"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    DrawSVGPlugin,
    MotionPathPlugin,
    SplitText,
    useGSAP,
  );
  gsap.defaults({ ease: "power3.out", duration: 1 });
}

export {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  DrawSVGPlugin,
  MotionPathPlugin,
  SplitText,
  useGSAP,
};
