export const VALID_LICENSE_KEYS = (import.meta.env.VITE_LICENSE_KEYS || "")
  .split(",").map(k => k.trim().toUpperCase()).filter(Boolean);

export const MOODS = ["🌸 Peaceful","🌤 Hopeful","😌 Calm","😔 Heavy","😤 Frustrated","🌪 Overwhelmed","🙏 Grateful"];

export const EXPENSE_CATS = ["Housing","Food","Transport","Utilities","Health","Clothing","Entertainment","Faith/Giving","Self-care","Other"];

export const SECTIONS = [
  { id: "journal", icon: "📓", label: "Daily Journal" },
  { id: "vision", icon: "🌿", label: "Life Vision" },
  { id: "boundaries", icon: "🛡️", label: "Boundaries & Energy" },
  { id: "faith", icon: "✨", label: "Faith & Grounding" },
  { id: "relationships", icon: "💛", label: "Relationships" },
  { id: "financial", icon: "🌱", label: "Financial Calm" },
  { id: "health", icon: "🤍", label: "Health & Wellness" },
  { id: "experiences", icon: "🗺️", label: "Experiences & Travel" },
  { id: "memories", icon: "📖", label: "Memory Keeper" },
  { id: "reset", icon: "🌙", label: "Weekly Reset" },
  { id: "future", icon: "💌", label: "Future Self Letters" },
];

export const SECTION_CONTENT = {
  vision: { heading: "🌿 Life Vision", prompt: "Describe the life you are moving toward. What do your days look, feel, and sound like?", placeholder: "My peaceful life looks like..." },
  boundaries: { heading: "🛡️ Boundaries & Energy", prompt: "What situations or habits are draining your energy? What boundaries would restore your peace?", placeholder: "A boundary I need to set is..." },
  faith: { heading: "✨ Faith & Grounding", prompt: "How are you nurturing your spirit this season? What practices help you feel connected to God?", placeholder: "My grounding practices are..." },
  relationships: { heading: "💛 Relationship Alignment", prompt: "Which relationships feel nourishing? Which feel heavy?", placeholder: "The relationships I want to invest in are..." },
  health: { heading: "🤍 Health & Wellness", prompt: "Without pressure or perfection — how do you want to care for your body and mind?", placeholder: "One gentle health habit I want to build is..." },
  experiences: { heading: "🗺️ Experiences & Travel", prompt: "What experiences are you saving your energy for? A trip, a moment, a gathering?", placeholder: "An experience I'm planning or dreaming of..." },
};

export const STORAGE_KEY = "plp_data_v1";
export const todayStr = () => new Date().toISOString().slice(0, 10);
export const monthKey = (d) => d.slice(0, 7);
export const fmt = (n) => Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const toNum = (s) => parseFloat(String(s).replace(/[^0-9.]/g, "")) || 0;
