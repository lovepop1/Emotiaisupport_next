"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";
import { GradientBorderButton } from "@/components/GradientBorderButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const sounds = [
  { name: "Rain", src: "/sounds/calming-rain-257596.mp3" },
  { name: "Ocean", src: "/sounds/ocean-waves-250310.mp3" },
  { name: "Forest", src: "/sounds/nature-216798.mp3" },
];

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isLoggedIn) return null;

  const handleSignOut = () => {
    router.push("/");
  };

  const toggleSound = (soundSrc: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (playing !== soundSrc) {
      const newAudio = new Audio(soundSrc);
      newAudio.loop = true;
      newAudio.play();
      audioRef.current = newAudio;
      setPlaying(soundSrc);
    } else {
      setPlaying(null);
    }
  };

  return (
    <header className="bg-white text-card-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/projects" className="text-2xl font-bold text-green-300">
            Emoti AI Support
          </Link>
        </motion.div>
        <nav className="flex items-center space-x-4">
          {/* Sessions Button */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <GradientBorderButton className="w-48 bg-white text-green-300 rounded-full border border-green-300">
              <Link href="/projects" className="w-full text-center text-green-300">Sessions</Link>
            </GradientBorderButton>
          </motion.div>

          {/* Mind Compass Button */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <GradientBorderButton className="w-48 bg-white text-green-300 rounded-full border border-green-300">
              <Link href="/mind-compass" className="w-full text-center text-green-300">Mind Compass</Link>
            </GradientBorderButton>
          </motion.div>

          {/* Relaxing Sounds Dropdown */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <GradientBorderButton className="w-48 bg-white text-green-300 rounded-full border border-green-300 green-300">
                🍃
                </GradientBorderButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-lg rounded-lg w-56 p-2">
                {sounds.map((sound) => (
                  <DropdownMenuItem
                    key={sound.name}
                    onClick={() => toggleSound(sound.src)}
                    className={`flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-all ${
                      playing === sound.src ? "bg-green-100 text-green-600" : "hover:bg-green-300 hover:text-white bg-white text-green-300"
                    }`}
                  >
                    <span>{sound.name}</span>
                    {playing === sound.src ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Sign Out Button */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <GradientBorderButton className="w-48 bg-white text-green-300 rounded-full border border-green-300" onClick={handleSignOut}>
              <span className="flex items-center justify-center w-full text-green-300">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </span>
            </GradientBorderButton>
          </motion.div>
        </nav>
      </div>
    </header>
  );
}
