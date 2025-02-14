"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlowCard } from "@/components/GlowCard2"
import RisingStars from "@/components/RisingStars"

interface SessionData {
  session_id: string
  session_name: string
  mood?: string
  intensity?: number
  session_type?: string
  created_at?: string
}

interface ChatMessage {
  message: string
  response: string
}


export function ContentCard({ 
  title, 
  description, 
  content 
}: { 
  title: string; 
  description: string; 
  content: string 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <Card className="border border-primary/20 shadow-lg transition-transform duration-300 hover:scale-[1.02] bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl overflow-hidden">
        
        {/* Header Section */}
        <CardHeader className="flex flex-row items-center space-x-3 p-6 border-b border-primary/30 bg-gray-950/40">
          <div>
            <CardTitle className="text-2xl font-bold tracking-wide">{title}</CardTitle>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="p-6">
          <div className="leading-relaxed text-gray-300">
            {content
              .replace(/\*/g, "")
              .replace(/\#/g, "") // Removes all * characters
              .split("\n")
              .map((line, index) =>
                line.trim() ? (
                  <motion.p 
                    key={index} 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.3, delay: index * 0.05 }} 
                    className="mb-3"
                  >
                    {line}
                  </motion.p>
                ) : (
                  <br key={index} />
                )
              )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}





const generateFirstResponse = (session: SessionData): string => {
  const { mood, intensity, session_type } = session;

  let response = "Hello! I'm here to support you.";

  if (session_type) {
    switch (session_type) {
      case "Free Chat":
        response = "Hey there! Feel free to talk about anything on your mind. This is a safe space to share your thoughts and feelings.";
        break;
      case "Guided Reflection":
        response = "Let's reflect together. What's something on your mind today?";
        break;
      case "Meditation":
        response = "Let's take a deep breath together. What's something you'd like to try today?";
        break;
      // case "Cognitive Support":
      //   response = "I'm here to help you with cognitive strategies. What are you struggling with today?";
      //   break;
      case "Journaling":
        response = "Let's journal your thoughts. What's something you'd like to write about today?";
        break;
      default:
        response = "Welcome! How can I assist you today?";
    }
  }

  // if (mood) {
  //   response += ` I see you're feeling ${mood.toLowerCase()}.`;
  // }

  // if (intensity !== undefined) {
  //   response += ` On a scale of 1-10, you're feeling a ${intensity}. I'm here to help.`;
  // }

  return response;
};



export default function SessionDetail() {
  const params = useParams()
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [takeaways, setTakeaways] = useState("Fetching session insights...");
  const [activeTab, setActiveTab] = useState("sessionDetails");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === "takeaways" && session?.session_id) {
      fetchTakeaways(session.session_id, session.session_type);
    }
  };


  useEffect(() => {
    async function fetchSessionData() {
      try {
        const response = await fetch(`/api/sessions/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch session")
        const data: { session: SessionData } = await response.json()
        setSession(data.session)
        const firstMessage: ChatMessage = {
          message: "Hey EmotiAI!",
          response: generateFirstResponse(data.session),
        };
  
        setMessages([firstMessage]);
      } catch (error) {
        console.error("Error fetching session:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [params.id])

  async function fetchTakeaways(sessionId: string, sessionType?: string) {
    console.log("Fetching takeaways for:", { sessionId, sessionType });
  
    try {
      const response = await fetch("/api/takeaways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, sessionType }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Get response details
        throw new Error(`Failed to fetch takeaways: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Takeaways received:", data);
  
      setTakeaways(data.takeaways || "No takeaways recorded.");
    } catch (error) {
      console.error("Error fetching takeaways:", error);
      setTakeaways("Failed to generate takeaways.");
    }
  }
  

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input.trim()
    setInput("")

    const newMessage: ChatMessage = { message: userMessage, response: "..." }
    setMessages((prev) => [...prev, newMessage])

    const userId = localStorage.getItem("userId");
  const sessionId = session?.session_id;
  const sessionType = session?.session_type;

  if (!userId || !sessionId || !/^[0-9a-fA-F-]{36}$/.test(userId) || !/^[0-9a-fA-F-]{36}$/.test(sessionId)) {
    console.error("Invalid UUID format for userId or sessionId");
    return;
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        userId,
        sessionType, // Include session type
        message: userMessage,
      }),
    });

      const data = await response.json()
      if (data.response) {
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, response: data.response } : msg
          )
        )
      }
    } catch (error) {
      console.error("Chat error:", error)
    }
  }


  const sendThoughtRecord = () => {
    const situation = (document.querySelector('textarea[placeholder*="event"]') as HTMLTextAreaElement)?.value.trim();
    const automaticThoughts = (document.querySelector('textarea[placeholder*="thoughts"]') as HTMLTextAreaElement)?.value.trim();
    const emotions = (document.querySelector('textarea[placeholder*="Rate"]') as HTMLTextAreaElement)?.value.trim();
    const evidenceFor = (document.querySelector('textarea[placeholder*="support"]') as HTMLTextAreaElement)?.value.trim();
    const evidenceAgainst = (document.querySelector('textarea[placeholder*="contradict"]') as HTMLTextAreaElement)?.value.trim();
    const alternativeThought = (document.querySelector('textarea[placeholder*="realistic"]') as HTMLTextAreaElement)?.value.trim();
    const reRatedEmotions = (document.querySelector('textarea[placeholder*="Anxiety - 40"]') as HTMLTextAreaElement)?.value.trim();
  
    const formattedThoughtRecord = `
  **Thought Record Submission**
  - **Situation:** ${situation || "N/A"}
  - **Automatic Thoughts:** ${automaticThoughts || "N/A"}
  - **Emotions (0-100):** ${emotions || "N/A"}
  - **Evidence For:** ${evidenceFor || "N/A"}
  - **Evidence Against:** ${evidenceAgainst || "N/A"}
  - **Alternative Thought:** ${alternativeThought || "N/A"}
  - **Re-rated Emotions (0-100):** ${reRatedEmotions || "N/A"}
  `;
  
    // Append to chatbot messages
    setMessages((prev) => [...prev, { message: formattedThoughtRecord, response: "..." }]);
  
    sendToChatAPI(formattedThoughtRecord);
    setActiveTab("sessionDetails");
  };
  
  const sendToChatAPI = async (message: string) => {
    const userId = localStorage.getItem("userId");
    const sessionId = session?.session_id;
    const sessionType = session?.session_type;
  
    if (!userId || !sessionId || !/^[0-9a-fA-F-]{36}$/.test(userId) || !/^[0-9a-fA-F-]{36}$/.test(sessionId)) {
      console.error("Invalid UUID format for userId or sessionId");
      return;
    }
  
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId, sessionType, message }),
      });
  
      const data = await response.json();
      if (data.response) {
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, response: data.response } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
    }
  };
  

  if (loading) {
    return <p className="text-center py-10 text-green-300">Loading session...</p>
  }

  if (!session) {
    return <p className="text-center py-10 text-red-500">Session not found</p>
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <RisingStars colors={["#22c55e", "#10b981", "#059669", "#047857"]} />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-5">
          <GlowCard className="w-full cursor-pointer transition-transform duration-300 hover:scale-105 mb-0 min-h-[100px]" size={300} border={2} radius={16}>
            <div className="flex items-center justify-center h-full p-6">
              <h2 className="text-4xl font-bold text-green-300 text-center">{session.session_name}</h2>
            </div>
          </GlowCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="sessionDetails" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent text-green-300">
              <TabsTrigger value="sessionDetails" className="data-[state=active]:bg-green-300 data-[state=active]:text-white">EmotiAI</TabsTrigger>
              <TabsTrigger value="thoughtRecords" className="data-[state=active]:bg-green-300 data-[state=active]:text-white">Thought Record</TabsTrigger>
              <TabsTrigger value="takeaways" className="data-[state=active]:bg-green-300 data-[state=active]:text-white">Session Takeaways</TabsTrigger>
              <TabsTrigger value="helplines" className="data-[state=active]:bg-green-300 data-[state=active]:text-white">Helplines</TabsTrigger>
            </TabsList>

            <TabsContent value="sessionDetails">
              <Card className="bg-transparent text-green-300 border-2 border-green-300">
                <CardHeader>
                  <CardTitle>EmotiAI Chat</CardTitle>
                  <CardDescription className="text-black ">This is your safe space for your emotional well-being. EmotiAI retains past conversation context.</CardDescription>
                </CardHeader>
                
                <CardContent>
                <div className="max-h-60 overflow-y-auto space-y-3  border-green-300 pb-3">
                    {messages.map((msg, index) => (
                      <div key={index} className="flex flex-col space-y-2">
                        <div className="flex justify-start">
                          <div className="border border-green-300 rounded-lg p-3 max-w-1/4 mr-auto">
                            <p className="font-semibold text-green-400">👤 You:</p>
                            <p className="text-black">{msg.message}</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="border border-green-300 rounded-lg p-3 max-w-3+1/4 ml-auto">
                            <p className="font-semibold text-green-400">👩🏻‍⚕️ EmotiAI:</p>
                            <p className="text-black">{msg.response}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <input
                      type="text"
                      className="flex-1 p-2 rounded-md border border-green-300 bg-transparent text-black outline-none"
                      placeholder="Ask EmotiAI..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 rounded-md bg-green-300 text-white font-bold hover:bg-green-500 transition"
                    >
                      Send
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="thoughtRecords">
              <Card className="bg-transparent text-green-300 border-2 border-green-300">
                <CardHeader>
                  <CardTitle className="text-green-300">Thought Records</CardTitle>
                  <CardDescription className="text-black">
                    Thought records help you analyze and reframe negative thinking patterns. Fill in each section and reflect on your thoughts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    {/* Situation */}
                    <div>
                      <label className="block text-green-400">1. Situation:</label>
                      <textarea
                        className="w-full p-2 bg-transparent border border-green-300 rounded-md text-black"
                        placeholder="Briefly describe the event that led to the negative feelings."
                      />
                    </div>

                    {/* Automatic Thoughts */}
                    <div>
                      <label className="block text-green-400">2. Automatic Thoughts:</label>
                      <textarea
                        className="w-full p-2 bg-transparent border border-green-300 rounded-md text-black"
                        placeholder="What thoughts went through your mind in that situation?"
                      />
                    </div>

                    {/* Emotions */}
                    <div>
                      <label className="block text-green-400">3. Emotions (Rate 0-100):</label>
                      <textarea
                        className="w-full p-2 bg-transparent border border-green-300 rounded-md text-black"
                        placeholder="Example: Anxiety - 90, Sadness - 70"
                      />
                    </div>

                    {/* Evidence For */}
                    <div>
                      <label className="block text-green-400">4. Evidence For the Thought:</label>
                      <textarea
                        className="w-full p-2 bg-transparent border border-green-300 rounded-md text-black"
                        placeholder="What facts support the negative thought?"
                      />
                    </div>

                    {/* Evidence Against */}
                    <div>
                      <label className="block text-green-400">5. Evidence Against the Thought:</label>
                      <textarea
                        className="w-full p-2 bg-transparent border border-green-300 rounded-md text-black"
                        placeholder="What facts contradict the negative thought?"
                      />
                    </div>

                    {/* Alternative Thought */}
                    <div>
                      <label className="block text-green-400">6. Alternative/Balanced Thought:</label>
                      <textarea
                        className="w-full p-2 bg-transparent border border-green-300 rounded-md text-black"
                        placeholder="What's a more realistic and balanced way to view the situation?"
                      />
                    </div>

                    {/* Re-rate Emotions */}
                    <div>
                      <label className="block text-green-400">7. Re-rate Emotions (0-100):</label>
                      <textarea
                        className="w-full p-2 bg-transparent border border-green-300 rounded-md text-black"
                        placeholder="Example: Anxiety - 40, Sadness - 30"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between">
                      {/* <button
                        type="submit"
                        className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-400"
                      >
                        Save Thought Record
                      </button> */}
                      <button
                        type="button"
                        className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-blue-500"
                        onClick={
                          sendThoughtRecord}
                      >
                        Send to Chat
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>



            <TabsContent value="takeaways">
              <Card className="bg-transparent text-green-300 border-2 border-green-300">
              <CardHeader>
                <CardTitle>Session Takeaways</CardTitle>
                <CardDescription>EmotiAI retains past conversation context and these are the key insights from your session.</CardDescription>
              </CardHeader>
              <CardContent className="text-black">
                
                <p>{takeaways ? (
                                takeaways.split("\n\n").map((section, sectionIndex) => {
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
              </CardContent>
            </Card>
            {/* <ContentCard
                title="Session Takeaways"
                description={"EmotiAI retains past conversation context and these are the key insights from your session."}
                content={takeaways}
              /> */}
            </TabsContent>
            <TabsContent value="helplines">
              <Card className="bg-transparent text-green-300 border-2 border-green-300">
                <CardHeader>
                  <CardTitle>Helplines</CardTitle>
                  <CardDescription className="text-black">
                    If you or someone you know is struggling, please reach out to a helpline in your country.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc text-black pl-5">
                    <li><strong>USA:</strong> National Suicide Prevention Lifeline - <span className="text-black">988</span></li>
                    <li><strong>UK:</strong> Samaritans - <span className="text-black">116 123</span></li>
                    <li><strong>India:</strong> AASRA - <span className="text-black">91-9820466726</span></li>
                    <li><strong>Canada:</strong> Talk Suicide Canada - <span className="text-black">1-833-456-4566</span></li>
                    <li><strong>Australia:</strong> Lifeline - <span className="text-black">13 11 14</span></li>
                    <li><strong>Global:</strong> <a href="https://www.befrienders.org" target="_blank" rel="noopener noreferrer" className="underline text-black">Befrienders Worldwide - Visit Website</a></li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
