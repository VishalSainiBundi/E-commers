export default function ContactForm() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        READY TO WORK WITH US
      </h2>
      <p className="text-gray-500 mb-6">
        Contact us for all your questions and opinions
      </p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="input"
          placeholder="First Name *"
        />
        <input
          className="input"
          placeholder="Last Name *"
        />
        <input
          className="input md:col-span-2"
          placeholder="Email Address *"
        />
        <input
          className="input md:col-span-2"
          placeholder="Phone Number (Optional)"
        />

        <select className="input md:col-span-2">
          <option>United States (US)</option>
          <option>United Kingdom (UK)</option>
        </select>

        <input
          className="input md:col-span-2"
          placeholder="Subject (Optional)"
        />

        <textarea
          className="input md:col-span-2 h-32 resize-none"
          placeholder="Note about your order, e.g. special note for delivery"
        />

        <div className="md:col-span-2 flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" />
          <span>
            I agree to the{" "}
            <a href="#" className="text-teal-600 underline">
              Terms & Conditions
            </a>
          </span>
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition md:col-span-2 w-fit"
        >
          SEND MESSAGE
        </button>
      </form>
    </div>
  );
}
