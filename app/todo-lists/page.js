"use client";

import { useUserAuth } from "../_utils/auth-context";
import { useState, useEffect } from "react";
import { db } from "../_utils/firebase";
import Link from "next/link";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function TodoListsPage() {
  const { user } = useUserAuth();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "todos"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setLists(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [user]);

  const addList = async () => {
    if (!newListName.trim()) return;
    await addDoc(collection(db, "todos"), {
      uid: user.uid,
      name: newListName,
      createdAt: new Date(),
    });
    setNewListName("");
  };

  const deleteList = async (listId) => {
    await deleteDoc(doc(db, "todos", listId));
  };

  if (!user) return <p className="p-4">Please login first</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Lists</h2>

      {/* Create list */}
      <div className="flex gap-2 mb-6">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name..."
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={addList}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Create List
        </button>
      </div>

      {/* Empty state */}
      {lists.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No lists yet. Click "Create List" to get started!
        </div>
      )}

      {/* Existing lists */}
      {lists.map((list) => (
        <div
          key={list.id}
          className="border rounded p-4 mb-4 bg-white shadow flex justify-between items-center"
        >
          <Link
            href={`/todo-lists/${list.id}`}
            className="flex-grow hover:underline"
          >
            {list.name}
          </Link>
          <button
            onClick={() => deleteList(list.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
