"use client";
import { useState } from "react";
import { site } from "@/content/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const field = "mt-2 w-full border border-line bg-white px-4 py-3 text-base focus:border-box";
  return sent ? (
    <p role="status" className="bg-fog p-6">Thanks. Your email app should have opened with your message. If it did not, write to {site.contact.email}.</p>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const body = `Name: ${d.get("name")}\nPhone: ${d.get("phone")}\n\n${d.get("message")}`;
        window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(String(d.get("subject") || "Enquiry"))}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
      className="space-y-5"
    >
      {/* TODO: replace mailto with a server action or API route when a mail service is chosen. */}
      <label className="block font-medium">Name<input name="name" required autoComplete="name" className={field} /></label>
      <label className="block font-medium">Phone<input name="phone" type="tel" autoComplete="tel" className={field} /></label>
      <label className="block font-medium">Subject<input name="subject" className={field} /></label>
      <label className="block font-medium">Message<textarea name="message" required rows={5} className={field} /></label>
      <button className="min-h-12 bg-box px-8 font-semibold text-white transition-colors hover:bg-box-dark">Send message</button>
    </form>
  );
}
