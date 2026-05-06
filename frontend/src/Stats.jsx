const stats = [
    { value: "400+", label: "Games in Catalog", icon: "🎲" },
    { value: "12", label: "Club Tables", icon: "🪑" },
    { value: "2,000+", label: "Members", icon: "👥" },
    { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
];

export function Stats() {
    return (
        <section className="relative z-10 -mt-2 py-6 border-y border-[#1e3a1e]" style={{ background: "linear-gradient(90deg, #0f1a0f 0%, #12201a 50%, #0f1a0f 100%)" }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#1e3a1e]">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center py-6 px-4 text-center gap-1">
                            <span className="text-2xl mb-1">{stat.icon}</span>
                            <span className="text-[#c8a84b]" style={{ fontSize: "1.75rem", fontWeight: 800 }}>{stat.value}</span>
                            <span className="text-[#6a8a6a] text-xs">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
