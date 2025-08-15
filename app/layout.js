import Link from "next/link";
import "./globals.css";
import { AuthContextProvider } from "./_utils/auth-context";

export const metadata = {
  title: "My Todo App",
  description: "Todo Lists with Next.js and Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100">
        <AuthContextProvider>
          {/* Header */}
          <header className="shadow-md">
            <h1 className="text-2xl font-bold">
              <Link href="/">MyWall</Link>
            </h1>
          </header>

          {/* Main content */}
          <main className="flex-grow container mx-auto p-4">{children}</main>

          {/* Footer */}
          <footer>
            Developed by{" "}
            <a
              href="https://github.com/deGuzmanChris"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b82f6] text-decoration-none"
            >
              Chris de Guzman
            </a>
          </footer>
        </AuthContextProvider>
      </body>
    </html>
  );
}
