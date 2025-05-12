import BottomTabBar from "@/components/navigation/BottomTabBar";
import Header from "@/components/navigation/Header";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> {/* Adjusted background for consistency */}
      {/* Using the Header component */}
      <Header />
      
      {/* Add padding top to account for fixed header */}
      <main className="flex-grow pb-15 pt-16">{children}</main>
      
      {/* Updated container for BottomTabBar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <BottomTabBar />
      </div>
    </div>
  );
}