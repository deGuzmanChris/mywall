"use client";

import { useParams } from "next/navigation";
import { useUserAuth } from "../../_utils/auth-context";
import { useState, useEffect } from "react";
import { db } from "../../_utils/firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";

export default function ListPage() {
  const { listId } = useParams();
  const { user } = useUserAuth();
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const listRef = doc(db, "todos", listId);
    const unsub = onSnapshot(listRef, (docSnap) => {
      if (docSnap.exists()) setListName(docSnap.data().name);
    });
    return () => unsub();
  }, [listId]);

  useEffect(() => {
    const itemsCol = collection(db, "todos", listId, "items");
    const q = query(itemsCol, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [listId]);

  const addItem = async () => {
    if (!newItem.trim()) return;
    await addDoc(collection(db, "todos", listId, "items"), { text: newItem, createdAt: new Date() });
    setNewItem("");
  };

  const deleteItem = async (itemId) => {
    await deleteDoc(doc(db, "todos", listId, "items", itemId));
  };

  if (!user) return <p className="p-4">Please login first</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{listName}</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New item..."
          className="border p-2 flex-grow rounded"
        />
        <button onClick={addItem} className="bg-green-500 text-white px-4 rounded">Add</button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center border p-2 rounded">
            {item.text}
            <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700">❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
