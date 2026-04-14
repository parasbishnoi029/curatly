import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f5f5f5" }}>
        
        {/* 🔥 Navbar */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px 30px",
            background: "#fff",
            borderBottom: "1px solid #ddd",
          }}
        >
          <h2 style={{ margin: 0 }}>Curatly</h2>

          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/">Home</Link>
            <Link href="/saved">Saved</Link>
            <Link href="/login">Login</Link>
          </div>
        </nav>

        {/* Content */}
        <div style={{ padding: 20 }}>{children}</div>
      </body>
    </html>
  );
}