export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Discover</h1>
        <p className="mb-12 font-light text-lg text-muted">Here are some applications that support bn2.me.</p>
        {children}
      </div>
    </main>
  );
}
