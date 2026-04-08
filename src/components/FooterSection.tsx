import tigerLogo from "@/assets/tiger-logo.png";

const FooterSection = () => {
  return (
    <footer className="py-12 bg-darker-surface border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={tigerLogo} alt="The Tiger Squad" className="w-10 h-10" loading="lazy" />
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground tracking-wider">THE TIGER SQUAD</h3>
              <p className="text-[10px] text-muted-foreground tracking-widest">FOOTBALL CLUB</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { label: "Players", href: "#players" },
              { label: "Tournament", href: "#tournament" },
              { label: "Ranking", href: "#ranking" },
              { label: "Club", href: "#club-info" },
              { label: "Rules", href: "#rules" },
              { label: "News", href: "#news" },
            ].map((link) => (
              <a key={link.label} href={link.href} className="text-muted-foreground hover:text-primary transition-colors font-heading text-xs tracking-wider">
                {link.label.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            © 2026 The Tiger Squad Football Club. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Website Created & Designed by <span className="text-primary font-bold">MAHEDI HASAN</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
