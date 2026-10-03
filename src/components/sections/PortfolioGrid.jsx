import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../ui/Reveal';
import ProjectShowcase from './ProjectShowcase';

const projects = [
  {
    title: "Skyrict",
    subtitle: "AI-Powered Multi-Tenant ERP Platform",
    tagline: "AI Business Operating System",
    category: "ERP Platform",
    image: "/skyrict.webp",
    coverImage: "/skyrict.webp",
    coverAlt: "Skyrict AI Business Operating System landing page with the Business Pulse dashboard preview",
    coverWidth: 1920,
    coverHeight: 929,
    tags: ["FastAPI", "Python", "PostgreSQL", "Redis", "SQLAlchemy", "Next.js", "JWT (RS256)", "Docker", "AI Integration"],
    description: "An AI-powered, multi-tenant ERP platform combining secure RBAC and MFA authentication, an intelligent AI assistant, and business trend analysis, helping organizations manage operations and make data-driven decisions.",
    meta: "Multi-tenant ERP + AI assistant",
    link: "https://skyrict.in/",
    github: "https://github.com/abhikrishna-a/skyrict/tree/dev",
    fileNo: "FILE 03",
    status: "LIVE",
    date: "2026",
    metrics: [
      { label: "Business modules", value: "4" },
      { label: "Security checks per request", value: "4" },
      { label: "Tenant isolation", value: "Database-level (Postgres RLS)" },
    ],
    sections: [
      {
        title: "What It Is",
        body: "Skyrict is an enterprise ERP platform with an integrated AI assistant and business trend analyzer. It brings organizational operations, users, permissions, workflows and data into one secure system instead of scattered tools and spreadsheets.",
      },
      {
        title: "The Problem It Solves",
        body: "Traditional business systems keep information siloed across applications and spreadsheets, making it hard for management to get a complete view, spot problems early and decide using current data. Skyrict centralizes data, enforces role-based access, automates workflows and turns raw records into insight.",
      },
      {
        title: "AI Assistant",
        body: "A conversational interface to the ERP. It answers questions about business data, explains information in plain language, summarizes operations, helps users understand reports and metrics, and removes the need to manually dig through large datasets.",
      },
      {
        title: "Trend Analyzer",
        body: "Examines ERP data to surface patterns: rising or falling activity, historical performance, shifts in operational metrics, potential issues, and areas needing management attention. It converts data into information that supports planning, not just numbers on a screen.",
      },
      {
        title: "Multi-Tenancy",
        body: "Multiple organizations share one platform while users, roles, permissions and data stay isolated per tenant. Isolation is enforced across the authentication and authorization pipeline and at the database level.",
      },
      {
        title: "Security",
        body: "Layered security applied to every protected request, before any business handler runs.",
        bullets: [
          "Authentication: registration, email verification, login, sessions, invitations, token management",
          "JWT with RS256, Argon2id password hashing",
          "TOTP-based MFA with single-use backup codes; MFA can be mandatory for higher-security accounts; MFA secrets encrypted with Fernet, backup codes hashed",
          "RBAC with built-in roles plus a custom role builder; permissions come from a controlled permission catalog, not arbitrary keys",
          "Every protected request passes: JWT validation, tenant validation, MFA enforcement, RBAC permission check, and only then reaches the business handler",
        ],
      },
      {
        title: "Architecture",
        body: "Layered backend: Router, Service, Repository, Database. Routers handle HTTP, services hold business rules, repositories handle persistence. This keeps the code maintainable, testable and easy to extend. Fully containerized with Docker.",
      },
      {
        title: "Why It Is Technically Significant",
        body: "It is more than a CRUD ERP: it combines enterprise architecture, a layered security model, true multi-tenancy, AI-assisted interaction, and conversion of business data into actionable insight, backed by automated testing and containerized deployment.",
      },
    ],
  },
  {
    title: "EduSphere",
    subtitle: "Student Management Portal",
    tagline: "One Portal for Every Course",
    category: "Web Application",
    image: "/edusphere.png",
    tags: ["Django", "Python", "PostgreSQL", "SQLite", "Cloudinary", "Vercel"],
    description: "A student management portal where students register, browse the course catalogue, request enrollment and track their academic record — with a separate staff console for approving requests and managing courses.",
    meta: "Course enrollment & student records",
    link: "https://student-management-eight-rho.vercel.app/",
    github: "https://github.com/abhikrishna-a/student-management",
    screenshots: ["/edusphere-1.png", "/edusphere-2.png"],
    fileNo: "FILE 01",
    status: "SHIPPED",
    date: "2026",
    role: "Full-Stack Engineer",
    duration: "6 weeks",
    metrics: [
      { label: "URL routes", value: "16" },
      { label: "Django apps", value: "2" },
      { label: "Data models", value: "4" },
    ],
    sections: [
      {
        title: "What It Is",
        body: "A Django web application for managing students, courses, and academic data. Students register, sign in, browse the course catalogue and request enrollment. Staff get a separate console for approving requests, maintaining the catalogue and viewing the student roster. Two roles, one codebase, one database.",
      },
      {
        title: "The Problem It Solves",
        body: "Course and student records were spread across spreadsheets and disconnected tools, so nobody had a reliable view of who was enrolled in what. Enrollment in particular needed an approval step, and that step had nowhere to live.",
      },
      {
        title: "Roles & Access Control",
        body: "Access is decided in one place. A custom middleware class checks every request against a public allowlist, then requires authentication, then blocks students from staff routes and staff from student routes — redirecting each to their own dashboard instead of returning a 403.",
        bullets: [
          "Public allowlist: landing, login, register, logout",
          "Anonymous users are redirected to login",
          "Students requesting /principal/ are sent back to their dashboard",
          "Staff requesting student-only routes are sent to the staff dashboard",
        ],
      },
      {
        title: "Registration & Authentication",
        body: "Registration creates a user with a role, so a single sign-in serves both audiences and the middleware routes each to the correct dashboard. Django's built-in password hashing and session handling do the underlying work — no custom auth layer to maintain.",
      },
      {
        title: "Course Catalogue & Enrollment",
        body: "Courses belong to a department, carry a description and a price, and are listed in a catalogue students can browse. A student joins a course by submitting a request rather than self-enrolling, which keeps enrollment under staff control.",
      },
      {
        title: "Enrollment Approval Workflow",
        body: "Enrollment is a first-class record, not a boolean. An explicit join model between students and courses carries a status that starts pending and moves to approved or rejected, along with purchase and approval timestamps. A uniqueness constraint on the student-course pair makes duplicate requests impossible at the database level, and ordering by most recent request puts the newest activity first.",
        bullets: [
          "Status: pending → approved or rejected",
          "Records when the request was made and when it was decided",
          "Database constraint prevents the same student requesting the same course twice",
          "Staff approve or reject from the console",
        ],
      },
      {
        title: "Staff Console",
        body: "Staff work in a separate area of the app: a dashboard, the full student roster with a detail view per student, the course list, a create form, and delete. The approve and reject actions on pending requests live here too, which is what makes the enrollment workflow usable end to end.",
      },
      {
        title: "Architecture & Data",
        body: "A conventional Django layout — URL conf, views, forms, models, admin — split across two apps, one for the student experience and one for staff. Four models carry the domain: departments, courses, the student profile, and the enrollment join. Server-rendered templates keep the whole thing a single deployable process with no separate API to keep in sync.",
      },
      {
        title: "Deployment & Media",
        body: "Profile pictures are stored on Cloudinary rather than on local disk, so media survives redeploys on a serverless host. Static files are served through WhiteNoise, and the app deploys to Vercel as a Python function behind WSGI.",
        bullets: [
          "Cloudinary for student profile images",
          "WhiteNoise for static assets",
          "PostgreSQL with SQLite for local development",
          "Deployed on Vercel",
        ],
      },
      {
        title: "Why It Is Technically Significant",
        body: "It is a complete multi-role application rather than a CRUD demo: authentication, role-based routing, a stateful approval workflow enforced by the database, staff tooling, and serverless deployment. Every part of the enrollment path — request, review, decision, record — is implemented and reachable from the UI.",
      },
    ],
  },
  {
    title: "Sprint.X",
    subtitle: "E-Commerce Web Application",
    tagline: "Shopping Without The Noise",
    category: "E-Commerce",
    image: "/Sprint.X.png",
    tags: ["React", "Django", "REST Framework", "JWT", "PostgreSQL", "Material UI", "Tailwind CSS"],
    description: "A full-stack e-commerce application — a React storefront over a Django REST API and PostgreSQL, with a server-synced cart, checkout, order history and a separate admin console backed by its own analytics endpoint.",
    meta: "Storefront, checkout & admin console",
    github: "https://github.com/abhikrishna-a/Ecommerce_online",
    screenshots: ["/SprintX1.png", "/SprintX2.png"],
    fileNo: "FILE 02",
    status: "BUILT",
    date: "2026",
    role: "Full-Stack Engineer",
    duration: "8 weeks",
    metrics: [
      { label: "API endpoints", value: "16" },
      { label: "Client routes", value: "14" },
      { label: "Django apps", value: "4" },
    ],
    sections: [
      {
        title: "What It Is",
        body: "A full-stack e-commerce application: a React single-page storefront backed by a Django REST API and PostgreSQL. Shoppers browse and filter the catalogue, open product pages, manage a cart and place an order. Staff get a separate admin console for products, orders and users. Fourteen client routes and sixteen API endpoints across four Django apps.",
      },
      {
        title: "The Problem It Solves",
        body: "Shopping flows tend to get cluttered, burying the path from product to cart under noise. The goal here was the opposite: fewer decisions between landing and cart, product pages addressable by their own URL, and a cart that survives a page reload instead of living only in memory.",
      },
      {
        title: "API Layer & Data Model",
        body: "Sixteen endpoints split across products and categories, carts, orders plus analytics, and users. The domain is five models: a product keyed by a string id with a JSONField image list and a derived first-image property, the category it belongs to, one cart per user stored as a JSON item list, an order carrying a unique order number and a status, and a user with a role. Serializers resolve a product's category by name and create it when it does not exist, so catalogue writes never fail on an unknown category.",
        bullets: [
          "Products and categories: list, create, retrieve, update, delete",
          "Carts: one row per user, items held as JSON",
          "Orders: list, create, retrieve, update, delete",
          "Analytics: one aggregate endpoint for the admin dashboard",
        ],
      },
      {
        title: "Authentication & Session Handling",
        body: "Authentication is a custom DRF class rather than the stock one. It accepts the access token from an Authorization header or from an HttpOnly cookie, and a token that has expired is treated as anonymous rather than as an error when it arrived by cookie — so a stale browser session degrades to a logged-out page instead of a failed request. Access tokens last thirty minutes and refresh tokens seven days. Login also re-hashes any still-plaintext password it finds in storage as a side effect of a successful sign-in.",
        bullets: [
          "Token accepted from Bearer header or HttpOnly cookie",
          "Expired cookie tokens fall back to anonymous, not to an error",
          "Access 30 minutes, refresh 7 days",
          "Plaintext passwords re-hashed on successful login",
        ],
      },
      {
        title: "Roles & Authorization",
        body: "Three permission classes cover the API: admin-only, admin-or-read-only, and admin-or-owner. The last is the one that matters — reading an order is allowed if you are its owner, but modifying or deleting one is admin-only. The order list is scoped the same way, filtered to the caller's own orders unless the caller is an admin.",
      },
      {
        title: "Cart State",
        body: "The cart lives in a single context above the router and is mirrored to the server, so it is not lost on refresh. Catalogue fetches are deduplicated with refs: an in-flight request is reused instead of reissued, and a loaded flag stops React's StrictMode double-mount from firing two identical requests. Server writes are debounced, and adding a product already in the cart increments its quantity rather than adding a second line.",
        bullets: [
          "Add, increment, set quantity, remove, clear",
          "In-flight request reused instead of duplicated",
          "StrictMode double-mount guarded",
          "Server writes debounced",
        ],
      },
      {
        title: "Checkout & Orders",
        body: "Checkout is a single page rather than a wizard: address, city, state, pin code and payment method, with cash on delivery as the default. Pricing is computed in one place — Indian Rupee formatting through Intl.NumberFormat, a flat shipping charge, tax at eight percent of the subtotal, and a rounded total. The resulting order is posted with a unique order number and a pending status, and submitted orders are listed per user on their own account page.",
      },
      {
        title: "Catalogue Discovery",
        body: "The collection page filters the catalogue in the browser: free-text search across name, description and category, a category filter, a price ceiling, an in-stock toggle, four sort orders and pagination. Filtering is memoised against its inputs so typing in the search box does not re-sort the whole list, and one reset clears every control at once.",
        bullets: [
          "Search across name, description and category",
          "Category, price ceiling and stock filters",
          "Sort by default, price, or name",
          "Client-side pagination",
        ],
      },
      {
        title: "Admin Console & Analytics",
        body: "An admin area sits behind a protected route: a dashboard, product management, order management, user management and a separate admin sign-in, wrapped in its own layout shell. The dashboard reads a dedicated analytics endpoint that computes total revenue, month-over-month revenue and order growth, a twelve-month revenue series, the top five products by units sold, and a conversion rate — all on the server rather than in the browser.",
      },
      {
        title: "Stack & Tooling",
        body: "React 19 and Vite on the front; Django with Django REST Framework and SimpleJWT on the back; PostgreSQL underneath. Material UI and Emotion for components, Tailwind CSS for layout, Axios for requests, Lucide and Heroicons for icons, and toast libraries for feedback. A token refresh interceptor replays a request once after a 401. A Django management command seeds the catalogue from JSON into PostgreSQL.",
      },
      {
        title: "Why It Is Technically Significant",
        body: "It is a complete commerce loop rather than a UI shell: catalogue, cart, checkout, order history, and an admin console that can act on all of it, over an API with real authorization. The parts that are easiest to skip are the parts that are done — token refresh with request replay, ownership checks on orders, request deduplication under StrictMode, and analytics computed server-side.",
      },
    ],
  },
];

const ProjectCard = ({ project, index, onClick }) => {
  return (
    <Reveal delay={index * 0.1} origin="bottom" distance={24} scale={0.98} duration={0.8}>
      <button
        type="button"
        onClick={() => onClick(project)}
        className="group relative w-full overflow-hidden rounded-[0.9rem] bg-card text-left transition-all duration-700 motion-safe:hover:-translate-y-1 motion-safe:active:-translate-y-1 hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background border border-foreground/15 card-shine active:border-primary/45 focus-visible:border-primary/45"
        aria-label={`Open ${project.title} project`}
      >
        <div className="relative flex items-center justify-between border-b border-foreground/12 px-5 py-3">
          <span className="flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-muted">
              Project File — {project.fileNo}
            </span>
          </span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-primary-dim transition-colors duration-300 group-hover:text-primary group-active:text-primary group-focus-within:text-primary">
            {project.category}
          </span>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden p-4 md:p-5">
          <div className="absolute inset-x-4 top-3 bottom-3 rounded-lg border border-foreground/12 bg-background" />
          <div className="absolute top-3 left-10 w-20 h-5 tape -rotate-2 opacity-90" aria-hidden="true" />
          <div className="absolute bottom-3 right-8 w-16 h-5 tape rotate-2 opacity-90" aria-hidden="true" />
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md border border-foreground/12 bg-background transition-all duration-700 group-hover:border-primary/30 group-active:border-primary/30 group-focus-within:border-primary/30">
            <span className="absolute inset-0 flex items-center justify-center font-display text-4xl md:text-6xl font-black uppercase text-primary/[0.05] select-none">
              {project.title.split(' ')[0]}
            </span>
            <span
              aria-hidden="true"
              className={`absolute top-3 right-3 z-10 -rotate-3 ${project.status === 'SHIPPED' ? 'stamp-red' : 'stamp'} opacity-95 select-none`}
            >
              {project.status}
            </span>
          </div>
        </div>

        <div className="relative px-5 md:px-6 pb-5">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-xl md:text-2xl font-black tracking-tight leading-none text-foreground uppercase">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-3 line-clamp-2 max-w-xl text-sm font-medium leading-relaxed text-foreground/75 md:text-[15px]">
                  {project.description}
                </p>
              )}
            </div>
            <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-[1.5px] border-foreground/25 text-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary group-hover:bg-primary group-hover:text-background group-active:-translate-y-0.5 group-focus-within:-translate-y-0.5 group-active:border-primary group-focus-within:border-primary group-active:bg-primary group-focus-within:bg-primary group-active:text-background group-focus-within:text-background">
              <ArrowUpRight size={16} />
            </span>
          </div>

          {(project.role || project.duration) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">
              {project.role && <span>{project.role}</span>}
              {project.role && project.duration && (
                <span className="h-1 w-1 rounded-full bg-amber/70" aria-hidden="true" />
              )}
              {project.duration && <span>{project.duration}</span>}
            </div>
          )}

          {project.metrics && project.metrics.length > 0 && (
            <div className="mt-4 grid grid-cols-2 border-t border-foreground/12">
              {project.metrics.slice(0, 2).map((metric, i) => (
                <div key={metric.label} className={`pt-2.5 ${i > 0 ? 'border-l border-foreground/12 pl-4' : 'pr-4'}`}>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">{metric.label}</div>
                  <div className="mt-0.5 font-mono text-xl font-bold text-primary">{metric.value}</div>
                </div>
              ))}
            </div>
          )}

          {project.meta && (
            <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-dim">
              {project.meta}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="tag-sweep rounded-[4px] border border-primary/40 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary transition-colors duration-500 group-hover:border-primary/70 group-hover:bg-primary/10 group-active:border-primary/70 group-focus-within:border-primary/70 group-active:bg-primary/10 group-focus-within:bg-primary/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-foreground/12 pt-3.5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-500 group-hover:border-primary/25 group-active:border-primary/25 group-focus-within:border-primary/25">
            <span className="inline-flex items-center gap-2 transition-all duration-500 group-hover:text-primary group-hover:translate-x-1 group-active:text-primary group-focus-within:text-primary group-active:translate-x-1 group-focus-within:translate-x-1">
              Open Project
              <span className="block h-px w-8 origin-left bg-primary scale-x-0 transition-transform duration-500 group-hover:scale-x-100 group-active:scale-x-100 group-focus-within:scale-x-100" />
            </span>
            <span className="inline-flex items-center gap-2 transition-all duration-500 group-hover:translate-x-1 group-hover:text-primary/80 group-active:translate-x-1 group-focus-within:translate-x-1 group-active:text-primary/80 group-focus-within:text-primary/80">
              Case Study
              <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-0.5 group-focus-within:translate-x-0.5 group-active:-translate-y-0.5 group-focus-within:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </button>
    </Reveal>
  );
};

const PortfolioGrid = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <section id="portfolio" className="relative py-24 md:py-28 px-6 border-t border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 grid gap-8 md:mb-16 md:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] md:items-end">
            <div className="max-w-3xl">
              <Reveal origin="left" distance={24} scale={0.98}>
                <h2 className="ledger-head font-display text-4xl md:text-6xl font-black tracking-tighter uppercase text-foreground">
                  Projects that turn <span className="text-primary">ideas</span> into experiences
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.2} origin="right" distance={24} scale={0.98}>
              <div className="relative rounded-[0.9rem] p-6 bg-card border border-foreground/15">
                <div className="absolute -top-3 right-6 w-20 h-5 tape rotate-2" aria-hidden="true" />
                <span className="stamp mb-4">Selected Builds</span>
                <p className="text-foreground/80 text-base md:text-lg font-medium leading-relaxed">
                  A focused collection of products shaped around clarity, performance, and interfaces people can use without friction.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 md:[&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:max-w-[calc(50%_-_1rem)] md:[&>*:last-child:nth-child(odd)]:mx-auto">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} onClick={setSelectedProject} />
            ))}
          </div>
        </div>
      </section>
      <ProjectShowcase project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
};

export default PortfolioGrid;
