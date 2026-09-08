import { useState } from "react";
import { finalCta } from "../data/content.js";
import SectionTag from "../components/SectionTag.jsx";
import Img from "../components/Img.jsx";

const INITIAL = { name: "", email: "", phone: "", type: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    // Front-end confirmation only — wire this to your endpoint / mail service.
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm(INITIAL);
    }, 4000);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-journey section-pad" aria-label="Contact">
      {/* Partial architectural image band behind the form column */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block" aria-hidden="true">
        <Img
          src="/images/cta.jpg"
          alt=""
          fill
          eager
          overlay="ov-ivory-left"
          grain
          fallbackVariant="complex"
          imgClassName="opacity-90"
        />
      </div>

      <div className="container-x relative">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          {/* Left — editorial content */}
          <div className="lg:col-span-5">
            <div data-reveal="">
              <SectionTag>{finalCta.eyebrow}</SectionTag>
              <h2 className="h-d2 mt-7 text-charcoal">
                {finalCta.titleLines.map((line) => (
                  <span key={line} className="block overflow-hidden split-line"><span>{line}</span></span>
                ))}
              </h2>
              <p className="lede mt-7 max-w-md">{finalCta.body}</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4" data-reveal="">
              <a href={finalCta.primaryHref} className="btn btn-solid" data-cursor-label="Start project">
                <span className="bl">{finalCta.primary}</span>
                <span className="ba">→</span>
              </a>
              <a href={finalCta.secondaryHref} className="btn btn-outline" data-cursor-label="Call team">
                <span className="bl">{finalCta.secondary}</span>
                <span className="ba">→</span>
              </a>
            </div>

            <div className="mt-12 space-y-3 border-t hairline-t pt-8 text-sm" data-reveal="">
              <a href={`mailto:${finalCta.email}`} className="block text-charcoal/75 transition-colors hover:text-bronze">
                {finalCta.email}
              </a>
              <a href={finalCta.secondaryHref} className="block text-charcoal/75 transition-colors hover:text-bronze">
                {finalCta.phone}
              </a>
              <p className="text-charcoal/60">{finalCta.location}</p>
            </div>
          </div>

          {/* Right — premium minimal form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              data-reveal=""
              className="rounded-[var(--radius-card)] bg-card/95 p-7 shadow-[var(--shadow-soft)] backdrop-blur sm:p-10"
              aria-label="Project inquiry"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="field">
                  <span className="field-label">Name</span>
                  <input className="input" type="text" required placeholder="Your full name" value={form.name} onChange={set("name")} />
                </label>
                <label className="field">
                  <span className="field-label">Email</span>
                  <input className="input" type="email" required placeholder="you@company.com" value={form.email} onChange={set("email")} />
                </label>
                <label className="field">
                  <span className="field-label">Phone</span>
                  <input className="input" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set("phone")} />
                </label>
                <label className="field">
                  <span className="field-label">Project Type</span>
                  <select className="input" required value={form.type} onChange={set("type")}>
                    <option value="" disabled>Select a project type</option>
                    {finalCta.projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="field sm:col-span-2">
                  <span className="field-label">Message</span>
                  <textarea
                    className="input min-h-[7.5rem] resize-y"
                    required
                    placeholder="Tell us about your site, programme and timeline…"
                    value={form.message}
                    onChange={set("message")}
                  />
                </label>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[0.66rem] uppercase tracking-[0.16em] text-charcoal/45">
                  Response within one working day
                </p>
                <button type="submit" className="btn btn-dark" data-cursor-label="Send">
                  <span className="bl">{sent ? "Inquiry Sent ✓" : "Send Inquiry"}</span>
                  <span className="ba">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
