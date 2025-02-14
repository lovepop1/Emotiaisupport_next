"use client"

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import RisingStars from "@/components/RisingStars";
import {GlowCard} from "@/components/GlowCard";
import {GradientBorderButton} from "@/components/GradientBorderButton";
import { FaArrowRight } from "react-icons/fa";
import { BiRightArrowAlt, BiChevronRight } from "react-icons/bi";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <RisingStars colors={["#22c55e", "#10b981", "#059669", "#047857"]} />
      <section className="flex flex-col items-center justify-center px-4 text-center relative z-10">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 text-green-300"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EmotiAI Support
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-3xl text-green-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Empowering emotional health and mental well-being through AI driven compassion.
        </motion.p>
        <motion.div
          key="get-started"
          initial={{ opacity: 0.2, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >

          <GlowCard
            className="w-full w-64 h-17 cursor-pointer transition-transform duration-300 hover:scale-105"
            hue={120}
            size={100}
            border={2}
            radius={380}
          >
            <div className="flex items-center justify-center w-64 h-14 p-6" onClick={() => router.push("/login")}>
            <h2 className="text-xl font-bold text-green-300 text-center flex items-center">
                Get Started <BiChevronRight className="ml-16" size={30} /> {/* Add the arrow icon */}
              </h2>
            </div>
          </GlowCard>
          {/* <GradientBorderButton
            className="w-full w-64 h-17 cursor-pointer  transition-transform duration-300 hover:scale-105"
            onClick={() => router.push("/login")}
          >
            <div className="flex items-center justify-center w-64 h-14 p-6">
              <h2 className="text-xl font-bold text-green-300 text-center">
                Get Started
              </h2>
            </div> */}
          {/* </GradientBorderButton> */}
        </motion.div>
      </section>
    </div>
  );
};

export default HeroSection;
