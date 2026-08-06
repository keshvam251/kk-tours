"use client";

import AdminLayout from "../components/AdminLayout";
import ImageUpload from "../components/ImageUpload";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Image from "next/image";

interface Room {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNote: string;
  imageUrl: string;
  features: string[];
  badge: string;
  order: number;
}

export default function AdminRooms() {
  const [items, setItems] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    priceNote: "per night",
    imageUrl: "",
    features: "",
    badge: "",
    order: 0,
  });

  const fetchItems = async () => {
    try {
      const q = query(collection(db, "rooms"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Room[];
      setItems(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", priceNote: "per night", imageUrl: "", features: "", badge: "", order: items.length + 1 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: Room) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      priceNote: item.priceNote,
      imageUrl: item.imageUrl,
      features: (item.features || []).join(", "),
      badge: item.badge || "",
      order: item.order,
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await deleteDoc(doc(db, "rooms", id));
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.imageUrl) {
      alert("Please fill in name, price, and upload an image.");
      return;
    }

    setSaving(true);
    const data = {
      name: form.name,
      description: form.description,
      price: form.price,
      priceNote: form.priceNote,
      imageUrl: form.imageUrl,
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
      badge: form.badge,
      order: form.order,
    };

    try {
      if (editing) {
        await updateDoc(doc(db, "rooms", editing.id), { ...data, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "rooms"), { ...data, order: items.length + 1, createdAt: serverTimestamp() });
      }
      await fetchItems();
      resetForm();
    } catch (err: any) {
      console.error("Save error:", err);
      if (err?.code === "permission-denied" || err?.message?.includes("permission")) {
        alert("🔒 Firebase Permission Error: Please update your Firestore Security Rules in Firebase Console to 'allow read, write: if true;' and click Publish.");
      } else {
        alert(`Failed to save room: ${err?.message || err}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Rooms</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} rooms</p>
          </div>
          <button
            onClick={() => {
              setForm({ name: "", description: "", price: "", priceNote: "per night", imageUrl: "", features: "", badge: "", order: items.length + 1 });
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Room
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-5">
              {editing ? "Edit Room" : "Add New Room"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Room Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Deluxe Double Room" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Badge</label>
                  <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Most Popular, Best Value" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} placeholder="Describe the room..." className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Price *</label>
                  <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="e.g. ₹1,499" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Price Note</label>
                  <input type="text" value={form.priceNote} onChange={(e) => setForm({ ...form, priceNote: e.target.value })} placeholder="per night" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Features (comma-separated)</label>
                <input type="text" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Double Bed, Mountain View, AC, TV, Wi-Fi" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Room Image *</label>
                <ImageUpload currentUrl={form.imageUrl} folder="rooms" onUpload={(url) => setForm({ ...form, imageUrl: url })} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm py-2.5 px-6 rounded-xl transition-all cursor-pointer disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Update Room" : "Add Room"}
                </button>
                <button type="button" onClick={resetForm} className="bg-white/5 hover:bg-white/10 text-white/60 font-medium text-sm py-2.5 px-6 rounded-xl transition-all cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-900 rounded-2xl h-32 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-2xl border border-white/5">
            <p className="text-white/40 text-sm">No rooms yet. Click &quot;Add Room&quot; to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="group bg-gray-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                  {item.badge && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-gray-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-white/40 text-sm mt-1 line-clamp-2">{item.description}</p>
                    <p className="text-amber-400 font-bold mt-2">{item.price} <span className="text-white/30 font-normal text-xs">/ {item.priceNote}</span></p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleEdit(item)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center cursor-pointer transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center cursor-pointer transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
