const stats = [
  { value: "50K+", label: "FANS" },
  { value: "15", label: "TROPHIES" },
  { value: "1985", label: "FOUNDED" },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-dark-surface">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-3xl md:text-5xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
