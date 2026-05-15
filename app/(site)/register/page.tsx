"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Church, ArrowRight, Users, Heart, BookOpen } from "lucide-react";
import type { Gender } from "@/types/user";
import type { RegisterPayload } from "@/types/auth";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(11, "Phone number must be at least 11 digits"),
  address: z.string().min(5, "Please enter your address"),
  gender: z.string().min(1, "Please select your gender"),
  membershipType: z.string().min(1, "Please select membership type"),
});

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      gender: "",
      membershipType: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await authService.register({
        ...values,
        gender: values.gender as Gender,
      } as RegisterPayload);
      toast({
        title: "Registration Successful!",
        description:
          "Welcome to Vision Family Church. We're glad to have you!",
      });
      form.reset();
      router.push("/admin");
    } catch {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              className="rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              className="rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            className="rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+234..."
                            className="rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-lg">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="membershipType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Membership Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-lg">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NEW_MEMBER">
                                New Member
                              </SelectItem>
                              <SelectItem value="TRANSFER">
                                Transfer Member
                              </SelectItem>
                              <SelectItem value="VISITOR">
                                Regular Visitor
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your address..."
                            className="rounded-lg resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full btn-gold text-white border-0 rounded-xl py-6 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Registering..."
                    ) : (
                      <>
                        Register Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
