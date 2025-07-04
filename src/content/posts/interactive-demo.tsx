import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function InteractiveDemo() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Interactive React Demo
        </h1>
        <p className="text-xl text-gray-300">
          This is an example of a fully dynamic React page within the resources
          system.
        </p>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Interactive Counter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`text-center transition-all duration-500 ${
              isAnimating ? "scale-150 text-blue-400" : "scale-100 text-white"
            }`}
          >
            <span className="text-6xl font-bold">{count}</span>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setCount((c) => c - 1)}
              variant="outline"
              className="border-white/20 text-white bg-white/5 hover:bg-white/10"
            >
              Decrease
            </Button>
            <Button
              onClick={() => {
                setCount((c) => c + 1);
                handleAnimation();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Increase
            </Button>
            <Button
              onClick={() => setCount(0)}
              variant="outline"
              className="border-red-500/50 text-red-400 bg-red-500/10 hover:bg-red-500/20"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Dynamic Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge className="bg-green-500/20 text-green-400">
                React Component
              </Badge>
              <p className="text-gray-300">
                This entire page is a React component with full access to hooks,
                state, and interactivity.
              </p>
              <p className="text-gray-300">
                You can include any React patterns: state management, effects,
                custom hooks, animations, and more.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Styling Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge className="bg-purple-500/20 text-purple-400">
                Tailwind + shadcn/ui
              </Badge>
              <p className="text-gray-300">
                Uses the same design system as the rest of the site, maintaining
                visual consistency.
              </p>
              <p className="text-gray-300">
                All your existing components and styling utilities work
                seamlessly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-white/10">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            The Best of Both Worlds
          </h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Mix and match markdown blog posts for content-heavy articles with
            fully interactive React pages for demos, tools, and dynamic
            experiences. All within the same resources system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Add metadata as a static property
InteractiveDemo.metadata = {
  title: "Interactive React Demo Post",
  description:
    "Example of a dynamic React page with animations and interactive elements",
  date: "2024-12-20",
  readTime: "10 min read",
  featured: false,
  type: "react",
  tags: ["react", "interactive", "demo"],
  author: "Vibe CTO",
  hidden: true,
};

export default InteractiveDemo;
