import React from "react";
import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function HealthTipsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 15 },
    mode: "free-snap",
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 3000);

    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div className="relative w-full mx-auto">
      <div ref={sliderRef} className="keen-slider">
        <div className="keen-slider__slide flex flex-col items-center justify-center bg-green-100 dark:bg-green-900 text-center p-8 rounded-lg min-h-[300px] w-full">
          <h3 className="text-xl font-bold mb-2">Stay Hydrated</h3>
          <p>
            Drink at least 8 glasses of water daily to keep your body
            functioning optimally.
          </p>
        </div>
        <div className="keen-slider__slide flex flex-col items-center justify-center bg-green-100 dark:bg-green-900 text-center p-8 rounded-lg min-h-[300px] w-full">
          <h3 className="text-xl font-bold mb-2">Regular Exercise</h3>
          <p>
            Engage in at least 30 minutes of moderate exercise most days of the
            week.
          </p>
        </div>
        <div className="keen-slider__slide flex flex-col items-center justify-center bg-green-100 dark:bg-green-900 text-center p-8 rounded-lg min-h-[300px] w-full">
          <h3 className="text-xl font-bold mb-2">Balanced Diet</h3>
          <p>
            Incorporate a variety of fruits, vegetables, and whole grains into
            your meals.
          </p>
        </div>
        <div className="keen-slider__slide flex flex-col items-center justify-center bg-green-100 dark:bg-green-900 text-center p-8 rounded-lg min-h-[300px] w-full">
          <h3 className="text-xl font-bold mb-2">Adequate Sleep</h3>
          <p>
            Aim for 7-9 hours of quality sleep each night to support overall
            health.
          </p>
        </div>
      </div>

      {/* Arrows for md screens */}
      <div className="hidden md:flex absolute top-1/2 left-0 right-0 justify-between px-4 -translate-y-1/2">
        <button
          onClick={() => instanceRef.current?.prev()}
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
        >
          ⟵
        </button>
        <button
          onClick={() => instanceRef.current?.next()}
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
        >
          ⟶
        </button>
      </div>

      {/* Dots for small screens */}
      <div className="flex md:hidden justify-center mt-4 space-x-2">
        {[
          ...Array(
            instanceRef.current?.track?.details?.slides?.length || 4
          ).keys(),
        ].map((idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === idx ? "bg-green-700" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default HealthTipsCarousel;
