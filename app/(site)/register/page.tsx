"use client";

import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Church, Users, Heart, BookOpen } from "lucide-react";
import type { RegisterPayload } from "@/types/auth";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();

  async function handleRegister(payload: RegisterPayload) {
    try {
      await authService.register(payload);
      toast({
        title: "Registration Successful!",
        description:
          "Welcome to Vision Family Church. We're glad to have you!",
      });
      router.push("/admin");
    } catch {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw new Error("Registration failed");
    }
  }

  const benefits = [
    {
      icon: Users,
      title: "Community",
      description: "Join a loving family of believers",
    },
    {
      icon: Heart,
      title: "Growth",
      description: "Grow in faith and purpose",
    },
    {
      icon: BookOpen,
      title: "Discipleship",
      description: "Learn from God's Word",
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
              'url("https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-24">
          <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 animate-fade-down">
            Become a Member
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
            Join Our Church Family
          </h1>
          <p className="text-lg text-white/80 animate-fade-up animation-delay-200">
            Take the first step towards a deeper walk with God. Register and
            become part of something greater.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16">
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div>
                <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
                  Why Join Us
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  What to Expect
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you register with Vision Family Church, you become part
                  of a vibrant community dedicated to faith, fellowship, and
                  spiritual growth.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-5 rounded-xl bg-white border border-border/50"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl bg-primary text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Church className="h-5 w-5 text-gold" />
                  <span className="font-semibold">Service Times</span>
                </div>
                <div className="space-y-2 text-white/80 text-sm">
                  <p>Sunday: 9:00 AM - 11:30 AM</p>
                  <p>Wednesday: 6:00 PM - 7:30 PM</p>
                  <p>Friday: 6:00 PM - 8:00 PM</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-border/50">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Registration Form
                </h3>
                <p className="text-muted-foreground text-sm">
                  Fill out the form below and we&apos;ll be in touch.
                </p>
              </div>

              <RegistrationForm onSubmit={handleRegister} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
