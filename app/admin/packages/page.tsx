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

interface Package {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: string;
  description?: string;
  imageUrl?: string;
  gradient?: string;
  order: number;
}

export default function AdminPackages() {
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "Jammu & Kashmir",
    duration: "",
    price: "",
    description: "",
    imageUrl: "",
    order: 0,
  });

  const fetchItems = async () => {
    try {
      const q = query(collection(db, "packages"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Package[];
      setItems(data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      location: "Jammu & Kashmir",
      duration: "",
      price: "",
      description: "",
      imageUrl: "",
      order: items.length + 1,
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: Package) => {
    setForm({
      name: item.name,
      location: item.location,
      duration: item.duration,
      price: item.price,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      order: item.order,
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    try {
      await deleteDoc(doc(db, "packages", id));
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.duration) {
      alert("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "packages", editing.id), { ...form, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "packages"), { ...form, order: items.length + 1, createdAt: serverTimestamp() });
      }
      await fetchItems();
      resetForm();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save. Check Firebase config.");
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
            <h1 className="text-2xl font-bold text-white">Tour Packages</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} packages</p>
          </div>
          <button
            onClick={() => {
              setForm({
                name: "",
                location: "Jammu & Kashmir",
                duration: "",
                price: "",
                description: "",
                imageUrl: "",
                order: items.length + 1,
              });
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Package
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-5">
              {editing ? "Edit Package" : "Add New Package"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Package Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Dal Lake Houseboat" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Location *</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required placeholder="Jammu & Kashmir" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Duration *</label>
                  <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required placeholder="5 Days / 4 Nights" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Price *</label>
                  <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="₹18,999" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Enter package highlights, itinerary summary, inclusions..."
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Package Image</label>
                <ImageUpload
                  currentUrl={form.imageUrl}
                  folder="packages"
                  onUpload={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                />
              </div>

              {/* Preview */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Preview</label>
                <div className="relative w-full max-w-xs aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800 border border-white/10">
                  {form.imageUrl ? (
                    <Image
                      src={form.imageUrl}
                      alt={form.name || "Preview"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white/30 text-xs">
                      No Image Uploaded
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="font-bold">{form.name || "Package Name"}</h3>
                    <p className="text-white/70 text-sm">{form.location || "Location"}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs bg-white/20 backdrop-blur-md rounded-full px-3 py-1">{form.duration || "Duration"}</span>
                      <span className="font-bold text-amber-300">{form.price || "₹0"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm py-2.5 px-6 rounded-xl transition-all cursor-pointer disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Update Package" : "Add Package"}
                </button>
                <button type="button" onClick={resetForm} className="bg-white/5 hover:bg-white/10 text-white/60 font-medium text-sm py-2.5 px-6 rounded-xl transition-all cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 rounded-2xl h-48 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-2xl border border-white/5">
            <p className="text-white/40 text-sm">No packages yet. Click &quot;Add Package&quot; to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all">
                <div className="relative w-full aspect-[4/3] bg-gray-800">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: item.gradient || "linear-gradient(135deg, #1e293b, #0f172a)" }}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm text-white/80 hover:text-white flex items-center justify-center cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-500/80 text-white hover:bg-red-500 flex items-center justify-center cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white z-10">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-white/70 text-sm">{item.location}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs bg-white/20 backdrop-blur-md rounded-full px-3 py-1">{item.duration}</span>
                      <span className="font-bold text-amber-300">{item.price}</span>
                    </div>
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

