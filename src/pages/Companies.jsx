import React, { useState } from 'react';
import { Search, MapPin, Users, Star, ExternalLink, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/context/JobContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

// Sample companies for public browsing
const SAMPLE_COMPANIES = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    employees: '1,000-5,000',
    rating: 4.8,
    openJobs: 24,
    description: 'Leading technology company focused on innovation and digital transformation.',
    benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Learning Budget'],
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300'
  },
  {
    id: '2',
    name: 'StartupXYZ',
    industry: 'Fintech',
    location: 'New York, NY',
    employees: '100-500',
    rating: 4.6,
    openJobs: 8,
    description: 'Fast-growing fintech startup revolutionizing digital payments and banking.',
    benefits: ['Equity', 'Flexible Hours', 'Health & Dental', 'Team Events'],
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300'
  },
  {
    id: '3',
    name: 'Design Studio',
    industry: 'Creative',
    location: 'Los Angeles, CA',
    employees: '50-100',
    rating: 4.9,
    openJobs: 6,
    description: 'Award-winning design studio creating exceptional digital experiences.',
    benefits: ['Creative Freedom', 'Work-Life Balance', 'Professional Growth'],
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300'
  },
  {
    id: '4',
    name: 'AI Solutions',
    industry: 'Artificial Intelligence',
    location: 'Austin, TX',
    employees: '200-1,000',
    rating: 4.7,
    openJobs: 15,
    description: 'Pioneering AI company developing cutting-edge machine learning solutions.',
    benefits: ['Research Time', 'Conference Budget', 'Stock Options'],
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300'
  },
  {
    id: '5',
    name: 'CloudTech',
    industry: 'Cloud Services',
    location: 'Seattle, WA',
    employees: '500-1,000',
    rating: 4.5,
    openJobs: 32,
    description: 'Leading cloud infrastructure provider helping businesses scale globally.',
    benefits: ['Remote First', 'Learning & Development', 'Health Coverage'],
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300'
  },
  {
    id: '6',
    name: 'GrowthCo',
    industry: 'Marketing',
    location: 'Chicago, IL',
    employees: '100-500',
    rating: 4.4,
    openJobs: 12,
    description: 'Full-service marketing agency helping brands achieve sustainable growth.',
    benefits: ['Creative Environment', 'Flexible PTO', 'Growth Opportunities'],
    logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300'
  }
];

const Companies = () => {
  const { companies = [] } = useJobs();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  // Use sample companies if API companies not available
  const companiesToDisplay = companies && companies.length > 0 ? companies : SAMPLE_COMPANIES;
  const industries = [...new Set(companiesToDisplay.map(company => company.industry))];

  const filteredCompanies = companiesToDisplay.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const handleCompanyClick = (companyId) => {
    // For now, navigate to find jobs filtered by company
    navigate(`/find-jobs?company=${companyId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Discover Amazing <span className="text-transparent bg-clip-text bg-gradient-primary">Companies</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore top companies, learn about their culture, and find your next career opportunity.
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card 
              key={company.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/30"
              onClick={() => handleCompanyClick(company.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-secondary flex items-center justify-center flex-shrink-0">
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold text-lg">${company.name.charAt(0)}</div>`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-1">
                      {company.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{company.industry}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{company.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{company.size}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {company.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{company.rating}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Founded {company.founded}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-primary">
                    <Briefcase className="h-4 w-4" />
                    <span className="font-medium">{company.openJobs} jobs</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/companies/${company.id}`);
                    }}
                  >
                    View Profile
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/find-jobs?company=${company.name}`);
                    }}
                  >
                    View Jobs
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://${company.website}`, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Companies Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedIndustry('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{companies.length}+</div>
            <div className="text-muted-foreground">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {companies.reduce((sum, company) => sum + company.openJobs, 0)}+
            </div>
            <div className="text-muted-foreground">Open Positions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{industries.length}+</div>
            <div className="text-muted-foreground">Industries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {companies.reduce((sum, company) => sum + company.employees, 0).toLocaleString()}+
            </div>
            <div className="text-muted-foreground">Employees</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Companies;