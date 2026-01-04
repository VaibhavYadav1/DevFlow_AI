import Sidebar from "@/components/sidebar/sidebar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </>
  );
}
