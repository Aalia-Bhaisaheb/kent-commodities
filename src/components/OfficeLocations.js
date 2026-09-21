import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { officeLocationsData } from "@/data/contactData";

export default function OfficeLocations({ offices = officeLocationsData }) {
  return (
    <div className="w-full bg-white py-8 -mt-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto border-t border-b border-gray-200/80 py-15">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {offices.map((office, index) => (
            <div
              key={office.id}
              className={`flex flex-col space-y-4 ${
                index !== offices.length - 1
                  ? "border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-8 md:mr-8"
                  : ""
              }`}
            >
              {/* Flag & Title */}
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-7 overflow-hidden rounded-xs border border-gray-100 shrink-0">
                  <Image
                    src={office.flag}
                    alt={office.country}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-base font-semibold text-gray-800">
                  {office.country}
                </h4>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-2.5 text-sm text-gray-600 leading-relaxed min-h-[40px]">
                <MapPin className="w-5 h-5 text-[#708c2a] shrink-0 mt-0.5" />
                <span>{office.address}</span>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-2.5 text-sm text-gray-600">
                <Phone className="w-5 h-5 text-[#708c2a] shrink-0" />
                <a
                  href={office.phoneHref}
                  className="hover:text-[#708c2a] transition-colors"
                >
                  {office.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}