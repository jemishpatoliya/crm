import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Home,
  IndianRupee,
  Heart,
  Phone,
  Download,
  Building2,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projects, units } from "@/data/mockData";
import { getUnitDisplayType, getUnitArea, getUnitLocation, formatPrice } from "@/lib/unitHelpers";

export const CustomerPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">RealCRM Properties</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Properties
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Projects
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              About Us
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
            <Button size="sm">Sign In</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-sidebar py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-sidebar-foreground mb-4"
          >
            Find Your Dream Home
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-sidebar-foreground/70 mb-8 max-w-2xl mx-auto"
          >
            Discover premium properties from India's leading builders. Browse, compare, and book your perfect home.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto bg-card rounded-lg p-4 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location, project, or builder..."
                  className="pl-9"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1bhk">1 BHK</SelectItem>
                  <SelectItem value="2bhk">2 BHK</SelectItem>
                  <SelectItem value="3bhk">3 BHK</SelectItem>
                  <SelectItem value="4bhk">4 BHK</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50-75">₹50L - ₹75L</SelectItem>
                  <SelectItem value="75-100">₹75L - ₹1Cr</SelectItem>
                  <SelectItem value="100-150">₹1Cr - ₹1.5Cr</SelectItem>
                  <SelectItem value="150+">₹1.5Cr+</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full md:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Trending Projects</h2>
              <p className="text-muted-foreground">Most sought-after developments</p>
            </div>
            <Button variant="outline">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-48 bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-primary-foreground">
                        {project.availableUnits} units available
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-card/80 hover:bg-card"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="text-lg font-semibold text-primary">
                          {project.priceRange.split(" - ")[0]}
                        </p>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Units */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Available Units</h2>
              <p className="text-muted-foreground">Ready to move properties</p>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {units
              .filter((u) => u.status === "AVAILABLE")
              .map((unit, index) => (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Available
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <h4 className="font-semibold text-foreground">{unit.unitNo}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{unit.project}</p>
                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Home className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{getUnitDisplayType(unit)} • {getUnitArea(unit)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{getUnitLocation(unit)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <p className="text-lg font-semibold text-primary">{formatPrice(unit.price)}</p>
                      <Button size="sm" variant="outline">
                        Express Interest
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Need Help Finding Your Perfect Home?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Our property experts are here to help you find the ideal property that matches your requirements and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Phone className="w-4 h-4 mr-2" />
              Request Callback
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Download className="w-4 h-4 mr-2" />
              Download Brochure
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sidebar-foreground">RealCRM</span>
              </div>
              <p className="text-sm text-sidebar-foreground/60">
                India's leading real estate platform connecting buyers with premium builders.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><a href="#" className="hover:text-sidebar-foreground">Properties</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground">Projects</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground">Builders</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground">Home Loans</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><a href="#" className="hover:text-sidebar-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground">FAQs</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li>+91 1800 123 4567</li>
                <li>support@realcrm.com</li>
                <li>Mumbai, Maharashtra</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/60">
            © 2024 RealCRM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};