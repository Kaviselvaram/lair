"use client";

import { useState, useEffect } from "react";
import SmoothScrollProvider, { setScrollPaused } from "@/components/SmoothScrollProvider";
import Preloader from "@/components/preloader/Preloader";
import Nav from "@/components/navigation/Nav";
import Hero from "@/components/hero/Hero";
import DestinationShowcase from "@/components/sections/DestinationShowcase";
import FlightNetwork from "@/components/sections/FlightNetwork";
import Cabin from "@/components/sections/Cabin";
import AircraftBand from "@/components/sections/AircraftBand";
import Gallery from "@/components/sections/Gallery";
import Membership from "@/components/sections/Membership";
import Enquiry from "@/components/enquiry/Enquiry";
import Footer from "@/components/sections/Footer";

export default function Page() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setScrollPaused(!entered);
  }, [entered]);

  return (
    <>
      {/* Fixed layers live OUTSIDE the smooth wrapper. */}
      {!entered && <Preloader onDone={() => setEntered(true)} />}
      <Nav />

      <SmoothScrollProvider>
        <main id="top" className="relative z-10">
          <Hero />
          <DestinationShowcase />
          <FlightNetwork />
          <Cabin />
          <AircraftBand />
          <Gallery />
          <Membership />
          <Enquiry />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}
