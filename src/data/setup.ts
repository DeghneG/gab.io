export interface SetupItem {
  id: number;
  category: "CPU" | "GPU" | "RAM" | "Monitor" | "Keyboard" | "Mouse" | "Headphones" | "Mousepad";
  name: string;
  specs: string[];
  image: string;
  source: "own" | "manufacturer";
  url: string;
}

/**
 * Hostnames allowlist for remote images.
 * Add exact hostnames here only if using remote URLs (e.g., "images.unsplash.com").
 * Never use wildcards.
 */
export const ALLOWED_IMAGE_HOSTS: string[] = [];

/**
 * Panel color cycle for hardware tiles:
 * mustard, teal, orange, teal, mustard, orange, teal, mustard
 */
export const PANEL_COLORS = [
  "#F1A512", // 1. mustard
  "#2BAF90", // 2. teal
  "#DD4111", // 3. orange
  "#2BAF90", // 4. teal
  "#F1A512", // 5. mustard
  "#DD4111", // 6. orange
  "#2BAF90", // 7. teal
  "#F1A512", // 8. mustard
] as const;

/**
 * 8 pieces of hardware displayed in equal-size tiles.
 * Replace names, specs, image paths, or URLs as your setup evolves.
 */
export const setupItems: SetupItem[] = [
  {
    id: 1,
    category: "CPU",
    name: "CPU Model Name",
    specs: ["Cores and threads", "Clock speed"],
    image: "/setup/cpu.png",
    source: "own",
    url: "",
  },
  {
    id: 2,
    category: "GPU",
    name: "GPU Model Name",
    specs: ["Memory", "Series"],
    image: "/setup/gpu.png",
    source: "own",
    url: "",
  },
  {
    id: 3,
    category: "RAM",
    name: "RAM Model Name",
    specs: ["Capacity", "Speed"],
    image: "/setup/ram.png",
    source: "own",
    url: "",
  },
  {
    id: 4,
    category: "Monitor",
    name: "Monitor Model Name",
    specs: ["Size and resolution", "Refresh rate"],
    image: "/setup/monitor.png",
    source: "own",
    url: "",
  },
  {
    id: 5,
    category: "Keyboard",
    name: "Keyboard Model Name",
    specs: ["Layout", "Switch type"],
    image: "/setup/keyboard.png",
    source: "own",
    url: "",
  },
  {
    id: 6,
    category: "Mouse",
    name: "Mouse Model Name",
    specs: ["Sensor DPI", "Weight"],
    image: "/setup/mouse.png",
    source: "own",
    url: "",
  },
  {
    id: 7,
    category: "Headphones",
    name: "Headphones Model Name",
    specs: ["Type", "Connection"],
    image: "/setup/headphones.png",
    source: "own",
    url: "",
  },
  {
    id: 8,
    category: "Mousepad",
    name: "Mousepad Model Name",
    specs: ["Size", "Surface"],
    image: "/setup/mousepad.png",
    source: "own",
    url: "",
  },
];
