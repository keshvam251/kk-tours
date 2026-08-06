"use client";

import AdminLayout from "./components/AdminLayout";
import ImageUpload from "./components/ImageUpload";
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

/* ─── Interfaces ─── */
interface GalleryItem {
  id: string;
  title: string;
  location: string;
  category: string;
  imageUrl: string;
  order: number;
}

interface RoomItem {
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

interface PackageItem {
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

const categories = ["Kashmir", "Vaishno Devi", "Hotels", "Adventures"];

export default function AdminDashboardAllInOne() {
  const [activeTab, setActiveTab] = useState<"overview" | "gallery" | "rooms" | "packages">("overview");

  /* ─── State for Collections ─── */
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  /* ─── Forms State ─── */
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editGallery, setEditGallery] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState({ title: "", location: "", category: "Kashmir", imageUrl: "", order: 0 });

  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editRoom, setEditRoom] = useState<RoomItem | null>(null);
  const [roomForm, setRoomForm] = useState({ name: "", description: "", price: "", priceNote: "per night", imageUrl: "", features: "", badge: "", order: 0 });

  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editPackage, setEditPackage] = useState<PackageItem | null>(null);
  const [packageForm, setPackageForm] = useState({ name: "", location: "Jammu & Kashmir", duration: "", price: "", description: "", imageUrl: "", order: 0 });

  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  /* ─── Fetch All Data ─── */
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [gSnap, rSnap, pSnap] = await Promise.all([
        getDocs(query(collection(db, "gallery"), orderBy("order", "asc"))).catch(() => null),
        getDocs(query(collection(db, "rooms"), orderBy("order", "asc"))).catch(() => null),
        getDocs(query(collection(db, "packages"), orderBy("order", "asc"))).catch(() => null),
      ]);

      if (gSnap) setGallery(gSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryItem[]);
      if (rSnap) setRooms(rSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as RoomItem[]);
      if (pSnap) setPackages(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as PackageItem[]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  /* ─── Gallery Handlers ─── */
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title) return alert("Title is required!");
    if (!galleryForm.imageUrl) return alert("Please select an image file or paste an image link!");

    setSaving(true);
    try {
      if (editGallery) {
        await updateDoc(doc(db, "gallery", editGallery.id), { ...galleryForm, updatedAt: serverTimestamp() });
        showToast("✓ Gallery item updated!");
      } else {
        await addDoc(collection(db, "gallery"), { ...galleryForm, order: gallery.length + 1, createdAt: serverTimestamp() });
        showToast("✓ Gallery item added successfully!");
      }
      setShowGalleryForm(false);
      setEditGallery(null);
      setGalleryForm({ title: "", location: "", category: "Kashmir", imageUrl: "", order: 0 });
      await fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert(`Save error: ${err?.message || "Check Firebase permissions"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      setGallery((prev) => prev.filter((i) => i.id !== id));
      showToast("Item deleted.");
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  /* ─── Rooms Handlers ─── */
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.name || !roomForm.price) return alert("Room name and price are required!");
    if (!roomForm.imageUrl) return alert("Please select a room image file or paste an image link!");

    setSaving(true);
    const data = {
      name: roomForm.name,
      description: roomForm.description,
      price: roomForm.price,
      priceNote: roomForm.priceNote,
      imageUrl: roomForm.imageUrl,
      features: roomForm.features.split(",").map((f) => f.trim()).filter(Boolean),
      badge: roomForm.badge,
      order: roomForm.order,
    };
    try {
      if (editRoom) {
        await updateDoc(doc(db, "rooms", editRoom.id), { ...data, updatedAt: serverTimestamp() });
        showToast("✓ Room updated successfully!");
      } else {
        await addDoc(collection(db, "rooms"), { ...data, order: rooms.length + 1, createdAt: serverTimestamp() });
        showToast("✓ Room added successfully!");
      }
      setShowRoomForm(false);
      setEditRoom(null);
      setRoomForm({ name: "", description: "", price: "", priceNote: "per night", imageUrl: "", features: "", badge: "", order: 0 });
      await fetchAllData();
    } catch (err: any) {
      alert(`Error saving room: ${err?.message || "Check Firebase permissions"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    try {
      await deleteDoc(doc(db, "rooms", id));
      setRooms((prev) => prev.filter((i) => i.id !== id));
      showToast("Room deleted.");
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  /* ─── Packages Handlers ─── */
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.name || !packageForm.price || !packageForm.duration) return alert("Name, duration and price are required!");
    setSaving(true);
    try {
      if (editPackage) {
        await updateDoc(doc(db, "packages", editPackage.id), { ...packageForm, updatedAt: serverTimestamp() });
        showToast("✓ Package updated successfully!");
      } else {
        await addDoc(collection(db, "packages"), { ...packageForm, order: packages.length + 1, createdAt: serverTimestamp() });
        showToast("✓ Package created successfully!");
      }
      setShowPackageForm(false);
      setEditPackage(null);
      setPackageForm({ name: "", location: "Jammu & Kashmir", duration: "", price: "", description: "", imageUrl: "", order: 0 });
      await fetchAllData();
    } catch (err: any) {
      alert(`Error saving package: ${err?.message || "Check Firebase permissions"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    try {
      await deleteDoc(doc(db, "packages", id));
      setPackages((prev) => prev.filter((i) => i.id !== id));
      showToast("Package deleted.");
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Admin <span className="text-amber-400">Dashboard</span>
            </h1>
            <p className="text-white/40 text-sm mt-1">Manage Gallery, Rooms, and Tour Packages all in one place</p>
          </div>
          <button
            onClick={fetchAllData}
            className="self-start sm:self-auto bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="mb-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 animate-bounce">
            <span>✓</span> {toastMsg}
          </div>
        )}

        {/* Unified Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-900/80 backdrop-blur p-1.5 rounded-2xl border border-white/5">
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "gallery", label: `🖼️ Gallery (${gallery.length})` },
            { id: "rooms", label: `🏨 Rooms (${rooms.length})` },
            { id: "packages", label: `🏔️ Packages (${packages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════
            TAB 1: OVERVIEW
           ════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div
                onClick={() => setActiveTab("gallery")}
                className="bg-gray-900 p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🖼️</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 font-semibold px-3 py-1 rounded-full">Gallery</span>
                </div>
                <p className="text-3xl font-extrabold text-white">{gallery.length}</p>
                <p className="text-white/40 text-xs mt-1">Photos uploaded</p>
                <p className="text-amber-400 text-xs font-semibold mt-4 group-hover:translate-x-1 transition-transform">Manage Gallery →</p>
              </div>

              <div
                onClick={() => setActiveTab("rooms")}
                className="bg-gray-900 p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🏨</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-3 py-1 rounded-full">Rooms</span>
                </div>
                <p className="text-3xl font-extrabold text-white">{rooms.length}</p>
                <p className="text-white/40 text-xs mt-1">Room types listed</p>
                <p className="text-amber-400 text-xs font-semibold mt-4 group-hover:translate-x-1 transition-transform">Manage Rooms →</p>
              </div>

              <div
                onClick={() => setActiveTab("packages")}
                className="bg-gray-900 p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🏔️</span>
                  <span className="text-xs bg-teal-500/20 text-teal-300 font-semibold px-3 py-1 rounded-full">Packages</span>
                </div>
                <p className="text-3xl font-extrabold text-white">{packages.length}</p>
                <p className="text-white/40 text-xs mt-1">Tour packages created</p>
                <p className="text-amber-400 text-xs font-semibold mt-4 group-hover:translate-x-1 transition-transform">Manage Packages →</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-bold text-base mb-4">Quick Add Content</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => { setActiveTab("gallery"); setShowGalleryForm(true); }}
                  className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl text-left border border-white/5 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-2xl">+</span>
                  <div>
                    <p className="text-sm font-bold">Add Gallery Image</p>
                    <p className="text-white/40 text-xs">Upload new photos</p>
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab("rooms"); setShowRoomForm(true); }}
                  className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl text-left border border-white/5 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-2xl">+</span>
                  <div>
                    <p className="text-sm font-bold">Add New Room</p>
                    <p className="text-white/40 text-xs">Add room with price &amp; features</p>
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab("packages"); setShowPackageForm(true); }}
                  className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl text-left border border-white/5 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-2xl">+</span>
                  <div>
                    <p className="text-sm font-bold">Add Tour Package</p>
                    <p className="text-white/40 text-xs">Create Kashmir/Yatra package</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 2: GALLERY MANAGER
           ════════════════════════════════════════════════════════ */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-900 p-4 rounded-2xl border border-white/5">
              <h2 className="text-white font-bold">Gallery Management</h2>
              <button
                onClick={() => {
                  setGalleryForm({ title: "", location: "", category: "Kashmir", imageUrl: "", order: gallery.length + 1 });
                  setEditGallery(null);
                  setShowGalleryForm(!showGalleryForm);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                {showGalleryForm ? "Cancel" : "+ Add Gallery Image"}
              </button>
            </div>

            {showGalleryForm && (
              <form onSubmit={handleSaveGallery} className="bg-gray-900 p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-amber-400 font-bold text-sm">{editGallery ? "Edit Image" : "Upload New Image"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Vaishno Devi Bhawan"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Katra, Jammu"
                      value={galleryForm.location}
                      onChange={(e) => setGalleryForm({ ...galleryForm, location: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Category *</label>
                    <select
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-gray-900">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Display Order</label>
                    <input
                      type="number"
                      placeholder="Order"
                      value={galleryForm.order}
                      onChange={(e) => setGalleryForm({ ...galleryForm, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Select Image File or Paste Link *</label>
                  <ImageUpload
                    key={galleryForm.imageUrl || "new-gallery-img"}
                    currentUrl={galleryForm.imageUrl}
                    folder="gallery"
                    onUpload={(url) => setGalleryForm({ ...galleryForm, imageUrl: url })}
                  />
                </div>

                <button type="submit" disabled={saving} className="bg-amber-500 text-gray-950 font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-amber-400 disabled:opacity-50">
                  {saving ? "Saving..." : editGallery ? "Update Image" : "Save Image"}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-white/5 p-3 flex flex-col justify-between">
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-gray-950">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.title}</h4>
                    <p className="text-white/40 text-xs">{item.location} • <span className="text-amber-400">{item.category}</span></p>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                      <button
                        onClick={() => { setEditGallery(item); setGalleryForm({ title: item.title, location: item.location, category: item.category, imageUrl: item.imageUrl, order: item.order }); setShowGalleryForm(true); }}
                        className="text-xs text-white/60 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg cursor-pointer flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 3: ROOMS MANAGER
           ════════════════════════════════════════════════════════ */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-900 p-4 rounded-2xl border border-white/5">
              <h2 className="text-white font-bold">Rooms Management</h2>
              <button
                onClick={() => {
                  setRoomForm({ name: "", description: "", price: "", priceNote: "per night", imageUrl: "", features: "", badge: "", order: rooms.length + 1 });
                  setEditRoom(null);
                  setShowRoomForm(!showRoomForm);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                {showRoomForm ? "Cancel" : "+ Add New Room"}
              </button>
            </div>

            {showRoomForm && (
              <form onSubmit={handleSaveRoom} className="bg-gray-900 p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-amber-400 font-bold text-sm">{editRoom ? "Edit Room" : "Add New Room"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Room Name (e.g. Deluxe Double Room)"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  <input
                    type="text"
                    placeholder="Badge (e.g. Most Popular)"
                    value={roomForm.badge}
                    onChange={(e) => setRoomForm({ ...roomForm, badge: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <textarea
                  placeholder="Room Description"
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  rows={2}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Price (e.g. ₹1,499)"
                    value={roomForm.price}
                    onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  <input
                    type="text"
                    placeholder="Price Note (e.g. per night)"
                    value={roomForm.priceNote}
                    onChange={(e) => setRoomForm({ ...roomForm, priceNote: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  <input
                    type="text"
                    placeholder="Features (comma-separated)"
                    value={roomForm.features}
                    onChange={(e) => setRoomForm({ ...roomForm, features: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <ImageUpload
                  key={roomForm.imageUrl || "new-room-img"}
                  currentUrl={roomForm.imageUrl}
                  folder="rooms"
                  onUpload={(url) => setRoomForm({ ...roomForm, imageUrl: url })}
                />
                <button type="submit" disabled={saving} className="bg-amber-500 text-gray-950 font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-amber-400 disabled:opacity-50">
                  {saving ? "Saving..." : editRoom ? "Update Room" : "Save Room"}
                </button>
              </form>
            )}

            <div className="space-y-4">
              {rooms.map((room) => (
                <div key={room.id} className="bg-gray-900 rounded-2xl border border-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-950">
                      <Image src={room.imageUrl} alt={room.name} fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">{room.name} {room.badge && <span className="text-xs bg-amber-500 text-gray-950 px-2 py-0.5 rounded-full font-bold ml-2">{room.badge}</span>}</h4>
                      <p className="text-white/40 text-xs mt-1 line-clamp-1">{room.description}</p>
                      <p className="text-amber-400 font-bold text-sm mt-1">{room.price} <span className="text-white/30 font-normal text-xs">/ {room.priceNote}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                    <button
                      onClick={() => { setEditRoom(room); setRoomForm({ name: room.name, description: room.description, price: room.price, priceNote: room.priceNote, imageUrl: room.imageUrl, features: (room.features || []).join(", "), badge: room.badge || "", order: room.order }); setShowRoomForm(true); }}
                      className="text-xs text-white/60 hover:text-white bg-white/5 px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 4: PACKAGES MANAGER
           ════════════════════════════════════════════════════════ */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-900 p-4 rounded-2xl border border-white/5">
              <h2 className="text-white font-bold">Tour Packages Management</h2>
              <button
                onClick={() => {
                  setPackageForm({ name: "", location: "Jammu & Kashmir", duration: "", price: "", description: "", imageUrl: "", order: packages.length + 1 });
                  setEditPackage(null);
                  setShowPackageForm(!showPackageForm);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                {showPackageForm ? "Cancel" : "+ Add Tour Package"}
              </button>
            </div>

            {showPackageForm && (
              <form onSubmit={handleSavePackage} className="bg-gray-900 p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-amber-400 font-bold text-sm">{editPackage ? "Edit Package" : "Add Package"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Package Name (e.g. Dal Lake Houseboat)"
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Jammu & Kashmir)"
                    value={packageForm.location}
                    onChange={(e) => setPackageForm({ ...packageForm, location: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Duration (e.g. 5 Days / 4 Nights)"
                    value={packageForm.duration}
                    onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  <input
                    type="text"
                    placeholder="Price (e.g. ₹18,999)"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                    required
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>

                <textarea
                  placeholder="Package description, itinerary highlights, or inclusions..."
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />

                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2">Package Image</label>
                  <ImageUpload
                    currentUrl={packageForm.imageUrl}
                    folder="packages"
                    onUpload={(url) => setPackageForm((prev) => ({ ...prev, imageUrl: url }))}
                  />
                </div>

                <button type="submit" disabled={saving} className="bg-amber-500 text-gray-950 font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-amber-400 disabled:opacity-50">
                  {saving ? "Saving..." : editPackage ? "Update Package" : "Save Package"}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="relative group bg-gray-900 rounded-2xl overflow-hidden border border-white/10 p-4 aspect-[4/3] flex flex-col justify-between">
                  {pkg.imageUrl ? (
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: pkg.gradient || "linear-gradient(135deg, #1e293b, #0f172a)" }}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />
                  
                  <div className="relative z-10 drop-shadow-lg">
                    <h4 className="text-white font-extrabold text-lg">{pkg.name}</h4>
                    <p className="text-white/80 text-xs">{pkg.location}</p>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between pt-3 border-t border-white/20">
                      <span className="text-xs bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-full">{pkg.duration}</span>
                      <span className="text-amber-300 font-extrabold text-base drop-shadow-md">{pkg.price}</span>
                    </div>
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditPackage(pkg); setPackageForm({ name: pkg.name, location: pkg.location, duration: pkg.duration, price: pkg.price, description: pkg.description || "", imageUrl: pkg.imageUrl || "", order: pkg.order }); setShowPackageForm(true); }}
                        className="text-xs text-white bg-black/60 hover:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg cursor-pointer flex-1 text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="text-xs text-red-200 bg-red-950/80 hover:bg-red-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
