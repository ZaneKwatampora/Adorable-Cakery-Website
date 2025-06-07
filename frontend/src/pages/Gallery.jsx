import React from 'react';
import { Link } from 'react-router-dom';
import image1 from "../assets/cake1.jpg";
import image2 from "../assets/cake2.jpg";
import image3 from "../assets/cake3.jpg";
import image4 from "../assets/cake4.jpg";
import image5 from "../assets/cake5.jpg";

const galleryItems = [
  {
    id: 1,
    name: 'Classic Vanilla Cake',
    description: 'A timeless favorite with smooth vanilla buttercream and moist sponge layers.',
    imgSrc: image1,
    alt: 'Classic Vanilla Cake',
  },
  {
    id: 2,
    name: 'Chocolate Fudge Brownies',
    description: 'Rich and gooey brownies packed with intense chocolate flavor and a fudgy texture.',
    imgSrc: image2,
    alt: 'Chocolate Fudge Brownies',
  },
  {
    id: 3,
    name: 'Strawberry Cupcakes',
    description: 'Light cupcakes topped with fresh strawberry frosting and real strawberry pieces.',
    imgSrc: image3,
    alt: 'Strawberry Cupcakes',
  },
  {
    id: 4,
    name: 'Lemon Drizzle Cookies',
    description: 'Tangy lemon cookies with a sweet drizzle glaze, perfect with afternoon tea.',
    imgSrc: image4,
    alt: 'Lemon Drizzle Cookies',
  },
  {
    id: 5,
    name: 'Seasonal Fruit Tart',
    description: 'A crisp pastry shell filled with creamy custard and topped with fresh seasonal fruits.',
    imgSrc: image5,
    alt: 'Seasonal Fruit Tart',
  },
];

export default function Gallery() {
  return (
    <main className="min-h-screen bg-white text-gray-800 py-12 px-6 max-w-6xl mx-auto pt-30 font-sans">
      {/* Back Home Button */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-all group overflow-hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="currentColor"
            className="w-8 h-8 transition-transform group-hover:rotate-[360deg] duration-700 ease-in-out rolling-icon"
          >
            <path d="M32 2C15.43 2 2 15.43 2 32s13.43 30 30 30 30-13.43 30-30S48.57 2 32 2zm0 4c14.36 0 26 11.64 26 26S46.36 58 32 58 6 46.36 6 32 17.64 6 32 6zm0 10c-8.84 0-16 7.16-16 16 0 3.79 1.32 7.25 3.51 9.99.68.84 1.88.97 2.71.3s.97-1.88.3-2.71A11.948 11.948 0 0 1 20 32c0-6.62 5.38-12 12-12s12 5.38 12 12-5.38 12-12 12c-.38 0-.75-.02-1.12-.06a1.998 1.998 0 1 0-.38 3.97c.5.05 1.01.09 1.5.09 8.84 0 16-7.16 16-16s-7.16-16-16-16z" />
          </svg>
          <span className="text-sm back-text opacity-0 translate-x-[-10px] transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
            Back Home
          </span>
        </Link>
      </div>

      {/* Gallery Items */}
      <section className="space-y-20">
        {galleryItems.map(({ id, name, description, imgSrc, alt }, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={id}
              className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 animate-fade-in ${
                !isEven ? 'md:flex-row-reverse' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="md:flex-1 shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imgSrc}
                  alt={alt}
                  className="object-cover w-full max-h-80 md:max-h-96 transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="md:flex-1 max-w-xl text-center md:text-left">
                <h2 className="text-3xl font-extrabold text-pink-600 mb-3 tracking-wide">{name}</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Instagram Link */}
      <footer className="mt-24 flex justify-center">
        <a
          href="https://instagram.com/adorablecakery"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg shadow-pink-300/50 transform transition-all hover:scale-110 hover:shadow-pink-500/80"
          aria-label="Visit Adorable Cakery Instagram"
        >
          Want to see more? Check out our Instagram
        </a>
      </footer>

      <style>{`
        /* Rolling icon initial shape animation */
        .rolling-icon {
          animation: rollIn 0.8s ease forwards;
          transform-origin: center center;
        }
        @keyframes rollIn {
          0% {
            transform: rotate(0deg) scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: rotate(90deg) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        /* Fade-in animation for gallery items */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation-name: fadeIn;
          animation-duration: 0.6s;
          animation-fill-mode: forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  );
}
