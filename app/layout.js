import "./globals.css";
import { AuthContextProvider } from "./_utils/auth-context";
import Header from "./_components/Header";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100">
        <AuthContextProvider>
          <Header />

          <main className="flex-grow container mx-auto p-4">{children}</main>

          <footer className="bg-gray-800 text-white p-4 text-center">
            Developed by{" "}
            <a
              href="https://github.com/deGuzmanChris"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b82f6] hover:underline"
            >
              Chris de Guzman
            </a>
          </footer>
        </AuthContextProvider>
      </body>
    </html>
  );
}
