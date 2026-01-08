"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/services" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location =
    typeof window !== "undefined" ? window.location : { pathname: "" };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="container mx-auto">
        <div className="glass-card rounded-[4px] px-6 py-3 flex items-center justify-between ">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-xl">
                Q
              </span>
            </div>
            <span className="text-xl font-bold gradient-text">Qcena</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-smoke-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="hero" size="sm">
                Criar Conta
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              viewport={{
                once: true,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 glass-card rounded-2xl p-4 space-y-4"
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border space-y-2">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="hero" className="w-full">
                    Criar Conta
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
