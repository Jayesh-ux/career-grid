import { useState } from "react";
import { Search, MapPin, Building, TrendingUp, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const stats = [
    { label: "Active Jobs", value: "50K+", icon: TrendingUp },
    { label: "Companies", value: "10K+", icon: Building },
    { label: "Job Seekers", value: "2M+", icon: Users },
    { label: "Success Rate", value: "95%", icon: Star },
  ];

  const popularSearches = [
    "Frontend Developer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "Marketing Manager",
    "Software Engineer",
  ];

  const handleSearch = () => {
    // Handle job search
    console.log("Searching for:", searchQuery, "in", location);
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="space-y-6 mb-12 animate-fade-in">
            <Badge 
              className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors duration-300"
            >
              🎉 Join 2M+ Job Seekers
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your{" "}
              <span className="gradient-text">Dream Career</span>
              <br />
              With Top Companies
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover thousands of job opportunities from leading companies worldwide. 
              Your next career move is just one search away.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 mb-12 animate-scale-in shadow-card">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base border-border/50 focus:border-primary/50 bg-background/50"
                />
              </div>
              
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-12 h-12 text-base border-border/50 focus:border-primary/50 bg-background/50"
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                size="lg"
                className="h-12 px-8 bg-gradient-primary hover:shadow-button btn-glow text-primary-foreground font-semibold"
              >
                Search Jobs
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mb-16 animate-slide-in-right">
            <p className="text-sm text-muted-foreground mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors duration-200 px-3 py-1"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/20 text-primary">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl floating" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl floating" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-company-accent/10 rounded-full blur-xl floating" style={{ animationDelay: '2s' }} />
    </section>
  );
}