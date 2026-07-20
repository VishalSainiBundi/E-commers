const features = [
  { title: "100% Authentic Products", desc: "Guaranteed original products" },
  { title: "Fast Delivery", desc: "Quick and safe shipping worldwide" },
  { title: "Affordable Price", desc: "Best value for your money" },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
      {features.map((f) => (
        <div
          key={f.title}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="w-4 h-4 bg-teal-600 rounded-full mb-4" />
          <h4 className="font-semibold mb-2">{f.title}</h4>
          <p className="text-sm text-gray-500">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
