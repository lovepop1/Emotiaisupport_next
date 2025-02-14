"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import RisingStars from "@/components/RisingStars";
import { GradientBorderButton } from "@/components/GradientBorderButton";
import Link from "next/link";
import { GlowCard } from "@/components/GlowCard";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create an account. Please try again.");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to create an account. Please try again.");
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <RisingStars colors={["#22c55e", "#10b981", "#059669", "#047857"]} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] border-2 border-white bg-card/50 backdrop-blur-sm relative z-10 bg-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-center text-green-300">EmotiAI Support</CardTitle>
            <CardDescription className="text-center text-muted-foreground text-green-300">
              Explore Your Emotional Well-being
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-full px-4 py-2 text-green-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-300 bg-transparent"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-full px-4 py-2 text-green-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-300 bg-transparent"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-full px-4 py-2 text-green-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-300 bg-transparent"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter className="pt-0 flex flex-col gap-2">
            <GlowCard
              className="w-full px-4 py-2 cursor-pointer transition-transform duration-300 hover:scale-105"
              hue={120}
              size={140}
              border={2}
              radius={380}
            >
              <div className="flex items-center justify-center px-4 py-2 p-6" onClick={handleSignup}>
                <h2 className="text-l font-bold text-green-300 text-center flex items-center">
                  Sign Up
                </h2>
              </div>
            </GlowCard>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
