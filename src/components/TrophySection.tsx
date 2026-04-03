import { Trophy } from "lucide-react";

const trophies = [
  { year: "2020", title: "Record Season", description: "Most points ever accumulated in a single league season." },
  { year: "2018", title: "European Glory", description: "Historic European trophy win, cementing the club's place among the elite." },
  { year: "2005", title: "Tiger Arena Opened", description: "The state-of-the-art 45,000 seater became our new home." },
];

const TrophySection = () => {
  return (
    <section id="club" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">Trophy Cabinet</h2>
        <p className="text-muted-foreground text-sm mb-12 max-w-md">
          Decades of success have filled our trophy room with silverware that represents the hard work of everyone connected to the club.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {trophies.map((trophy) => (
            <div key={trophy.year} className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="font-heading text-sm font-bold text-primary tracking-wider mb-2">{trophy.year}</p>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{trophy.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{trophy.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrophySection;
