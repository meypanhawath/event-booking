"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from "lucide-react";
import Navbar from "./ui/navbar";

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
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form submitted:", form);
      setSubmitted(true);
      setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
      
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    
    <>
    <Navbar />
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#C14FE6] rounded-full blur-3xl opacity-20 top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#C14FE6] rounded-full blur-3xl opacity-20 bottom-20 right-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute w-72 h-72 bg-[#C14FE6] rounded-full blur-3xl opacity-10 top-1/2 left-1/3"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h1 className="text-6xl xl:pt-20 md:text-7xl font-bold text-[#C14FE6] mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              We're here to help and answer any question you might have
            </p>
            <p className="text-gray-600">
              Looking forward to hearing from you!
            </p>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="max-w-6xl mx-auto mb-8 p-4 bg-green-100 border border-green-500 rounded-xl flex items-center gap-3 animate-fade-in">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-black">Message Sent Successfully!</p>
                <p className="text-sm text-gray-700">We'll get back to you shortly.</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Contact Section */}
        <div className="px-6 pb-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto bg-white border border-[#C14FE6]/20 rounded-3xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-black mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-lg outline-none transition-all ${errors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#C14FE6] focus:bg-gray-50"}`}
                  />
                  {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-lg outline-none transition-all ${errors.lastName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#C14FE6] focus:bg-gray-50"}`}
                  />
                  {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-lg outline-none transition-all ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#C14FE6] focus:bg-gray-50"}`}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-lg outline-none transition-all ${errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#C14FE6] focus:bg-gray-50"}`}
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-lg outline-none transition-all ${errors.subject ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#C14FE6] focus:bg-gray-50"}`}
                />
                {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-lg outline-none transition-all resize-none ${errors.message ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#C14FE6] focus:bg-gray-50"}`}
                />
                {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#C14FE6] hover:bg-[#C14FE6]/80 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-[#C14FE6]/50 hover:shadow-[#C14FE6]/75"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-black mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {[
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
                  a: "Yes! We provide 24/7 customer support via email and phone.",
                },
                {
                  q: "Can I schedule a consultation?",
                  a: "Absolutely! Contact us and we'll arrange a time that works for you.",
                },
              ].map((item, idx) => (
                <details key={idx} className="group bg-white border border-[#C14FE6]/20 rounded-lg p-6 cursor-pointer hover:border-[#C14FE6] transition-all">
                  <summary className="flex items-center justify-between font-semibold text-lg text-black">
                    {item.q}
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-700">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
