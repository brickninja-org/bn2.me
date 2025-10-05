import './header.css';

export default function AuthorizeLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex-1">
      <main className="flex flex-col gap-4 w-full max-w-[560px] my-8 mx-auto p-4 rounded-xs border shadow">
        {children}
      </main>
    </div>
  );
}
