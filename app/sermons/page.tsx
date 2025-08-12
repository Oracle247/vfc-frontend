"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Search, PlayCircle } from "lucide-react"

export default function SermonsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const sermons = [
    {
      title: "Walking in Divine Vision",
      speaker: "Pastor John Doe",
      date: "April 14, 2024",
      duration: "45 mins",
      thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "The Power of Faith",
      speaker: "Pastor Jane Smith",
      date: "April 7, 2024",
      duration: "40 mins",
      thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Understanding God's Purpose",
      speaker: "Pastor John Doe",
      date: "March 31, 2024",
      duration: "50 mins",
      thumbnail: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    // Add more sermons as needed
  ]

  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative h-[30vh] mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1490127252417-7c393f20b677?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
              Sermons
            </h1>
            <p className="text-xl animate-fade-up animation-delay-200">
              Listen to life-changing messages from God's Word
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative animate-fade-up">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search sermons..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sermons Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSermons.map((sermon, index) => (
            <Card 
              key={index}
              className="overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative h-48">
                <img
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
              </div>
              <CardHeader>
                <CardTitle>{sermon.title}</CardTitle>
                <CardDescription>{sermon.speaker}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {sermon.date} • {sermon.duration}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Watch Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}