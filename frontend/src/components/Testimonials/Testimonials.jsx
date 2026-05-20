import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Marta L.",
        handle: "@marta_plays",
        avatar: "ML",
        avatarColor: "#c8a84b",
        rating: 5,
        text: "BoardRoot completely changed our Friday nights. We rented Wingspan for a week and fell in love — now it's a regular thing. The availability tracker is a lifesaver.",
        tag: "Rent & Go member",
    },
    {
        id: 2,
        name: "João S.",
        handle: "@joaos_games",
        avatar: "JS",
        avatarColor: "#6abf6a",
        rating: 5,
        text: "Reserved a table for my birthday — the staff was amazing, the selection was huge, and we ended up staying for 5 hours. Best birthday ever. 10/10 will be back.",
        tag: "Stay & Play member",
    },
    {
        id: 3,
        name: "Ana R.",
        handle: "@anaboards",
        avatar: "AR",
        avatarColor: "#9b6abf",
        rating: 5,
        text: "The catalog is incredible. I can filter by player count, time, genre — exactly what I need when I'm planning game night for 6 people with wildly different tastes.",
        tag: "Club member",
    },
];

export function Testimonials() {
    return (
        <section className="py-28 bg-[#0d160d]" style={{ backgroundImage: "radial-gradient(ellipse at 50% 100%, #1a3a1a33 0%, transparent 70%)" }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-[#c8a84b] text-xs uppercase tracking-widest mb-3">
                        Community Love
                    </p>
                    <h2
                        className="text-white"
                        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, lineHeight: 1.15 }}
                    >
                        What Our Members Say
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="bg-[#12201a] border border-[#1e3a1e] hover:border-[#2a4a2a] rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[#0f1a0f] text-sm"
                                        style={{ background: t.avatarColor, fontWeight: 700 }}
                                    >
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm" style={{ fontWeight: 600 }}>{t.name}</p>
                                        <p className="text-[#4a6a4a] text-xs">{t.handle}</p>
                                    </div>
                                </div>
                                <Quote className="w-5 h-5 text-[#2a4a2a]" />
                            </div>

                            <div className="flex gap-0.5">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 text-[#c8a84b] fill-[#c8a84b]" />
                                ))}
                            </div>

                            <p className="text-[#8aab8a] text-sm flex-1" style={{ lineHeight: 1.7 }}>
                                "{t.text}"
                            </p>

                            <div
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs self-start"
                                style={{ background: "#c8a84b15", color: "#c8a84b", border: "1px solid #c8a84b30" }}
                            >
                                {t.tag}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
