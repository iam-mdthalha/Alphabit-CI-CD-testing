const ErrorTemplate = () => {
  return (
    <div className="min-h-screen bg-vintageBg flex items-center justify-center font-montserrat p-8">
      <section className="flex items-center h-full">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto">
          <h2 className="mb-8 text-9xl text-vintageText relative">
            <span className="sr-only">Error</span>
            404
            <div
              className="absolute inset-0 text-vintageText text-opacity-10 -z-10"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M1 1v18h18V1H1zm1 1h16v16H2V2zm2 2h12v12H4V4zm2 2v8h8V6H6zm1 1h6v6H7V7zm1 1v4h4V8H8zm1 1h2v2H9V9z' fill='%23000000' fill-opacity='0.1'/%3E%3C/svg%3E\")",
              }}
            ></div>
          </h2>

          <p className="text-2xl md:text-3xl text-vintageText mb-4">
            Chapter Not Found
          </p>

          <p className="text-lg text-vintageText text-opacity-80 mb-8 max-w-md text-center">
            It seems this page has been misplaced in our library archives. The
            story you're looking for isn't on this shelf.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/"
              className="px-8 py-3 bg-vintageText text-light rounded-md hover:bg-vintageText hover:bg-opacity-90 transition-colors font-semibold text-center"
            >
              Return to Library
            </a>
            <a
              href="/collections"
              className="px-8 py-3 border-2 border-vintageText border-opacity-30 text-vintageText rounded-md hover:bg-vintageText hover:bg-opacity-10 transition-colors font-semibold text-center"
            >
              Browse Collection
            </a>
          </div>

          <div className="mt-12 p-6 border-2 border-vintageText border-opacity-20 rounded-lg bg-vintageText bg-opacity-5">
            <p className="text-vintageText text-opacity-80 italic text-center">
              "Not all those who wander are lost, but sometimes pages are."
            </p>
            <p className="text-vintageText text-opacity-60 text-sm text-center mt-2">
              - Ancient Librarian Proverb
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ErrorTemplate;
