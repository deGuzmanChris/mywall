"use client";

import { useUserAuth } from "./_utils/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user } = useUserAuth();
  const router = useRouter();

  // Redirect logged-in users to /todo-lists
  useEffect(() => {
    if (user) {
      router.push("/todo-lists");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to MyWall</h1>
      <p className="text-lg text-gray-700">
        MyWall is a personal task management tool that allows users to create, manage, and organize multiple to-do lists. Users will be able to log in using GitHub, create multiple lists, and add or remove items in each list. <br /> Please log in using the button on the top right.
      </p>
    </div>
  );
}
