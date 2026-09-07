// ============================================================================
// EVENTORA PLATFORM DATA STORE
// Realistic data for international events, conferences, speakers, agenda, etc.
// ============================================================================

const EVENTORA_DATA = {
  categories: [
    { id: "all", name: "All Events", icon: "sparkles" },
    { id: "technology", name: "Technology", icon: "cpu" },
    { id: "ai", name: "Artificial Intelligence", icon: "brain" },
    { id: "business", name: "Business & Leadership", icon: "briefcase" },
    { id: "startup", name: "Startup & VC", icon: "rocket" },
    { id: "design", name: "Design & UX", icon: "palette" },
    { id: "marketing", name: "Growth & Marketing", icon: "trending-up" },
    { id: "finance", name: "FinTech & Web3", icon: "dollar-sign" },
    { id: "healthcare", name: "HealthTech & Bio", icon: "activity" },
    { id: "networking", name: "Networking Summits", icon: "users" }
  ],

  events: [
    {
      id: "evt-1",
      title: "Global AI & Autonomous Systems Summit 2026",
      tagline: "Shaping the next decade of frontier artificial intelligence, agentic workflows, and ethical compute.",
      category: "ai",
      format: "In-Person", // "In-Person" | "Online" | "Hybrid"
      date: "Oct 14 - 16, 2026",
      startDate: "2026-10-14",
      endDate: "2026-10-16",
      time: "09:00 AM - 06:30 PM PST",
      location: "Moscone Center, San Francisco, USA",
      city: "San Francisco",
      venueAddress: "747 Howard St, San Francisco, CA 94103",
      organizer: {
        name: "NextGen AI Alliance",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        eventsHosted: 34
      },
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      price: 349,
      currency: "$",
      attendeeCount: 4820,
      capacity: 5000,
      description: "The Global AI & Autonomous Systems Summit is the premier gathering for AI researchers, enterprise innovators, and technology executives. Over three days, witness keynotes from creators of state-of-the-art LLMs, participate in hands-on robotics workshops, and explore transformative enterprise deployment strategies.",
      highlights: [
        "120+ Keynote sessions and technical deep dives",
        "Frontier AI exhibition featuring 80+ leading generative startups",
        "Executive roundtable dinners and VIP founder matchmaking",
        "Exclusive whitepaper releases and hands-on developer labs"
      ],
      ticketTiers: [
        {
          id: "tier-ga",
          name: "General Admission",
          price: 349,
          badge: "Popular",
          perks: ["Access to Main Stage Keynotes", "Exhibition Hall Access", "Official Summit Swag Pack", "Coffee & Lunch Catering"],
          available: 340
        },
        {
          id: "tier-vip",
          name: "VIP Executive Pass",
          price: 799,
          badge: "Best Value",
          perks: ["Everything in General Admission", "Reserved Front-Row Seating", "VIP Lounge & Private Dining", "Invitation to Founders Gala Dinner", "Fast-track Badge Pickup"],
          available: 65
        },
        {
          id: "tier-all",
          name: "All-Access + Workshops",
          price: 1199,
          badge: "Limited",
          perks: ["Everything in VIP Pass", "Full Access to All 12 Technical Masterclasses", "Direct 1-on-1 Mentor Office Hours", "Lifetime On-Demand Session Recordings", "Exclusive Executive Directory Access"],
          available: 22
        },
        {
          id: "tier-student",
          name: "Academic / Student Pass",
          price: 129,
          badge: "Verified ID",
          perks: ["Main Stage Livestream & Hall Access", "Career Fair & Startup Speed Dating", "Digital Certificate of Participation"],
          available: 110
        }
      ],
      speakers: ["spk-1", "spk-2", "spk-5", "spk-8"]
    },
    {
      id: "evt-2",
      title: "FinTech Frontiers & Next-Gen Banking 2026",
      tagline: "The world's most influential congress on decentralized finance, algorithmic liquidity, and digital banking.",
      category: "finance",
      format: "Hybrid",
      date: "Nov 03 - 05, 2026",
      startDate: "2026-11-03",
      endDate: "2026-11-05",
      time: "08:30 AM - 05:30 PM GMT",
      location: "ExCeL London, United Kingdom",
      city: "London",
      venueAddress: "Royal Victoria Dock, 1 Western Gateway, London E16 1XL",
      organizer: {
        name: "Global FinTech Council",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        eventsHosted: 19
      },
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      price: 499,
      currency: "$",
      attendeeCount: 3600,
      capacity: 4000,
      description: "Bringing together 3,500+ leaders from global investment banks, tier-1 neobanks, cross-border payment protocols, and regulatory bodies to unpack the next wave of programmable finance.",
      highlights: [
        "Keynotes from Fortune 500 Chief Risk and Technology Officers",
        "RegTech & AML Sandbox Demonstrations",
        "Global Payment Gateway Architectural Breakouts",
        "Cross-continental venture investment pitch lounge"
      ],
      ticketTiers: [
        {
          id: "tier-ga",
          name: "Standard Delegate",
          price: 499,
          badge: "Standard",
          perks: ["All 3-Day Summit Sessions", "Networking Coffee Breaks & Lunches", "Digital Resource Vault", "Exhibition Floor Access"],
          available: 210
        },
        {
          id: "tier-vip",
          name: "FinTech VIP Leader",
          price: 950,
          badge: "Executive",
          perks: ["VIP Access to Private Speakeasy Reception", "Curated 1:1 Investor Meetings", "Fast-track Security Check-in", "Executive Lounge Amenities"],
          available: 40
        }
      ],
      speakers: ["spk-3", "spk-6", "spk-7"]
    },
    {
      id: "evt-3",
      title: "DevCon Nexus Tokyo: Cloud & Infrastructure",
      tagline: "Connecting 6,000+ software engineers, systems architects, and DevOps leaders across the Asia-Pacific.",
      category: "technology",
      format: "In-Person",
      date: "Sep 22 - 24, 2026",
      startDate: "2026-09-22",
      endDate: "2026-09-24",
      time: "10:00 AM - 07:00 PM JST",
      location: "Tokyo International Forum, Tokyo, Japan",
      city: "Tokyo",
      venueAddress: "3-5-1 Marunouchi, Chiyoda City, Tokyo 100-0005",
      organizer: {
        name: "Nexus Cloud Foundation",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        eventsHosted: 42
      },
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      price: 280,
      currency: "$",
      attendeeCount: 5800,
      capacity: 6000,
      description: "DevCon Nexus Tokyo is Asia's most coveted technical summit focusing on distributed systems, Kubernetes orchestration, Rust in production, and ultra-low-latency edge architectures.",
      highlights: [
        "Interactive live coding showdowns on giant arena displays",
        "Deep architectural audits by principal cloud engineers",
        "Bilingual English/Japanese audio translation for all stages",
        "Midnight developer hackathon with $75,000 in bounties"
      ],
      ticketTiers: [
        {
          id: "tier-dev",
          name: "Developer Pass",
          price: 280,
          badge: "Selling Fast",
          perks: ["Access to All 4 Technical Stages", "Hackathon Entry & Swag Kit", "Developer Lounge & High-speed Fiber WiFi", "Lunch & Evening Beer Garden"],
          available: 150
        },
        {
          id: "tier-architect",
          name: "Lead Architect VIP",
          price: 580,
          badge: "Premium",
          perks: ["Everything in Developer Pass", "Private Architect Roundtables", "Exclusive Tokyo Sky Lounge Dinner", "All Recorded Masterclasses with Transcripts"],
          available: 35
        }
      ],
      speakers: ["spk-4", "spk-1", "spk-9"]
    },
    {
      id: "evt-4",
      title: "Design Systems & Future Interfaces 2026",
      tagline: "Exploring spatial computing, multi-modal human interfaces, and AI-augmented design workflows.",
      category: "design",
      format: "Online",
      date: "Oct 28 - 29, 2026",
      startDate: "2026-10-28",
      endDate: "2026-10-29",
      time: "08:00 AM - 04:00 PM EST",
      location: "Virtual Experience (Global Streaming)",
      city: "Online",
      venueAddress: "Global Interactive Broadcast via Eventora LiveStream HD",
      organizer: {
        name: "DesignCraft Collective",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
        eventsHosted: 15
      },
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      price: 149,
      currency: "$",
      attendeeCount: 2900,
      capacity: 5000,
      description: "A premier worldwide online gathering of Product Designers, Design Directors, Creative Technologists, and Design Engineers crafting the visual language of spatial UI and generative software.",
      highlights: [
        "Figma masterclasses led by system architects",
        "Interactive virtual workshop breakout rooms",
        "Critique sessions on award-winning design systems",
        "Portfolio reviews with design leaders from Apple, Stripe & Linear"
      ],
      ticketTiers: [
        {
          id: "tier-digital",
          name: "Virtual All-Access",
          price: 149,
          badge: "Virtual",
          perks: ["Live 4K Ultra-Low Latency Stream", "Interactive Slido Q&A & Polls", "Design System Figma Component Libraries", "12 Months On-Demand Replays"],
          available: 800
        }
      ],
      speakers: ["spk-5", "spk-2"]
    },
    {
      id: "evt-5",
      title: "BioHealth & Longevity Innovations Summit",
      tagline: "Accelerating computational biology, CRISPR breakthroughs, and AI-driven therapeutics.",
      category: "healthcare",
      format: "In-Person",
      date: "Nov 18 - 20, 2026",
      startDate: "2026-11-18",
      endDate: "2026-11-20",
      time: "09:00 AM - 05:00 PM CET",
      location: "Congress Center Basel, Switzerland",
      city: "Basel",
      venueAddress: "Messepl. 21, 4058 Basel, Switzerland",
      organizer: {
        name: "European Biotech Forum",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
        eventsHosted: 28
      },
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      price: 650,
      currency: "$",
      attendeeCount: 1850,
      capacity: 2200,
      description: "Gathering premier geneticists, clinical researchers, venture partners, and biotech founders pioneering cellular rejuvenation and computational drug discovery.",
      highlights: [
        "Nobel Laureate Keynote presentations",
        "Clinical trials breakthrough spotlight sessions",
        "Biotech venture pitching competition with €2M prize pool",
        "Gala dinner overlooking the historic Rhine river"
      ],
      ticketTiers: [
        {
          id: "tier-standard",
          name: "Scientific Delegate",
          price: 650,
          badge: "Official",
          perks: ["Full Summit Access", "Abstract Book & Research Compendium", "Networking Receptions & Lunch", "CPD Continuing Education Credits"],
          available: 120
        },
        {
          id: "tier-patron",
          name: "Research Patron Pass",
          price: 1350,
          badge: "All-Inclusive",
          perks: ["Delegate Pass + Private Scientific Dinners", "Access to Closed-Door Investor Briefings", "Hotel Concierge & Airport Transfer"],
          available: 18
        }
      ],
      speakers: ["spk-7", "spk-8"]
    },
    {
      id: "evt-6",
      title: "SaaS Scale Summit & Venture Days 2026",
      tagline: "The playbook for taking B2B SaaS companies from $10M ARR to $100M+ ARR and IPO.",
      category: "startup",
      format: "Hybrid",
      date: "Dec 08 - 10, 2026",
      startDate: "2026-12-08",
      endDate: "2026-12-10",
      time: "09:00 AM - 06:00 PM EST",
      location: "Austin Convention Center, Texas, USA",
      city: "Austin",
      venueAddress: "500 E Cesar Chavez St, Austin, TX 78701",
      organizer: {
        name: "ScaleVentures Network",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
        eventsHosted: 22
      },
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      price: 399,
      currency: "$",
      attendeeCount: 4200,
      capacity: 4500,
      description: "No fluff, no vanity metrics. Join 4,000+ SaaS founders, CROs, CMOs, and GPs sharing actionable unit economics, pricing packaging changes, and product-led sales playbooks.",
      highlights: [
        "Uncensored teardowns of $100M ARR revenue engines",
        "Curated founder-to-investor speed meetings",
        "SaaS metrics benchmarks report (2026 edition)",
        "Legendary Austin Live Music VIP Afterparty"
      ],
      ticketTiers: [
        {
          id: "tier-founder",
          name: "Founder & Exec Pass",
          price: 399,
          badge: "Popular",
          perks: ["Access to All Stages", "SaaS Benchmarking Toolkit", "Matchmaking App Access", "All Networking Mixers"],
          available: 240
        },
        {
          id: "tier-team",
          name: "Leadership Team (3 Passes)",
          price: 999,
          badge: "Save 16%",
          perks: ["3 All-Access Badges", "Private Strategy Room Reservation (2h)", "Priority Badge Collection", "VIP Afterparty Invitations"],
          available: 30
        }
      ],
      speakers: ["spk-2", "spk-6", "spk-9"]
    },
    {
      id: "evt-7",
      title: "Global Growth Marketing & Retention Con",
      tagline: "Zero-party data, algorithmic acquisition, hyper-personalized retention engines, and viral loops.",
      category: "marketing",
      format: "In-Person",
      date: "Sep 28 - 29, 2026",
      startDate: "2026-09-28",
      endDate: "2026-09-29",
      time: "09:30 AM - 05:30 PM CEST",
      location: "Marina Bay Sands Expo, Singapore",
      city: "Singapore",
      venueAddress: "10 Bayfront Ave, Singapore 018956",
      organizer: {
        name: "Apex Growth Network",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
        eventsHosted: 17
      },
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      price: 299,
      currency: "$",
      attendeeCount: 2400,
      capacity: 3000,
      description: "Join the elite cohort of growth marketers, product managers, and conversion rate specialists rewriting modern omnichannel customer journeys.",
      highlights: [
        "Live conversion teardowns on real corporate funnels",
        "Hands-on prompt engineering for performance creative",
        "Asia-Pacific e-commerce & SaaS retention roundtables",
        "Rooftop networking overlooking Singapore skyline"
      ],
      ticketTiers: [
        {
          id: "tier-ga",
          name: "Growth Marketer Pass",
          price: 299,
          badge: "General",
          perks: ["Keynotes & Breakout Tracks", "Interactive Teardown Workshops", "Post-Event Slide Deck Library", "Networking Lunches"],
          available: 180
        }
      ],
      speakers: ["spk-3", "spk-5"]
    },
    {
      id: "evt-8",
      title: "Executive Leadership & Board Governance 2026",
      tagline: "Navigating geopolitical volatility, cyber resilience, and AI stewardship in the modern boardroom.",
      category: "business",
      format: "In-Person",
      date: "Nov 25 - 26, 2026",
      startDate: "2026-11-25",
      endDate: "2026-11-26",
      time: "08:30 AM - 04:30 PM CET",
      location: "Grand Hotel des Bains Kempinski, St. Moritz, Switzerland",
      city: "St. Moritz",
      venueAddress: "Via Mezdi 27, 7500 St. Moritz, Switzerland",
      organizer: {
        name: "Chatham Leadership Institute",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
        eventsHosted: 12
      },
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      price: 1850,
      currency: "$",
      attendeeCount: 450,
      capacity: 500,
      description: "An exclusive, invitation-only summit for Fortune 1000 board directors, chief legal officers, and enterprise CEOs to engage under Chatham House Rule on crisis management and strategic oversight.",
      highlights: [
        "Strict Chatham House Rule for uncensored governance debates",
        "Cyber war-game simulation led by former intelligence chiefs",
        "Curated alpine networking hikes and private chef banquets",
        "Limited strictly to 500 accredited enterprise leaders"
      ],
      ticketTiers: [
        {
          id: "tier-board",
          name: "Board Director Delegate",
          price: 1850,
          badge: "Verified Credential",
          perks: ["Full 2-Day Private Summit & War-room Sessions", "5-Star Kempinski Banquet & Private Dinners", "Direct Board Matching Network", "Executive Driver Service"],
          available: 14
        }
      ],
      speakers: ["spk-6", "spk-8"]
    }
  ],

  speakers: [
    {
      id: "spk-1",
      name: "Dr. Elena Vance",
      title: "Chief AI Scientist & VP Research",
      company: "Cognitive Frontier Labs",
      bio: "Former Stanford AI faculty, author of 'The Autonomous Mind', and pioneer in synthetic reasoning and transformer self-alignment.",
      expertise: ["Generative AI", "Neural Reasoning", "Compute Optimization"],
      category: "Keynote Speakers",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      linkedin: "#",
      twitter: "#",
      featured: true,
      sessions: ["Architectures for Trillion-Parameter Reasoning Models"]
    },
    {
      id: "spk-2",
      name: "Marcus Sterling",
      title: "Founding Partner & Chief Strategist",
      company: "Aura Capital Partners",
      bio: "Venture capitalist with $2.4B in AUM. Seeded 14 unicorns in cloud, open-source infrastructure, and developer platforms.",
      expertise: ["Venture Capital", "B2B SaaS", "Global Scale"],
      category: "Industry Leaders",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      linkedin: "#",
      twitter: "#",
      featured: true,
      sessions: ["Capital Allocation in High-Interest Rate Realities"]
    },
    {
      id: "spk-3",
      name: "Siddharth Verma",
      title: "Head of Distributed Engineering",
      company: "Stripe HyperScale",
      bio: "Architecting financial infrastructure handling tens of billions of transactions annually with 99.9999% availability.",
      expertise: ["Fault-Tolerant Systems", "FinTech", "High-Throughput Rust"],
      category: "Technology Experts",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      linkedin: "#",
      twitter: "#",
      featured: true,
      sessions: ["Zero-Downtime Migration for Multi-Region Financial Ledgers"]
    },
    {
      id: "spk-4",
      name: "Aoi Takahashi",
      title: "Distinguished Principal Architect",
      company: "Tokyo Cloud Systems",
      bio: "Co-maintainer of open-source container runtimes and Kubernetes core contributor. Specialist in low-overhead eBPF networking.",
      expertise: ["Cloud Native", "eBPF", "Edge Infrastructure"],
      category: "Technology Experts",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      linkedin: "#",
      twitter: "#",
      featured: true,
      sessions: ["Kernel-Bypass Networking for Real-Time Streaming"]
    },
    {
      id: "spk-5",
      name: "Camille Dubois",
      title: "Global Head of Product Design",
      company: "Linear Vision Studio",
      bio: "Celebrated design director known for minimalist human-computer interfaces, spatial UI standards, and micro-interaction craft.",
      expertise: ["Spatial Design", "Design Systems", "Product Craft"],
      category: "Keynote Speakers",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      linkedin: "#",
      twitter: "#",
      featured: false,
      sessions: ["Designing Software That Feels Like Physical Architecture"]
    },
    {
      id: "spk-6",
      name: "Henrik Lindqvist",
      title: "Chief Risk & Compliance Officer",
      company: "Nordic Sovereign Bank",
      bio: "Advising European central banks and fintech conglomerates on programmable settlement, AML heuristics, and cyber defense.",
      expertise: ["Governance", "Central Banking", "Risk Engineering"],
      category: "Industry Leaders",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      linkedin: "#",
      twitter: "#",
      featured: false,
      sessions: ["Defending Sovereign Infrastructure against AI-Driven Threats"]
    },
    {
      id: "spk-7",
      name: "Dr. Alistair Chen",
      title: "Director of Genomic Therapeutics",
      company: "BioSyn Longevity Institute",
      bio: "Leading clinical trials on targeted CRISPR epigenome editing. Named in Nature's 10 scientists who shaped biotechnology.",
      expertise: ["Computational Biology", "CRISPR", "Therapeutics"],
      category: "Researchers",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      linkedin: "#",
      twitter: "#",
      featured: false,
      sessions: ["Algorithmic Cellular Reprogramming at Clinical Scale"]
    },
    {
      id: "spk-8",
      name: "Kendra Reynolds",
      title: "Founder & CEO",
      company: "Synthetix Robotics",
      bio: "Roboticist and serial founder building autonomous humanoid manipulators for aerospace manufacturing and cleanrooms.",
      expertise: ["Humanoid Robotics", "Industrial Tech", "DeepTech Startups"],
      category: "Entrepreneurs",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      linkedin: "#",
      twitter: "#",
      featured: true,
      sessions: ["Embodied Intelligence in Mission-Critical Fabrication"]
    },
    {
      id: "spk-9",
      name: "Liam O'Connor",
      title: "VP Growth & Revenue Engineering",
      company: "OmniFlow Systems",
      bio: "Engineered monetization and PLG mechanisms driving $200M+ ARR expansion for three consecutive high-growth enterprise platforms.",
      expertise: ["Product-Led Growth", "Monetization", "Revenue Ops"],
      category: "Entrepreneurs",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      linkedin: "#",
      twitter: "#",
      featured: false,
      sessions: ["Engineering High-Velocity Sales Funnels with Generative Workflows"]
    }
  ],

  scheduleDays: [
    {
      dayId: "day-1",
      dayTitle: "Day 1",
      dateFormatted: "Wednesday, Oct 14",
      subtitle: "Vision, Frontier Keynotes & AI Architecture",
      tracks: ["Main Stage", "AI & Robotics", "Executive Hall"],
      sessions: [
        {
          id: "sess-101",
          time: "08:00 AM - 09:00 AM",
          title: "Summit Registration, VIP Breakfast & Morning Networking",
          speaker: "Summit Welcome Crew",
          company: "Eventora Platform",
          type: "Break", // Keynote | Workshop | Panel | Networking | Break | Demo
          stage: "Grand Atrium",
          description: "Collect your smart NFC credentials, explore the exhibition pavilions, and enjoy gourmet breakfast.",
          room: "Pavilion Hall A"
        },
        {
          id: "sess-102",
          time: "09:00 AM - 10:15 AM",
          title: "Opening Keynote: Architectures for Trillion-Parameter Reasoning Models",
          speaker: "Dr. Elena Vance",
          company: "Cognitive Frontier Labs",
          type: "Keynote",
          stage: "Main Stage",
          description: "An in-depth revelation of frontier reasoning paradigms, multi-modal compute clusters, and agentic workflows.",
          room: "Main Auditorium (Plenary)"
        },
        {
          id: "sess-103",
          time: "10:30 AM - 11:45 AM",
          title: "Panel: Venture Capital Allocation in Autonomous Computing",
          speaker: "Marcus Sterling & Guests",
          company: "Aura Capital Partners",
          type: "Panel",
          stage: "Executive Hall",
          description: "Top venture partners deliberate where $50B in frontier capital is flowing across infrastructure, silicon, and application layers.",
          room: "Room 302 (Executive Suite)"
        },
        {
          id: "sess-104",
          time: "12:00 PM - 01:30 PM",
          title: "Founders & Investors Networking Luncheon & Pavilion Showcase",
          speaker: "Curated Matching",
          company: "Eventora Networking",
          type: "Networking",
          stage: "Grand Atrium",
          description: "Connect 1-on-1 with fellow attendees using the Eventora AI Matchmaking badges.",
          room: "Dining Terrace"
        },
        {
          id: "sess-105",
          time: "01:30 PM - 03:00 PM",
          title: "Technical Masterclass: High-Throughput Rust for Real-Time Financial Pipelines",
          speaker: "Siddharth Verma",
          company: "Stripe HyperScale",
          type: "Workshop",
          stage: "AI & Robotics",
          description: "Hands-on coding session demonstrating memory-safe low-latency architectures handling 100k events/sec.",
          room: "Workshop Lab B"
        },
        {
          id: "sess-106",
          time: "03:30 PM - 04:45 PM",
          title: "Live Product Demo: Next-Gen Autonomous Manipulators in Action",
          speaker: "Kendra Reynolds",
          company: "Synthetix Robotics",
          type: "Product Demo",
          stage: "Main Stage",
          description: "Live physical stage demonstration of bipedal humanoid robots performing sub-millimeter aerospace assemblies.",
          room: "Main Auditorium"
        },
        {
          id: "sess-107",
          time: "05:00 PM - 07:00 PM",
          title: "Evening Welcome Gala & Skyline Cocktail Mixer",
          speaker: "All Delegates",
          company: "Sponsored by Nvidia & Stripe",
          type: "Networking",
          stage: "Grand Atrium",
          description: "Celebrate day one with ambient live music, craft cocktails, and high-level ecosystem networking.",
          room: "Skyline Terrace"
        }
      ]
    },
    {
      dayId: "day-2",
      dayTitle: "Day 2",
      dateFormatted: "Thursday, Oct 15",
      subtitle: "Deep Dives, System Design & Enterprise Scale",
      tracks: ["Main Stage", "Cloud & Infra", "FinTech Track"],
      sessions: [
        {
          id: "sess-201",
          time: "09:00 AM - 10:15 AM",
          title: "Keynote: Zero-Downtime Multi-Region Cloud Resilience",
          speaker: "Aoi Takahashi",
          company: "Tokyo Cloud Systems",
          type: "Keynote",
          stage: "Main Stage",
          description: "Practical strategies for maintaining zero data loss across cross-continental failovers under simulated catastrophe.",
          room: "Main Auditorium"
        },
        {
          id: "sess-202",
          time: "10:30 AM - 12:00 PM",
          title: "Workshop: Building Autonomous Agentic Workflows with Observability",
          speaker: "Dr. Elena Vance & Team",
          company: "Cognitive Frontier",
          type: "Workshop",
          stage: "Cloud & Infra",
          description: "Learn how to build resilient agent trees with real-time token telemetry and fallback recovery.",
          room: "Lab 101"
        },
        {
          id: "sess-203",
          time: "01:30 PM - 03:00 PM",
          title: "Panel: Programmable Currencies & Global Regulatory Sandbox",
          speaker: "Henrik Lindqvist",
          company: "Nordic Sovereign Bank",
          type: "Panel",
          stage: "FinTech Track",
          description: "Central bank perspectives on interoperability between private payment rails and CBDCs.",
          room: "Room 204"
        },
        {
          id: "sess-204",
          time: "03:30 PM - 05:00 PM",
          title: "Design Keynote: Designing Software That Feels Like Physical Architecture",
          speaker: "Camille Dubois",
          company: "Linear Vision Studio",
          type: "Keynote",
          stage: "Main Stage",
          description: "How tactile feedback, fluid physics, and ultra-high frame rates produce emotional software devotion.",
          room: "Main Auditorium"
        }
      ]
    },
    {
      dayId: "day-3",
      dayTitle: "Day 3",
      dateFormatted: "Friday, Oct 16",
      subtitle: "Hackathon Pitches, VC Awards & Future Outlook",
      tracks: ["Main Stage", "Pitch Arena", "Startup Village"],
      sessions: [
        {
          id: "sess-301",
          time: "09:30 AM - 11:30 AM",
          title: "Global Startup Demo Day: Top 10 Frontier Startups Pitch to 100+ VCs",
          speaker: "Marcus Sterling (Host)",
          company: "Aura Capital",
          type: "Panel",
          stage: "Pitch Arena",
          description: "Selected from 600+ applicants, ten high-growth startups pitch live for $5M in committed syndicated checks.",
          room: "Auditorium West"
        },
        {
          id: "sess-302",
          time: "01:00 PM - 02:30 PM",
          title: "Keynote: Algorithmic Longevity & Cellular Therapeutics",
          speaker: "Dr. Alistair Chen",
          company: "BioSyn Longevity Institute",
          type: "Keynote",
          stage: "Main Stage",
          description: "Mapping the intersection of high-throughput generative biology and human lifespan extension.",
          room: "Main Auditorium"
        },
        {
          id: "sess-303",
          time: "03:00 PM - 04:30 PM",
          title: "Closing Ceremonies, Hackathon Awards & 2027 Roadmap Reveal",
          speaker: "Eventora Executive Board",
          company: "Eventora Global",
          type: "Keynote",
          stage: "Main Stage",
          description: "Honoring hackathon champions, announcing the $100k grand prize winner, and unveiling host cities for 2027.",
          room: "Main Auditorium"
        }
      ]
    }
  ],

  sponsors: [
    {
      tier: "Platinum Partners",
      badgeClass: "badge-platinum",
      items: [
        { name: "NVIDIA Quantum", logoText: "NVIDIA", label: "Frontier Compute", color: "#76B900" },
        { name: "Google Cloud", logoText: "Google Cloud", label: "Hyperscale Infra", color: "#4285F4" },
        { name: "Stripe", logoText: "stripe", label: "Financial Engine", color: "#635BFF" },
        { name: "Microsoft Azure", logoText: "Azure AI", label: "Enterprise Cloud", color: "#0089D6" }
      ]
    },
    {
      tier: "Gold Sponsors",
      badgeClass: "badge-gold",
      items: [
        { name: "Datadog", logoText: "DATADOG", label: "Observability", color: "#632CA6" },
        { name: "Linear", logoText: "Linear", label: "Product Systems", color: "#5E6AD2" },
        { name: "Vercel", logoText: "▲ Vercel", label: "Frontend Cloud", color: "#FFFFFF" },
        { name: "Snowflake", logoText: "snowflake", label: "Data Cloud", color: "#29B5E8" },
        { name: "Anthropic", logoText: "ANTHROPIC", label: "AI Safety", color: "#D97706" }
      ]
    },
    {
      tier: "Silver & Community",
      badgeClass: "badge-silver",
      items: [
        { name: "Supabase", logoText: "supabase", label: "Open Source DB", color: "#3ECF8E" },
        { name: "Cloudflare", logoText: "CLOUDFLARE", label: "Edge Security", color: "#F38020" },
        { name: "Retool", logoText: "Retool", label: "Internal Tools", color: "#3B82F6" },
        { name: "Postman", logoText: "POSTMAN", label: "API Platform", color: "#FF6C37" },
        { name: "GitHub", logoText: "GitHub", label: "Developer Home", color: "#E6EDF3" },
        { name: "Figma", logoText: "Figma", label: "Collaborative UI", color: "#F24E1E" }
      ]
    }
  ],

  networkingAttendees: [
    {
      id: "net-1",
      name: "Sophia Martinez",
      role: "VP of Product Engineering",
      company: "Vanguard Tech",
      location: "San Francisco, USA",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      skills: ["Agentic AI", "Distributed Systems", "Rust"],
      matchScore: 98,
      mutualInterests: ["AI Infrastructure", "Seed Funding", "Spatial UI"],
      connected: false
    },
    {
      id: "net-2",
      name: "Alexander Becker",
      role: "Managing Director & Partner",
      company: "Apex Horizon Ventures",
      location: "Zurich, Switzerland",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      skills: ["Venture Capital", "Series A/B", "FinTech"],
      matchScore: 94,
      mutualInterests: ["Autonomous Agents", "SaaS Scale", "Board Governance"],
      connected: true
    },
    {
      id: "net-3",
      name: "Mei-Ling Zhou",
      role: "Principal AI Research Engineer",
      company: "DeepNeural AI",
      location: "Singapore",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      skills: ["LLM Alignment", "RLHF", "CUDA Kernel Tuning"],
      matchScore: 91,
      mutualInterests: ["Model Reasoning", "Open Weights", "Synthetic Data"],
      connected: false
    },
    {
      id: "net-4",
      name: "David Kalu",
      role: "Founder & CEO",
      company: "OmniLedger Africa",
      location: "Nairobi, Kenya",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      skills: ["FinTech", "Cross-Border FX", "Neobanking"],
      matchScore: 88,
      mutualInterests: ["Programmable Payments", "Emerging Markets", "Micro-loans"],
      connected: false
    },
    {
      id: "net-5",
      name: "Astrid Lindholm",
      role: "Chief Design Officer",
      company: "Nordic Craft Studio",
      location: "Stockholm, Sweden",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      skills: ["Design Systems", "Haptic UI", "Spatial Computing"],
      matchScore: 86,
      mutualInterests: ["UI Micro-interactions", "Figma Variables", "Typography"],
      connected: false
    }
  ],

  testimonials: [
    {
      id: "test-1",
      name: "Seraphina Vance",
      title: "Global Head of Events",
      company: "Nexus Cloud Summit (6,000+ Attendees)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      quote: "Eventora transformed how we organize our annual conference. From multi-tier ticket sales and smart QR check-ins to attendee matchmaking, our NPS jumped by 34% in our very first year."
    },
    {
      id: "test-2",
      name: "Julian Thorne",
      title: "Executive Director",
      company: "European FinTech Congress",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      quote: "The SaaS organizer suite gives us instantaneous financial observability. We processed over $1.8M in enterprise tickets without a single dropped transaction or security friction."
    },
    {
      id: "test-3",
      name: "Kavita Rao",
      title: "Founding Partner",
      company: "Horizon Ventures Silicon Valley",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      quote: "As an attendee and speaker at 20+ conferences annually, Eventora's digital ticket wallet, personalized schedule builder, and networking recommendations are lightyears ahead of old legacy tools."
    }
  ],

  myTickets: [
    {
      ticketId: "EVT-8829-VIP",
      eventId: "evt-1",
      eventTitle: "Global AI & Autonomous Systems Summit 2026",
      attendeeName: "Alexander Hayes",
      attendeeEmail: "a.hayes@frontierlabs.io",
      tierName: "VIP Executive Pass",
      pricePaid: "$799",
      purchaseDate: "Aug 14, 2026",
      date: "Oct 14 - 16, 2026",
      time: "09:00 AM - 06:30 PM PST",
      venue: "Moscone Center, San Francisco, USA",
      seat: "VIP Lounge - Section A, Row 2",
      qrCodeData: "EVENTORA-AUTH:EVT-8829-VIP:ALEXANDER-HAYES:CONFIRMED",
      status: "Confirmed"
    },
    {
      ticketId: "EVT-4102-DEV",
      eventId: "evt-3",
      eventTitle: "DevCon Nexus Tokyo: Cloud & Infrastructure",
      attendeeName: "Alexander Hayes",
      attendeeEmail: "a.hayes@frontierlabs.io",
      tierName: "Developer Pass",
      pricePaid: "$280",
      purchaseDate: "Jul 29, 2026",
      date: "Sep 22 - 24, 2026",
      time: "10:00 AM - 07:00 PM JST",
      venue: "Tokyo International Forum, Tokyo, Japan",
      seat: "General Access Floor",
      qrCodeData: "EVENTORA-AUTH:EVT-4102-DEV:ALEXANDER-HAYES:CONFIRMED",
      status: "Confirmed"
    }
  ],

  organizerStats: {
    totalEvents: 24,
    totalAttendees: 14820,
    ticketsSold: 18450,
    totalRevenue: 1248500,
    conversionRate: 8.4,
    recentSalesTrend: "+18.6% vs last quarter",
    recentTransactions: [
      { id: "TX-9021", event: "Global AI Summit 2026", buyer: "Sarah Jenkins (OpenAI)", amount: "$1,199", date: "Just now", status: "Completed" },
      { id: "TX-9020", event: "Global AI Summit 2026", buyer: "Dr. Kenji Sato (NTT)", amount: "$799", date: "4 mins ago", status: "Completed" },
      { id: "TX-9019", event: "FinTech Frontiers 2026", buyer: "Amara Okonjo (Barclays)", amount: "$950", date: "18 mins ago", status: "Completed" },
      { id: "TX-9018", event: "DevCon Tokyo 2026", buyer: "Taro Yamada (Sony)", amount: "$580", date: "42 mins ago", status: "Completed" },
      { id: "TX-9017", event: "Design Systems 2026", buyer: "Lucas Rossi (Canva)", amount: "$149", date: "1 hour ago", status: "Completed" },
      { id: "TX-9016", event: "Global AI Summit 2026", buyer: "Elena Petrov (DeepMind)", amount: "$799", date: "2 hours ago", status: "Completed" }
    ],
    salesMonthly: [
      { month: "Jan", revenue: 48000, tickets: 320 },
      { month: "Feb", revenue: 62000, tickets: 410 },
      { month: "Mar", revenue: 89000, tickets: 650 },
      { month: "Apr", revenue: 112000, tickets: 840 },
      { month: "May", revenue: 145000, tickets: 1100 },
      { month: "Jun", revenue: 130000, tickets: 980 },
      { month: "Jul", revenue: 175000, tickets: 1320 },
      { month: "Aug", revenue: 210000, tickets: 1540 },
      { month: "Sep", revenue: 277500, tickets: 1980 }
    ],
    sources: [
      { source: "Direct / Organic", pct: 42, color: "#3B82F6" },
      { source: "LinkedIn & Social", pct: 28, color: "#8B5CF6" },
      { source: "Partner Newsletters", pct: 18, color: "#06B6D4" },
      { source: "Referrals & Affiliates", pct: 12, color: "#EC4899" }
    ]
  },

  notifications: [
    {
      id: "notif-1",
      title: "Ticket Confirmed: Global AI Summit 2026",
      desc: "Your VIP Pass (EVT-8829-VIP) has been activated. Digital QR pass is ready in your wallet.",
      time: "10 mins ago",
      icon: "ticket",
      unread: true
    },
    {
      id: "notif-2",
      title: "New Connection Request",
      desc: "Sophia Martinez (VP Product at Vanguard Tech) requested to connect with you.",
      time: "1 hour ago",
      icon: "user-plus",
      unread: true
    },
    {
      id: "notif-3",
      title: "Schedule Updated: Day 2 Keynote",
      desc: "Aoi Takahashi's keynote has been moved to Main Auditorium Plenary Hall at 09:00 AM.",
      time: "4 hours ago",
      icon: "calendar",
      unread: false
    },
    {
      id: "notif-4",
      title: "Early Bird Pricing Ending",
      desc: "FinTech Frontiers London early-bird passes will expire in 48 hours.",
      time: "1 day ago",
      icon: "bell",
      unread: false
    }
  ]
};
