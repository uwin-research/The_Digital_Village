"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-amber-950">Thank you</h1>
        <p className="text-lg text-amber-800">
          We received your message. This site is educational only; we can&apos;t give personal advice, but we read feedback. If you think you&apos;re at risk, contact your phone provider or a trusted family member.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-amber-950">Contact</h1>
      <p className="mb-6 text-lg text-amber-800">
        Send us a message. We can&apos;t give personal advice, but we read feedback.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-base font-medium text-amber-900">
            Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-amber-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-base font-medium text-amber-900">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-amber-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-1 block text-base font-medium text-amber-900">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-amber-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-amber-500 px-6 py-4 text-lg font-semibold text-amber-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
        >
          Send message
        </button>
      </form>
    </div>
  );
}
