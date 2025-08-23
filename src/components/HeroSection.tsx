import { useState, useEffect } from "react";
import { Search, MapPin, Building, TrendingUp, Users, Star, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import heroImage from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    if (searchQuery || location) {
      navigate(`/find-jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setAuthModalTab('register');
      setIsAuthModalOpen(true);
    }
  };

  const handleSignIn = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32 min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        <div className="max-w-6xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center items-center lg:items-start space-y-6">
              {/* Badge with scroll animation */}
              <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <Badge 
                  className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors duration-300 inline-flex"
                >
                  🚀 Join 2M+ Professionals
                </Badge>
              </div>
              
              {/* Main Heading with staggered animation */}
              <div className={`space-y-4 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-center lg:text-left">
                  Discover Your{" "}
                  <span className="gradient-text">Perfect Job</span>
                  <br className="hidden sm:block" />
                  <span className="block mt-2">Match Today</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl lg:max-w-none text-center lg:text-left mx-auto lg:mx-0">
                  Connect with top employers, explore opportunities, and advance your career with our AI-powered job matching platform.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transform transition-all duration-1000 delay-400 w-full sm:w-auto ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto h-12 px-8 bg-gradient-primary hover:shadow-button btn-glow text-primary-foreground font-semibold group"
                >
                  <UserPlus className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handleSignIn}
                  className="w-full sm:w-auto h-12 px-8 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
                >
                  <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Button>
              </div>
            </div>

            {/* Right Content - Search Card */}
            <div className={`flex justify-center items-center transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-card w-full max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-6 text-center">Quick Job Search</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Job title, keywords, or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-base border-border/50 focus:border-primary/50 bg-background/50"
                    />
                  </div>
                  
                  <div className="relative">
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
                    className="w-full h-12 bg-gradient-primary hover:shadow-button btn-glow text-primary-foreground font-semibold"
                  >
                    Search Jobs
                  </Button>
                </div>

                {/* Popular Searches */}
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3 text-center">Popular searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularSearches.slice(0, 4).map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors duration-200 text-xs px-2 py-1"
                        onClick={() => setSearchQuery(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 lg:mt-16 max-w-4xl mx-auto justify-center items-center transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 bg-card/40 backdrop-blur-sm rounded-2xl p-4 border border-border/30 hover:bg-card/60 transition-all duration-300 group flex flex-col items-center"
                style={{ 
                  animationDelay: `${800 + index * 100}ms`,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isVisible ? 1 : 0,
                  transition: `all 0.6s ease-out ${800 + index * 100}ms`
                }}
              >
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/20 text-primary group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
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

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </section>
  );
}