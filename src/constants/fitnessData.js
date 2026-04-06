import T from "./theme";

export const MUSCLE_GROUPS = [
  { id: "pecho",      label: "Pecho",      icon: "🫁", color: "#F87171" },
  { id: "espalda",    label: "Espalda",    icon: "🔙", color: "#60A5FA" },
  { id: "biceps",     label: "Bíceps",     icon: "💪", color: T.yellow  },
  { id: "triceps",    label: "Tríceps",    icon: "🦾", color: "#A78BFA" },
  { id: "antebrazo",  label: "Antebrazo",  icon: "🤜", color: "#FB923C" },
  { id: "hombros",    label: "Hombros",    icon: "🏋️", color: "#34D399" },
  { id: "abdomen",    label: "Abdomen",    icon: "⬛", color: "#FBBF24" },
  { id: "piernas",    label: "Piernas",    icon: "🦵", color: "#F472B6" },
  { id: "gluteos",    label: "Glúteos",    icon: "🍑", color: "#FB7185" },
  { id: "pantorrilla",label: "Pantorrillas",icon: "🦶", color: "#6EE7B7"},
];

export const EXERCISES_CATALOG = [
  // PECHO
  { id: 1,  muscle: "pecho",      name: "Press de banca plano",        type: "Fuerza"    },
  { id: 2,  muscle: "pecho",      name: "Press de banca inclinado",     type: "Fuerza"    },
  { id: 3,  muscle: "pecho",      name: "Aperturas con mancuernas",     type: "Aislamiento"},
  { id: 4,  muscle: "pecho",      name: "Fondos en paralelas",          type: "Fuerza"    },
  { id: 5,  muscle: "pecho",      name: "Cruce de poleas",              type: "Aislamiento"},
  { id: 6,  muscle: "pecho",      name: "Flexiones de brazos",          type: "Peso corporal"},

  // ESPALDA
  { id: 7,  muscle: "espalda",    name: "Jalón al pecho",               type: "Fuerza"    },
  { id: 8,  muscle: "espalda",    name: "Remo con barra",               type: "Fuerza"    },
  { id: 9,  muscle: "espalda",    name: "Remo con mancuerna",           type: "Fuerza"    },
  { id: 10, muscle: "espalda",    name: "Peso muerto",                  type: "Compuesto" },
  { id: 11, muscle: "espalda",    name: "Dominadas",                    type: "Peso corporal"},
  { id: 12, muscle: "espalda",    name: "Hiperextensiones",             type: "Aislamiento"},

  // BÍCEPS
  { id: 13, muscle: "biceps",     name: "Curl con barra",               type: "Aislamiento"},
  { id: 14, muscle: "biceps",     name: "Curl con mancuernas alterno",  type: "Aislamiento"},
  { id: 15, muscle: "biceps",     name: "Curl martillo",                type: "Aislamiento"},
  { id: 16, muscle: "biceps",     name: "Curl en banco Scott",          type: "Aislamiento"},
  { id: 17, muscle: "biceps",     name: "Curl en polea baja",           type: "Aislamiento"},

  // TRÍCEPS
  { id: 18, muscle: "triceps",    name: "Press francés",                type: "Aislamiento"},
  { id: 19, muscle: "triceps",    name: "Extensión en polea alta",      type: "Aislamiento"},
  { id: 20, muscle: "triceps",    name: "Fondos en banco",              type: "Peso corporal"},
  { id: 21, muscle: "triceps",    name: "Patada de tríceps",            type: "Aislamiento"},
  { id: 22, muscle: "triceps",    name: "Press cerrado",                type: "Fuerza"    },

  // ANTEBRAZO
  { id: 23, muscle: "antebrazo",  name: "Curl de muñeca con barra",     type: "Aislamiento"},
  { id: 24, muscle: "antebrazo",  name: "Curl inverso",                 type: "Aislamiento"},
  { id: 25, muscle: "antebrazo",  name: "Agarre de barra (Farmer walk)",type: "Fuerza"    },

  // HOMBROS
  { id: 26, muscle: "hombros",    name: "Press militar con barra",      type: "Fuerza"    },
  { id: 27, muscle: "hombros",    name: "Elevaciones laterales",        type: "Aislamiento"},
  { id: 28, muscle: "hombros",    name: "Elevaciones frontales",        type: "Aislamiento"},
  { id: 29, muscle: "hombros",    name: "Remo al cuello",               type: "Compuesto" },
  { id: 30, muscle: "hombros",    name: "Press Arnold",                 type: "Fuerza"    },

  // ABDOMEN
  { id: 31, muscle: "abdomen",    name: "Crunches",                     type: "Peso corporal"},
  { id: 32, muscle: "abdomen",    name: "Plancha",                      type: "Peso corporal"},
  { id: 33, muscle: "abdomen",    name: "Elevación de piernas",         type: "Peso corporal"},
  { id: 34, muscle: "abdomen",    name: "Crunch en polea",              type: "Aislamiento"},
  { id: 35, muscle: "abdomen",    name: "Russian twist",                type: "Peso corporal"},

  // PIERNAS
  { id: 36, muscle: "piernas",    name: "Sentadilla libre",             type: "Compuesto" },
  { id: 37, muscle: "piernas",    name: "Prensa de piernas",            type: "Fuerza"    },
  { id: 38, muscle: "piernas",    name: "Extensión de cuádriceps",      type: "Aislamiento"},
  { id: 39, muscle: "piernas",    name: "Curl femoral tumbado",         type: "Aislamiento"},
  { id: 40, muscle: "piernas",    name: "Zancadas con mancuernas",      type: "Compuesto" },
  { id: 41, muscle: "piernas",    name: "Sentadilla búlgara",           type: "Compuesto" },

  // GLÚTEOS
  { id: 42, muscle: "gluteos",    name: "Hip thrust con barra",         type: "Fuerza"    },
  { id: 43, muscle: "gluteos",    name: "Patada trasera en polea",      type: "Aislamiento"},
  { id: 44, muscle: "gluteos",    name: "Sentadilla sumo",              type: "Compuesto" },
  { id: 45, muscle: "gluteos",    name: "Abducción en máquina",         type: "Aislamiento"},

  // PANTORRILLAS
  { id: 46, muscle: "pantorrilla",name: "Elevación de talones de pie",  type: "Aislamiento"},
  { id: 47, muscle: "pantorrilla",name: "Elevación de talones sentado", type: "Aislamiento"},
  { id: 48, muscle: "pantorrilla",name: "Donkey calf raises",           type: "Aislamiento"},
];

export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export const BODY_PARTS_MEASUREMENTS = [
  { key: "cuello",    label: "Cuello"     },
  { key: "hombros",   label: "Hombros"    },
  { key: "pecho",     label: "Pecho"      },
  { key: "cintura",   label: "Cintura"    },
  { key: "cadera",    label: "Cadera"     },
  { key: "bicep_d",   label: "Bícep Der." },
  { key: "bicep_i",   label: "Bícep Izq." },
  { key: "antebrazo", label: "Antebrazo"  },
  { key: "muslo_d",   label: "Muslo Der." },
  { key: "muslo_i",   label: "Muslo Izq." },
  { key: "pantorrilla",label:"Pantorrilla"},
];

export const IMC_CATEGORIES = [
  { max: 18.5, label: "Bajo peso",      color: "#60A5FA" },
  { max: 25,   label: "Normal",         color: "#4ADE80" },
  { max: 30,   label: "Sobrepeso",      color: "#FBBF24" },
  { max: 35,   label: "Obesidad I",     color: "#FB923C" },
  { max: 40,   label: "Obesidad II",    color: "#F87171" },
  { max: 999,  label: "Obesidad III",   color: "#EF4444" },
];

export const getIMCCategory = (imc) =>
  IMC_CATEGORIES.find(c => imc < c.max) || IMC_CATEGORIES[IMC_CATEGORIES.length - 1];
