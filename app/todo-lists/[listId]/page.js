"use client";

import { useParams, useRouter } from "next/navigation";
import { useUserAuth } from "../../_utils/auth-context";
import { useState, useEffect } from "react";
import { db } from "../../_utils/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function ListPage() {
  const { listId } = useParams();
  const router = useRouter();
  const { user } = useUserAuth();
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Fetch list name
  useEffect(() => {
    if (!user) return;
    const listRef = doc(db, "todos", listId);
    const unsub = onSnapshot(listRef, (docSnap) => {
      if (docSnap.exists()) setListName(docSnap.data().name);
      else router.push("/todo-lists");
    });
    return () => unsub();
  }, [listId, user, router]);

  // Fetch items
  useEffect(() => {
    if (!user) return;
    const itemsCol = collection(db, "todos", listId, "items");
    const q = query(itemsCol, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [listId, user]);

  const addItem = async () => {
    if (!newItem.trim()) return;
    await addDoc(collection(db, "todos", listId, "items"), {
      text: newItem,
      createdAt: new Date(),
    });
    setNewItem("");
  };

  const deleteItem = async (itemId) => {
    await deleteDoc(doc(db, "todos", listId, "items", itemId));
  };

  if (!user) return <p className="p-4">Please login first</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{listName || "Loading..."}</h2>

      {/* Add new item */}
      <div className="flex gap-2 mb-4">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()} 
          placeholder="Add New Task"
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={addItem}
          className="bg-green-500 text-white px-4  rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {/* Items list */}
      {items.length === 0 && (
        <div className="text-gray-500 mt-4">No items yet. Add one above!</div>
      )}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border p-2 rounded bg-white"
          >
            {item.text}
            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

   
      <button
        onClick={() => router.push("/todo-lists")}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back to Lists
      </button>
    </div>
  );
}
