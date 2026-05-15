"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  ArrowRight,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const events = [
    {
      title: "Youth Conference 2024",
      date: "May 15-17, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      description:
        "Three days of powerful worship, teaching, and fellowship for young people. Come experience the move of God!",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      tag: "Conference",
    },
    {
      title: "Marriage Seminar",
      date: "April 30, 2024",
      time: "10:00 AM - 2:00 PM",
      location: "Fellowship Hall",
      description:
        "Building strong marriages through God's principles. Open to all married and engaged couples.",
      image:
        "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      tag: "Seminar",
    },
    {
      title: "Easter Service",
      date: "March 31, 2024",
      time: "8:00 AM - 11:00 AM",
      location: "Main Auditorium",
      description:
        "Celebrate the resurrection of Jesus Christ with us in a special Easter worship service.",
      image:
        "https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      tag: "Service",
    },
    {
      title: "Community Outreach",
      date: "June 5, 2024",
      time: "8:00 AM - 4:00 PM",
      location: "Amassoma Community",
      description:
        "Join us as we reach out to our community with the love of Christ through acts of service and kindness.",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      tag: "Outreach",
    },
  ];

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-hero pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-24">
          <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 animate-fade-down">
            What&apos;s Happening
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
            Upcoming Events
          </h1>
          <p className="text-lg text-white/80 animate-fade-up animation-delay-200">
            Join us for these special gatherings and be part of something
            meaningful.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-10 rounded-xl border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No events found matching your search.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredEvents.map((event, index) => (
                <div
                  key={index}
                  className="group grid grid-cols-1 md:grid-cols-[350px_1fr] rounded-2xl overflow-hidden bg-white border border-border/50 card-hover"
                >
                  <div className="relative h-64 md:h-full overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold text-white">
                        {event.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg">
                        <Clock className="h-4 w-4 text-primary" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg">
                        <MapPin className="h-4 w-4 text-primary" />
                        {event.location}
                      </span>
                    </div>
                    <div>
                      <Button asChild className="rounded-xl">
                        <Link href="/register">
                          Register Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Users className="h-12 w-12 mx-auto mb-6 text-gold" />
          <h2 className="text-3xl font-bold mb-4">
            Want to Host an Event?
          </h2>
          <p className="text-white/70 mb-8">
            If you have an idea for a church event or would like to volunteer,
            we&apos;d love to hear from you. Get in touch with our events team.
          </p>
          <Button
            asChild
            className="btn-gold text-white border-0 px-8 py-6 text-base rounded-xl"
          >
            <Link href="/register">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
