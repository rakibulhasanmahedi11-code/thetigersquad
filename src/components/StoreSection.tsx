import { useState } from "react";
import kit1 from "@/assets/kit-1.jpg";
import kit2 from "@/assets/kit-2.jpg";

const categories = ["ALL", "KITS", "TRAINING", "ACCESSORIES", "EQUIPMENT"];
const products = [
  { name: "Home Kit 2024/25", price: "$89", image: kit1 },
  { name: "Training Top", price: "$59", image: kit2 },
  { name: "Away Kit 2024/25", price: "$89", image: kit1 },
  { name: "Match Day Jacket", price: "$79", image: kit2 },
];

const StoreSection = () => {
  const [activeCat, setActiveCat] = useState(0);

  return (
    <section id="shop" className="py-16 bg-purple-surface">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">Official Store</h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-md">
          Shop the official merchandise of The Tiger Squad. Wear your colors with pride.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat, i) => (
            <button key={cat} onClick={() => setActiveCat(i)}
              className={`font-heading text-xs tracking-wider px-4 py-2 border transition-colors ${
                activeCat === i ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <div key={i} className="group bg-card border border-border rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={600} height={600} />
              <div className="p-3">
                <h3 className="font-heading text-sm font-bold text-foreground">{product.name}</h3>
                <p className="text-primary font-heading text-sm mt-1">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreSection;
