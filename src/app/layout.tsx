// app/layout.tsx
import './globals.css'; // Your global styles

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Put your main site header here */}
        <header>
          <h1>My Website</h1>
          {/* Maybe your main nav */}
        </header>

        <main>{children}</main>

        {/* Put your footer here */}
        <footer>© 2025 My Website</footer>
      </body>
    </html>
  );
}
