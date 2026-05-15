import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Heart,
  BookOpen,
  Users,
  ArrowRight,
  Clock,
  MapPin,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: "Biblical Teaching",
      description:
        "Deep, practical teachings rooted in the Word of God that transform lives and renew minds.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "A warm, loving family of believers where you belong and are valued.",
    },
    {
      icon: Heart,
      title: "Worship",
      description:
        "Spirit-filled worship experiences that draw you into the presence of God.",
    },
    {
      icon: Calendar,
      title: "Events & Programs",
      description:
        "Life-enriching activities, conferences, and programs for every age group.",
    },
  ];

  const stats = [
    { value: "500+", label: "Members" },
    { value: "10+", label: "Years of Ministry" },
    { value: "52", label: "Services Yearly" },
    { value: "20+", label: "Departments" },
  ];

  return (
    <div className="min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 hero-overlay" />

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-down">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium">
                Welcome to our church family
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-up leading-tight">
              A Place of{" "}
              <span className="text-gold">Divine Vision</span>
              <br />
              and Purpose
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-up animation-delay-200">
              Experience the transforming power of God&apos;s love in a vibrant
              community of faith, hope, and purpose.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-300">
              <Button
                size="lg"
                asChild
                className="btn-gold text-white border-0 px-8 py-6 text-base rounded-xl"
              >
                <Link href="/register">
                  Join Us Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-base rounded-xl"
              >
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-white/60 animate-fade-down" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground section-divider">
              A Church That Feels Like Home
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center p-8 rounded-2xl bg-white border border-border/50 card-hover"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-gold mb-2">
                  {stat.value}
                </p>
                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICE TIMES SECTION ═══ */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
                Join Us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Service Times
              </h2>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                We would love to have you worship with us. Our services are
                designed to uplift, inspire, and draw you closer to God. Come as
                you are.
              </p>

              <div className="space-y-4">
                {[
                  {
                    day: "Sunday",
                    name: "Sunday Worship Service",
                    time: "9:00 AM - 11:30 AM",
                  },
                  {
                    day: "Wednesday",
                    name: "Midweek Bible Study",
                    time: "6:00 PM - 7:30 PM",
                  },
                  {
                    day: "Friday",
                    name: "Prayer & Intercession",
                    time: "6:00 PM - 8:00 PM",
                  },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-5 rounded-xl bg-white border border-border/50 card-hover"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {service.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {service.day} &middot; {service.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Church worship"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>Amassoma, Bayelsa State</span>
                  </div>
                  <p className="text-white text-xl font-bold">
                    Everyone is Welcome
                  </p>
                </div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-border/50 animate-float hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Come as you are</p>
                    <p className="text-xs text-muted-foreground">
                      All are welcome
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LATEST SERMON SECTION ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
                Latest Message
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Recent Sermons
              </h2>
            </div>
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/sermons">
                View All Sermons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Walking in Divine Vision",
                speaker: "Pastor John Doe",
                date: "April 14, 2024",
                image:
                  "https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "The Power of Faith",
                speaker: "Pastor Jane Smith",
                date: "April 7, 2024",
                image:
                  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Understanding God's Purpose",
                speaker: "Pastor John Doe",
                date: "March 31, 2024",
                image:
                  "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              },
            ].map((sermon, index) => (
              <div
                key={index}
                className="group rounded-2xl overflow-hidden border border-border/50 card-hover"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={sermon.image}
                    alt={sermon.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <PlayCircle className="h-14 w-14 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground mb-2">
                    {sermon.date} &middot; {sermon.speaker}
                  </p>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {sermon.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/3 w-64 h-64 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Whether you&apos;re new to faith or looking for a church home, we
            welcome you with open arms. Come experience God&apos;s love with us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="btn-gold text-white border-0 px-8 py-6 text-base rounded-xl"
            >
              <Link href="/register">
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-6 text-base rounded-xl"
            >
              <Link href="/about">Learn About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
