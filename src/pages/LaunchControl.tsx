import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Code2, GitBranch, Layers, Rocket, Calendar } from "lucide-react";

const LaunchControl = () => {
  const services = [
    {
      icon: Shield,
      title: "Production Confidence",
      description:
        "Build rock-solid systems that won't break under pressure or expose security vulnerabilities",
    },
    {
      icon: Code2,
      title: "Architecture Review",
      description:
        "Ensure your codebase is maintainable, scalable, and follows industry best practices",
    },
    {
      icon: GitBranch,
      title: "Development Workflow",
      description:
        "Set up proper version control, CI/CD, and collaboration tools for sustainable growth",
    },
    {
      icon: Layers,
      title: "Technical Foundation",
      description:
        "Establish patterns and conventions that enable efficient development as your product evolves",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart",
      content:
        "Launch Control helped us avoid critical security vulnerabilities and set up a proper CI/CD pipeline. Our product is now rock-solid.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO, InnovateNow",
      content:
        "The architecture review transformed our codebase. We can now onboard developers without fear of breaking things.",
      rating: 5,
    },
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
              Transform your vibe coding projects into production-ready systems.
              Get expert guidance on architecture, security, and development
              workflows that ensure your product can scale without breaking or
              exposing vulnerabilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
                onClick={() =>
                  window.open(
                    "https://savvycal.com/craigsturgis/vibecto-30-minute-call",
                    "_blank"
                  )
                }
              >
                Book Strategy Call
                <Calendar className="ml-2 w-5 h-5" />
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
                Expert guidance to ensure your product is secure, scalable, and
                maintainable.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                        <service.icon className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-center">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section className="py-20 px-6">
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
        </section> */}

        {/* How It Works Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We'll guide you through every step to ensure your project is
                production-ready.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Initial Architecture Review
                  </h3>
                  <p className="text-gray-300">
                    We'll analyze your current codebase and identify potential
                    issues before they become problems.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Security & Performance Audit
                  </h3>
                  <p className="text-gray-300">
                    Comprehensive review to ensure your application is secure
                    and performs well under load.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Development Workflow Setup
                  </h3>
                  <p className="text-gray-300">
                    Implement proper CI/CD, testing, and collaboration tools for
                    sustainable growth.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ongoing Support & Guidance
                  </h3>
                  <p className="text-gray-300">
                    Continue working with us as your product grows and evolves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Build with Confidence?
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Stop worrying about your code breaking in production. Get the
                expert guidance you need to build systems that last.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-xl"
                onClick={() =>
                  window.open(
                    "https://savvycal.com/craigsturgis/vibecto-30-minute-call",
                    "_blank"
                  )
                }
              >
                Schedule Free Consultation
                <Calendar className="ml-3 w-6 h-6" />
              </Button>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
                <span>No commitment required</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>30-minute architecture review</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Custom technical roadmap included</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LaunchControl;
