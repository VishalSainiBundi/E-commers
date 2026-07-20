
import ContactForm from "@/Components/website/Contect";
import ContactInfo from "@/Components/website/ContectInfo";
import FooterMap from "@/Components/website/FooterMap";

export default function ContactPage() {
  return (
    <main className="bg-gray-50">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500">
        Home / Shop / <span className="text-gray-900 font-medium">Contact</span>
      </div>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <ContactInfo />
        </div>
      </section>

      <FooterMap />
    </main>
  );
}
