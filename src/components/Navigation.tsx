'use client'

import {
  Home,
  BookOpen,
  Menu,
  X,
  User,
  ChevronDown,
  Briefcase,
  Target,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { getOrderedServices } from "@/config/services";
import { getOrderedGoals } from "@/config/goals";

export const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const serviceItems = getOrderedServices();
  const goalItems = getOrderedGoals();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/resources", label: "Resources", icon: BookOpen },
    { path: "/about", label: "About", icon: User },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
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
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/10">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-black/95 backdrop-blur-lg border border-white/10">
                      {serviceItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                          <li key={item.path}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.path}
                                className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${
                                  isActive
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                    : "hover:bg-white/10 hover:text-white text-white/90"
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <Icon className="w-4 h-4" />
                                  <div className="text-sm font-medium leading-none">
                                    {item.label}
                                  </div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-white/60">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/10">
                    <Target className="w-4 h-4 mr-2" />
                    Goals
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-black/95 backdrop-blur-lg border border-white/10">
                      {goalItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                          <li key={item.path}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.path}
                                className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${
                                  isActive
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                    : "hover:bg-white/10 hover:text-white text-white/90"
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <Icon className="w-4 h-4" />
                                  <div className="text-sm font-medium leading-none">
                                    {item.label}
                                  </div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-white/60">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {navItems
              .filter((item) => item.path !== "/")
              .map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.path ||
                  (item.path === "/resources" &&
                    pathname.startsWith("/resources"));

                return (
                  <Link key={item.path} href={item.path}>
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
                  href="/"
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
                {/* Home */}
                <Link href="/" onClick={handleNavClick}>
                  <Button
                    variant={pathname === "/" ? "default" : "ghost"}
                    className={`w-full justify-start space-x-3 text-left ${
                      pathname === "/"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-base">Home</span>
                  </Button>
                </Link>

                {/* Services Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-white/60 text-sm font-medium">
                    <Briefcase className="w-4 h-4" />
                    <span>Services</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    {serviceItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          href={item.path}
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
                </div>

                {/* Goals Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-white/60 text-sm font-medium">
                    <Target className="w-4 h-4" />
                    <span>Goals</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    {goalItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={handleNavClick}
                        >
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start space-x-3 text-left ${
                              isActive
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
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
                </div>

                {/* Other Nav Items */}
                {navItems
                  .filter((item) => item.path !== "/")
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.path ||
                      (item.path === "/resources" &&
                        pathname.startsWith("/resources"));

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
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
