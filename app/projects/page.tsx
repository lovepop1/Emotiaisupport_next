"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { GlowCard } from "@/components/GlowCard2";
import { GradientBorderButton } from "@/components/GradientBorderButton";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import RisingStars from "@/components/RisingStars";

export default function SessionsDashboard() {
  const [sessions, setSessions] = useState<{ session_id: string; session_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUserSessions() {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("You must be logged in to view your sessions.");
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/sessions/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sessions.");
        }

        const data = await response.json();
        setSessions(data.sessions || []);
      } catch (err) {
        setError("Error fetching sessions.");
        console.error(err);
      }

      setLoading(false);
    }

    fetchUserSessions();
  }, []);

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      <RisingStars colors={["#22c55e", "#10b981", "#059669", "#047857"]} />
      <div className="container mx-auto py-16 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-3xl text-green-300 mb-8">
            Your journey to emotional well-being starts here
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <GradientBorderButton className="w-60 bg-white text-green-300 rounded-full border border-green-300">
            <Link href="/new_session" className="flex items-center text-green-300 ">
              <Plus className="mr-2 h-5 w-5" /> Start New Session
            </Link>
          </GradientBorderButton>
        </motion.div>

        {loading ? (
          <p className="text-green-300 text-center">Loading sessions...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : sessions.length === 0 ? (
          <p className="text-green-300 text-center">No sessions yet. Start your first session now!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session, index) => (
              <motion.div
                key={session.session_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <Link href={`/projects/${session.session_id}`} className="block">
                  <GlowCard
                    className="w-full h-24 cursor-pointer transition-transform duration-300 hover:scale-105"
                  
                    size={100}
                    border={2}
                    radius={100}
                  >
                    <div className="flex items-center justify-center h-full p-6">
                      <h2 className="text-xl font-bold text-green-300 text-center">
                        {session.session_name}
                      </h2>
                    </div>
                  </GlowCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
