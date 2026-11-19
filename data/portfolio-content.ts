/** Short case-study points shown in the projects panel, e.g. "What I built", "Technical challenge". */
export type ProjectDetails = { label: string; text: string }[];

export type Project = {
  slug: string;
  title: string;
  /** First commit date (YYYY-MM-DD); projects are shown newest first. */
  started: string;
  category: string;
  summary: string;
  description: string;
  details?: ProjectDetails;
  tags: string[];
  status: string;
  href: string;
  layout: "wide" | "tall";
  images: { src: string; width: number; height: number; alt: string }[];
};

const projects: Project[] = [
  {
    slug: "crew-office",
    details: [
      { label: "What I built", text: "I used The Roving Office as a starting point for my own AI-agent office and turned it into a multiplayer workspace where each player brings a team of AI agents. My additions include shared projects, task coordination, agent messaging, workers and a dashboard." },
      { label: "Technical challenge", text: "Getting Claude to work autonomously, making files shareable in multiplayer, stopping the AI from resending the whole chat with every request to cut token usage, and building an office environment that’s actually useful." },
      { label: "How it works", text: "A central Node.js host manages shared state in SQLite, while separate workers run agent jobs. HTTP handles actions and Server-Sent Events deliver live updates. Jobs use leases and retries to recover from interrupted workers, and backend events drive the activity in the office." },
      { label: "Current status", text: "A scripted demo lets you explore the workflow without an API key. Automated integration tests cover coordination, permissions and recovery. Hosting it on the internet requires a separately deployed connectivity service." },
    ],
    title: "Crew Office",
    started: "2026-11-03",
    category: "Multiplayer · AI",
    summary:
      "A multiplayer pixel-art office where each player’s AI agents plan, message each other, write code and review the work — live on the office floor.",
    description:
      "A multiplayer pixel-art office where every player brings their own team of AI agents. Host an office, invite friends, hand it a project, and watch the agents plan, message each other, write files, run tests and review the work — every movement on the floor is a real backend event.",
    tags: ["JavaScript", "Node.js", "Multiplayer", "AI agents", "Pixel art"],
    status: "1.0.0 beta",
    href: "https://github.com/lisboaphe/Crew-Office",
    layout: "wide",
    images: [
      { src: "/projects/crew-office-floor-live.webp", width: 1896, height: 921, alt: "Crew Office: the office floor with four AI agents working at their desks next to a break area" },
      { src: "/projects/crew-office-agents.webp", width: 939, height: 459, alt: "Crew Office: close-up of four agent desks — Lead Dev, two Developers and an Art/Designer — showing Idle, Thinking and Asking AI states" },
    ],
  },
  {
    slug: "omachi-pet",
    details: [
      { label: "What I built", text: "A Linux desktop companion with Egg-to-Slime hatching, care controls, activity-based growth and persistent local saves, built with QML and Quickshell." },
      { label: "Technical challenge", text: "Honestly, almost everything: learning QML, and working out how the pet should earn points based on what you’re doing on your computer." },
      { label: "How it works", text: "Activity detection uses local application classes and MPRIS media playback. Recognized activities train configurable attributes after a continuous activity interval; idle detection pauses growth, and switching activities resets the interval. Save migration keeps progress from earlier versions." },
      { label: "Current status", text: "Version 1 covers the single-player experience. Automated checks cover the model and isolated UI behavior; live-desktop and mixed-monitor testing are still pending. It’s published on Omarchy Market so others can build on it. I haven’t decided yet where to take it next." },
    ],
    title: "Omachi Pet",
    started: "2026-09-25",
    category: "Desktop companion",
    summary:
      "A desktop pet for Omarchy (Hyprland) that grows and reacts based on what you actually do on your computer — coding, music or gaming.",
    description:
      "An Egg-and-Slime desktop companion for Omarchy. Hatch your egg, feed and play with your slime, and let it roam the desktop. What you do on your computer — coding, music, gaming — trains its attributes and changes how it reacts.",
    tags: ["QML", "Quickshell", "Hyprland", "Pixel art"],
    status: "v1.0.0",
    href: "https://github.com/lisboaphe/omachi-pet",
    layout: "tall",
    images: [
      { src: "/projects/omachi-pet-home.webp", width: 420, height: 720, alt: "Omachi Pet home tab: a blue slime listening to music by a lake, with fullness, happiness and energy bars" },
      { src: "/projects/omachi-pet-activities.webp", width: 420, height: 720, alt: "Omachi Pet activities tab with activity detection and training settings" },
    ],
  },
  {
    slug: "webportfolio",
    details: [
      { label: "What I built", text: "A personal portfolio built with Next.js, TypeScript and Tailwind CSS, combining a responsive layout with pixel-art animation, project previews and expandable sections." },
      { label: "Technical challenge", text: "Balancing a playful visual identity with readable content, mobile navigation and privacy for my résumé. It was also my first “real” project: I wanted to build it myself instead of using AI, so I followed a lot of tutorials to get it looking the way I wanted." },
      { label: "How I approached it", text: "My résumé is stored in Vercel Blob and stays password-protected, with a contact form for requesting access. The balance between playful and readable is something that grows with me. I may be happy with it today and change it tomorrow." },
      { label: "Current status", text: "Live at phelis.dev, and evolving as I add projects and refine the experience." },
    ],
    title: "My Webportfolio",
    started: "2026-09-26",
    category: "Development",
    summary:
      "This site: a Next.js portfolio with a pixel-art intro, animated bento tiles, a captcha-protected contact form and a password-protected résumé.",
    description:
      "This site: a personal space where modern UI meets small pixel-art details, playful motion and a responsive bento layout.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    status: "Live",
    href: "https://github.com/lisboaphe/Portfolio-Phillip",
    layout: "wide",
    images: [
      { src: "/projects/portfolio-home.webp", width: 1600, height: 1000, alt: "The portfolio home page with the pixel-art character and bento tiles" },
    ],
  },
];

export const site = {
  name: "Phillip Lisboa",
  resumes: [{ language: "English", lang: "en", url: "/api/resume/en" }, { language: "Deutsch", lang: "de", url: "/api/resume/de" }],
  socials: {
    github: "https://github.com/lisboaphe",
    linkedin: "https://www.linkedin.com/in/phillip-bittencourt-lisboa-056b05306/",
  },
  skills: [
    "Python",
    "Java",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Responsive UI",
    "Git / GitHub",
  ],
  projects,
};

/** Projects sorted newest first, as shown on the site. */
export const projectsByDate = [...projects].sort((a, b) => b.started.localeCompare(a.started));
