"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GradientBorderButton } from "@/components/GradientBorderButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlowCard } from "@/components/GlowCard2";
import RisingStars from "@/components/RisingStars";
import { BarChart, LineChart } from "@/components/Visualizations";
import { formatISO, subDays } from "date-fns"; // Import chart components
import EmotionalProgressChart from "@/components/EmotionalProgressChart";

export default function MindCompass() {
  const [activeTab, setActiveTab] = useState("mentalHealthTest");
  const [quizAnswers, setQuizAnswers] = useState(Array(12).fill(null)); // Ensure all are answered
  const [testResults, setTestResults] = useState([]);
  const [insights, setInsights] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Ensure userId is set only on client-side
    setUserId(localStorage.getItem("userId") || null);
  }, []);

  // useEffect(() => {
  //   if (userId) fetchTestHistory();
  // }, [userId]);

  const handleQuizChange = (index: number, value: string) => {
    setQuizAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[index] = parseInt(value); // Ensure numeric values
      return updatedAnswers;
    });
  };

  const isQuizComplete = quizAnswers.every((answer) => answer !== null); // Check if all are answered

  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission

  const [isSubmitting, setIsSubmitting] = useState(false); // Track if submission is in progress
  const [isLoadingInsights, setIsLoadingInsights] = useState(false); // Track insights generation

  const submitQuiz = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Prevents page reload

    if (!isQuizComplete || !userId || isSubmitting) return; // ✅ Prevent multiple submissions

    setIsSubmitting(true); // ✅ Disable form while submitting
    setIsLoadingInsights(true); // ✅ Show loading state

    try {
      console.log("Submitting quiz with responses:", quizAnswers);

      const res = await fetch("/api/mental-health-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, responses: quizAnswers }),
      });

      const text = await res.text();
      console.log("Test submission response:", text); // Debugging

      if (!res.ok) {
        console.error("Failed to submit test:", res.status, text);
        setIsSubmitting(false);
        setIsLoadingInsights(false);
        return;
      }

      const newTest = JSON.parse(text);
      setTestResults([newTest, ...testResults]);

      console.log("Fetching insights...");

      const insightsRes = await fetch("/api/get-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: quizAnswers }),
      });

      if (!insightsRes.ok) {
        console.error("Failed to fetch insights");
        setIsSubmitting(false);
        setIsLoadingInsights(false);
        return;
      }

      const insightsData = await insightsRes.json();
      setInsights(insightsData.insights);
      console.log("Insights received:", insightsData.insights);

      setIsLoadingInsights(false); // ✅ Hide loading once insights are received
    } catch (error) {
      console.error("Error submitting test:", error);
      setIsSubmitting(false);
      setIsLoadingInsights(false);
    }
  };


  const [timeRange, setTimeRange] = useState("30d");
  const [growthInsights, setGrowthInsights] = useState(""); // ✅ Doesn't affect `insights`
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [isLoadingGrowthInsights, setIsLoadingGrowthInsights] = useState(false); // ✅ Separate loading states
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId") || null);
  }, []);

  // Fetch Emotional Growth Insights
  useEffect(() => {
    if (userId) {
      fetchEmotionalGrowth();
      fetchVisualizationData();
    }
  }, [timeRange, userId]);

  // ✅ Compute startDate and endDate based on timeRange
  const getDateRange = () => {
    const endDate = formatISO(new Date()).split("T")[0]; // Today
    const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
    const startDate = formatISO(subDays(new Date(), daysMap[timeRange])).split("T")[0]; // Past date

    return { startDate, endDate };
  };

  // ✅ Fetch insights
  const fetchEmotionalGrowth = async () => {
    if (!userId) return;
    setIsLoadingGrowthInsights(true);
  
    const { startDate, endDate } = getDateRange(); // Get calculated dates
  
    try {
      const res = await fetch(`/api/emotional-growth?userId=${userId}&startDate=${startDate}&endDate=${endDate}`);
  
      if (!res.ok) throw new Error("Failed to fetch insights");
  
      const data = await res.json();
      setGrowthInsights(data.insights);
    } catch (error) {
      console.error("Error fetching emotional growth insights:", error);
    } finally {
      setIsLoadingGrowthInsights(false);
    }
  };
  

  // ✅ Fetch visualization data separately
  const fetchVisualizationData = async () => {
    if (!userId) return;
    setIsLoadingCharts(true);
  
    const { startDate, endDate } = getDateRange(); // Get calculated dates
  
    try {
      const res = await fetch(`/api/emotional-growth-visuals?userId=${userId}&startDate=${startDate}&endDate=${endDate}`);
  
      if (!res.ok) throw new Error("Failed to fetch visualization data");
  
      const data = await res.json();
      
      // ✅ Use the correct response keys
      setBarChartData(data.barChartData);
      setLineChartData(data.lineChartData);
    } catch (error) {
      console.error("Error fetching visualization data:", error);
    } finally {
      setIsLoadingCharts(false);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <RisingStars colors={["#22c55e", "#10b981", "#059669", "#047857"]} />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-5">
          <GlowCard className="w-full cursor-pointer transition-transform duration-300 hover:scale-105 mb-0 min-h-[100px]" size={300} border={2} radius={16}>
            <div className="flex items-center justify-center h-full p-6">
              <h2 className="text-4xl font-bold text-green-300 text-center">Mind Compass</h2>
            </div>
          </GlowCard>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="mentalHealthTest" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent text-green-300">
            <TabsTrigger value="mentalHealthTest" className="data-[state=active]:bg-green-300 data-[state=active]:text-white">Mental Health Test</TabsTrigger>
            <TabsTrigger value="emotionalGrowth" className="data-[state=active]:bg-green-300 data-[state=active]:text-white">Emotional Progress</TabsTrigger>
          </TabsList>

          {/* Mental Health Test */}
          <TabsContent value="mentalHealthTest">
            <Card className="bg-transparent text-green-300 border-2 border-green-300">
              <CardHeader>
                <CardTitle>Mental Health Test</CardTitle>
                <CardDescription className="text-black">Answer all questions honestly to get insights on your mental well-being.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  {[
                    "How often do you feel focused and able to concentrate on daily tasks?",
                    "Do you get restful sleep, even during stressful times?",
                    "Do you feel that your daily activities contribute meaningfully to your life or others’?",
                    "Do you feel confident in making decisions, even in uncertain situations?",
                    "How often do you feel calm and in control of your emotions?",
                    "When facing difficulties, do you feel capable in handling them?",
                    "Do you find joy and satisfaction in your daily tasks and activities?",
                    "Do you effectively manage stress and challenges in your life?",
                    "How frequently do you feel emotionally balanced and generally happy?",
                    "How strong and confident do you feel in yourself and your abilities?",
                    "Do you generally feel valued, worthy, and appreciated?",
                    "Lately, how often do you experience a sense of contentment and well-being?",
                  ].map((question, index) => (
                    <div key={index}>
                      <label className="block text-green-400">{question}</label>
                      <select
                        className="w-full p-2 bg-transparent border border-green-300 rounded-md text-black"
                        onChange={(e) => handleQuizChange(index, e.target.value)}
                        value={quizAnswers[index] !== null ? quizAnswers[index] : ""}
                        disabled={isSubmitted} // ✅ Disable after submission
                      >
                        <option value="" disabled>Select an option</option>
                        <option value="0">Never</option>
                        <option value="1">Rarely</option>
                        <option value="2">Sometimes</option>
                        <option value="3">Often</option>
                        <option value="4">Always</option>
                      </select>
                    </div>
                  ))}

                  <div className="flex justify-end">
                  <button
                        type="button"
                        className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-blue-500"
                        onClick={submitQuiz}
                        disabled={isSubmitting} // ✅ Disable after submission
                      >
                        {isLoadingInsights ? (
                          <>
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            Generating insights...
                          </>
                        ) : (
                          "Get Insights"
                        )}
                      </button>
                  </div>
                </form>

                {insights && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-green-300">Your Insights</h3>
                    <p className="text-black">{insights ? (
                                insights.split("\n\n").map((section, sectionIndex) => {
                                  const lines = section.split("\n");
                                  const heading = lines[0];
                                  const contentLines = lines.slice(1);

                                  const cleanedHeading = heading ? heading.replace(/^\*\*|\*\*$/g, "") : "";

                                  // Function to clean content lines
                                  const cleanContent = (lines: any[]) =>
                                    lines.map((line) => line.replace(/\*\*(.*?)\*\*/g, "$1"));

                                  return (
                                    <div key={sectionIndex} className="mb-4">
                                      <h3 className="text-lg text-black mb-2">{cleanedHeading}</h3>
                                      <div className="text-black leading-relaxed">
                                        {cleanContent(contentLines).map((line, index) => (
                                          <p key={index}>{line}</p>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-black">Analysis not available</p>
                              )}
                              </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="emotionalGrowth">
            <Card className="bg-transparent text-green-300 border-2 border-green-300">
              <CardHeader>
                <CardTitle>Emotional Progress Analysis</CardTitle>
                <CardDescription className="text-black">
                  Track your emotional well-being progress over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* ✅ Time Range Selector */}
                <div className="flex gap-4 mb-4">
                  {["7d", "30d", "90d"].map((range) => (
                    <button
                      key={range}
                      className={`px-4 py-2 rounded-md ${timeRange === range ? "bg-green-400 text-white" : "bg-transparent border border-green-300 text-green-300"}`}
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>

                {/* ✅ Insights Section */}
                {isLoadingGrowthInsights ? (
                  <div className="text-green-300 text-center">Loading insights...</div>
                ) : (
                  growthInsights && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-green-300">Your Emotional Progress Insights</h3>
                      <p className="text-black">{growthInsights ? (
                                growthInsights.split("\n\n").map((section, sectionIndex) => {
                                  const lines = section.split("\n");
                                  const heading = lines[0];
                                  const contentLines = lines.slice(1);

                                  const cleanedHeading = heading ? heading.replace(/^\*\*|\*\*$/g, "") : "";

                                  // Function to clean content lines
                                  const cleanContent = (lines: any[]) =>
                                    lines.map((line) => line.replace(/\*\*(.*?)\*\*/g, "$1"));

                                  return (
                                    <div key={sectionIndex} className="mb-4">
                                      <h3 className="text-lg text-black mb-2">{cleanedHeading}</h3>
                                      <div className="text-black leading-relaxed">
                                        {cleanContent(contentLines).map((line, index) => (
                                          <p key={index}>{line}</p>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-black">Analysis not available</p>
                              )}</p>
                    </div>
                  )
                )}


                {isLoadingCharts ? (
                  <div className="text-green-300 text-center">Loading charts...</div>
                ) : (
                  <div className="p-4 border border-green-300 rounded-md">
                    <h3 className="text-lg text-green-300 font-bold mb-2">Average Mental Health Score Over Time</h3>
                    <EmotionalProgressChart />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
