export default function CategorySidebar() {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold mb-3">CATEGORIES</h3>

      <ul className="space-y-2 text-sm">
        {[
          "All Categories",
          "iPhone",
          "Samsung",
          "Xiaomi",
          "Asus",
          "Oppo",
          "Gaming Smartphone",
          "iPad",
          "Window Tablets",
          "eReader",
          "Smartphone Chargers",
        ].map((item) => (
          <li
            key={item}
            className="cursor-pointer hover:text-green-600"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
