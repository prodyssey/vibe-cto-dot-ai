
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Shield, Users, TrendingUp, CheckCircle, ArrowRight, Star, Calendar } from "lucide-react";

const LaunchControl = () => {
  const services = [
    {
      icon: Rocket,
      title: "Launch Strategy",
      description: "Complete go-to-market strategy tailored to your product and audience"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Identify and mitigate potential launch risks before they become problems"
    },
    {
      icon: TrendingUp,
      title: "Growth Optimization",
      description: "Data-driven approaches to maximize your launch momentum"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Build a loyal user base before, during, and after your launch"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart",
      content: "Launch Control helped us go from prototype to $10k MRR in just 8 weeks. The strategic guidance was invaluable.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO, InnovateNow",
      content: "The risk management strategies saved us from major pitfalls. Our launch was smooth and successful.",
      rating: 5
    }
  ];

  const packages = [
    {
      name: "Essentials",
      price: "$2,997",
      description: "Perfect for solo founders ready to launch their first product",
      features: [
        "Launch strategy session",
        "Risk assessment checklist",
        "Basic marketing templates",
        "Email support for 30 days"
      ]
    },
    {
      name: "Premium",
      price: "$7,997",
      description: "Comprehensive launch support for serious entrepreneurs",
      features: [
        "Everything in Essentials",
        "Weekly strategy calls",
        "Custom launch timeline",
        "Marketing automation setup",
        "Community building guide",
        "90 days of support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "White-glove service for high-stakes launches",
      features: [
        "Everything in Premium",
        "Dedicated launch manager",
        "Custom integrations",
        "Press & media outreach",
        "Investor pitch support",
        "6 months of support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Launch Control
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Turn your vibe coding projects into profitable businesses. Get expert guidance, 
              proven strategies, and hands-on support for a successful product launch.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
              >
                Book Strategy Call
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg"
              >
                View Case Studies
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What We Do
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive launch support to maximize your chances of success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                        <service.icon className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-center">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Success Stories
              </h2>
              <p className="text-xl text-gray-300">
                See how Launch Control has helped founders achieve their goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Choose Your Package
              </h2>
              <p className="text-xl text-gray-300">
                Select the level of support that matches your ambitions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <Card key={index} className={`bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-white text-2xl mb-2">{pkg.name}</CardTitle>
                    <div className="text-4xl font-bold text-white mb-4">{pkg.price}</div>
                    <p className="text-gray-300">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${pkg.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-white/10 hover:bg-white/20'
                      } text-white`}
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready for Launch?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Don't leave your product launch to chance. Get the expert guidance you need to succeed.
              </p>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-xl"
              >
                Schedule Free Consultation
                <Calendar className="ml-3 w-6 h-6" />
              </Button>
              
              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
                <span>No commitment required</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>30-minute strategy session</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Custom action plan included</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LaunchControl;
