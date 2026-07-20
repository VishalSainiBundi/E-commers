export default function Dashboard() {
  const sales = [
    { month: "Jan", value: 40 },
    { month: "Feb", value: 55 },
    { month: "Mar", value: 35 },
    { month: "Apr", value: 70 },
    { month: "May", value: 95 },
    { month: "Jun", value: 60 },
    { month: "Jul", value: 110 },
    { month: "Aug", value: 90 },
    { month: "Sep", value: 120 },
    { month: "Oct", value: 140 },
    { month: "Nov", value: 160 },
    { month: "Dec", value: 180 },
  ];

  return (
    <div className="flex w-5xl mx-auto bg-gray-100">

     

      {/* MAIN */}
      <main className="flex-1 md:ml-64">

        {/* TOPBAR */}
        <header className="h-20 bg-white shadow flex items-center justify-between px-10">
          <h1 className="text-2xl font-semibold tracking-wide">Dashboard</h1>
          <input
            className="px-5 py-2.5 w-64 border rounded-full focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Search..."
          />
        </header>

        {/* CONTENT WRAPPER */}
        <div className="p-10 max-w-7xl mx-auto space-y-12">

          {/* CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition">
              <h2 className="text-gray-600 text-lg font-medium">Users</h2>
              <p className="text-4xl mt-2 font-bold text-indigo-600">4,530</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition">
              <h2 className="text-gray-600 text-lg font-medium">Revenue</h2>
              <p className="text-4xl mt-2 font-bold text-green-600">$12,480</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition">
              <h2 className="text-gray-600 text-lg font-medium">Orders</h2>
              <p className="text-4xl mt-2 font-bold text-orange-500">1,240</p>
            </div>
          </section>

          {/* BAR GRAPH */}
          <section className="bg-white p-10 rounded-3xl shadow">
            <h2 className="text-xl font-semibold mb-8">Yearly Sales Overview</h2>

            <div className="flex items-end gap-4 h-80 pb-4">

              {sales.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  
                  {/* BAR */}
                  <div
                    className="w-full max-w-[32px] rounded-t-xl bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500 transition"
                    style={{ height: `${item.value * 1.3}px` }}
                  ></div>

                  {/* LABEL */}
                  <span className="mt-3 text-sm font-medium text-gray-600">
                    {item.month}
                  </span>
                </div>
              ))}

            </div>
          </section>

          {/* USER TABLE */}
          <section className="bg-white p-10 rounded-3xl shadow overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6">Recent Users</h2>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-4 px-3 text-left font-medium text-gray-600">Name</th>
                  <th className="py-4 px-3 text-left font-medium text-gray-600">Email</th>
                  <th className="py-4 px-3 text-left font-medium text-gray-600">Role</th>
                </tr>
              </thead>

              <tbody>
                {[
                  { name: "John Doe", email: "john@example.com", role: "Admin" },
                  { name: "Sarah Smith", email: "sarah@example.com", role: "Editor" },
                  { name: "Mike Johnson", email: "mike@example.com", role: "User" },
                ].map((u, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100 transition">
                    <td className="py-4 px-3">{u.name}</td>
                    <td className="py-4 px-3">{u.email}</td>
                    <td className="py-4 px-3">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </section>
        </div>
      </main>
    </div>
  );
}
