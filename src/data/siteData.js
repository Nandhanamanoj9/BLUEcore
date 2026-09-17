export const SERVICES = [
  {
    num: "01",
    name: "Wood Carving",
    desc: "Customized and decorative wood carving using advanced CNC technology.",
    icon: "carve"
  },
  {
    num: "02",
    name: "Door Design",
    desc: "Customized 2D and 3D designs and patterns for main doors and interior doors.",
    icon: "door"
  },
  {
    num: "03",
    name: "Staircase",
    desc: "Decorative and customized staircase design elements that add character to your interior.",
    icon: "stair"
  },
  {
    num: "04",
    name: "Wall Panels & Hanging",
    desc: "Decorative CNC-cut wall panels and hanging elements designed to enhance interior spaces.",
    icon: "panel"
  },
  {
    num: "05",
    name: "Ceiling Design",
    desc: "Customized decorative ceiling patterns and designs for modern and traditional interiors.",
    icon: "ceiling"
  },
  {
    num: "06",
    name: "Personalized Wooden Gifts",
    desc: "Customized wooden gifts and decorative products created for special occasions and personal spaces.",
    icon: "gift"
  },
  {
    num: "07",
    name: "Sign Boards",
    desc: "Customized CNC-cut and decorative sign boards for homes, businesses and commercial spaces.",
    icon: "sign"
  },
];

export const SHOWCASE = [
  {
    tag: "Wall Panels",
    title: "Wall Panels & Hanging",
    text: "Decorative CNC-cut wall panels and hanging pieces that give a feature wall its own identity — sized and patterned to suit your room and interior style.",
    shortDesc: "Precision-carved geometric and floral panels engineered for luxury feature walls, partition screens, and acoustic spaces.",
    points: [
      "Custom geometric & floral motifs",
      "Interior feature walls",
      "Hanging decorative pieces",
      "Customized sizes and patterns"
    ],
    image: "/images/showcase/wall-panels.jpg",
    placeholder: false,
    legend: ["CNC Wall Panel", "Floral Motif", "Brass Inlay Work", "Acoustic Backing"],
    specs: {
      cutterTolerance: "±0.02 mm Precision",
      bedCapacity: "1300 × 2500 mm (MTR 1325-H)",
      materials: "Natural Teak, Plywood, MDF, HDF, Multiwood",
      finishOptions: "Raw Precision, PU Clear Matte, Gold / Brass Inlay",
      leadTime: "3–5 Business Days"
    }
  },
  {
    tag: "Doors",
    title: "Door Design",
    text: "2D and 3D pattern work on doors, from subtle linework to fully carved panels, built to match the character and style of your entrance.",
    shortDesc: "Architectural 2D and 3D CNC carving for entrance doors and luxury interior portals, combining deep relief carving with enduring structural integrity.",
    points: [
      "2D & 3D surface patterns",
      "Main door & interior doors",
      "Traditional and modern motifs",
      "Customized designs"
    ],
    image: "/images/showcase/door-design.jpg",
    placeholder: false,
    legend: ["CNC Front Door Cutting", "Religious & Deity Motifs", "Deep 3D Carving", "Solid Teak Core"],
    specs: {
      cutterTolerance: "±0.02 mm Precision",
      bedCapacity: "1300 × 2500 mm (MTR 1325-H)",
      materials: "Solid Teak, Hardwood, Marine Plywood, WPC",
      finishOptions: "Natural Teak Oil, High-Build PU Satin, Antique Polish",
      leadTime: "4–7 Business Days"
    }
  },
  {
    tag: "Ceilings",
    title: "Ceiling Design",
    text: "Decorative ceiling patterns that add depth and rhythm to a room without competing with the rest of the interior.",
    shortDesc: "Layered lattice panels and recessed false ceiling patterns that diffuse ambient lighting and introduce elegant architectural depth.",
    points: [
      "False ceiling panel patterns",
      "Living room & hall ceilings",
      "Layered geometric designs",
      "Customized decorative patterns"
    ],
    image: "/images/showcase/ceiling-design.jpg",
    placeholder: false,
    legend: ["Architectural Jali", "Geometric Motif", "Recessed LED Channels", "Multiwood Core"],
    specs: {
      cutterTolerance: "±0.02 mm Precision",
      bedCapacity: "1300 × 2500 mm (MTR 1325-H)",
      materials: "Multiwood, Lightweight MDF, HDF",
      finishOptions: "Warm White PU, Sandalwood Stained, Matte Acrylic",
      leadTime: "3–5 Business Days"
    }
  },
];

export const MATERIALS = [
  {
    name: "Plywood",
    desc: "Versatile and practical for customized CNC cutting and decorative applications."
  },
  {
    name: "MDF",
    desc: "A smooth and consistent surface suitable for detailed CNC patterns and interior designs."
  },
  {
    name: "HDF",
    desc: "A dense and durable material suitable for precise decorative detailing."
  },
  {
    name: "Multiwood",
    desc: "A versatile material for customized CNC designs and decorative interior applications."
  },
  {
    name: "Wood",
    desc: "Natural wood transformed through detailed CNC carving and customized craftsmanship."
  },
  {
    name: "WPC",
    desc: "A durable and modern material suitable for decorative panels, wall applications and selected interior and exterior designs."
  }
];

export const GALLERY_CATS = [
  "ALL",
  "WALL PANELS",
  "DOORS",
  "WOOD CARVING",
  "CEILING",
  "3D PANELS",
  "CUSTOM DESIGNS"
];

export const GALLERY_ITEMS = [
  { id: 1, cat: "WALL PANELS", label: "Custom CNC Wall Panel", image: "/images/showcase/wall-panels.jpg", placeholder: false, legend: ["Architectural Jali", "Geometric Motif", "Feature Wall Panel"] },
  { id: 2, cat: "DOORS", label: "Custom Door Pattern", image: "/images/showcase/door-design.jpg", placeholder: false, legend: ["CNC Front Door Cutting", "Solid Core Entrance", "Modern Arch"] },
  { id: 3, cat: "WOOD CARVING", label: "Decorative Wood Carving", image: "/images/gallery/decorative-wood-carving.jpg", placeholder: false, legend: ["Artisan Wood Carving", "Relief Detailing", "Teak Timber"] },
  { id: 4, cat: "CEILING", label: "Custom Ceiling Pattern", image: "/images/showcase/ceiling-design.jpg", placeholder: false, legend: ["Ceiling Lattice", "Ambient Backlit Grid", "Geometric Motif"] },
  { id: 5, cat: "3D PANELS", label: "3D Interior Panel", image: "/images/about/cnc-craftsmanship.jpg", placeholder: false, legend: ["Wave 3D Panel", "Living Room Wall", "Multi-Axis Milling"] },
  { id: 6, cat: "CUSTOM DESIGNS", label: "Personalized Wooden Design", image: "/images/about/cnc-craftsmanship.jpg", placeholder: false, legend: ["Personalized Wooden Craft", "Custom Engraving", "Bespoke Gift"] },
  { id: 7, cat: "WALL PANELS", label: "CNC-Cut Decorative Screen", image: "/images/showcase/wall-panels.jpg", placeholder: false, legend: ["Decorative Screen", "Jali Partition", "Floral Pattern"] },
  { id: 8, cat: "DOORS", label: "2D / 3D Door Panel", image: "/images/showcase/door-design.jpg", placeholder: false, legend: ["Double Door Relief", "Brass Inlay Work", "Grand Entry"] },
  { id: 9, cat: "3D PANELS", label: "Textured 3D Panel", image: "/images/about/cnc-craftsmanship.jpg", placeholder: false, legend: ["Fluted Wood Panel", "Acoustic Diffusion", "Natural Oil"] },
  { id: 10, cat: "WOOD CARVING", label: "Traditional Carved Motif", image: "/images/gallery/traditional-carved-motif.jpg", placeholder: false, legend: ["Religious/God Panel", "Intricate Temple Arch", "Floral Motif"] },
  { id: 11, cat: "CUSTOM DESIGNS", label: "Decorative Wooden Clock", image: "/images/about/cnc-craftsmanship.jpg", placeholder: false, legend: ["Decorative Wooden Clock", "Engraved Dial", "Fine Craftsman Finish"] },
];

export const WHY_ITEMS = [
  {
    num: "01",
    t: "Precision",
    d: "CNC-based accurate cutting and detailing on every panel and pattern."
  },
  {
    num: "02",
    t: "Customization",
    d: "Designs shaped around your requirements, space and reference material."
  },
  {
    num: "03",
    t: "Design Variety",
    d: "A wide range of 2D and 3D patterns suited to different applications."
  },
  {
    num: "04",
    t: "Multiple Materials",
    d: "Solutions across wood, plywood, MDF, HDF, multiwood and WPC."
  },
  {
    num: "05",
    t: "Interior & Exterior",
    d: "Decorative applications designed for both indoor and outdoor spaces."
  },
  {
    num: "06",
    t: "Craftsmanship",
    d: "Modern CNC technology combined with creative, hands-on design work."
  },
];

export const APPLICATION_GROUPS = [
  {
    category: "Residential",
    items: [
      "Homes",
      "Living Rooms",
      "Bedrooms",
      "Feature Walls",
      "Doors",
      "Staircases",
      "Ceilings"
    ]
  },
  {
    category: "Commercial",
    items: [
      "Offices",
      "Commercial Spaces",
      "Restaurants",
      "Reception Areas",
      "Feature Walls",
      "Sign Boards"
    ]
  },
  {
    category: "Exterior",
    items: [
      "Exterior Decorative Areas",
      "Wall Panels",
      "Decorative Screens",
      "Sign Boards"
    ]
  }
];

export const BRANCHES = [
  {
    name: "Kanhangad",
    addr: "Maruthi Tower, Devan Link Road, Kanhangad, Pin: 671315",
    phone: "+91 9400 544 477",
    tel: "+919400544477"
  },
  {
    name: "Payyannur / Trikaripur",
    addr: "Near Irikaripur Farmers Bank, Olavad - Mundya, Trikaripur, Pin: 671310",
    phone: "+91 9656 544 477",
    tel: "+919656544477"
  },
  {
    name: "Palakkunnu",
    addr: "Kottikkulam, Palakkunnu, Near Bakery, Pin: 671318",
    phone: "+91 9747 544 477",
    tel: "+919747544477"
  },
  {
    name: "Cherupuzha",
    addr: "Kollada Road, Kakkayamchal, Opp. St. Mary's High School, Cherupuzha, Pin: 670511",
    phone: "+91 7510 544 477",
    tel: "+917510544477"
  }
];

export const CONTACT_INFO = {
  email: "blucorenc@gmail.com",
  website: "https://www.blucoredesign.com",
  websiteDisplay: "www.blucoredesign.com",
  primaryPhone: "+91 9400 544 477",
  primaryTel: "+919400544477",
  whatsappNumber: "919400544477",
  whatsappMessage: "Hi BLU CORE, I'd like to know more about your CNC & wall panel designs.",
  get whatsappLink() {
    return `https://api.whatsapp.com/send?phone=${this.whatsappNumber}&text=${encodeURIComponent(this.whatsappMessage)}`;
  }
};
