"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlayCircle, Clock, User } from "lucide-react";

export default function SermonsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "worship", "faith", "purpose", "family"];

  const sermons = [
    {
      title: "Walking in Divine Vision",
      speaker: "Pastor John Doe",
      date: "April 14, 2024",
      duration: "45 mins",
      category: "purpose",
      thumbnail:
        "https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "The Power of Faith",
      speaker: "Pastor Jane Smith",
      date: "April 7, 2024",
      duration: "40 mins",
      category: "faith",
      thumbnail:
        "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Understanding God's Purpose",
      speaker: "Pastor John Doe",
      date: "March 31, 2024",
      duration: "50 mins",
      category: "purpose",
      thumbnail:
        "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Building a Strong Family",
      speaker: "Pastor Jane Smith",
      date: "March 24, 2024",
      duration: "42 mins",
      category: "family",
      thumbnail:
        "https://images.unsplash.com/photo-1490127252417-7c393f20b677?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "The Heart of Worship",
      speaker: "Pastor John Doe",
      date: "March 17, 2024",
      duration: "38 mins",
      category: "worship",
      thumbnail:
        "https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Living by Faith",
      speaker: "Deacon Michael Johnson",
      date: "March 10, 2024",
      duration: "35 mins",
      category: "faith",
      thumbnail:
        "https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || sermon.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-hero pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1490127252417-7c393f20b677?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-24">
          <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 animate-fade-down">
            God&apos;s Word
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
            Sermons
          </h1>
          <p className="text-lg text-white/80 animate-fade-up animation-delay-200">
            Listen to life-changing messages from God&apos;s Word
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-white border-b border-border/50 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search sermons by title or speaker..."
                className="pl-10 rounded-xl border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  className="rounded-full capitalize shrink-0"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredSermons.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No sermons found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSermons.map((sermon, index) => (
                <div
                  key={index}
                  className="group rounded-2xl overflow-hidden bg-white border border-border/50 card-hover"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors cursor-pointer">
                        <PlayCircle className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-primary capitalize">
                        {sermon.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                      {sermon.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {sermon.speaker}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {sermon.duration}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      {sermon.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
