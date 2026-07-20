const stats = [
  { value: "$12.5M", label: "TOTAL REVENUE FROM 2001-2023" },
  { value: "12K+", label: "ORDERS DELIVERED" },
  { value: "725+", label: "ACTIVE CUSTOMERS" },
];

export default function Stats() {
  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <h3 className="text-2xl font-bold">{s.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
