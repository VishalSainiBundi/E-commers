export default function ContactInfo() {
  return (
    <aside className="bg-gray-100 rounded-lg p-6">
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-500 mb-2">
          UNITED STATES (HEAD QUARTER)
        </h4>
        <p className="text-sm">
          152 Thatcher Road St, Manhattan, 10463, US
        </p>
        <p className="text-sm mt-1">(025) 3886 25 16</p>
        <a
          href="mailto:hello@swattechmart.com"
          className="text-teal-600 text-sm"
        >
          hello@swattechmart.com
        </a>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-500 mb-2">
          UNITED KINGDOM (BRANCH)
        </h4>
        <p className="text-sm">
          12 Buckingham Rd, Thornthwaite, HG3 4TY, UK
        </p>
        <p className="text-sm mt-1">(+718) 895-5350</p>
        <a
          href="mailto:contact@swattechmart.co.uk"
          className="text-teal-600 text-sm"
        >
          contact@swattechmart.co.uk
        </a>
      </div>
    </aside>
  );
}
