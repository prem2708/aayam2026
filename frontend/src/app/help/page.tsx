'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, ChevronDown, MessageSquare, Mail, Phone, 
  Clock, ShieldAlert, Award, FileCheck, Landmark 
} from 'lucide-react';

const faqs = [
  {
    category: 'General',
    q: 'What is Aayam TechFest 2026?',
    a: 'Aayam is a premier national-level technical festival showcasing standard competitions, tech workshops, robotic matches, and coding panels. It is designed to host developers and innovators nationwide.'
  },
  {
    category: 'General',
    q: 'Who can participate in the events?',
    a: 'Students currently enrolled in any undergraduate or postgraduate course (B.Tech, B.Sc, BCA, MCA, M.Tech, etc.) at any recognized college or school are eligible to register.'
  },
  {
    category: 'Registration & Payments',
    q: 'How do I register for team events?',
    a: 'For team events, the Team Leader registers by creating a team name and inputting team members names. Once registered successfully, a Team Code/Registration Number is generated. Teammates do not need to register separately.'
  },
  {
    category: 'Registration & Payments',
    q: 'Is there a registration fee?',
    a: 'Some events are completely free, while others have a nominal entry fee. The entry fee details are clearly listed on each Event card and registration sidebar.'
  },
  {
    category: 'Registration & Payments',
    q: 'How do I complete the payment proof upload?',
    a: 'You can pay the entry fee by scanning the QR code or transferring to the bank details listed on the event page. Take a screenshot of the completed transaction showing the transaction ID/reference number, and upload it as a PNG/JPEG in the registration form.'
  },
  {
    category: 'Verification & Support',
    q: 'How long does registration approval take?',
    a: 'Once you submit your registration along with the payment screenshot proof, the admin panel reviews the submission. Verification is typically completed within 12 to 24 hours. You can track your status in your dashboard.'
  },
];

const categories = ['All', 'General', 'Registration & Payments', 'Verification & Support'];

export default function HelpPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => activeCat === 'All' || faq.category === activeCat);

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background radial glows */}
      <div className="absolute top-[10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px] -z-10" />
      <div className="absolute bottom-[20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-accent-secondary/5 blur-[150px] -z-10" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 -z-20" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent-secondary mb-4 tracking-wider uppercase">
            <HelpCircle className="h-3.5 w-3.5 animate-pulse" /> Support & FAQs
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight mb-4">
            How Can We <span className="gradient-text">Help You?</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Find answers to frequently asked questions about events, team setups, registration proof verification, or connect directly with our support team.
          </p>
        </div>

        {/* Support Channels Row */}
        <div className="grid gap-4 md:grid-cols-3 mb-16">
          <div className="glass rounded-2xl p-6 border border-slate-900 flex flex-col justify-between group hover:border-accent/20 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent mb-4">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">Email Support</h3>
              <p className="text-xs text-slate-500 mb-3">Shoot us a mail for registration disputes</p>
              <a href="mailto:support@aayam2026.com" className="text-sm font-semibold text-accent hover:text-accent-secondary transition-colors">
                support@aayam2026.com
              </a>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-slate-900 flex flex-col justify-between group hover:border-accent-secondary/20 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary mb-4">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">Discord Community</h3>
              <p className="text-xs text-slate-500 mb-3">Connect directly with event coordinators</p>
              <a href="https://discord.gg/aayam2026" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent-secondary hover:text-accent-secondary/80 transition-colors">
                discord.gg/aayam2026
              </a>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-slate-900 flex flex-col justify-between group hover:border-accent-secondary/20 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary mb-4">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">Emergency Helplines</h3>
              <p className="text-xs text-slate-500 mb-3">Call us for immediate payment issues</p>
              <span className="text-sm font-semibold text-accent-secondary">
                +91 98765 43210 / +91 91234 56789
              </span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-900 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-accent/5 blur-2xl" />
          <h2 className="text-xl sm:text-2xl font-black font-heading mb-6 text-white flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-accent" /> Guide: Registering & Uploading Proof
          </h2>
          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 border border-accent/20 text-xs">1</span>
                Choose your Event
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Browse our events list page. Pick an event (Solo or Team) and click <strong>Register</strong>.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-secondary font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-xs">2</span>
                Scan & Complete Payment
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Scan the UPI QR Code or copy bank credentials. Make the transfer of the exact fee amount and capture a screenshot.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent-secondary font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-xs">3</span>
                Upload Proof & Onboard
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Upload the receipt picture, assign team names if any, click register, and fill in your college profile details. Done!
              </p>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div>
          <h2 className="text-2xl font-black font-heading mb-6 text-center">Frequently Asked Questions</h2>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setActiveCat(c);
                  setOpenIdx(null);
                }}
                className={`px-4.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  activeCat === c 
                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div 
                  key={idx}
                  className="glass rounded-2xl border border-slate-900/60 overflow-hidden hover:border-slate-800/80 transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 text-slate-400 text-sm leading-relaxed border-t border-slate-900/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
