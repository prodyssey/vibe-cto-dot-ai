import { Home, Zap, Rocket, Sparkles, BookOpen, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/transformation", label: "Transformation", icon: Sparkles },
    { path: "/ignition", label: "Ignition", icon: Zap },
    { path: "/launch-control", label: "Launch Control", icon: Rocket },
    { path: "/resources", label: "Resources", icon: BookOpen },
    { path: "/about", label: "About", icon: User },
  ];

  // Desktop nav items (without Home)
  const desktopNavItems = navItems.filter(item => item.path !== "/");

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-3 text-xl sm:text-2xl font-bold text-white"
          >
            <Logo size="md" />
            <span>
              VibeCTO
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                .ai
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === "/resources" &&
                  location.pathname.startsWith("/resources"));

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-black/95 backdrop-blur-lg border-l border-white/10 p-0"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Link
                  to="/"
                  onClick={handleNavClick}
                  className="flex items-center space-x-3 text-xl font-bold text-white"
                >
                  <Logo size="md" />
                  <span>
                    VibeCTO
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      .ai
                    </span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path === "/resources" &&
                      location.pathname.startsWith("/resources"));

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start space-x-3 text-left ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-base">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
