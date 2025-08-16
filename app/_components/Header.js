"use client";

import Link from "next/link";
import { useUserAuth } from "../_utils/auth-context";

export default function Header() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  return (
    <header className="bg-indigo-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link href="/" className="landing-title text-2xl font-bold">
        MyWall
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="font-medium">{user.email}</span>
          <button
            onClick={firebaseSignOut}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={gitHubSignIn}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
        >
          Login with GitHub
        </button>
      )}
    </header>
  );
}
