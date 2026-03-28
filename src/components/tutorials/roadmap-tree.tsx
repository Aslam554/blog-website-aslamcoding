"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight,
  Code2,
  Database,
  Globe,
  Layout,
  Layers,
  Terminal,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RoadmapNode } from "@/data/roadmaps";
import { Button } from "@/components/ui/button";

interface RoadmapTreeProps {
  nodes: RoadmapNode[];
}

const typeIcons = {
  frontend: <Layout className="h-4 w-4" />,
  backend: <Terminal className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  tooling: <Layers className="h-4 w-4" />,
  fullstack: <Globe className="h-4 w-4" />,
};

export default function RoadmapTree({ nodes }: RoadmapTreeProps) {
  return (
    <div className="relative p-10 min-h-[800px] w-full max-w-5xl mx-auto overflow-visible">
      <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible">
        {nodes.map((node) => {
          if (!node.parentId) return null;
          const parent = nodes.find((n) => n.id === node.parentId);
          if (!parent) return null;

          return (
            <motion.path
                key={`edge-${node.id}`}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
                d={`M ${parent.position.x * 3} ${parent.position.y * 1.5} L ${node.position.x * 3} ${node.position.y * 1.5}`}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                className={cn(
                    "text-muted-foreground/20",
                    node.status === "completed" && "text-primary/40 stroke-solid opacity-100"
                )}
            />
          );
        })}
      </svg>

      {nodes.map((node, idx) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          style={{ 
            left: `${node.position.x * 3}px`, 
            top: `${node.position.y * 1.5}px`,
            transform: "translate(-50%, -50%)"
          }}
          className="absolute z-10"
        >
          <div className="relative group">
            {/* Connection Point Aura */}
            <div className={cn(
                "absolute -inset-4 rounded-full blur-[20px] opacity-0 transition-opacity duration-500",
                node.status === "completed" && "bg-green-500/10 opacity-100",
                node.status === "in-progress" && "bg-primary/10 opacity-100 animate-pulse"
            )} />

            <div className={cn(
                "w-72 glass p-5 rounded-[24px] border transition-all duration-300 relative z-20",
                node.status === "completed" ? "border-green-500/30 bg-green-500/5 shadow-lg shadow-green-500/5" : "border-white/10 hover:border-primary/40 shadow-xl",
                node.status === "in-progress" && "border-primary/50 shadow-primary/10 ring-1 ring-primary/20"
            )}>
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                    "p-2.5 rounded-xl",
                    node.status === "completed" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                )}>
                  {typeIcons[node.type]}
                </div>
                <div className="flex items-center gap-1.5">
                    {node.status === "completed" ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                            <CheckCircle2 className="h-3 w-3" />
                            Done
                        </div>
                    ) : node.status === "in-progress" ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
                            <Clock className="h-3 w-3" />
                            Active
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            <Circle className="h-3 w-3" />
                            Locked
                        </div>
                    )}
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <h4 className="font-outfit font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {node.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {node.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                 <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Level {Math.ceil(node.position.y / 100)}</span>
                 <Button variant="ghost" size="sm" className="h-7 px-3 rounded-full text-[10px] font-bold gap-1.5 hover:bg-primary/10 hover:text-primary transition-all">
                    Unlock <ExternalLink className="h-2.5 w-2.5" />
                 </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
