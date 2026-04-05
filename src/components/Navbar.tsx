import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import tigerLogo from "@/assets/tiger-logo.png";

const navItems = [
  { label: "PLAYERS", href: "/players" },
  { label: "TOURNAMENT", href: "/tournament" },
  { label: "RANKING", href: "/#ranking" },
  { label: "CLUB", href: "/club-info" },
  { label: "RULES", href: "/rules" },
  { label: "NEWS", href: "/news" },
  { label: "LIVE DRAW", href: "/live-draw" },
  { label: "ADMIN", href: "/admin" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <img src={tigerLogo} alt="The Tiger Squad" className="w-10 h-10" />
          <div>
            <h1 className="font-heading text-sm font-bold tracking-wider text-foreground">THE TIGER SQUAD</h1>
            <p className="text-[10px] text-muted-foreground tracking-widest">FOOTBALL CLUB</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            item.href.startsWith("/#") ? (
              <a key={item.label} href={item.href} className="font-heading text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors">
                {item.label}
              </a>
            ) : (
              <Link key={item.label} to={item.href} className="font-heading text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors">
                {item.label}
              </Link>
            )
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          {navItems.map((item) =>
            item.href.startsWith("/#") ? (
              <a key={item.label} href={item.href} className="block px-6 py-3 font-heading text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                {item.label}
              </a>
            ) : (
              <Link key={item.label} to={item.href} className="block px-6 py-3 font-heading text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
