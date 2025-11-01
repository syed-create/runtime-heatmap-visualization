// Application constants

export const POLLING_INTERVAL_MS = 30000; // 30 seconds for live updates
export const CHART_HEIGHT = 700; // Height in pixels
export const CHART_ANIMATION_DURATION = 500; // Animation duration in ms
export const PROGRESSIVE_RENDER_THRESHOLD = 10000; // Number of data points before progressive rendering
export const PROGRESSIVE_CHUNK_SIZE = 5000; // Chunk size for progressive rendering

// Event names
export const EXPORT_CHART_EVENT = "export-chart";

// Data fetch configuration
export const DATA_ENDPOINT = "/runtime.json";
