import whatsapp from "Assets/whatsapp.svg";

const FloatingWhatsApp = () => {
  const phoneNumber = "1234567890";

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-green-500 flex space-x-6 items-center justify-center hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition transform hover:scale-110">
        <img width="auto" height="auto" src={whatsapp} alt="Whatsapp" />
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
