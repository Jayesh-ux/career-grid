import { Link } from "react-router-dom";
import { Briefcase, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const footerSections = [
    {
      title: "For Job Seekers",
      links: [
        { name: "Browse Jobs", href: "/jobs" },
        { name: "Career Advice", href: "/advice" },
        { name: "Resume Builder", href: "/resume" },
        { name: "Salary Guide", href: "/salary" },
        { name: "Interview Tips", href: "/interview-tips" },
      ]
    },
    {
      title: "For Employers", 
      links: [
        { name: "Post a Job", href: "/post-job" },
        { name: "Search Resumes", href: "/resumes" },
        { name: "Pricing", href: "/pricing" },
        { name: "Recruitment Tips", href: "/recruitment" },
        { name: "Company Profiles", href: "/company-profiles" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Help Center", href: "/help" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Industry Reports", href: "/reports" },
        { name: "Job Market Trends", href: "/trends" },
        { name: "Career Events", href: "/events" },
        { name: "Mobile App", href: "/mobile" },
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
  ];

  return (
    <footer className="bg-secondary/30 backdrop-blur-xl border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-button">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold gradient-text">CareerGrid</span>
              </Link>

              <p className="text-muted-foreground max-w-md leading-relaxed">
                Connecting talented professionals with amazing opportunities. 
                Join millions of job seekers and top companies on our platform to build the future together.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span>123 Career Street, Tech City, TC 12345</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span>hello@careergrid.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-2">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 hover:bg-primary/20 hover:text-primary transition-all duration-200 border border-border/50 hover:border-primary/30"
                    asChild
                  >
                    <a href={social.href} aria-label={social.name}>
                      <social.icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {footerSections.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-semibold text-foreground text-lg mb-4 relative">
                    {section.title}
                    <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-primary rounded-full" />
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-border/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="max-w-md">
              <h3 className="font-semibold text-foreground mb-2 text-lg">Stay Updated</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get the latest job alerts, career insights, and industry trends delivered directly to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              <Input
                placeholder="Enter your email address"
                className="w-full sm:w-80 bg-background/50 border-border/50 focus:border-primary/50 h-11"
              />
              <Button className="bg-gradient-primary hover:shadow-button btn-glow h-11 px-6 whitespace-nowrap">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/30">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                © 2024 <span className="text-foreground font-medium">CareerGrid</span>. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link 
                to="/privacy" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <Link 
                to="/sitemap" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}