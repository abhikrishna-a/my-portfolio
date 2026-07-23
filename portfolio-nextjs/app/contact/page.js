'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Send, ArrowUpRight, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

const portfolioData = {
  email: "abhikrishna616@gmail.com",
  github: "https://github.com/abhikrishna-a",
  linkedin: "https://www.linkedin.com/in/abhikrishna22",
  location: "Digital World",
}

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

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, message } = formData
    if (!name || !email || !message) {
      setStatus('error')
      return
    }
    window.location.href = `mailto:${portfolioData.email}?subject=Hello from ${name}&body=${encodeURIComponent(message)}`
    setStatus('success')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (status) setStatus(null)
  }

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
              Contact
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.05] mb-6">
              Get in touch
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl">
              Have a project in mind, a question, or just want to connect? I&apos;m always open to new opportunities.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="space-y-8">
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Mail size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                      <a href={`mailto:${portfolioData.email}`} className="text-white hover:text-accent transition-colors">
                        {portfolioData.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <MapPin size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Location</p>
                      <p className="text-white">{portfolioData.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium mb-4">Find me on</p>
                  <div className="flex gap-3">
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
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-gray-400 hover:text-accent hover:border-accent/20 hover:bg-white/[0.04] transition-all duration-300 text-sm"
                      >
                        <Icon size={16} />
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
              >
                <Send size={16} />
                Send Message
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              {status === 'error' && (
                <p className="text-red-400 text-sm">Please fill in all fields.</p>
              )}
              {status === 'success' && (
                <p className="text-green-400 text-sm">Message sent! Your email client should open.</p>
              )}
            </motion.form>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 text-center"
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
