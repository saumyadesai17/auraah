import BottomTabBar from "@/components/navigation/BottomTabBar";
// import { ThemeToggle } from "@/components/ui/ThemeToggle"; // Removed

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> {/* Adjusted background for consistency */}
      {/* <div className="fixed top-4 right-4 z-50"> // Removed
        <ThemeToggle />
      </div> */}
      <main className="flex-grow pb-15">{children}</main>
      {/* Updated container for BottomTabBar for styling consistency with explore.png */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <BottomTabBar />
      </div>
    </div>
  );
}