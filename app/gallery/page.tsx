"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const categories = ["all", "worship", "events", "outreach", "teaching"];

  const images = [
    {
      url: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Sunday Service",
      category: "worship",
      span: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
    },
    {
      url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Youth Conference",
      category: "events",
      span: "col-span-1 row-span-1",
    },
    {
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Christmas Celebration",
      category: "events",
      span: "col-span-1 row-span-1",
    },
    {
      url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Worship Night",
      category: "worship",
      span: "col-span-1 row-span-1",
    },
    {
      url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Community Outreach",
      category: "outreach",
      span: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
    },
    {
      url: "https://images.unsplash.com/photo-1490127252417-7c393f20b677?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Bible Study",
      category: "teaching",
      span: "col-span-1 row-span-1",
    },
    {
      url: "https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Church Building",
      category: "events",
      span: "col-span-1 row-span-1",
    },
    {
      url: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Easter Celebration",
      category: "events",
      span: "col-span-1 row-span-1",
    },
    {
      url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Prayer Meeting",
      category: "worship",
      span: "col-span-1 row-span-1",
    },
  ];

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || image.category === activeCategory;
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
              'url("https://images.unsplash.com/photo-1493863641943-9b68992a8d07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Camera className="h-4 w-4 text-gold" />
            <span className="text-sm text-white/90">Captured Moments</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
            Photo Gallery
          </h1>
          <p className="text-lg text-white/80 animate-fade-up animation-delay-200">
            Capturing moments of faith, fellowship, and celebration
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-8 bg-white border-b border-border/50 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search gallery..."
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

      {/* Gallery Grid */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">
                No photos found matching your filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
              {filteredImages.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative group overflow-hidden rounded-2xl cursor-pointer",
                    activeCategory === "all" ? image.span : ""
                  )}
                  onClick={() =>
                    setSelectedImage({ url: image.url, title: image.title })
                  }
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-5 w-full">
                      <h3 className="text-white font-semibold text-lg">
                        {image.title}
                      </h3>
                      <p className="text-white/70 text-sm capitalize">
                        {image.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="max-w-5xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-full object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4 text-lg font-medium">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
