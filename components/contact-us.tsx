"use client";

import { useState } from "react";
import { CheckCircle, Clock, Mail, MapPin, Phone, Send } from "lucide-react";

const contactCards = [
  {
    icon: Mail,
    title: "Email Us",
    value: "support@eventizo.com",
    detail: "For bookings, payments, and account support.",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+855 12 345 678",
    detail: "Available during working hours for urgent help.",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Phnom Penh, Cambodia",
    detail: "Our team is available for partner and event discussions.",
  },
  {
    icon: Clock,
    title: "Response Time",
    value: "Within 24 hours",
    detail: "Most requests are answered on the same business day.",
  },
] as const;

const faqs = [
  {
    q: "How quickly will I receive a response?",
    a: "We typically respond to all inquiries within 24 business hours.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers.",
  },
  {
    q: "Do you offer customer support?",
    a: "Yes. We provide customer support for bookings, account issues, and organizer questions.",
  },
  {
    q: "Can I schedule a consultation?",
    a: "Yes. Send us your preferred date and topic, and we will follow up with available times.",
  },
] as const;

export default function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Form submitted:", form);
    setSubmitted(true);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const inputClassName =
    "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <section className="relative isolate border-b border-border">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(193,79,230,0.12),transparent_34%),linear-gradient(180deg,var(--background),var(--muted))]" />
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                Contact Eventizo
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Get in touch with the team behind your next event.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                Questions about bookings, payments, partnerships, or organizer support. Send us a message and we will
                respond with the right person.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {contactCards.map(({ icon: Icon, title, value, detail }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/35 xl:min-h-[220px]"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
                  <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 xl:grid-cols-12 xl:items-start">
          <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10 xl:col-span-7">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Send us a message</h2>
              <p className="mt-2 text-muted-foreground">
                Fill in the form and we will route your request to the correct team member.
              </p>
            </div>

            {submitted ? (
              <div className="mb-8 flex items-start gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm">
                <CheckCircle className="mt-0.5 size-5 text-green-600" />
                <div>
                  <p className="font-semibold text-foreground">Message sent successfully</p>
                  <p className="text-muted-foreground">We will get back to you shortly.</p>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-foreground">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`${inputClassName} ${errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input"}`}
                  />
                  {errors.firstName ? <p className="mt-2 text-sm text-red-600">{errors.firstName}</p> : null}
                </div>

                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-foreground">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`${inputClassName} ${errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input"}`}
                  />
                  {errors.lastName ? <p className="mt-2 text-sm text-red-600">{errors.lastName}</p> : null}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`${inputClassName} ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input"}`}
                  />
                  {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                    className={`${inputClassName} ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input"}`}
                  />
                  {errors.phone ? <p className="mt-2 text-sm text-red-600">{errors.phone}</p> : null}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-foreground">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={handleChange}
                  className={`${inputClassName} ${errors.subject ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input"}`}
                />
                {errors.subject ? <p className="mt-2 text-sm text-red-600">{errors.subject}</p> : null}
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClassName} resize-none ${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input"}`}
                />
                {errors.message ? <p className="mt-2 text-sm text-red-600">{errors.message}</p> : null}
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Send className="size-4" />
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-6 xl:col-span-5 xl:sticky xl:top-28">
            <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Support that matches the platform</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We keep the contact experience simple and direct, just like the rest of the product. No extra visual
                effects, just clear information and fast follow-up.
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-muted px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">Booking support</p>
                  <p className="mt-1 text-sm text-muted-foreground">Help with confirmations, payment issues, or ticket access.</p>
                </div>
                <div className="rounded-2xl bg-muted px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">Organizer inquiries</p>
                  <p className="mt-1 text-sm text-muted-foreground">Reach out for event setup, platform questions, or collaboration.</p>
                </div>
                <div className="rounded-2xl bg-muted px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">General questions</p>
                  <p className="mt-1 text-sm text-muted-foreground">We can point you to the right person even if you are not sure where to start.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Frequently asked questions</h2>
              <div className="mt-6 space-y-4">
                {faqs.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-border bg-background px-5 py-4 transition-colors hover:border-primary/35"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-foreground">
                      {item.q}
                      <span className="text-primary transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
          </div>
        </section>
      </main>
  );
}
