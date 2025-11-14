import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroPic from "../assets/HeroPic.png";

function Hero() {
  return (
    <section className="bg-white dark:bg-[#054233] text-black dark:text-white py-20 px-4 flex flex-col md:flex-row items-center justify-between">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-6xl font-bold">
          Your Path to{" "}
          <span className="text-green-500 dark:text-green-400">
            Optimal Wellness
          </span>{" "}
          Starts Here.
        </h2>
        <p className="mt-4">
          Your health is our priority. Explore our resources and get the support
          you need.
        </p>
        <Link
          to="/signup"
          className="mt-6 inline-block bg-green-500 text-white py-2 px-4 rounded"
        >
          Get Started
        </Link>
      </motion.div>
      <motion.div className="flex-1">
        <img
          src={HeroPic}
          alt="Health"
          className="w-full md:w-1/2 rounded-lg shadow-lg object-cover h-auto"
        />
      </motion.div>
    </section>
  );
}

export default Hero;

// import React from "react";
// import Aurora from "./Aurora";

// function Hero() {
//   return (
//     <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
//       {/* Aurora background */}
//       <div className="absolute inset-0 z-0">
//         <Aurora
//           colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
//           blend={0.5}
//           amplitude={1.0}
//           speed={0.5}
//         />
//       </div>

//       {/* Foreground content */}
//       {/* <div className="relative z-10 text-center text-white">
//         <h1 className="text-5xl font-bold mb-4">Welcome to ThriveWell</h1>
//         <p className="text-lg">Your health companion for everyday wellness</p>
//       </div> */}
//     </section>
//   );
// }

// export default Hero;
