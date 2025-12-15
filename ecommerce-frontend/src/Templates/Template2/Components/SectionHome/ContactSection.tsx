const ContactSection = () => {
  return (
    <div className="relative h-[80vh] flex items-center justify-center">
      <div
        className="hidden sm:block absolute inset-0 bg-fixed bg-center bg-cover bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/template2/SectionHome/contact.jpg')",
        }}
      />

      <div
        className="block sm:hidden absolute inset-0 bg-fixed bg-center bg-cover bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/template2/SectionHome/contact_mobile.jpeg')",
        }}
      />

      <div className="absolute inset-0 bg-black/50 z-10" />

      <div className="relative z-10 bg-white text-center max-w-[90vw] md:max-w-[40vw] min-h-[30vh] m-auto px-4 py-8 flex flex-col justify-center items-center">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-6">
          Get in touch
        </h3>
        <p className="text-xs tracking-widest leading-relaxed">
          Feel Free to call us on{" "}
          <a href="tel:8056892910" className="hover:underline">
            8056892910
          </a>
          <br />
          at 10:00AM To 6:30PM during (Monday to Saturday)
          <br />
          or mail us at{" "}
          <a href="mailto:info@caviaarmode.com" className="hover:underline">
            info@caviaarmode.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactSection;
