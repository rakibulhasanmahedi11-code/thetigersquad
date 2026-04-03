import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";

const stories = [
  { image: news1, title: "Tigers Secure Dominant Victory", date: "Jan 15, 2025" },
  { image: news2, title: "Transfer Window Updates", date: "Jan 12, 2025" },
];

const LatestNewsSection = () => {
  return (
    <section id="news" className="py-16 bg-purple-surface">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">Latest News</h2>
        <p className="text-muted-foreground text-sm mb-10 max-w-md">
          Stay updated with all the latest news, match reports, transfers, and updates from The Tiger Squad.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg bg-card border border-border">
              <img src={story.image} alt={story.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={800} height={600} />
              <div className="p-5">
                <p className="text-xs text-muted-foreground mb-2">{story.date}</p>
                <h3 className="font-heading text-lg font-bold text-foreground">{story.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <h3 className="font-heading text-2xl font-bold text-foreground mt-12 mb-6">More Stories</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <div key={`more-${i}`} className="group relative overflow-hidden rounded-lg">
              <img src={story.image} alt={story.title} className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" loading="lazy" width={800} height={600} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNewsSection;
