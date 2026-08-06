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

interface GalleryItem {
  id: string;
  title: string;
  location: string;
  category: string;
  imageUrl: string;
  order: number;
}

const categories = ["Kashmir", "Vaishno Devi", "Hotels", "Adventures"];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [form, setForm] = useState({
    title: "",
    location: "",
    category: "Kashmir",
    imageUrl: "",
    order: 0,
  });

  const fetchItems = async () => {
    try {
      const q = query(collection(db, "gallery"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryItem[];
      setItems(data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({ title: "", location: "", category: "Kashmir", imageUrl: "", order: items.length + 1 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: GalleryItem) => {
    setForm({
      title: item.title,
      location: item.location,
      category: item.category,
      imageUrl: item.imageUrl,
      order: item.order,
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      setItems((prev) => prev.filter((i) => i.id !== id));
      setStatusMsg("Item deleted successfully!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete. Try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      alert("Please enter a title and select/upload an image.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "gallery", editing.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        setStatusMsg("Gallery item updated successfully!");
      } else {
        await addDoc(collection(db, "gallery"), {
          ...form,
          order: items.length + 1,
          createdAt: serverTimestamp(),
        });
        setStatusMsg("New gallery item added successfully!");
      }
      await fetchItems();
      resetForm();
      setTimeout(() => setStatusMsg(""), 4000);
    } catch (err: any) {
      console.error("Save error:", err);
      alert(`Save error: ${err?.message || "Check Firebase permissions and rules."}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Gallery</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} items uploaded</p>
          </div>
          <button
            onClick={() => {
              setForm({ title: "", location: "", category: "Kashmir", imageUrl: "", order: items.length + 1 });
              setEditing(null);
              setShowForm(!showForm);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showForm ? "Close Form" : "Add Item"}
          </button>
        </div>

        {statusMsg && (
          <div className="mb-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
            <span>✓</span> {statusMsg}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 mb-8 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-5">
              {editing ? "Edit Gallery Item" : "Add New Gallery Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="e.g. Dal Lake Sunset"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Location *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                    placeholder="e.g. Srinagar, Kashmir"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 appearance-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-gray-900">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Image *</label>
                <ImageUpload
                  key={form.imageUrl || "new"}
                  currentUrl={form.imageUrl}
                  folder="gallery"
                  onUpload={(url) => setForm({ ...form, imageUrl: url })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold text-sm py-2.5 px-6 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update Item" : "Save & Publish"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white/5 hover:bg-white/10 text-white/60 font-medium text-sm py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                >
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
              <div key={i} className="bg-gray-900 rounded-2xl h-64 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-2xl border border-white/5">
            <svg className="w-12 h-12 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-white/40 text-sm mb-4">No gallery items yet. Click &quot;Add Item&quot; to upload your first image.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group bg-gray-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                <div className="relative h-44 bg-gray-950">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" unoptimized />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-sm text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-500 flex items-center justify-center cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs text-white font-medium">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  <p className="text-white/40 text-xs mt-0.5">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
