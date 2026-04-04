import { LogIn, Shield } from "lucide-react";

const LoginSection = () => {
  return (
    <section id="login" className="py-16 bg-purple-surface">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            ADMIN PANEL
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Access the admin dashboard to manage tournaments, players, results, and more.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/login"
              className="bg-primary text-primary-foreground font-heading text-sm tracking-wider px-6 py-4 hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 rounded-lg"
            >
              <LogIn className="w-4 h-4" />
              MAIN ADMIN
            </a>
            <a
              href="/admin/club-login"
              className="bg-card border border-border text-foreground font-heading text-sm tracking-wider px-6 py-4 hover:border-primary transition-colors flex items-center justify-center gap-2 rounded-lg"
            >
              <LogIn className="w-4 h-4" />
              CLUB ADMIN
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
