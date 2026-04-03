import { useState } from "react";
import { Menu, X } from "lucide-react";
import tigerLogo from "@/assets/tiger-logo.png";

const navItems = ["PLAYERS", "NEWS", "FIXTURES", "CLUB", "SHOP", "TICKET"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img src={tigerLogo} alt="The Tiger Squad" className="w-10 h-10" />
          <div>
            <h1 className="font-heading text-sm font-bold tracking-wider text-foreground">THE TIGER SQUAD</h1>
            <p className="text-[10px] text-muted-foreground tracking-widest">FOOTBALL CLUB</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="font-heading text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors">
              {item}
            </a>
          ))}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block px-6 py-3 font-heading text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
