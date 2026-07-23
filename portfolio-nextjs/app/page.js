'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin, ArrowUpRight, Github, Linkedin, Mail, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

const portfolioData = {
  name: "Abhikrishna A",
  firstName: "Abhikrishna",
  lastName: "A",
  title: "Designer & Developer",
  location: "Digital World",
  bio: "I craft digital experiences that blend bold design with seamless functionality. Every line of code I write is intentional — focused on performance, accessibility, and clean architecture. From concept to deployment, I build products that solve real problems and stand the test of time.",
  techStack: ["REACT", "DJANGO", "PYTHON", "JAVASCRIPT", "TAILWIND CSS", "POSTGRESQL"],
  email: "abhikrishna616@gmail.com",
  github: "https://github.com/abhikrishna-a",
  linkedin: "https://www.linkedin.com/in/abhikrishna22",
  twitter: "https://twitter.com/abhikrishna",
}

const projects = [
  {
    title: "EduSphere",
    category: "Web Application",
    description: "A clean, modern platform designed to help students confidently manage courses, track progress, and crush academic goals without the clutter.",
    tags: ["React", "Django REST Framework", "REST APIs"],
    image: "/edusphere.png",
    link: "https://student-management-eight-rho.vercel.app/",
    github: "https://github.com/abhikrishna-a/student-management",
  },
  {
    title: "Sprint.X",
    category: "E-Commerce",
    description: "A clean e-commerce app built with full frontend and backend functionality, focused on smooth shopping, clear product discovery, and a simple user-friendly experience.",
    tags: ["React", "JavaScript", "Django"],
    image: "/Sprint.X.png",
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
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[80px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 w-full pt-20 md:pt-0">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative"
          >
            <motion.div variants={fadeUp} className="mb-4 sm:mb-6 lg:mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-gray-400 text-xs font-medium tracking-wide">
                <MapPin size={12} className="text-accent" />
                {portfolioData.location}
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-sans font-black leading-[0.9] mb-2 sm:mb-3 lg:mb-5"
            >
              <span className="text-[clamp(5rem,8vw,7.5rem)] block">{portfolioData.firstName}</span>
              <span className="text-[clamp(2.5rem,5vw,3.75rem)] block text-gray-500/60">{portfolioData.lastName}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed max-w-xl mb-5 sm:mb-8 lg:mb-10"
            >
              {portfolioData.bio}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-6 sm:mb-10 lg:mb-16">
              {portfolioData.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-[20px] bg-white/[0.05] border border-white/5 text-gray-300 text-xs font-semibold tracking-wider hover:bg-white/[0.08] hover:border-accent/20 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
              >
                Get in touch
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href={portfolioData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
              >
                <Github size={18} />
              </a>
              <a
                href={portfolioData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
              >
                <Linkedin size={18} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[400px] h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-[3rem] blur-[60px]" />
              <div className="relative w-full h-full rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                      <span className="text-3xl font-black font-display text-white">A</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Design · Code · Create</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown size={24} className="text-gray-600 animate-bounce" />
      </motion.div>
    </section>
  )
}

function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <motion.div style={{ y }} className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeUp}>
            <span className="text-accent text-sm font-bold tracking-[0.3em] uppercase mb-4 block">About Me</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.05] mb-6">
              Turning ideas into
              <span className="text-gradient"> digital experiences</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              I&apos;m a designer and developer who cares deeply about crafting digital products that
              solve problems and look beautiful. With expertise across the full stack, I bring ideas
              to life with clean code and thoughtful design.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6">
            {[
              { value: '20+', label: 'Projects' },
              { value: '100+', label: 'Problems Solved' },
              { value: '10+', label: 'Hours Coding' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
                <div className="text-3xl sm:text-4xl font-black font-display text-white mb-2">{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturedProjects() {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="mb-14"
        >
          <motion.span variants={fadeUp} className="text-accent text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            Selected Works
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.05] max-w-3xl">
            Projects that turn ideas into{' '}
            <span className="text-gradient">experiences</span>
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="group relative rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.04] to-white/[0.01] overflow-hidden hover:border-accent/20 hover:shadow-[0_40px_100px_-20px_rgba(230,126,34,0.15)] transition-all duration-700 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">{project.category}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 group-hover:text-accent transition-colors duration-300">
                    Featured
                  </span>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden p-5">
                  <div className="w-full h-full rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center overflow-hidden">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-white/5 flex items-center justify-center">
                        <span className="text-2xl font-black font-display text-accent/60">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs font-medium">{project.title}</p>
                    </div>
                  </div>
                </div>

                <div className="relative p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight font-display">{project.title}</h3>
                      <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-2">{project.description}</p>
                    </div>
                    <a
                      href={project.link || project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/5 text-gray-400 hover:bg-accent hover:text-white hover:border-accent/20 transition-all duration-300"
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:border-accent/20 group-hover:bg-accent/[0.06] transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/10 text-gray-300 font-semibold text-sm tracking-wide hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
          >
            View all projects
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-20 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.span variants={fadeUp} className="text-accent text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            Get in Touch
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.05] mb-6">
            Let&apos;s build something{' '}
            <span className="text-gradient">great together</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Have a project in mind or just want to say hello? I&apos;d love to hear from you.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <a
              href={`mailto:${portfolioData.email}`}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-white font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
            >
              <Mail size={18} />
              {portfolioData.email}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex justify-center gap-6">
            {[
              { href: portfolioData.github, icon: Github, label: 'GitHub' },
              { href: portfolioData.linkedin, icon: Linkedin, label: 'LinkedIn' },
              { href: `mailto:${portfolioData.email}`, icon: Mail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent/20 transition-all duration-300"
              >
                <Icon size={22} className="text-gray-400 group-hover:text-accent transition-colors duration-300" />
                <span className="text-xs text-gray-500 font-medium">{label}</span>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Abhikrishna A. All rights reserved.
        </p>
        <p className="text-gray-600 text-sm">
          Designed & built with care
        </p>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <FeaturedProjects />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
