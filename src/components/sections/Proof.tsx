import { Star, TrendingUp, Users, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export const Proof = () => {
  const metrics = [
    { icon: TrendingUp, value: "40+", label: "Prototypes hardened" },
    { icon: Zap, value: "6 weeks", label: "Avg. time to production" },
    { icon: Users, value: "95%", label: "Client satisfaction rate" },
    { icon: Star, value: "15+", label: "5-star reviews" },
  ];

  const testimonials = [
    {
      quote:
        "Craig helped us build a culture around AI-assisted engineering. We've dramatically increased the pace of delivery even with 1/3 the capacity we had in early 2024.",
      author: "Jason Burchard",
      role: "CEO, Rootnote",
      path: "Transformation",
      link: "https://rootnote.co",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Proven results
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real builders getting real results with working with Craig:
          </p>
        </div>

        {/* Metrics */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <metric.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-gray-300 text-sm">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Testimonials */}
        <div
          className={`grid gap-8 ${
            testimonials.length < 3
              ? "justify-center"
              : "md:grid-cols-2 lg:grid-cols-3"
          } ${
            testimonials.length === 1
              ? "max-w-md mx-auto"
              : testimonials.length === 2
              ? "md:grid-cols-2 max-w-2xl mx-auto"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-sm border-white/10"
            >
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <blockquote className="text-gray-300 text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.link ? (
                        <a
                          href={testimonial.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple-400 transition-colors"
                        >
                          {testimonial.role}
                        </a>
                      ) : (
                        testimonial.role
                      )}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      testimonial.path === "Ignition"
                        ? "bg-green-500/20 text-green-400"
                        : testimonial.path === "Transformation"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {testimonial.path}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
