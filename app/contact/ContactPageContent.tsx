"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactPageContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = [
      `Hi, I'm reaching out via the Contact form!`,
      ``,
      `👤 Name: ${formData.name}`,
      `📧 Email: ${formData.email}`,
      `📞 Phone: ${formData.phone}`,
      formData.subject ? `📋 Subject: ${formData.subject}` : "",
      `💬 Message: ${formData.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918082069080?text=${encoded}`, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <main className="bg-white">
      {/* ════════════════════════════════════════════════════════
          1. HERO BANNER
         ════════════════════════════════════════════════════════ */}
      <section className="relative h-[55vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/travel-banner.png"
          alt="Contact KK Tour & Travel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
            Contact Us
          </h1>
          <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            We&apos;re here to help plan your dream trip to Jammu &amp; Kashmir.
            Reach out anytime!
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. CONTACT INFO CARDS
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 -mt-24 relative z-20">
            {/* Phone */}
            <a
              href="tel:+918082069080"
              className="group bg-white rounded-2xl p-7 shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Phone</h3>
              <p className="text-gray-500 text-sm">+91 80820 69080</p>
              <p className="text-amber-500 text-xs font-medium mt-2">Tap to call →</p>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/918082069080?text=Hi%20Ankur%2C%20I%20want%20to%20know%20more%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-7 shadow-xl border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">WhatsApp</h3>
              <p className="text-gray-500 text-sm">Chat directly on WhatsApp</p>
              <p className="text-emerald-500 text-xs font-medium mt-2">Open chat →</p>
            </a>

            {/* Email */}
            <a
              href="mailto:kktourtravel21@gmail.com"
              className="group bg-white rounded-2xl p-7 shadow-xl border border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-500 text-sm">kktourtravel21@gmail.com</p>
              <p className="text-red-500 text-xs font-medium mt-2">Send an email →</p>
            </a>

            {/* Website */}
            <a
              href="https://www.kkkatra.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-7 shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Official Website</h3>
              <p className="text-gray-500 text-sm">www.kkkatra.com</p>
              <p className="text-amber-500 text-xs font-medium mt-2">Visit website →</p>
            </a>

            {/* Address */}
            <a
              href="https://maps.app.goo.gl/QT1z5bLdRtCR5Uw39"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-7 shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Address</h3>
              <p className="text-gray-500 text-sm">Katra, Reasi District, J&amp;K 182301</p>
              <p className="text-blue-500 text-xs font-medium mt-2">View on map →</p>
            </a>

            {/* Hours */}
            <div className="group bg-white rounded-2xl p-7 shadow-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Hours</h3>
              <p className="text-gray-500 text-sm">Open 24 hours, 7 days</p>
              <p className="text-emerald-500 text-xs font-medium mt-2 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Available Now
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. CONTACT FORM + MAP
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
              Send Us a Message
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              We&apos;d Love to Hear From You
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Fill out the form below and we&apos;ll get back to you via WhatsApp within minutes.
            </p>
            <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100">
              {submitted && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-emerald-700 text-sm font-medium">
                    Message sent! We&apos;ll respond on WhatsApp shortly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Phone + Subject Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0.75rem center",
                        backgroundSize: "1rem",
                      }}
                    >
                      <option value="">Select a topic</option>
                      <option value="Tour Package Inquiry">Tour Package Inquiry</option>
                      <option value="Hotel Booking">Hotel Booking</option>
                      <option value="Cab Service">Cab Service</option>
                      <option value="Vaishno Devi Yatra">Vaishno Devi Yatra</option>
                      <option value="Custom Trip">Custom Trip</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your travel plans, group size, preferred dates..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-[1.01] cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send Message on WhatsApp
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-[350px] lg:h-full min-h-[350px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3370.6!2d74.9353285!3d32.9914833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e79aa0c066bb3%3A0x5cdba12782b1a340!2skk%20tour%20travel%20katra!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="KK Tour & Travel Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4. FAQ SECTION
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
              Common Questions
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="mt-5 mx-auto w-14 h-1 rounded-full bg-amber-500" />
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How do I book a tour package?",
                a: "Simply click the 'Book Now' button in the navigation bar, fill in your details, and your booking request will be sent to us via WhatsApp. We'll respond within minutes!",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept UPI, bank transfer, and cash payments. Advance booking requires a small deposit, and the rest can be paid on arrival.",
              },
              {
                q: "Do you provide pickup from Jammu airport/station?",
                a: "Yes! We offer pickup and drop services from Jammu Airport, Railway Station, and Katra Bus Stand. Just mention it in your booking.",
              },
              {
                q: "Can I customize my tour package?",
                a: "Absolutely! We specialize in customized itineraries. Tell us your preferences, budget, and group size, and we'll create a perfect plan for you.",
              },
              {
                q: "Is it safe to travel to Kashmir?",
                a: "Yes, Kashmir is one of India's most beautiful and welcoming tourist destinations. We ensure all our tours follow safe, well-established routes with experienced local guides.",
              },
            ].map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. CTA BANNER
         ════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            Call us now or send a WhatsApp message — we respond in minutes!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/918082069080?text=Hi%20Ankur%2C%20I%20want%20to%20plan%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold py-3.5 px-10 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/40 transform hover:scale-105"
            >
              Chat on WhatsApp
            </a>
            <a
              href="tel:+918082069080"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-10 rounded-full transition-all duration-300 border border-white/20"
            >
              Call +91 80820 69080
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─── FAQ Accordion Item ─── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-amber-200">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
      >
        <span className="text-gray-900 font-semibold text-[15px] pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}
