import Navbar from "@/components/ui/navbar";

export default function EventsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <header className="pb-10">
        <Navbar />
      </header>
      <main className="pt-10">{children}</main>

      {modal}
    </>
  );
}
