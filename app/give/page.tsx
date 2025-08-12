"use client"

import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Heart, Gift, Landmark, ArrowRight } from "lucide-react"

export default function GivePage() {
  const [amount, setAmount] = useState("")

  const givingOptions = [
    {
      title: "Tithe",
      description: "Regular giving of 10% of your income",
      icon: Landmark,
      suggested: ["5000", "10000", "20000"]
    },
    {
      title: "Offering",
      description: "Give as you are led by the Holy Spirit",
      icon: Heart,
      suggested: ["1000", "2000", "5000"]
    },
    {
      title: "Special Project",
      description: "Support our building and community projects",
      icon: Gift,
      suggested: ["10000", "50000", "100000"]
    }
  ]

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative h-[30vh] mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
              Give
            </h1>
            <p className="text-xl animate-fade-up animation-delay-200">
              Support the work of God through your generous giving
            </p>
          </div>
        </div>
      </div>

      {/* Giving Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {givingOptions.map((option, index) => (
            <Card 
              key={index}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader>
                <option.icon className="h-8 w-8 text-primary mb-4" />
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {option.suggested.map((value, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="flex-1"
                        onClick={() => setAmount(value)}
                      >
                        ₦{value}
                      </Button>
                    ))}
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-6"
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2">₦</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Give Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bank Details */}
        <div className="mt-16 text-center animate-fade-up">
          <h2 className="text-2xl font-bold mb-6">Bank Transfer Details</h2>
          <div className="inline-block bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-2">Vision Family Church</p>
            <p className="text-gray-600">Bank: First Bank of Nigeria</p>
            <p className="text-gray-600">Account Number: XXXXXXXXXX</p>
            <p className="text-gray-600 mt-4">
              Please use your name as reference when making transfers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}