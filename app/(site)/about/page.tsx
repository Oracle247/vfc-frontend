import {
  Church,
  Users,
  Heart,
  Target,
  BookOpen,
  HandHeart,
  Flame,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Church,
      title: "Worship",
      description:
        "Authentic, Spirit-filled worship that connects hearts with the presence of God.",
    },
    {
      icon: Users,
      title: "Fellowship",
      description:
        "Building strong, lasting relationships within our church family and community.",
    },
    {
      icon: HandHeart,
      title: "Service",
      description:
        "Serving God by serving others with love, compassion, and excellence.",
    },
    {
      icon: BookOpen,
      title: "Discipleship",
      description:
        "Growing in faith through the study and application of God's Word.",
    },
    {
      icon: Flame,
      title: "Evangelism",
      description:
        "Sharing the good news of Jesus Christ to our community and beyond.",
    },
    {
      icon: Heart,
      title: "Love",
      description:
        "Demonstrating the unconditional love of Christ in all we do.",
    },
  ];

  const leaders = [
    {
      name: "Pastor John Doe",
      role: "Senior Pastor",
      image:
        "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      bio: "Leading with vision and a passion for God's people since 2014.",
    },
    {
      name: "Pastor Jane Smith",
      role: "Associate Pastor",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      bio: "Passionate about discipleship and women's ministry.",
    },
    {
      name: "Deacon Michael Johnson",
      role: "Head Deacon",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      bio: "Dedicated to serving the church with integrity and humility.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-hero pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-24">
          <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 animate-fade-down">
            Our Story
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
            About Vision Family Church
          </h1>
          <p className="text-lg text-white/80 animate-fade-up animation-delay-200">
            Building a community of faith, hope, and love in Amassoma and
            beyond since 2014.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative p-10 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To be a beacon of hope and transformation in Amassoma and
                beyond, leading people to Christ and empowering them to live
                purposeful lives through the Word of God.
              </p>
            </div>

            <div className="relative p-10 rounded-2xl bg-gold/5 border border-gold/10">
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-gold" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To create an environment where people can encounter God,
                experience His love, and be equipped to serve Him and others
                effectively in every area of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
                How It All Began
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Journey of Faith
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Vision Family Church was founded in 2014 with a simple yet
                  powerful calling: to bring the light of God&apos;s Word to the
                  community of Amassoma and the entire Bayelsa State.
                </p>
                <p>
                  What began as a small gathering of faithful believers has
                  grown into a vibrant community of worshippers, united by
                  their love for God and passion for impacting lives.
                </p>
                <p>
                  Today, we continue to grow in numbers and in grace, reaching
                  out to the lost, nurturing believers, and building a legacy
                  of faith for generations to come.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Church community"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-xl shadow-lg border border-border/50 hidden lg:block">
                <p className="text-3xl font-bold text-primary">10+</p>
                <p className="text-sm text-muted-foreground">
                  Years of Ministry
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground section-divider">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-border/50 bg-white card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mb-5 transition-colors">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
              Meet Our Team
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground section-divider">
              Our Leadership
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {leaders.map((leader, index) => (
              <div
                key={index}
                className="group text-center"
              >
                <div className="relative w-52 h-52 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {leader.name}
                </h3>
                <p className="text-gold font-medium text-sm mb-2">
                  {leader.role}
                </p>
                <p className="text-muted-foreground text-sm">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
