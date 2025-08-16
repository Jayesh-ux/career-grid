import JobCard from "./JobCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function FeaturedJobs() {
  const featuredJobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "3-5 years",
      salary: "$120k - $150k",
      description: "Join our innovative team to build cutting-edge web applications using React, TypeScript, and modern web technologies. Work with a passionate team of developers on exciting projects that impact millions of users.",
      posted: "2 days ago",
      remote: true,
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"]
    },
    {
      id: "2", 
      title: "Product Manager",
      company: "StartupXYZ",
      location: "New York, NY",
      type: "Full-time",
      experience: "2-4 years",
      salary: "$90k - $120k",
      description: "Lead product strategy and development for our SaaS platform. Collaborate with engineering, design, and marketing teams to deliver exceptional user experiences.",
      posted: "1 day ago",
      urgent: true,
      skills: ["Product Strategy", "Agile", "Analytics", "User Research", "Roadmapping"]
    },
    {
      id: "3",
      title: "UX Designer",
      company: "Design Studio",
      location: "Los Angeles, CA", 
      type: "Contract",
      experience: "1-3 years",
      salary: "$70k - $95k",
      description: "Create intuitive and beautiful user experiences for web and mobile applications. Work closely with product and engineering teams to bring designs to life.",
      posted: "3 days ago",
      remote: true,
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"]
    },
    {
      id: "4",
      title: "Data Scientist",
      company: "AI Solutions",
      location: "Austin, TX",
      type: "Full-time", 
      experience: "2-5 years",
      salary: "$100k - $130k",
      description: "Apply machine learning and statistical analysis to solve complex business problems. Work with large datasets to extract meaningful insights and build predictive models.",
      posted: "4 days ago",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Statistics"]
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Seattle, WA",
      type: "Full-time",
      experience: "3-6 years", 
      salary: "$110k - $140k",
      description: "Build and maintain scalable cloud infrastructure. Implement CI/CD pipelines and ensure high availability of our services across multiple environments.",
      posted: "1 week ago",
      urgent: true,
      remote: true,
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"]
    },
    {
      id: "6",
      title: "Marketing Manager",
      company: "GrowthCo",
      location: "Chicago, IL",
      type: "Full-time",
      experience: "2-4 years",
      salary: "$75k - $95k", 
      description: "Lead digital marketing campaigns and growth initiatives. Develop strategies to increase brand awareness and drive customer acquisition across multiple channels.",
      posted: "5 days ago",
      skills: ["Digital Marketing", "SEO", "Content Marketing", "Analytics", "Growth Hacking"]
    }
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-primary font-medium">Featured Opportunities</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Latest <span className="gradient-text">Job Openings</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover hand-picked job opportunities from top companies looking for talented professionals like you.
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredJobs.map((job, index) => (
            <div 
              key={job.id}
              className="animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>

        {/* View All Jobs Button */}
        <div className="text-center animate-fade-in">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-button btn-glow text-primary-foreground font-semibold px-8"
          >
            View All Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}