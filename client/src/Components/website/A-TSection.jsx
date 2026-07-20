const timelineLeft = [
  { year: "1999", text: "A small store started in Brooklyn Town, USA." },
  { year: "2000", text: "It is a long established fact that a reader will be distracted." },
  { year: "2002", text: "Lorem Ipsum is simply dummy text of the printing industry." },
  { year: "2004", text: "Company expanded logistics and delivery services." },
  { year: "2006", text: "First warehouse opened on the west coast." },
];

const timelineRight = [
  { year: "2014", text: "There are many variations of passages of Lorem Ipsum available." },
  { year: "2016", text: "All the Lorem Ipsum generators on the Internet tend to repeat." },
  { year: "2018", text: "Lorem Ipsum comes from sections 1.10.32." },
  { year: "2020", text: "Many desktop publishing packages and web editors use Lorem Ipsum." },
  { year: "2023", text: "Global chain of stores established worldwide." },
];

export default function TimelineSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-lg font-semibold mb-10">
          FROM A RETAIL STORE TO THE GLOBAL CHAIN OF STORES
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {[timelineLeft, timelineRight].map((group, idx) => (
            <div key={idx} className="space-y-6">
              {group.map((item) => (
                <div key={item.year} className="flex gap-6">
                  <span className="font-semibold text-gray-900 w-16">
                    {item.year}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
