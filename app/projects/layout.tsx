import Header from "@/components/Header";
import RisingStars from "@/components/RisingStars"; // Import RisingStars component

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <RisingStars colors={["#22c55e", "#10b981", "#059669", "#047857"]} /> {/* Add RisingStars component */}
      <Header isLoggedIn={true} />
      <main className="flex-grow bg-white relative z-10">{children}</main>
    </div>
  );
}

