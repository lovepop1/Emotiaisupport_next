"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradientBorderButton } from "@/components/GradientBorderButton";
import { motion } from "framer-motion";
import RisingStars from "@/components/RisingStars"; // Import RisingStars component

export default function NewSessionPage() {
  const [sessionName, setSessionName] = useState("");
  const [mood, setMood] = useState("Neutral 😐");
  const [intensity, setIntensity] = useState(5);
  const [sessionType, setSessionType] = useState("Free Chat");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const moods = ["Happy 😊", "Sad 😢", "Anxious 😰", "Stressed 😖", "Angry 😡", "Neutral 😐"];
  const sessionTypes = ["Free Chat", "Guided Reflection", "Meditation", "Journaling"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to start a session.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sessionName, mood, intensity, sessionType }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session.");
      }

      const data = await response.json();
      router.push(`/projects/${data.sessionId}`); // Redirect to project details page
    } catch (err) {
      setError("Error creating session. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      <RisingStars colors={["#22c55e", "#10b981", "#059669", "#047857"]} /> {/* Add RisingStars component */}
      <div className="container mx-auto py-16 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-3xl text-green-300 mb-8">
            Start a New Session
          </p>
        </motion.div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-300">Session Name</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full mt-1 p-2 border border-green-300 rounded-lg bg-transparent text-green-300 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-green-300">Current Mood</label>
            <div className="flex space-x-4 mt-1">
              {moods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`flex flex-col items-center p-4 rounded-lg border ${mood === m ? 'border-green-500' : 'border-green-300'} bg-transparent text-green-300 focus:outline-none`}
                >
                  <span className="text-4xl">{m.split(" ")[1]}</span>
                  <span className="mt-2">{m.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-green-300">
                Emotion Intensity ({intensity}/10)
            </label>
            <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full mt-1 appearance-none focus:ring-0 focus:outline-none"
            />
            <style jsx>{`
                input[type='range'] {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 6px;
                border-radius: 5px;
                outline: none;
                background: transparent; /* Avoid default styles */
                }

                /* Track (background of the slider) */
                input[type='range']::-webkit-slider-runnable-track {
                background: #86efac; /* Green-300 */
                height: 6px;
                border-radius: 5px;
                }

                input[type='range']::-moz-range-track {
                background: #86efac; /* Green-300 */
                height: 6px;
                border-radius: 5px;
                }

                /* Thumb (circle) */
                input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                background: #22c55e; /* Green-500 */
                border-radius: 50%;
                cursor: pointer;
                margin-top: -5px;
                }

                input[type='range']::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: #22c55e; /* Green-500 */
                border-radius: 50%;
                cursor: pointer;
                }

                /* Ensuring track color remains green-300 */
                input[type='range']::-webkit-slider-runnable-track {
                background: #86efac;
                }

                input[type='range']::-moz-range-progress {
                background: #86efac;
                }
            `}</style>
            </div>




          <div>
            <label className="block text-green-300">Session Type</label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full mt-1 p-2 border border-green-300 rounded-lg bg-transparent text-green-300 focus:ring-green-500 focus:border-green-500"
            >
              {sessionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <GradientBorderButton className="w-60 bg-white text-green-300 rounded-full border border-green-300">
              <button type="submit" className="flex items-center text-green-300" disabled={loading}>
                {loading ? "Starting..." : "Start Session"}
              </button>
            </GradientBorderButton>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
