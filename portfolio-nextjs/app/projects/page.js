'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

const projects = [
  {
    title: "EduSphere",
    category: "Web Application",
    description: "A clean, modern platform designed to help students confidently manage courses, track progress, and crush academic goals without the clutter.",
    tags: ["React", "Django REST Framework", "REST APIs"],
    link: "https://student-management-eight-rho.vercel.app/",
    github: "https://github.com/abhikrishna-a/student-management",
    screenshots: ["/edusphere-1.png", "/edusphere-2.png"],
  },
  {
    title: "Sprint.X",
    category: "E-Commerce",
    description: "A clean e-commerce app built with full frontend and backend functionality, focused on smooth shopping, clear product discovery, and a simple user-friendly experience.",
    tags: ["React", "JavaScript", "Django"],
    github: "https://github.com/abhikrishna-a/Ecommerce_online",
  },
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

export default function ProjectsPage() {
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
              Portfolio
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.05] mb-6">
              All Projects
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl">
              A collection of products shaped around clarity, performance, and interfaces people can use without friction.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className="group relative rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.04] to-white/[0.01] overflow-hidden hover:border-accent/20 hover:shadow-[0_40px_100px_-20px_rgba(230,126,34,0.15)] transition-all duration-700 hover:-translate-y-2 h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">{project.category}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 group-hover:text-accent transition-colors duration-300">
                      Featured Project
                    </span>
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden p-5">
                    <div className="w-full h-full rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center overflow-hidden">
                      <div className="text-center p-6">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-white/5 flex items-center justify-center">
                          <span className="text-3xl font-black font-display text-accent/60">
                            {project.title.charAt(0)}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{project.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 md:p-7 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight font-display">{project.title}</h3>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">{project.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:border-accent/20 group-hover:bg-accent/[0.06] transition-all duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center gap-4 pt-4 border-t border-white/5">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent transition-colors duration-300"
                        >
                          <ExternalLink size={14} />
                          Live Site
                        </a>
                      )}
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent transition-colors duration-300"
                      >
                        <Github size={14} />
                        Source Code
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <p className="text-gray-500 text-lg">More projects coming soon.</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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
