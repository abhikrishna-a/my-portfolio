'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Download, Code2, Server, Database, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

const skills = [
  {
    icon: Code2,
    title: 'Frontend Engineering',
    description: 'Building immersive user interfaces using modern frameworks like React, Next.js, and Vite. Expertise in Tailwind CSS and advanced animations.',
    tags: ['HTML', 'TailwindCSS', 'JavaScript', 'React', 'Redux'],
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'Architecting robust server-side applications with Django REST Framework, ORM, and PostgreSQL. Focused on scalability, performance, and secure API design.',
    tags: ['Django REST Framework', 'REST API', 'ORM', 'PostgreSQL'],
  },
  {
    icon: Database,
    title: 'Programming Languages',
    description: 'Building efficient and scalable solutions with a strong command of both back-end and front-end languages, writing clean, maintainable code across the full stack.',
    tags: ['Python', 'JavaScript'],
  },
]

const stats = [
  { value: '20+', label: 'Projects Completed' },
  { value: '100+', label: 'Problems Solved' },
  { value: '10+', label: 'Hours of Coding' },
]

const achievements = [
  'Built full-stack web applications with React + Django',
  'Designed and implemented REST APIs with Django REST Framework',
  'Developed e-commerce platforms with complete frontend and backend functionality',
  'Created student management systems for academic tracking',
  'Optimized database schemas and queries for PostgreSQL',
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.215, 0.61, 0.355, 1] },
  }),
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

function SkillCard({ skill, index }) {
  const Icon = skill.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group p-7 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:border-accent/20 hover:bg-accent/[0.02] transition-all duration-500"
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
        <Icon size={22} className="text-accent" />
      </div>
      <h3 className="text-lg font-bold font-display mb-3">{skill.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-5">{skill.description}</p>
      <div className="flex flex-wrap gap-2">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function DetailsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mb-16"
          >
            <motion.span variants={fadeUp} className="text-accent text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              About
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.05] mb-6">
              Details &amp; experience
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl">
              A deeper look into my background, skills, and the work I do.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-black mb-6">
                Who <span className="text-gradient">I am</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed mb-6">
                I&apos;m a designer and developer who cares deeply about crafting digital products that
                solve problems and look beautiful. I specialize in full-stack development with a focus on
                Django, React, and building scalable backend systems.
              </motion.p>
              <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed mb-8">
                Every project I take on is an opportunity to create something meaningful — whether it&apos;s
                a student management platform or an e-commerce experience, I bring the same level of care
                and attention to detail.
              </motion.p>

              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="text-2xl font-black font-display text-white mb-1">{stat.value}</div>
                    <div className="text-[10px] text-gray-500 font-medium tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01]"
            >
              <div className="flex items-center gap-3 mb-6">
                <BookOpen size={18} className="text-accent" />
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400">Key Achievements</span>
              </div>
              <ul className="space-y-4">
                {achievements.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                    <span className="text-gray-400 text-sm leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="mb-16"
          >
            <motion.span variants={fadeUp} className="text-accent text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              Expertise
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-black leading-[1.05] mb-12">
              What I <span className="text-gradient">do</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, i) => (
                <SkillCard key={skill.title} skill={skill} index={i} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              <ArrowUpRight size={14} className="rotate-[-135deg] transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
              Back to home
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  )
}
