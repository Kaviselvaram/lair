export type Region =
  | "EUROPE"
  | "MIDDLE EAST"
  | "ASIA"
  | "NORTH AMERICA"
  | "ISLANDS";

export type Destination = {
  code: string;
  city: string;
  country: string;
  region: Region;
  lat: number;
  lon: number;
  /** Editorial one-liner. */
  note: string;
  /** Hero image query used for sourcing / alt text. */
  imageQuery: string;
  image?: string;
};

/** The signature departure point routes are drawn from. */
export const HUB = { city: "London", lat: 51.5, lon: -0.12 };

export const destinations: Destination[] = [
  {
    code: "HND",
    city: "Tokyo",
    country: "Japan",
    region: "ASIA",
    lat: 35.68,
    lon: 139.76,
    note: "Neon rebuilt as silence. Land after midnight, ahead of the city.",
    imageQuery: "tokyo night aerial luxury cinematic",
    image: "/img/dest-tokyo.jpg",
  },
  {
    code: "DXB",
    city: "Dubai",
    country: "UAE",
    region: "MIDDLE EAST",
    lat: 25.2,
    lon: 55.27,
    note: "The desert, engineered vertical. Breakfast over the Gulf.",
    imageQuery: "dubai aerial skyline cinematic gold hour",
    image: "/img/dest-dubai.jpg",
  },
  {
    code: "IBZ",
    city: "Ibiza",
    country: "Spain",
    region: "ISLANDS",
    lat: 38.9,
    lon: 1.43,
    note: "Salt, bass and a private strip of coast that answers to no one.",
    imageQuery: "ibiza aerial sunset coastline cinematic",
    image: "/img/dest-ibiza.jpg",
  },
  {
    code: "MCM",
    city: "Monaco",
    country: "Monaco",
    region: "EUROPE",
    lat: 43.73,
    lon: 7.42,
    note: "Two square kilometres of altitude at sea level.",
    imageQuery: "monaco aerial coastline harbour cinematic",
    image: "/img/dest-monaco.jpg",
  },
  {
    code: "MLE",
    city: "Maldives",
    country: "Maldives",
    region: "ISLANDS",
    lat: 4.18,
    lon: 73.51,
    note: "A thousand atolls, one of them briefly yours.",
    imageQuery: "maldives aerial atoll turquoise cinematic",
    image: "/img/dest-maldives.jpg",
  },
  {
    code: "TEB",
    city: "New York",
    country: "USA",
    region: "NORTH AMERICA",
    lat: 40.71,
    lon: -74.0,
    note: "Skip the terminal. Manhattan, twelve minutes from the ramp.",
    imageQuery: "new york city aerial night cinematic luxury",
    image: "/img/dest-newyork.jpg",
  },
  {
    code: "CPT",
    city: "Cape Town",
    country: "South Africa",
    region: "AFRICA" as Region,
    lat: -33.92,
    lon: 18.42,
    note: "Where the two oceans argue and the light wins.",
    imageQuery: "cape town aerial table mountain coastline cinematic",
    image: "/img/dest-capetown.jpg",
  },
];

export const regions: Region[] = [
  "EUROPE",
  "MIDDLE EAST",
  "ASIA",
  "NORTH AMERICA",
  "ISLANDS",
];
