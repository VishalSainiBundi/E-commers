export default function AboutSplit() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
      <div className=" rounded-lg flex items-center justify-center p-8">
        <img
          src="img/delivery.png"
          alt="Delivery"
          className="max-w-4xl"
        />
      </div>

      <div className="bg-gray-100 rounded-lg p-8 flex flex-col justify-center">
        <h3 className="text-xl font-semibold mb-4">
          We connect millions of buyers and sellers around the world
        </h3>
        <p className="text-gray-600 mb-6">
          With our reach, logistics, and payments platform, we help people
          and businesses thrive globally.
        </p>
        <button className="bg-teal-600 text-white px-5 py-3 rounded-md w-fit hover:bg-teal-700 transition">
          OUR SERVICES
        </button>
      </div>
    </section>
  );
}
