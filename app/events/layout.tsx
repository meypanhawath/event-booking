export default function EventsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <main className="pt-10">{children}</main>

      {modal}
    </>
  );
}
