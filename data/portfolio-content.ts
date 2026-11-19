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
  projects: [
    {
      number: "01",
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
        { src: "/projects/crew-office-floor.webp", width: 1600, height: 804, alt: "Crew Office: the 2D pixel-art office floor with desks, a break area and the player at their desk" },
        { src: "/projects/crew-office-characters.webp", width: 900, height: 876, alt: "Crew Office: the character picker with six pixel-art characters" },
      ],
    },
    {
      number: "02",
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
      number: "03",
      title: "Portfolio Playground",
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
  ],
};
