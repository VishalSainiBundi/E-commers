export default function FooterMap() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      <h3 className="font-semibold mb-4">FIND US ON GOOGLE MAP</h3>
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <iframe
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Chiesa%20di%20San%20Francesco&output=embed"
        />
      </div>
    </section>
  );
}
