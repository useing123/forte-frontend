"use client"

import { Code, GitMerge, FileCode, Terminal, Braces, Database, Cpu, MessageSquareCode } from "lucide-react"

const floatingItems = [
    { icon: Code, color: "bg-pink-500", position: "top-[15%] left-[8%]", delay: "0s", size: "h-14 w-14" },
    { icon: GitMerge, color: "bg-orange-400", position: "top-[25%] right-[10%]", delay: "0.5s", size: "h-12 w-12" },
    { icon: FileCode, color: "bg-cyan-400", position: "top-[40%] left-[5%]", delay: "1s", size: "h-10 w-10" },
    { icon: Terminal, color: "bg-yellow-400", position: "top-[20%] left-[25%]", delay: "1.5s", size: "h-11 w-11" },
    { icon: Braces, color: "bg-emerald-400", position: "top-[35%] right-[8%]", delay: "2s", size: "h-12 w-12" },
    { icon: Database, color: "bg-blue-400", position: "top-[50%] right-[15%]", delay: "0.8s", size: "h-10 w-10" },
    { icon: Cpu, color: "bg-rose-400", position: "top-[55%] left-[12%]", delay: "1.2s", size: "h-11 w-11" },
    {
        icon: MessageSquareCode,
        color: "bg-indigo-400",
        position: "top-[12%] right-[25%]",
        delay: "0.3s",
        size: "h-13 w-13",
    },
]

export function FloatingElements() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingItems.map((item, index) => (
                <div
                    key={index}
                    className={`absolute ${item.position} animate-float`}
                    style={{
                        animationDelay: item.delay,
                        animationDuration: `${3 + index * 0.5}s`,
                    }}
                >
                    <div
                        className={`${item.size} ${item.color} rounded-2xl shadow-xl flex items-center justify-center transform rotate-${index % 2 === 0 ? "6" : "-6"} hover:scale-110 transition-transform`}
                    >
                        <item.icon className="h-1/2 w-1/2 text-white" />
                    </div>
                </div>
            ))}

            {/* Decorative elements */}
            <div
                className="absolute top-[30%] left-[35%] h-4 w-4 rounded-full bg-yellow-300 animate-ping"
                style={{ animationDuration: "2s" }}
            />
            <div
                className="absolute top-[45%] right-[30%] h-3 w-3 rounded-full bg-pink-300 animate-ping"
                style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
            />
            <div className="absolute top-[18%] left-[50%] h-5 w-5 rounded-full bg-white/40 animate-pulse" />
        </div>
    )
}
