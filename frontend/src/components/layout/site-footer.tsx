import { BookOpen, Github, Heart } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

export function SiteFooter(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t glass-header">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg glass-card">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <span className="gradient-text font-bold text-lg">EnglishPrep</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your companion for IELTS, TOEFL, and GRE preparation
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/words" className="hover:text-primary transition-colors">
                  Vocabulary
                </Link>
              </li>
              <li>
                <Link href="/add-word" className="hover:text-primary transition-colors">
                  Add Word
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-primary transition-colors">
                  Practice
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="https://dictionaryapi.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Dictionary API
                </a>
              </li>
              <li>
                <span className="text-xs">Next.js · Tailwind v4</span>
              </li>
              <li>
                <span className="text-xs">shadcn/ui · TypeScript</span>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">About</h3>
            <p className="text-sm text-muted-foreground">
              Built with <Heart className="inline h-3 w-3 text-red-500" /> for English learners
            </p>
            <div className="flex items-center space-x-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} EnglishPrep. All rights reserved.</p>
          <p className="glass-card px-3 py-1 rounded-full">
            Liquid Glass Design · iOS Inspired
          </p>
        </div>
      </div>
    </footer>
  );
}
