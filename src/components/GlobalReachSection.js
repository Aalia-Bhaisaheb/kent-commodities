import { aboutData } from "@/data/about";

export default function GlobalReachSection() {
  const { title, mapImage, locations } = aboutData.globalReachSection;

  return (
    <section className="w-full pt-8 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-normal tracking-tight text-[#dc5835] leading-tight mb-12">
          {title}
        </h2>

        {/* Map Container */}
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] bg-transparent">
          <img
            src={mapImage.src}
            alt={mapImage.alt}
            className="w-full h-full object-contain select-none pointer-events-none"
          />

          {/* Mapped Pins/Points */}
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ top: loc.top, left: loc.left }}
            >
              {/* Outer Pulsing Ring */}
              <span className="absolute -inset-1.5 rounded-full bg-[#658e3e] opacity-40 animate-ping pointer-events-none" />

              {/* Core Green Dot */}
              <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#658e3e] rounded-full border-2 border-white shadow-md transition-transform duration-200 group-hover:scale-125" />

              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex px-2.5 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                {loc.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}