import React from "react";
import Hero from "../components/Hero";
import HealthTipsCarousel from "../components/HealthTipsCarousel";

function Home() {
  return (
    <div>
      <Hero />
      <section className="my-10 px-4">
        <HealthTipsCarousel />
      </section>
    </div>
  );
}

export default Home;
