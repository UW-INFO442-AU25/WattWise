// Definitions for technical terms
export const termDefinitions = {
  "kWh": "Kilowatt-hour - A unit of energy. Think of it as how much electricity you use over time. Your electricity bill is measured in kWh.",
  "W": "Watt - A unit of power that measures how much energy a device uses. Lower watts mean less energy consumption.",
  "CO₂": "Carbon Dioxide - A gas that contributes to climate change. When we use energy, we often create CO₂ emissions.",
  "halogen bulb": "A type of light bulb that uses halogen gas. They're more efficient than old incandescent bulbs but less efficient than LEDs.",
  "LED": "Light Emitting Diode - A type of light bulb that uses much less energy and lasts longer than traditional bulbs.",
  "incandescent bulb": "An old-style light bulb that uses a filament. They're less energy-efficient than modern LED or CFL bulbs.",
  "therm": "A unit of natural gas. One therm equals about 100 cubic feet of natural gas.",
  "flow rate": "The speed at which water comes out, measured in gallons per minute. Lower flow rates use less water.",
  "Energy Star": "A government program that certifies appliances as energy-efficient. Look for this label when buying new appliances.",
  "standby mode": "When devices are off but still using electricity because they're plugged in. This is also called 'phantom load'.",
  "standby power": "The electricity devices use even when turned off but still plugged in. Also called 'phantom load' or 'vampire power'.",
  "phantom load": "The electricity devices use even when turned off but still plugged in. Also called 'vampire power' or 'standby power'.",
  "power strips": "A device with multiple outlets that you can turn off with one switch, helping eliminate phantom load.",
  "smart power strips": "Power strips that automatically turn off power to devices when they're not in use, saving energy.",
  "programmable thermostats": "A thermostat you can set to automatically change temperatures at different times of day.",
  "greenhouse gas emissions": "Gases like CO₂ that trap heat in the atmosphere and contribute to climate change.",
  "manufacturing emissions": "Carbon dioxide and other gases released during the process of making products.",
  "clean energy": "Energy from sources that don't produce harmful emissions, like solar, wind, or hydroelectric power.",
  "sleep mode": "A low-power state for computers and electronics that uses much less energy than being fully on."
};

// Helper function to find terms in text
export function findTermsInText(text) {
  const foundTerms = [];
  const termKeys = Object.keys(termDefinitions);
  
  // Sort by length (longest first) to match longer terms first
  const sortedTerms = termKeys.sort((a, b) => b.length - a.length);
  
  sortedTerms.forEach(term => {
    // Create regex to find whole word matches (case-insensitive)
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(text)) {
      foundTerms.push(term);
    }
  });
  
  return foundTerms;
}

export const sustainabilityCards = [
  {
    id: "shower-usage",
    question: "How many gallons of water are typically used in a 30-minute shower?",
    answer: "A 30-minute shower typically uses 60–75 gallons of water depending on the showerhead flow rate. Standard showerheads use 2.5 gallons per minute."
  },
  {
    id: "energy-savings-led",
    question: "How much energy can you save by switching a 43W halogen bulb to a 9W LED?",
    answer: "Switching saves about 37 kWh/year per bulb (assuming 3 hours per day of use). This reduces your electricity bill and cuts CO₂ emissions significantly."
  },
  {
    id: "laundry-water",
    question: "How much water does a typical top-loading washing machine use per cycle?",
    answer: "A top-loading washing machine typically uses 40–50 gallons per cycle. Front-loading machines are more efficient, using only 15–20 gallons per cycle."
  },
  {
    id: "refrigerator-energy",
    question: "What percentage of a typical household's electricity bill comes from the refrigerator?",
    answer: "Refrigerators account for approximately 13–15% of a household's total electricity consumption, making them one of the largest energy consumers in the home."
  },
  {
    id: "dishwasher-vs-hand",
    question: "Which uses more water: running a full dishwasher or hand-washing the same dishes?",
    answer: "Hand-washing typically uses more water. A modern Energy Star dishwasher uses about 3–5 gallons per cycle, while hand-washing can use 15–27 gallons."
  },
  {
    id: "co2-shower",
    question: "How much CO₂ is emitted from heating water for a single 10-minute hot shower?",
    answer: "A 10-minute hot shower emits approximately 2.5–4 pounds of CO₂, depending on your water heater type (gas vs. electric) and local energy sources."
  },
  {
    id: "standby-power",
    question: "What percentage of household electricity is consumed by devices in standby mode?",
    answer: "Standby power (phantom load) accounts for 5–10% of household electricity use. Unplugging devices or using power strips can eliminate this waste."
  },
  {
    id: "faucet-water",
    question: "How many gallons of water flow from a standard kitchen faucet per minute?",
    answer: "A standard kitchen faucet flows at 2.2 gallons per minute. Turning off the tap while washing dishes can save 5–10 gallons per washing session."
  },
  {
    id: "lighting-energy",
    question: "If you leave a 60W incandescent bulb on for 8 hours, how much energy does it consume?",
    answer: "A 60W bulb running for 8 hours consumes 0.48 kWh. Replacing it with a 9W LED would use only 0.072 kWh for the same period."
  },
  {
    id: "computer-energy",
    question: "How much electricity does a desktop computer and monitor use when left on 24/7?",
    answer: "A desktop computer with monitor left on 24/7 can consume 200–400 kWh per year. Using sleep mode or shutting down can reduce this by 80–90%."
  },
  {
    id: "natural-gas-co2",
    question: "How much CO₂ is produced per therm of natural gas burned?",
    answer: "Burning one therm of natural gas produces approximately 11.7 pounds of CO₂. This is why efficient heating systems and insulation are important."
  },
  {
    id: "washing-temp",
    question: "How much energy can you save by washing clothes in cold water instead of hot?",
    answer: "Washing in cold water can save 75–90% of the energy used for laundry. Most modern detergents work effectively in cold water, making this an easy change."
  },
  {
    id: "water-heater",
    question: "What is the recommended temperature setting for a water heater to balance safety and energy efficiency?",
    answer: "120°F is the recommended setting. Each 10°F reduction can save 3–5% on water heating costs while still preventing bacterial growth."
  },
  {
    id: "propane-emissions",
    question: "How much CO₂ is emitted per gallon of propane burned?",
    answer: "Burning one gallon of propane produces approximately 12.7 pounds of CO₂. Propane is cleaner than some fuels but still contributes to greenhouse gas emissions."
  },
  {
    id: "air-dry-clothes",
    question: "How much energy can you save by air-drying clothes instead of using a dryer?",
    answer: "Air-drying clothes can save 80–90% of the energy used for laundry. A typical dryer uses 2–4 kWh per load, while air-drying uses virtually none."
  },
  {
    id: "phantom-load",
    question: "What is the average annual cost of phantom load (standby power) for a typical household?",
    answer: "Phantom load costs the average household $100–200 per year. Using smart power strips or unplugging devices can eliminate this unnecessary expense."
  },
  {
    id: "ceiling-fan",
    question: "How much energy does a ceiling fan use compared to an air conditioner?",
    answer: "A ceiling fan uses only 1–2% of the energy of an air conditioner. Using fans can allow you to raise your AC thermostat by 4°F while staying comfortable."
  },
  {
    id: "water-leak",
    question: "How much water is wasted per day from a faucet dripping at one drop per second?",
    answer: "A faucet dripping at one drop per second wastes approximately 3,000 gallons per year. That's enough water for 180 showers or 60 loads of laundry."
  },
  {
    id: "solar-panel",
    question: "How many years does it typically take for residential solar panels to offset their manufacturing emissions?",
    answer: "Solar panels typically offset their manufacturing emissions in 3–5 years. After that, they produce clean energy for 25–30 years with minimal emissions."
  },
  {
    id: "thermostat-savings",
    question: "How much can you save on heating costs by lowering your thermostat by 7–10°F for 8 hours per day?",
    answer: "Lowering your thermostat by 7–10°F for 8 hours can save 10% annually on heating costs. Programmable thermostats make this easy to automate."
  }
];
