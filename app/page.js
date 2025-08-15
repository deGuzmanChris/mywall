"use client";

import { useUserAuth } from "./_utils/auth-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect logged-in users to /todo-lists
  useEffect(() => {
    if (user) {
      router.push("/todo-lists");
    }
  }, [user, router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await gitHubSignIn();
      // user state will update automatically via AuthContext
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
      {!user && (
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with GitHub"}
        </button>
      )}

      {user && (
        <div className="text-center p-4">
          <p className="text-lg font-semibold">
            Welcome, {user.displayName || user.email}
          </p>
          <button
            onClick={firebaseSignOut}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
