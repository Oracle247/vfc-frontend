import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, BookOpen, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Vision Family Church
            </h1>
            <p className="text-xl md:text-2xl mb-8 animation-delay-200">
              A place of divine vision and purpose
            </p>
            <div className="space-x-4">
              <Button
                size="lg"
                asChild
                className="animate-fade-up animation-delay-300"
              >
                <Link href="/register">Join Us</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="animate-fade-up text-black animation-delay-400"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl animate-fade-up">
              Why Choose Vision Family Church?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Biblical Teaching",
                description: "Deep, practical teachings from God's Word",
              },
              {
                icon: Users,
                title: "Community",
                description: "A loving family of believers",
              },
              {
                icon: Heart,
                title: "Worship",
                description: "Spirit-filled worship experiences",
              },
              {
                icon: Calendar,
                title: "Regular Events",
                description: "Activities for all age groups",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg shadow-lg bg-white animate-fade-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Service Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Join Our Next Service
            </h2>
            <div className="inline-block bg-white p-8 rounded-lg shadow-lg">
              <p className="text-2xl font-semibold mb-2">Sunday Service</p>
              <p className="text-xl text-gray-600 mb-4">9:00 AM - 11:30 AM</p>
              <Button size="lg" asChild>
                <Link href="/register">Plan Your Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
