"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Heart,
  Gift,
  Landmark,
  ArrowRight,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GivePage() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const givingOptions = [
    {
      title: "Tithe",
      description: "Regular giving of 10% of your income as unto the Lord.",
      icon: Landmark,
      suggested: ["5000", "10000", "20000"],
      verse: "Malachi 3:10",
    },
    {
      title: "Offering",
      description: "Give freely as you are led by the Holy Spirit.",
      icon: Heart,
      suggested: ["1000", "2000", "5000"],
      verse: "2 Corinthians 9:7",
    },
    {
      title: "Special Project",
      description: "Support our building and community projects.",
      icon: Gift,
      suggested: ["10000", "50000", "100000"],
      verse: "1 Chronicles 29:14",
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-hero pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-24">
          <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 animate-fade-down">
            Generosity
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
            Give
          </h1>
          <p className="text-lg text-white/80 animate-fade-up animation-delay-200">
            Support the work of God through your generous giving.
            &quot;Each of you should give what you have decided in your heart to
            give.&quot;
          </p>
        </div>
      </section>

      {/* Scripture Banner */}
      <section className="py-8 bg-gold/10 border-y border-gold/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">2 Corinthians 9:7</span>
          </div>
          <p className="text-foreground italic">
            &quot;Each of you should give what you have decided in your heart to
            give, not reluctantly or under compulsion, for God loves a cheerful
            giver.&quot;
          </p>
        </div>
      </section>

      {/* Giving Options */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
              Ways to Give
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground section-divider">
              Choose How You&apos;d Like to Give
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {givingOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => setSelectedOption(index)}
                className={cn(
                  "relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                  selectedOption === index
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border/50 hover:border-primary/30 bg-white card-hover"
                )}
              >
                {selectedOption === index && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <option.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {option.description}
                </p>

                {/* Suggested Amounts */}
                <div className="flex gap-2 mb-4">
                  {option.suggested.map((value, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1 rounded-lg text-xs",
                        amount === value && selectedOption === index
                          ? "bg-primary text-white border-primary"
                          : ""
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOption(index);
                        setAmount(value);
                      }}
                    >
                      &#8358;{Number(value).toLocaleString()}
                    </Button>
                  ))}
                </div>

                {selectedOption === index && (
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      &#8358;
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter custom amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7 rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-4 italic">
                  {option.verse}
                </p>
              </div>
            ))}
          </div>

          {amount && (
            <div className="mt-10 text-center">
              <Button className="btn-gold text-white border-0 px-10 py-6 text-base rounded-xl">
                Give &#8358;{Number(amount).toLocaleString()}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Bank Details */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
              Bank Transfer
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground section-divider">
              Transfer Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-border/50 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Landmark className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-4">Naira Account</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Bank Name
                  </p>
                  <p className="font-medium">First Bank of Nigeria</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Account Name
                  </p>
                  <p className="font-medium">Vision Family Church</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Account Number
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">XXXXXXXXXX</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopy("XXXXXXXXXX")}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-primary text-white">
              <h3 className="font-bold text-lg mb-4">Important Note</h3>
              <div className="space-y-4 text-white/80 text-sm leading-relaxed">
                <p>
                  Please use your full name as the transfer reference so we can
                  properly acknowledge your giving.
                </p>
                <p>
                  After making a transfer, you can notify us via email at{" "}
                  <span className="text-gold font-medium">
                    info@visionfamilychurch.org
                  </span>{" "}
                  with your name, amount, and purpose of giving.
                </p>
                <p>
                  Thank you for your faithfulness and generosity. God bless you
                  abundantly!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
