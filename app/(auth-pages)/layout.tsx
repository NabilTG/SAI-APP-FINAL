// app/(auth-pages)/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-foreground">
        {children}
      </body>
    </html>
  );
}
