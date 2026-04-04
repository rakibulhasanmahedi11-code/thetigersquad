import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

const rules = [
  {
    title: "Tournament Rules",
    items: [
      "All matches must be played within scheduled time",
      "Win = 3 points, Draw = 1 point, Loss = 0 points",
      "Group stage matches are played in 2 legs",
      "Knockout stage: draw goes to penalty shootout",
      "MOTM is selected after each match",
    ],
  },
  {
    title: "Player Behavior Rules",
    items: [
      "Respect all players, admins, and officials",
      "No abusive language or unsportsmanlike conduct",
      "Players must be on time for all matches",
      "Fair play is expected at all times",
    ],
  },
  {
    title: "Card Rules",
    items: [
      "Yellow card: Warning for foul play",
      "2 Yellow cards in one match = Red card (sent off)",
      "Red card: Immediate suspension for 1 match",
      "Accumulated yellow cards carry across matches",
    ],
  },
  {
    title: "Match Rules",
    items: [
      "Match results must be submitted immediately after the game",
      "Both teams must confirm the result",
      "Penalty shootout format: 5 kicks each, then sudden death",
      "Substitutions allowed as per tournament format",
    ],
  },
  {
    title: "Admin Rules",
    items: [
      "Only Main Admin has full system access",
      "Club Admins have limited permissions",
      "Admin approval required for new registrations",
      "All admin actions are logged",
    ],
  },
];

const ClubRulesSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="rules" className="py-16 bg-dark-surface">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            CLUB RULES
          </h2>
        </div>
        <p className="text-muted-foreground text-sm mb-10 max-w-md">
          Official rules and regulations of The Tiger Squad Football Club.
        </p>

        <div className="space-y-3 max-w-3xl">
          {rules.map((rule, idx) => (
            <div
              key={rule.title}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
              >
                <h3 className="font-heading text-sm font-bold text-foreground tracking-wider">
                  {rule.title}
                </h3>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {openIndex === idx && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <ul className="space-y-2">
                    {rule.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubRulesSection;
