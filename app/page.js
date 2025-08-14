"use client";

import { useUserAuth } from "./_utils/auth-context";
import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await gitHubSignIn();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!user ? (
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with GitHub"}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl font-semibold">
            Welcome, {user.displayName || "User"} ({user.email})
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
            <Link
              href="/todo-lists"
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Go to Your Lists
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
