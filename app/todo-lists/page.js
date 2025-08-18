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
    <div className="p-6 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-center ">
        My Todo Lists
      </h1>

      {/* Create list */}
      <div className="flex gap-3 mb-10 justify-center">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New List Name"
          className="flex-1 max-w-sm px-4 py-2 border rounded-lg shadow-sm "
          onKeyDown={(e) => e.key === "Enter" && addList()}
        />
        <button
          onClick={addList}
          className="px-4 py-2 bg-indigo-400 text-white font-medium rounded-lg hover:bg-indigo-600 transition"
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
  
      {/* Cards grid */}
      <div className="grid grid-cols-3 gap-6">
        {lists.map((list) => (
          <div
            key={list.id}
            onClick={() => router.push(`/todo-lists/${list.id}`)}
            className="bg-indigo-100 border-2 rounded-lg p-4"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{list.name}</h2>
              
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteList(list.id);
              }}
              className="self-end mt-4 px-3 py-1 font text-sm bg-red-300 border-1 border-black text-white rounded hover:bg-red-500"
            >
              ❌
            </button>
          </div>

        ))}
      </div>
    </div>
  );
}
