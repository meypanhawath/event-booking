import Image from "next/image";
import Navbar from "./ui/navbar";
// import panhawath from "../public/panhawath.jpg"

export default function AboutUs() {
  return (

    
    <>
        <Navbar />
        <div className="bg-black text-white">

      {/* HERO */}
      <section className="relative h-[70vh] w-full">
        <Image src="/rub.webp" alt="hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-5xl font-bold mb-4">About us</h1>
          <p className="max-w-2xl text-white/70 text-sm">
            Welcome to Evenjo – your go-to platform for finding, booking, and enjoying top events worldwide. From concerts and sports to theater and festivals, we make unforgettable experiences easy to access.
            Behind the scenes, our friendly and passionate team is here to support you every step of the way.
            Got a question or need help? We're just a message away!
          </p>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl text-center mb-10 font-semibold">Why Choose Evenjo?</h2>

        <div className="grid md:grid-cols-2 gap-4">

          {/* Card 1 */}
          <div className="relative rounded-2xl p-10 overflow-hidden min-h-[300px]" style={{ background: "#111111" }}>
            <h3 className="text-white font-bold text-xl mb-3">Your Ticket is on the Way!</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-[55%]">
              We're sending your ticket straight to your email. Just confirm your name and email
              below, and you're all set for an unforgettable experience!
            </p>
            <svg className="absolute right-6 bottom-6" width="160" height="190" viewBox="0 0 130 155" fill="none">
              <rect x="18" y="5" width="78" height="135" rx="12" fill="#0a0a0a" stroke="#C14FE6" strokeWidth="2"/>
              <rect x="26" y="18" width="62" height="90" rx="4" fill="#1a001a"/>
              <rect x="42" y="3" width="30" height="5" rx="2.5" fill="#C14FE6" opacity=".5"/>
              <circle cx="57" cy="128" r="5" fill="#C14FE6" opacity=".4"/>
              <rect x="31" y="30" width="52" height="36" rx="5" stroke="#C14FE6" strokeWidth="1.8" fill="none"/>
              <path d="M31 35 L57 52 L83 35" stroke="#C14FE6" strokeWidth="1.8" fill="none"/>
              <circle cx="57" cy="82" r="12" stroke="#C14FE6" strokeWidth="1.8" fill="#1a001a"/>
              <path d="M51 82 L55 86 L63 76" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="78" y="55" width="38" height="28" rx="5" fill="#1a001a" stroke="#C14FE6" strokeWidth="1.5"/>
              <path d="M78 60 L97 70 L116 60" stroke="#C14FE6" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-2xl p-10 overflow-hidden min-h-[300px] flex flex-col justify-between" style={{ background: "#1a0020" }}>
            <svg width="100" height="80" viewBox="0 0 90 75" fill="none">
              <rect x="5" y="22" width="80" height="38" rx="6" stroke="#C14FE6" strokeWidth="2" fill="none"/>
              <circle cx="5" cy="41" r="7" fill="#1a0020" stroke="#C14FE6" strokeWidth="2"/>
              <circle cx="85" cy="41" r="7" fill="#1a0020" stroke="#C14FE6" strokeWidth="2"/>
              <line x1="28" y1="22" x2="28" y2="60" stroke="#C14FE6" strokeWidth="1.5" strokeDasharray="4 3"/>
              <circle cx="55" cy="41" r="12" stroke="#C14FE6" strokeWidth="1.8" fill="none"/>
              <text x="51" y="46" fontSize="13" fill="#C14FE6" fontFamily="sans-serif" fontWeight="700">$</text>
              <circle cx="14" cy="10" r="9" fill="#0a0010" stroke="#C14FE6" strokeWidth="1.5"/>
              <text x="10" y="14" fontSize="9" fill="#C14FE6" fontFamily="sans-serif" fontWeight="600">%</text>
            </svg>
            <div>
              <h3 className="text-white font-bold text-xl mb-3">Online Ticket Purchasing</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Allows users to browse events, select seats, and buy tickets instantly via secure payment methods
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative rounded-2xl p-10 overflow-hidden min-h-[280px]" style={{ background: "#1a0020" }}>
            <h3 className="text-white font-bold text-xl mb-3">Customer Support</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-[55%]">
              24/7 live chat, email, or phone support for booking issues.
            </p>
            <svg className="absolute right-6 bottom-6" width="130" height="140" viewBox="0 0 105 115" fill="none">
              <circle cx="52" cy="28" r="16" stroke="#C14FE6" strokeWidth="2" fill="none"/>
              <path d="M36 28 A16 16 0 0 1 68 28" stroke="#C14FE6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <rect x="33" y="24" width="7" height="12" rx="3" stroke="#C14FE6" strokeWidth="1.8" fill="none"/>
              <rect x="65" y="24" width="7" height="12" rx="3" stroke="#C14FE6" strokeWidth="1.8" fill="none"/>
              <rect x="62" y="8" width="36" height="24" rx="6" stroke="#C14FE6" strokeWidth="1.5" fill="none"/>
              <line x1="68" y1="16" x2="90" y2="16" stroke="#C14FE6" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="68" y1="22" x2="85" y2="22" stroke="#C14FE6" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M20 55 A35 35 0 0 1 55 20" stroke="#C14FE6" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M55 90 A35 35 0 0 1 20 55" stroke="#C14FE6" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M17 48 L20 55 L27 51" stroke="#C14FE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M62 93 L55 90 L59 83" stroke="#C14FE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <rect x="40" y="70" width="24" height="38" rx="5" stroke="#C14FE6" strokeWidth="1.8" fill="none"/>
              <circle cx="52" cy="102" r="3" stroke="#C14FE6" strokeWidth="1.2" fill="none"/>
            </svg>
          </div>

          {/* Card 4 */}
          <div className="relative rounded-2xl p-10 overflow-hidden min-h-[280px]" style={{ background: "#111111" }}>
            <svg className="absolute right-8 top-1/2 -translate-y-1/2" width="100" height="115" viewBox="0 0 75 90" fill="none">
              <path d="M24 52 L10 82 L26 74 L32 88" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M51 52 L65 82 L49 74 L43 88" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="37" cy="36" r="28" stroke="#C14FE6" strokeWidth="2.5" fill="none"/>
              <circle cx="37" cy="36" r="20" stroke="#C14FE6" strokeWidth="1.5" fill="none"/>
              <path d="M29 40 L29 32 Q29 28 33 28 L33 26 Q33 22 37 22 L37 28 L41 28 Q45 28 45 32 L45 38 Q45 42 41 42 L29 42 Z" stroke="#C14FE6" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              <rect x="26" y="36" width="4" height="10" rx="1.5" stroke="#C14FE6" strokeWidth="1.5" fill="none"/>
            </svg>
            <h3 className="text-white font-bold text-xl mb-3">Event Discovery</h3>
            <p className="text-white/60 text-sm leading-relaxed pr-32">
              Personalized suggestions based on user preferences, location, and past bookings. Filters for categories, venues, and price ranges. The goal is to detect meaningful occurrences (events) in analysis, or automated responses.
            </p>
          </div>

        </div>
      </section>

    {/* MENTORS SECTION */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-12" style={{ color: "#C14FE6" }}>
          Our Mentors
        </h2>

        <div className="flex flex-wrap justify-center gap-16">

          {/* Mentor 1 */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10">
              <Image
                src="/cher chayya.jpg"
                alt="Chan Chhaya"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-white text-xl font-semibold mt-2">Chan Chhaya</h3>
            <p className="text-white/50 text-sm">Teacher</p>
            <span className="text-xs font-bold px-3 py-1 rounded" style={{ background: "#C14FE620", color: "#C14FE6" }}>
              SENIOR INSTRUCTOR
            </span>
            <div className="flex gap-4 mt-1">
              <a href="mailto:chanchhaya@gmail.com" aria-label="Email">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7 L12 13 L22 7"/>
  </svg>
</a>
              <a href="#" aria-label="GitHub">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#C14FE6">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Mentor 2 */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10">
              <Image
                src="/Mom Reaksmey.jpg"
                alt="Mom Reksmey"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-white text-xl font-semibold mt-2">Mom Reksmey</h3>
            <p className="text-white/50 text-sm">Teacher</p>
            <span className="text-xs font-bold px-3 py-1 rounded" style={{ background: "#C14FE620", color: "#C14FE6" }}>
              INSTRUCTOR LEAD. 
            </span>
            <div className="flex gap-4 mt-1">
              <a href="mailto:momreksmey@gmail.com" aria-label="Email">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7 L12 13 L22 7"/>
  </svg>
</a>
              <a href="#" aria-label="GitHub">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#C14FE6">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="#C14FE6" strokeWidth="1" fill="none"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Mentor 3 */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10">
              <Image
                src="/Kit Tara.jpg"
                alt="Kit Tara"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-white text-xl font-semibold mt-2">Kit Tara</h3>
            <p className="text-white/50 text-sm">Teacher</p>
            <span className="text-xs font-bold px-3 py-1 rounded" style={{ background: "#C14FE620", color: "#C14FE6" }}>
              SENIOR INSTRUCTOR.
            </span>
            <div className="flex gap-4 mt-1">
              <a href="mailto:kittara@gmail.com" aria-label="Email">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7 L12 13 L22 7"/>
  </svg>
</a>
              <a href="#" aria-label="GitHub">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#C14FE6">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="#C14FE6" strokeWidth="1" fill="none"/>
                </svg>
              </a>
            </div>
          </div>

        {/* LMS MEMBERS SECTION */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-12" style={{ color: "#C14FE6" }}>
          Our Members
        </h2>

        <div className="grid grid-cols-4 gap-6 items-start">

  {/* Member 1 */}
  <div className="flex flex-col items-center gap-3">
    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10">
      <Image src="/panhawath.jpg" alt="MEY PANHAWATH" width={160} height={160} className="object-cover w-full h-full"/>
    </div>
    <h3 className="text-white text-xl font-semibold mt-2">MEY PANHAWATH</h3>
    <p className="text-white/50 text-sm">MEMBER</p>
    <span className="text-xs font-bold px-3 py-1 rounded" style={{ background: "#C14FE620", color: "#C14FE6" }}>
      TEAM LEAD.
    </span>
    <div className="flex gap-4 mt-1">
      <a href="mailto:povsoknem@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7 L12 13 L22 7"/>
        </svg>
      </a>
      <a href="https://github.com/povsoknem" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      </a>
    </div>
  </div>

  {/* Member 2 */}
  <div className="flex flex-col items-center gap-3">
    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10">
      <Image src="/menghor.jpg" alt="SIM MENGHOR" width={160} height={160} className="object-cover w-full h-full"/>
    </div>
    <h3 className="text-white text-xl font-semibold mt-2">SIM MENGHOR</h3>
    <p className="text-white/50 text-sm">MEMBER</p>
    <span className="text-xs font-bold px-3 py-1 rounded" style={{ background: "#C14FE620", color: "#C14FE6" }}>
      UX/UI
    </span>
    <div className="flex gap-4 mt-1">
      <a href="mailto:longpiseth@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7 L12 13 L22 7"/>
        </svg>
      </a>
      <a href="https://github.com/longpiseth" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      </a>
    </div>
  </div>

 {/* Member 3 */}
<div className="flex flex-col items-center gap-3">
  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10">
    <Image src="/Q31A6082 copy.JPG" alt="SITHON SAMRACH" width={160} height={160} className="object-cover w-full h-full"/>
  </div>
  <h3 className="text-white text-lg font-semibold mt-2 text-center">SITHON SAMRACH</h3>
  <p className="text-white/50 text-sm">MEMBER</p>
  <span className="text-xs font-bold px-3 py-1 rounded" style={{ background: "#C14FE620", color: "#C14FE6" }}>
    FRONT-END
  </span>
  <div className="flex gap-4 mt-1">
    <a href="mailto:sanhpanha@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7 L12 13 L22 7"/>
      </svg>
    </a>
    <a href="https://github.com/sanhpanha" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    </a>
  </div>
</div>

  {/* Member 4 */}
  <div className="flex flex-col items-center gap-3">
    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10">
      <Image src="/KongHour.jpg" alt="YORT KONGHOUR" width={160} height={160} className="object-cover w-full h-full"/>
    </div>
    <h3 className="text-white text-xl font-semibold mt-2">YORT KONGHOUR</h3>
    <p className="text-white/50 text-sm">MEMBER</p>
    <span className="text-xs font-bold px-3 py-1 rounded" style={{ background: "#C14FE620", color: "#C14FE6" }}>
      FRONT-END
    </span>
    <div className="flex gap-4 mt-1">
      <a href="hourkong3@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7 L12 13 L22 7"/>
        </svg>
      </a>
      <a href="https://github.com/nuthchanreaksa" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C14FE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      </a>
    </div>
  </div>

</div>
      </section>

        </div>
      </section>
    </div>
    </>
    
  );
}