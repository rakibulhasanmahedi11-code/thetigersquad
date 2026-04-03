import { MapPin, Clock } from "lucide-react";
import stadiumVisit from "@/assets/stadium-visit.jpg";

const StadiumSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">Visit Tiger Arena</h2>

        <div className="rounded-lg overflow-hidden mb-8">
          <img src={stadiumVisit} alt="Tiger Arena Stadium" className="w-full h-64 md:h-96 object-cover" loading="lazy" width={1920} height={800} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground">Address</h3>
              <p className="text-sm text-muted-foreground">123 Tiger Street, City, Country</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary mt-1 flex-shrink-0 text-sm">🏟️</span>
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground">Capacity</h3>
              <p className="text-sm text-muted-foreground">Our 45,000 seat stadium</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground">Box Office Hours</h3>
              <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-5PM, Sat: 10AM-2PM</p>
            </div>
          </div>
        </div>

        <button className="mt-8 bg-primary text-primary-foreground font-heading text-xs tracking-wider px-6 py-3 hover:bg-gold-dark transition-colors">
          STADIUM TOUR INFO
        </button>
      </div>
    </section>
  );
};

export default StadiumSection;
