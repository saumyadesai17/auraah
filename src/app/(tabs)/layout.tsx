import BottomTabBar from "@/components/navigation/BottomTabBar";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-20">{children}</main>
      <BottomTabBar />
    </div>
  );
}