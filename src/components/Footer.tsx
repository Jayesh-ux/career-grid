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
    <footer className="bg-card/50 border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold gradient-text">CareerGrid</span>
              </Link>

              <p className="text-muted-foreground max-w-md">
                Connecting talented professionals with amazing opportunities. 
                Join millions of job seekers and top companies on our platform.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>123 Career Street, Tech City, TC 12345</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>hello@careergrid.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 hover:bg-primary/20 hover:text-primary"
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
            {footerSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-semibold text-foreground">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-border/50">
          <div className="max-w-md">
            <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest job alerts and career insights delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-background/50 border-border/50 focus:border-primary/50"
              />
              <Button className="bg-gradient-primary hover:shadow-button btn-glow">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 CareerGrid. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link 
                to="/privacy" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}