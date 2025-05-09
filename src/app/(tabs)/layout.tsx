import BottomTabBar from "@/components/navigation/BottomTabBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="flex-grow pb-20">{children}</main>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 backdrop-blur-md">
        <BottomTabBar />
      </div>
    </div>
  );
}