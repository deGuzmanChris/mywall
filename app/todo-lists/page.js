"use client";

import { useUserAuth } from "../_utils/auth-context";
import { useState, useEffect } from "react";
import { db } from "../_utils/firebase";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  if (!user) return <p className="p-4 text-center">Please login first</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-8 pl-4 text-center text-gray-800">
        My Todo Lists
      </h1>

      {/* Create list */}
      <div className="flex gap-3 mb-8 justify-center">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New List Name"
          
          onKeyDown={(e) => e.key === "Enter" && addList()}
        />
        <button
          onClick={addList}
          
        >
          ➕ 
        </button>
      </div>

      {/* Empty state */}
      {lists.length === 0 && (
        <div className="text-gray-500 mt-10 text-center italic">
          No lists yet. Create one above!
        </div>
      )}

      {/* Lists as cards */}
      <ul className="flex grid gap-6 sm:grid-cols-2">
        {lists.map((list) => (
          <li
            key={list.id}
            onClick={() => router.push(`/todo-lists/${list.id}`)}
            className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg
                       hover:shadow-xl hover:bg-gray-50 transition cursor-pointer
                       flex justify-between items-center"
          >
            <span className="text-lg font-semibold text-gray-900">
              {list.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                deleteList(list.id);
              }}
              
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
