import { Building2, Star, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function CompanyShowcase() {
  const companies = [
    {
      id: "1",
      name: "TechCorp Inc.",
      industry: "Technology",
      location: "San Francisco, CA",
      employees: "1,000-5,000",
      rating: 4.8,
      openJobs: 24,
      description: "Leading technology company focused on innovation and digital transformation.",
      benefits: ["Health Insurance", "Remote Work", "Stock Options", "Learning Budget"],
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "2", 
      name: "StartupXYZ",
      industry: "Fintech",
      location: "New York, NY",
      employees: "100-500",
      rating: 4.6,
      openJobs: 8,
      description: "Fast-growing fintech startup revolutionizing digital payments and banking.",
      benefits: ["Equity", "Flexible Hours", "Health & Dental", "Team Events"],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "3",
      name: "Design Studio", 
      industry: "Creative",
      location: "Los Angeles, CA",
      employees: "50-100",
      rating: 4.9,
      openJobs: 6,
      description: "Award-winning design studio creating exceptional digital experiences for global brands.",
      benefits: ["Creative Freedom", "Work-Life Balance", "Professional Growth", "Modern Tools"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "4",
      name: "AI Solutions",
      industry: "Artificial Intelligence", 
      location: "Austin, TX",
      employees: "200-1,000",
      rating: 4.7,
      openJobs: 15,
      description: "Pioneering AI company developing cutting-edge machine learning solutions.",
      benefits: ["Research Time", "Conference Budget", "Health Benefits", "Stock Options"],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "5",
      name: "CloudTech",
      industry: "Cloud Services",
      location: "Seattle, WA", 
      employees: "500-1,000",
      rating: 4.5,
      openJobs: 32,
      description: "Leading cloud infrastructure provider helping businesses scale globally.",
      benefits: ["Remote First", "Learning & Development", "Health Coverage", "Bonuses"],
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&crop=center"
    },
    {
      id: "6",
      name: "GrowthCo",
      industry: "Marketing",
      location: "Chicago, IL",
      employees: "100-500", 
      rating: 4.4,
      openJobs: 12,
      description: "Full-service marketing agency helping brands achieve sustainable growth.",
      benefits: ["Creative Environment", "Flexible PTO", "Team Building", "Growth Opportunities"],
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop&crop=center"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-6 w-6 text-company-accent" />
            <span className="text-company-accent font-medium">Top Employers</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Companies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore career opportunities with industry-leading companies that value innovation, growth, and work-life balance.
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {companies.map((company, index) => (
            <Card 
              key={company.id}
              className="group cursor-pointer job-card bg-card/80 backdrop-blur-sm border-border/50 hover:border-company-accent/30 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                {/* Company Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={company.image}
                    alt={`${company.name} office`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-success/90 text-success-foreground">
                      {company.openJobs} Open Jobs
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  {/* Company Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-company-accent transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{company.industry}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{company.rating}</span>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{company.employees} employees</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {company.description}
                  </p>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {company.benefits.slice(0, 3).map((benefit, idx) => (
                      <Badge 
                        key={idx}
                        variant="secondary" 
                        className="text-xs bg-company-accent/10 text-company-accent"
                      >
                        {benefit}
                      </Badge>
                    ))}
                    {company.benefits.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{company.benefits.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 hover:bg-company-accent/10 hover:text-company-accent hover:border-company-accent/30"
                    >
                      View Company
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-primary hover:shadow-button btn-glow"
                    >
                      View Jobs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Companies Button */}
        <div className="text-center animate-fade-in">
          <Button 
            size="lg" 
            variant="outline"
            className="hover:bg-company-accent/10 hover:text-company-accent hover:border-company-accent/30 border-company-accent/20 px-8"
          >
            Explore All Companies
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}