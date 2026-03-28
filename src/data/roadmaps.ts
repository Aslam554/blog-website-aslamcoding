export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  type: "frontend" | "backend" | "fullstack" | "tooling" | "database";
  status: "completed" | "in-progress" | "not-started";
  parentId?: string;
  position: { x: number; y: number };
  link?: string;
}

export const fullstackRoadmap: RoadmapNode[] = [
  {
    id: "1",
    title: "The Foundation",
    description: "Master HTML5, CSS3, and Modern JavaScript (ES6+).",
    type: "frontend",
    status: "completed",
    position: { x: 50, y: 50 },
  },
  {
    id: "2",
    title: "React Mastery",
    description: "Hooks, Context API, and state management patterns.",
    type: "frontend",
    status: "in-progress",
    parentId: "1",
    position: { x: 50, y: 200 },
  },
  {
    id: "3",
    title: "Next.js Ninja",
    description: "Server Components, Server Actions, and App Router.",
    type: "frontend",
    status: "not-started",
    parentId: "2",
    position: { x: 50, y: 350 },
  },
  {
    id: "4",
    title: "Backend Core",
    description: "Node.js, Express, and RESTful API design.",
    type: "backend",
    status: "not-started",
    parentId: "2",
    position: { x: 250, y: 200 },
  },
  {
    id: "5",
    title: "Database Design",
    description: "SQL (PostgreSQL) vs NoSQL (MongoDB), Prisma & Drizzle ORM.",
    type: "database",
    status: "not-started",
    parentId: "4",
    position: { x: 250, y: 350 },
  },
  {
    id: "6",
    title: "Deployment & CI/CD",
    description: "Vercel, Docker, and GitHub Actions.",
    type: "tooling",
    status: "not-started",
    parentId: "3",
    position: { x: 150, y: 500 },
  },
];
