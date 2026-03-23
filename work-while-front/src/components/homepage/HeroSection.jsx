import { useState, useEffect, forwardRef } from 'react';
import workwhileLogo from '../../../public/workwhile.png';

// Company logo URLs
const partnerLogos = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
  { name: "Microsoft", logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" },
  {
    name: "Apple",
    logo: "https://www.apple.com/ac/globalnav/7/en_US/images/be15095f-5a20-57d0-ad14-cf4c638e223a/globalnav_apple_image__b5er5ngrzxqq_large.svg",
    darkBackground: true,
    scale: 3 // Apple logo will be 3x its normal size
  },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/800px-Meta_Platforms_Inc._logo.svg.png" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png" },
  { name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" },
  { name: "LinkedIn", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/2560px-LinkedIn_Logo.svg.png" }, // Replaced Airbnb
  { name: "Spotify", logo: "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" },
  { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/800px-Tesla_logo.png" },
];

const HeroSection = forwardRef((props, ref) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col bg-white items-center justify-center px-4 relative overflow-hidden"
    >
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-300 opacity-20 blur-3xl top-1/4 left-1/4 animate-pulse" style={{ backgroundColor: '#3c78e6' }}></div>
        <div className="absolute w-72 h-72 rounded-full bg-yellow-300 opacity-20 blur-3xl bottom-1/4 right-1/4 animate-pulse" style={{ backgroundColor: '#EDC418' }}></div>
      </div>

      {/* Logo with circular hue */}
      <div className="relative mb-8 z-10">
        <div className="absolute inset-0 rounded-full opacity-10 blur-3xl transform scale-150" style={{ backgroundColor: '#3c78e6' }}></div>
        <div className="absolute inset-0 rounded-full opacity-10 blur-3xl transform scale-125 translate-x-6" style={{ backgroundColor: '#EDC418' }}></div>

        <div className="relative p-6 flex items-center justify-center">
          <img src={workwhileLogo} alt="Workwhile Logo" className="h-40 sm:h-30 md:h-80 object-contain" />
        </div>
      </div>

      {/* Rotating partner logos */}
      <div className="relative w-full md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto h-16 mb-10 overflow-hidden">
        <div
          className="absolute w-full whitespace-nowrap"
          style={{ transform: `translateX(-${rotation}px)` }}
        >
          <div className="inline-flex space-x-8 px-8">
            {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((partner, index) => (
              <div
                key={index}
                className={`flex items-center justify-center h-12 w-32 rounded-xl shadow-md p-2 ${partner.darkBackground ? 'bg-black' : 'bg-white'}`}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-h-full max-w-full object-contain"
                  style={partner.scale ? { transform: `scale(${partner.scale})` } : {}}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tagline */}
      <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-800 font-light max-w-2xl text-center mb-8 z-10">
        Shape your future with expert guidance and opportunities crafted for young professionals
      </h1>

      {/* Search bar */}
      <div className="w-full max-w-2xl relative z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Find your future now"
            className="w-full px-6 py-4 pr-12 text-lg rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white"
            style={{ focusRingColor: '#3c78e6' }}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button className="text-white p-2 rounded-full transition" style={{ backgroundColor: '#3c78e6' }}>
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Job categories */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl z-10">
        {['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Design', 'Engineering', 'Customer Service'].map((category, index) => (
          <div key={index} className="bg-white rounded-xl px-4 py-3 text-center shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100">
            <span className="text-gray-700 font-medium">{category}</span>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} style={{ color: '#3c78e6' }} />
      </div>
    </section>
  );
});

export default HeroSection;