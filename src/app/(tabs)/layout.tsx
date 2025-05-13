import BottomTabBar from "@/components/navigation/BottomTabBar";
import Header from "@/components/navigation/Header";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header - fixed at top */}
      <Header />
      
      {/* Main content area - adjusted for header and footer */}
      <main className="flex-grow overflow-y-auto pt-[57px] pb-16">
        {children}
      </main>
      
      {/* Bottom tab bar - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <BottomTabBar />
      </div>
    </div>
  );
}