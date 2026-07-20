const timeline = [
  { year: "1999", text: "Company founded as a local retailer" },
  { year: "2005", text: "Expanded logistics and delivery network" },
  { year: "2015", text: "Entered international markets" },
  { year: "2023", text: "Global chain of stores established" },
];

export default function Timeline() {
  return (
    <section className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-lg font-semibold mb-8">
          FROM A RETAIL STORE TO THE GLOBAL CHAIN OF STORES
        </h3>

        <div className="space-y-4">
          {timeline.map((t) => (
            <div key={t.year} className="flex gap-6">
              <span className="font-semibold w-16">{t.year}</span>
              <p className="text-gray-600">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
