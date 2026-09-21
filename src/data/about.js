import globe from '../../public/about/global.png'
import integrity from '../../public/about/integrity.png'
import growth from '../../public/about/growth.png'
export const aboutData = {
  metadata: {
    title: "About Us | Kent Commodities",
    description:
      "Learn about Kent Commodities — our story, mission, and the team connecting global markets with quality commodities.",
  },
  aboutSection: {
    experience: {
      number: "30+",
      label: "Years of Industry Experience",
    },
    stats: [
      { number: "15+", label: "Markets Connected" },
      { number: "25+", label: "Commodity Products" },
      { number: "10+", label: "Global Supply Partners" },
      { number: "100%", label: "Commitment to Quality" },
    ],
    headingLine1: "Connecting Global",
    headingLine2: "Commodity Markets",
    description:
      "KENT Commodities connects trusted producers with global buyers through reliable sourcing, quality-focused trading & efficient commodity supply solutions across agriculture and mining.",
    eyebrow: "DRIVEN BY OUR CORE VALUES",
    coreValues: [
      {
        title: "Sustainable Growth",
        icon: "/home/value-icons/sustainable-growth.png",
      },
      {
        title: "Reliability",
        icon: "/home/value-icons/reliability.png",
      },
      {
        title: "Quality",
        icon: "/home/value-icons/quality.png",
      },
      {
        title: "Customer Focus",
        icon: "/home/value-icons/customer-focus.png",
      },
    ],
  },
  visionMissionSection: {
    image: {
      src: "/about/VisionMission.png",
      alt: "Excavator operating on site representing vision and mission",
    },
    vision: {
      title: "Our Vision",
      subtitle: "To Be a Trusted Global Partner in Commodity Trade",
      description:
        "To build a globally connected commodity trading network known for quality, reliability, transparency, and long-term partnerships across agriculture and mining markets.",
    },
    mission: {
      title: "Our Mission",
      subtitle: "Connecting Quality Commodities with Global Markets",
      description:
        "To source and supply quality agricultural and mining commodities through trusted partnerships, efficient processes, and dependable supply solutions that create lasting value for our customers and partners.",
    },
  },
  clientAndValuesSection: {
    clientTitle: "The Trust Behind Our Trade",
    clients: [
      { name: "KNPC", src: "/about/knpc.png" },
      { name: "ADNOC", src: "/about/adnoc.png" },
      { name: "DEWA", src: "/about/dewa.png" },
      { name: "ENOC", src: "/about/enoc.png" },
      { name: "PDO", src: "/about/image 8.png" },
      { name: "SABIC", src: "/about/sabic.png" },
    ],
    valuesTitle: "Our Core Values",
    values: [
      {
        title: "Integrity",
        description:
          "Conducting every transaction with transparency, honesty, and trust.",
        icon:integrity,
      },
      {
        title: "Global Connectivity",
        description:
          "Connecting trusted suppliers with buyers across markets worldwide.",
        icon:globe,
      },
      {
        title: "Sustainable Growth",
        description:
          "Building long-term value through responsible sourcing and lasting partnerships.",
        icon:growth,
      },
    ],
  },
  connectingMarketsSection: {
    headingLine1: "Connecting Markets.",
    headingLine2: "Creating Value.",
    description:
      "KENT Commodities brings together trusted sources and global markets through dependable commodity trading. We focus on quality, transparency, and efficient supply across agriculture and mining, helping businesses source with confidence and build lasting partnerships.",
    image: {
      src: "/about/ConnectingMarkets.png",
      alt: "Connecting Markets Creating Value - Scales and Hardhat with Mining Background",
    },
  },
  globalReachSection: {
    title: "From Local To Global",
    mapImage: {
      src: "/about/map.png",
      alt: "Global Network Map",
    },
    locations: [
      {
        id: 1,
        name: "Greenland / Arctic",
        top: "21%",
        left: "39%",
      },
      {
        id: 2,
        name: "North America (USA)",
        top: "35.2%",
        left: "30.3%",
      },
      {
        id: 3,
        name: "South America",
        top: "67.5%",
        left: "31.5%",
      },
      {
        id: 4,
        name: "Europe",
        top: "32.8%",
        left: "56.4%",
      },
      {
        id: 5,
        name: "Africa",
        top: "51%",
        left: "49%",
      },
      {
        id: 6,
        name: "Middle East / Asia",
        top: "45.5%",
        left: "65.3%",
      },
      {
        id: 7,
        name: "Asia (East)",
        top: "35%",
        left: "76%",
      },
      {
        id: 8,
        name: "Australia",
        top: "68.5%",
        left: "80.6%",
      },
    ],
  },
};