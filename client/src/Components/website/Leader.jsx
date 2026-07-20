const leaders = [
  {
    name: "Henry Avery",
    role: "Chairman",
    img: "img/Man1.png",
  },
  {
    name: "Michael Edward",
    role: "Vice President",
    img: "img/Man2.png",
  },
  {
    name: "Ethan Howard",
    role: "Chief Executive Officer",
    img: "img/Man3.png",
  },
  {
    name: "Robert Downey Jr",
    role: "Chief Financial Officer",
    img: "img/Man4.png",
  },
  {
    name: "Nathan Drake",
    role: "Marketing Director",
    img: "img/Man5.png",
  },
];

export default function LeadershipSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-semibold">LEADERSHIPS</h2>
          <a href="#" className="text-sm text-teal-600 hover:underline">
            View All
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {leaders.map((leader) => (
            <div key={leader.name} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={leader.img}
                alt={leader.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-sm">{leader.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
