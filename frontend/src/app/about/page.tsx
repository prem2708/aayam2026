'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users, Award, Shield, Target, Calendar, Flame } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { value: '0', label: 'Total Attendees' },
  { value: '6', label: 'Competitions' },
  { value: 'TBA', label: 'Prize Pool' },
  { value: '5+', label: 'Partner Institutions' },
];

const team = [
  { name: 'Mrs. Kirti Verma', role: 'Faculty Coordinator', dept: 'Computer Science Dept' },
  { name: 'Prem Kumar', role: 'Organizer & Tech Lead', dept: 'B.Tech CSE, 4th Year' },
  { name: 'Sudhanshu Kumar Agrawal', role: 'Organizer & Social Media Head', dept: 'Core Team' },
  { name: 'Md Warsih Anasari', role: 'Organizer & Student Convener', dept: 'B.Tech CSE, 4th Year' },
];

const timeline = [
  { year: '2025', title: 'The Genesis', desc: 'The first tech fest began, marking the start of our incredible journey.' },
  { year: '2026', title: 'The Quantum Leap', desc: 'Our biggest edition yet, introducing exciting new events like eSports, Group Discussions, and much more.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-[10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[150px] -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-600/5 blur-[150px] -z-10" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 -z-20" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs font-semibold text-violet-300 mb-4 tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Aayam TechFest 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight mb-6">
            Where Innovation Meets <span className="gradient-text">Celebration</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Aayam is the premier national-level technical festival, acting as a massive launchpad for software engineers, designers, roboticists, and tech visionaries.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="glass rounded-2xl p-6 border border-slate-900 text-center relative overflow-hidden group hover:border-violet-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <p className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-1">{stat.value}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Values Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black font-heading mb-6 text-white flex items-center gap-2">
              <Target className="h-6 w-6 text-violet-400" /> Vision and Mission
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-950/50 border border-violet-500/30">
                  <Shield className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200 mb-1">Encouraging Tech Excellence</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Aayam strives to raise the bar for technical competence among students by challenging them to solve real-world problems.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-950/50 border border-cyan-500/30">
                  <Users className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200 mb-1">Building Collaboration Networks</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    By bringing together talent from all across the country, we build lifelong connections, partner opportunities, and student communities.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-950/50 border border-pink-500/30">
                  <Flame className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200 mb-1">Inspiring Future Inventors</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Through workshops, seminars, and hands-on competitions, we aim to spark the initial fire of research and enterprise.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-slate-900 shadow-2xl bg-gradient-to-br from-violet-600/10 via-slate-950 to-cyan-500/10 p-6 flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="absolute top-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xs text-violet-400 font-extrabold uppercase tracking-wider block mb-2">Empowering Talent</span>
              <p className="text-xl sm:text-2xl font-black font-heading leading-tight text-white mb-3">
                "We don't just host competitions. We build the future creators."
              </p>
              <p className="text-xs text-slate-500">Aayam Fest Committee Statement</p>
            </div>
          </motion.div>
        </div>

        {/* History Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">Our Journey & Legacy</h2>
            <p className="text-slate-500 text-sm mt-2">Tracing Aayam's history and growth across the years</p>
          </div>
          <div className="relative border-l border-slate-900 ml-4 md:ml-6 space-y-8">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-10">
                <div className="absolute -left-3 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 border-2 border-violet-500 shadow-md">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                </div>
                <div className="glass rounded-2xl p-6 border border-slate-900 max-w-3xl hover:border-violet-500/10 transition-all duration-300">
                  <span className="text-xs font-black text-violet-400 tracking-wider uppercase">{item.year}</span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2 font-heading">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Team Organizers */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">Organizing Committee</h2>
            <p className="text-slate-500 text-sm mt-2">The architects behind Aayam 2026 TechFest</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((member, idx) => (
              <div 
                key={idx}
                className="glass rounded-2xl p-5 border border-slate-900/60 hover:border-violet-500/20 text-center relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-600/30 to-cyan-500/10 border border-violet-500/25 flex items-center justify-center">
                  <Users className="h-6 w-6 text-violet-300 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
                <p className="text-xs text-violet-400 mt-1 font-semibold">{member.role}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{member.dept}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
