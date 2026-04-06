/* ═══════════════════════════════════════════════════════
   MOCK DATA DE PRUEBA — Rutinas y Nutrición
   Para 3 usuarios: Carlos (id:1), Ana (id:2), Luis (id:3)

   Flujo de prueba en ?qr=1:
     Carlos Pérez  → carlos@gmail.com
     Ana Gómez     → ana@gmail.com
     Luis Torres   → luis@gmail.com
═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   RUTINAS
   Formato: { [userId]: { [día]: [ ejercicios ] } }
   Cada ejercicio: id, name, muscle, type, sets, reps, rest, uid
───────────────────────────────────────────────────── */
export const mockRoutines = {

  /* ── CARLOS PÉREZ (id:1) — Pérdida de grasa + volumen ── */
  1: {
    Lunes: [
      { uid: 101, id: 1,  name: "Press de banca plano",       muscle: "pecho",   type: "Fuerza",      sets: 4, reps: 10, rest: 90  },
      { uid: 102, id: 3,  name: "Aperturas con mancuernas",   muscle: "pecho",   type: "Aislamiento", sets: 3, reps: 12, rest: 60  },
      { uid: 103, id: 5,  name: "Cruce de poleas",            muscle: "pecho",   type: "Aislamiento", sets: 3, reps: 15, rest: 60  },
      { uid: 104, id: 26, name: "Press militar con barra",    muscle: "hombros", type: "Fuerza",      sets: 4, reps: 10, rest: 90  },
      { uid: 105, id: 27, name: "Elevaciones laterales",      muscle: "hombros", type: "Aislamiento", sets: 3, reps: 15, rest: 45  },
    ],
    Martes: [
      { uid: 111, id: 10, name: "Peso muerto",                muscle: "espalda", type: "Compuesto",   sets: 4, reps: 6,  rest: 120 },
      { uid: 112, id: 7,  name: "Jalón al pecho",             muscle: "espalda", type: "Fuerza",      sets: 4, reps: 10, rest: 90  },
      { uid: 113, id: 9,  name: "Remo con mancuerna",         muscle: "espalda", type: "Fuerza",      sets: 3, reps: 12, rest: 75  },
      { uid: 114, id: 13, name: "Curl con barra",             muscle: "biceps",  type: "Aislamiento", sets: 4, reps: 12, rest: 60  },
      { uid: 115, id: 15, name: "Curl martillo",              muscle: "biceps",  type: "Aislamiento", sets: 3, reps: 12, rest: 60  },
    ],
    Miércoles: [
      { uid: 121, id: 36, name: "Sentadilla libre",           muscle: "piernas", type: "Compuesto",   sets: 4, reps: 8,  rest: 120 },
      { uid: 122, id: 37, name: "Prensa de piernas",          muscle: "piernas", type: "Fuerza",      sets: 4, reps: 12, rest: 90  },
      { uid: 123, id: 42, name: "Hip thrust con barra",       muscle: "gluteos", type: "Fuerza",      sets: 4, reps: 12, rest: 90  },
      { uid: 124, id: 46, name: "Elevación de talones de pie",muscle: "pantorrilla", type: "Aislamiento", sets: 4, reps: 20, rest: 45 },
    ],
    Jueves: [
      { uid: 131, id: 2,  name: "Press de banca inclinado",   muscle: "pecho",   type: "Fuerza",      sets: 4, reps: 10, rest: 90  },
      { uid: 132, id: 18, name: "Press francés",              muscle: "triceps", type: "Aislamiento", sets: 4, reps: 12, rest: 60  },
      { uid: 133, id: 19, name: "Extensión en polea alta",    muscle: "triceps", type: "Aislamiento", sets: 3, reps: 15, rest: 60  },
      { uid: 134, id: 31, name: "Crunches",                   muscle: "abdomen", type: "Peso corporal",sets: 4, reps: 20, rest: 30  },
      { uid: 135, id: 32, name: "Plancha",                    muscle: "abdomen", type: "Peso corporal",sets: 3, reps: 60, rest: 45  },
    ],
    Viernes: [
      { uid: 141, id: 11, name: "Dominadas",                  muscle: "espalda", type: "Peso corporal",sets: 4, reps: 8,  rest: 90  },
      { uid: 142, id: 8,  name: "Remo con barra",             muscle: "espalda", type: "Fuerza",      sets: 4, reps: 10, rest: 90  },
      { uid: 143, id: 40, name: "Zancadas con mancuernas",    muscle: "piernas", type: "Compuesto",   sets: 3, reps: 12, rest: 75  },
      { uid: 144, id: 33, name: "Elevación de piernas",       muscle: "abdomen", type: "Peso corporal",sets: 3, reps: 15, rest: 45  },
    ],
    Sábado: [
      { uid: 151, id: 30, name: "Press Arnold",               muscle: "hombros", type: "Fuerza",      sets: 4, reps: 12, rest: 75  },
      { uid: 152, id: 28, name: "Elevaciones frontales",      muscle: "hombros", type: "Aislamiento", sets: 3, reps: 15, rest: 45  },
      { uid: 153, id: 23, name: "Curl de muñeca con barra",   muscle: "antebrazo", type: "Aislamiento",sets: 3, reps: 20, rest: 30  },
      { uid: 154, id: 47, name: "Elevación de talones sentado",muscle:"pantorrilla",type: "Aislamiento",sets: 4, reps: 20, rest: 45 },
    ],
  },

  /* ── ANA GÓMEZ (id:2) — Tonificación + glúteos ── */
  2: {
    Lunes: [
      { uid: 201, id: 36, name: "Sentadilla libre",           muscle: "piernas", type: "Compuesto",   sets: 4, reps: 12, rest: 75  },
      { uid: 202, id: 42, name: "Hip thrust con barra",       muscle: "gluteos", type: "Fuerza",      sets: 4, reps: 15, rest: 75  },
      { uid: 203, id: 43, name: "Patada trasera en polea",    muscle: "gluteos", type: "Aislamiento", sets: 3, reps: 15, rest: 45  },
      { uid: 204, id: 44, name: "Sentadilla sumo",            muscle: "gluteos", type: "Compuesto",   sets: 3, reps: 15, rest: 60  },
      { uid: 205, id: 46, name: "Elevación de talones de pie",muscle: "pantorrilla", type: "Aislamiento", sets: 3, reps: 20, rest: 30 },
    ],
    Martes: [
      { uid: 211, id: 1,  name: "Press de banca plano",       muscle: "pecho",   type: "Fuerza",      sets: 3, reps: 12, rest: 75  },
      { uid: 212, id: 6,  name: "Flexiones de brazos",        muscle: "pecho",   type: "Peso corporal",sets: 3, reps: 12, rest: 60  },
      { uid: 213, id: 13, name: "Curl con barra",             muscle: "biceps",  type: "Aislamiento", sets: 3, reps: 15, rest: 60  },
      { uid: 214, id: 20, name: "Fondos en banco",            muscle: "triceps", type: "Peso corporal",sets: 3, reps: 15, rest: 60  },
      { uid: 215, id: 27, name: "Elevaciones laterales",      muscle: "hombros", type: "Aislamiento", sets: 3, reps: 15, rest: 45  },
    ],
    Miércoles: [
      { uid: 221, id: 37, name: "Prensa de piernas",          muscle: "piernas", type: "Fuerza",      sets: 4, reps: 15, rest: 75  },
      { uid: 222, id: 38, name: "Extensión de cuádriceps",    muscle: "piernas", type: "Aislamiento", sets: 3, reps: 15, rest: 60  },
      { uid: 223, id: 39, name: "Curl femoral tumbado",       muscle: "piernas", type: "Aislamiento", sets: 3, reps: 15, rest: 60  },
      { uid: 224, id: 45, name: "Abducción en máquina",       muscle: "gluteos", type: "Aislamiento", sets: 4, reps: 20, rest: 45  },
    ],
    Jueves: [
      { uid: 231, id: 7,  name: "Jalón al pecho",             muscle: "espalda", type: "Fuerza",      sets: 4, reps: 12, rest: 75  },
      { uid: 232, id: 9,  name: "Remo con mancuerna",         muscle: "espalda", type: "Fuerza",      sets: 3, reps: 12, rest: 75  },
      { uid: 233, id: 32, name: "Plancha",                    muscle: "abdomen", type: "Peso corporal",sets: 4, reps: 45, rest: 30  },
      { uid: 234, id: 35, name: "Russian twist",              muscle: "abdomen", type: "Peso corporal",sets: 3, reps: 20, rest: 30  },
    ],
    Viernes: [
      { uid: 241, id: 41, name: "Sentadilla búlgara",         muscle: "piernas", type: "Compuesto",   sets: 4, reps: 12, rest: 75  },
      { uid: 242, id: 42, name: "Hip thrust con barra",       muscle: "gluteos", type: "Fuerza",      sets: 4, reps: 15, rest: 75  },
      { uid: 243, id: 43, name: "Patada trasera en polea",    muscle: "gluteos", type: "Aislamiento", sets: 3, reps: 20, rest: 45  },
      { uid: 244, id: 31, name: "Crunches",                   muscle: "abdomen", type: "Peso corporal",sets: 3, reps: 20, rest: 30  },
    ],
    Sábado: [
      { uid: 251, id: 6,  name: "Flexiones de brazos",        muscle: "pecho",   type: "Peso corporal",sets: 3, reps: 15, rest: 45  },
      { uid: 252, id: 11, name: "Dominadas",                  muscle: "espalda", type: "Peso corporal",sets: 3, reps: 6,  rest: 90  },
      { uid: 253, id: 47, name: "Elevación de talones sentado",muscle:"pantorrilla",type: "Aislamiento",sets: 3, reps: 20, rest: 30 },
    ],
  },

  /* ── LUIS TORRES (id:3) — Fuerza general ── */
  3: {
    Lunes: [
      { uid: 301, id: 10, name: "Peso muerto",                muscle: "espalda", type: "Compuesto",   sets: 5, reps: 5,  rest: 180 },
      { uid: 302, id: 7,  name: "Jalón al pecho",             muscle: "espalda", type: "Fuerza",      sets: 4, reps: 8,  rest: 90  },
      { uid: 303, id: 8,  name: "Remo con barra",             muscle: "espalda", type: "Fuerza",      sets: 4, reps: 8,  rest: 90  },
      { uid: 304, id: 12, name: "Hiperextensiones",           muscle: "espalda", type: "Aislamiento", sets: 3, reps: 12, rest: 60  },
    ],
    Martes: [
      { uid: 311, id: 1,  name: "Press de banca plano",       muscle: "pecho",   type: "Fuerza",      sets: 5, reps: 5,  rest: 180 },
      { uid: 312, id: 2,  name: "Press de banca inclinado",   muscle: "pecho",   type: "Fuerza",      sets: 4, reps: 8,  rest: 90  },
      { uid: 313, id: 26, name: "Press militar con barra",    muscle: "hombros", type: "Fuerza",      sets: 4, reps: 8,  rest: 90  },
      { uid: 314, id: 4,  name: "Fondos en paralelas",        muscle: "pecho",   type: "Fuerza",      sets: 3, reps: 10, rest: 75  },
    ],
    Miércoles: [
      { uid: 321, id: 36, name: "Sentadilla libre",           muscle: "piernas", type: "Compuesto",   sets: 5, reps: 5,  rest: 180 },
      { uid: 322, id: 37, name: "Prensa de piernas",          muscle: "piernas", type: "Fuerza",      sets: 4, reps: 10, rest: 90  },
      { uid: 323, id: 46, name: "Elevación de talones de pie",muscle: "pantorrilla", type: "Aislamiento", sets: 4, reps: 15, rest: 45 },
    ],
    Jueves: [
      { uid: 331, id: 13, name: "Curl con barra",             muscle: "biceps",  type: "Aislamiento", sets: 4, reps: 10, rest: 75  },
      { uid: 332, id: 16, name: "Curl en banco Scott",        muscle: "biceps",  type: "Aislamiento", sets: 3, reps: 12, rest: 60  },
      { uid: 333, id: 18, name: "Press francés",              muscle: "triceps", type: "Aislamiento", sets: 4, reps: 10, rest: 75  },
      { uid: 334, id: 22, name: "Press cerrado",              muscle: "triceps", type: "Fuerza",      sets: 3, reps: 10, rest: 75  },
      { uid: 335, id: 23, name: "Curl de muñeca con barra",   muscle: "antebrazo", type: "Aislamiento",sets: 3, reps: 15, rest: 30 },
    ],
    Viernes: [
      { uid: 341, id: 10, name: "Peso muerto",                muscle: "espalda", type: "Compuesto",   sets: 3, reps: 5,  rest: 180 },
      { uid: 342, id: 11, name: "Dominadas",                  muscle: "espalda", type: "Peso corporal",sets: 4, reps: 6,  rest: 90  },
      { uid: 343, id: 32, name: "Plancha",                    muscle: "abdomen", type: "Peso corporal",sets: 5, reps: 60, rest: 30  },
      { uid: 344, id: 34, name: "Crunch en polea",            muscle: "abdomen", type: "Aislamiento", sets: 3, reps: 15, rest: 45  },
    ],
    Sábado: [
      { uid: 351, id: 29, name: "Remo al cuello",             muscle: "hombros", type: "Compuesto",   sets: 4, reps: 10, rest: 75  },
      { uid: 352, id: 27, name: "Elevaciones laterales",      muscle: "hombros", type: "Aislamiento", sets: 3, reps: 15, rest: 45  },
      { uid: 353, id: 40, name: "Zancadas con mancuernas",    muscle: "piernas", type: "Compuesto",   sets: 3, reps: 12, rest: 60  },
    ],
  },
};

/* ─────────────────────────────────────────────────────
   NUTRICIÓN
   Formato: { [userId]: { [día]: { [mealId]: { food, notes, calorias, proteinas, carbos, grasas } } } }
───────────────────────────────────────────────────── */
export const mockNutrition = {

  /* ── CARLOS PÉREZ (id:1) — Déficit calórico ~2000 kcal ── */
  1: {
    Lunes: {
      desayuno: { food: "Avena con leche descremada + plátano + 3 claras de huevo", notes: "Sin azúcar, endulzar con stevia", calorias: "420", proteinas: "32", carbos: "55", grasas: "6" },
      media:    { food: "Manzana + 20g almendras", notes: "Comer despacio", calorias: "180", proteinas: "5", carbos: "22", grasas: "9" },
      almuerzo: { food: "150g pechuga de pollo a la plancha + arroz integral + ensalada verde", notes: "Cocinar sin aceite, solo limón y hierbas", calorias: "520", proteinas: "45", carbos: "58", grasas: "7" },
      merienda: { food: "Batido de proteínas con agua + 1 banana", notes: "Tomar 30 min después de entrenar", calorias: "280", proteinas: "28", carbos: "35", grasas: "2" },
      cena:     { food: "150g merluza al horno + brócoli + batata cocida", notes: "Porción moderada de batata (100g)", calorias: "380", proteinas: "38", carbos: "40", grasas: "5" },
    },
    Martes: {
      desayuno: { food: "Tostadas integrales con huevo revuelto + palta", notes: "2 rebanadas, 2 huevos, ¼ palta", calorias: "410", proteinas: "24", carbos: "38", grasas: "18" },
      media:    { food: "Yogur griego natural + arándanos", notes: "Sin azúcar añadida", calorias: "160", proteinas: "14", carbos: "18", grasas: "2" },
      almuerzo: { food: "200g atún en agua + arroz integral + tomate y pepino", notes: "Escurrir bien el atún, aliñar con limón", calorias: "490", proteinas: "48", carbos: "52", grasas: "5" },
      merienda: { food: "1 manzana + 2 cucharadas de mantequilla de maní", notes: "Maní natural sin sal", calorias: "250", proteinas: "7", carbos: "28", grasas: "13" },
      cena:     { food: "Tortilla de 3 claras + 1 yema con verduras salteadas", notes: "Usar spray de aceite de oliva", calorias: "310", proteinas: "28", carbos: "15", grasas: "14" },
    },
    Miércoles: {
      desayuno: { food: "Avena con proteína en polvo + fresas + nueces", notes: "Mezclar proteína con la avena caliente", calorias: "440", proteinas: "36", carbos: "48", grasas: "10" },
      media:    { food: "Barrita de proteínas (marca libre) + agua", notes: "Mínimo 20g proteína por barrita", calorias: "200", proteinas: "20", carbos: "22", grasas: "5" },
      almuerzo: { food: "150g lomo de res magro + quinua + espinacas salteadas", notes: "Cortar grasa visible, cocinar a la plancha", calorias: "540", proteinas: "46", carbos: "50", grasas: "12" },
      merienda: { food: "Batido de proteínas con leche descremada", notes: "Post-entreno, tomar inmediatamente", calorias: "260", proteinas: "30", carbos: "24", grasas: "3" },
      cena:     { food: "Pechuga de pavo + ensalada mediterránea", notes: "Aliñar solo con aceite de oliva y vinagre", calorias: "360", proteinas: "40", carbos: "18", grasas: "14" },
    },
    Jueves: {
      desayuno: { food: "Panqueques de avena y plátano (sin harina)", notes: "2 plátanos + 80g avena + 2 huevos", calorias: "430", proteinas: "22", carbos: "62", grasas: "10" },
      media:    { food: "Queso cottage + piña en trozos", notes: "100g cottage + 100g piña natural", calorias: "170", proteinas: "16", carbos: "20", grasas: "2" },
      almuerzo: { food: "Salmón al horno + puré de camote + ensalada", notes: "120g salmón, no excederse con el camote", calorias: "510", proteinas: "42", carbos: "45", grasas: "16" },
      merienda: { food: "Edamame + agua con limón", notes: "100g edamame cocido con sal baja", calorias: "120", proteinas: "10", carbos: "10", grasas: "5" },
      cena:     { food: "Revuelto de claras con champiñones y tomate", notes: "4 claras + 1 yema, sin aceite extra", calorias: "280", proteinas: "30", carbos: "12", grasas: "12" },
    },
    Viernes: {
      desayuno: { food: "Bowl de frutas + granola sin azúcar + leche de almendras", notes: "Porción de granola: 40g máximo", calorias: "380", proteinas: "12", carbos: "60", grasas: "11" },
      media:    { food: "Huevo duro + zanahoria y pepino en bastones", notes: "2 huevos duros, vegetales sin límite", calorias: "160", proteinas: "13", carbos: "10", grasas: "8" },
      almuerzo: { food: "Pollo al curry con arroz integral y legumbres", notes: "Curry sin crema, base de tomate", calorias: "560", proteinas: "44", carbos: "60", grasas: "9" },
      merienda: { food: "Batido de proteínas + banana + mantequilla de maní", notes: "Solo si entrenó ese día", calorias: "350", proteinas: "32", carbos: "38", grasas: "8" },
      cena:     { food: "Ensalada de atún con huevo, tomate, lechuga y aceituna", notes: "Sin mayonesa, aliñar con aceite de oliva", calorias: "340", proteinas: "36", carbos: "12", grasas: "16" },
    },
    Sábado: {
      desayuno: { food: "Tostadas con aguacate + huevos pochados + café negro", notes: "Día de refeed controlado", calorias: "460", proteinas: "22", carbos: "42", grasas: "22" },
      media:    { food: "Fruta de temporada variada + yogur", notes: "Libre elección de fruta", calorias: "200", proteinas: "8", carbos: "38", grasas: "2" },
      almuerzo: { food: "Arroz con pollo + menestra + ensalada fresca", notes: "Plato peruano clásico, porción normal", calorias: "620", proteinas: "48", carbos: "72", grasas: "10" },
      merienda: { food: "Infusión + 1 puñado de nueces mixtas", notes: "No más de 30g de nueces", calorias: "200", proteinas: "6", carbos: "8", grasas: "16" },
      cena:     { food: "Sopa de verduras + pan integral", notes: "Sopa casera, evitar cremas envasadas", calorias: "300", proteinas: "12", carbos: "48", grasas: "5" },
    },
  },

  /* ── ANA GÓMEZ (id:2) — Tonificación ~1700 kcal ── */
  2: {
    Lunes: {
      desayuno: { food: "Smoothie bowl: espinaca + plátano + proteína + granola", notes: "Base líquida mínima para que quede espeso", calorias: "380", proteinas: "28", carbos: "52", grasas: "7" },
      media:    { food: "Yogur griego + kiwi", notes: "Sin azúcar añadida", calorias: "140", proteinas: "12", carbos: "18", grasas: "2" },
      almuerzo: { food: "Ensalada de quinua con pollo, tomate cherry y palta", notes: "80g quinua cocida, 120g pollo, ½ palta", calorias: "480", proteinas: "38", carbos: "42", grasas: "16" },
      merienda: { food: "Batido de proteínas con leche vegetal + 1 fruta", notes: "Post-entreno ideal", calorias: "250", proteinas: "26", carbos: "28", grasas: "3" },
      cena:     { food: "Crema de zapallo + 2 claras de huevo revueltas", notes: "Crema sin nata, solo zapallo y caldo", calorias: "290", proteinas: "22", carbos: "30", grasas: "6" },
    },
    Martes: {
      desayuno: { food: "Tostadas de centeno + queso fresco + tomate + té verde", notes: "2 rebanadas, 50g queso fresco", calorias: "340", proteinas: "18", carbos: "42", grasas: "9" },
      media:    { food: "Manzana + 15g nueces", notes: "Masticar despacio", calorias: "170", proteinas: "4", carbos: "26", grasas: "7" },
      almuerzo: { food: "Filete de merluza + arroz integral + judías verdes", notes: "Cocinar al vapor o al horno", calorias: "450", proteinas: "40", carbos: "48", grasas: "6" },
      merienda: { food: "Edamame + agua con jengibre y limón", notes: "100g edamame", calorias: "120", proteinas: "10", carbos: "10", grasas: "5" },
      cena:     { food: "Ensalada caprese + tortilla de claras con espinaca", notes: "3 claras, mozzarella light", calorias: "310", proteinas: "28", carbos: "14", grasas: "15" },
    },
    Miércoles: {
      desayuno: { food: "Avena nocturna con chía, arándanos y proteína", notes: "Preparar noche anterior en frasco", calorias: "400", proteinas: "30", carbos: "50", grasas: "9" },
      media:    { food: "Batido verde: pepino + apio + manzana + proteína", notes: "Agregar hielo, sin azúcar", calorias: "180", proteinas: "20", carbos: "18", grasas: "2" },
      almuerzo: { food: "Bowl de salmón + quinua + pepino + edamame + salsa de soya", notes: "Salmón crudo o al horno, soya baja en sodio", calorias: "520", proteinas: "42", carbos: "44", grasas: "16" },
      merienda: { food: "1 pera + queso cottage", notes: "100g cottage", calorias: "160", proteinas: "14", carbos: "22", grasas: "2" },
      cena:     { food: "Sopa de lentejas con vegetales + pan de pita integral", notes: "Porción moderada de pan", calorias: "360", proteinas: "22", carbos: "52", grasas: "5" },
    },
    Jueves: {
      desayuno: { food: "Huevos revueltos con espinaca + tostada integral + café", notes: "2 huevos enteros + 2 claras", calorias: "360", proteinas: "26", carbos: "32", grasas: "14" },
      media:    { food: "Fruta de temporada + 1 cucharada de mantequilla de almendra", notes: "Fruta libre", calorias: "190", proteinas: "5", carbos: "28", grasas: "8" },
      almuerzo: { food: "Pechuga de pollo al limón + camote asado + brócoli", notes: "No añadir mantequilla al camote", calorias: "460", proteinas: "42", carbos: "46", grasas: "8" },
      merienda: { food: "Proteína en polvo con agua + plátano pequeño", notes: "Tomar post-entreno", calorias: "230", proteinas: "25", carbos: "28", grasas: "2" },
      cena:     { food: "Sopa de pollo casera + arroz integral (pequeña porción)", notes: "50g arroz cocido", calorias: "320", proteinas: "30", carbos: "32", grasas: "6" },
    },
    Viernes: {
      desayuno: { food: "Panqueques de proteína con fresas + miel de abeja", notes: "1 cucharadita de miel solo", calorias: "380", proteinas: "30", carbos: "44", grasas: "8" },
      media:    { food: "Yogur griego + semillas de chía + frambuesas", notes: "1 cucharada de chía", calorias: "160", proteinas: "14", carbos: "16", grasas: "4" },
      almuerzo: { food: "Wok de tofu + fideos de arroz + vegetales coloridos", notes: "Tofu firme prensado, salsa teriyaki ligera", calorias: "440", proteinas: "28", carbos: "58", grasas: "10" },
      merienda: { food: "Mix de frutos secos y semillas", notes: "30g, variedad sin sal", calorias: "180", proteinas: "6", carbos: "10", grasas: "14" },
      cena:     { food: "Atún con ensalada de aguacate, tomate y lechuga", notes: "Sin mayonesa", calorias: "310", proteinas: "32", carbos: "12", grasas: "16" },
    },
    Sábado: {
      desayuno: { food: "French toast integral con canela + café con leche vegetal", notes: "Día más flexible, disfrutar", calorias: "420", proteinas: "20", carbos: "54", grasas: "12" },
      media:    { food: "Batido de frutas tropicales + proteína", notes: "Mango, piña, maracuyá", calorias: "260", proteinas: "24", carbos: "34", grasas: "3" },
      almuerzo: { food: "Ceviche de pollo o pescado + camote + choclo", notes: "Plato libre saludable del fin de semana", calorias: "480", proteinas: "38", carbos: "55", grasas: "8" },
      merienda: { food: "Chocolate negro 85% + infusión relajante", notes: "2 onzas de chocolate máximo", calorias: "140", proteinas: "3", carbos: "12", grasas: "10" },
      cena:     { food: "Wrap integral con pollo, lechuga, tomate y hummus", notes: "1 wrap, no excederse con el hummus", calorias: "380", proteinas: "30", carbos: "42", grasas: "10" },
    },
  },

  /* ── LUIS TORRES (id:3) — Volumen ~2800 kcal ── */
  3: {
    Lunes: {
      desayuno: { food: "6 claras + 2 yemas revueltas + avena con leche entera + plátano", notes: "Desayuno grande, día de espalda pesada", calorias: "680", proteinas: "52", carbos: "72", grasas: "16" },
      media:    { food: "Batido hipercalórico: leche + avena + plátano + proteína + maní", notes: "Licuar todo junto, tomar antes de entrenar", calorias: "520", proteinas: "38", carbos: "65", grasas: "12" },
      almuerzo: { food: "200g arroz blanco + 200g pechuga de pollo + menestra + palta", notes: "Porción grande, día de entrenamiento pesado", calorias: "720", proteinas: "58", carbos: "85", grasas: "14" },
      merienda: { food: "Batido de proteínas + 2 bananas + leche entera", notes: "Post-entreno inmediato", calorias: "420", proteinas: "42", carbos: "52", grasas: "6" },
      cena:     { food: "200g salmón al horno + quinua + ensalada con aceite de oliva", notes: "No restringir el aceite de oliva", calorias: "560", proteinas: "48", carbos: "42", grasas: "22" },
    },
    Martes: {
      desayuno: { food: "Pancakes de avena con mantequilla de maní + huevos + leche", notes: "4 pancakes, 2 cucharadas de maní", calorias: "640", proteinas: "44", carbos: "68", grasas: "20" },
      media:    { food: "Sándwich de pollo + queso + pan integral + fruta", notes: "2 rebanadas de pan, 150g pollo", calorias: "480", proteinas: "40", carbos: "52", grasas: "12" },
      almuerzo: { food: "Pasta integral con carne molida y salsa de tomate + ensalada", notes: "200g pasta cocida, 150g carne sin grasa", calorias: "700", proteinas: "52", carbos: "82", grasas: "14" },
      merienda: { food: "Arroz con leche + nueces + proteína", notes: "Merienda calórica pre-noche", calorias: "380", proteinas: "28", carbos: "48", grasas: "10" },
      cena:     { food: "Milanesa de res al horno + puré de papa + espárragos", notes: "Hornear, no freír", calorias: "580", proteinas: "50", carbos: "55", grasas: "16" },
    },
    Miércoles: {
      desayuno: { food: "Revuelto de 3 huevos + 100g avena + frutas variadas + leche", notes: "Día de piernas, cargar carbohidratos", calorias: "660", proteinas: "46", carbos: "78", grasas: "14" },
      media:    { food: "Batido con leche entera + avena + cacao + proteína", notes: "330ml leche, 60g avena, 1 scoop proteína", calorias: "500", proteinas: "40", carbos: "60", grasas: "10" },
      almuerzo: { food: "Arroz + frijoles + pollo entero + plátano frito (maduro)", notes: "Día de piernas, calorías altas necesarias", calorias: "750", proteinas: "54", carbos: "90", grasas: "14" },
      merienda: { food: "Batido de recuperación + plátano + granola", notes: "Post-sentadillas pesadas", calorias: "440", proteinas: "38", carbos: "58", grasas: "6" },
      cena:     { food: "Atún con arroz integral + vegetales al vapor + aceite de oliva", notes: "2 latas de atún, 150g arroz cocido", calorias: "520", proteinas: "50", carbos: "52", grasas: "12" },
    },
    Jueves: {
      desayuno: { food: "Tostadas con huevo + aguacate + jamón de pavo + zumo natural", notes: "3 tostadas, 2 huevos, ½ aguacate", calorias: "580", proteinas: "38", carbos: "58", grasas: "22" },
      media:    { food: "Yogur griego full fat + granola + frutos rojos + miel", notes: "200g yogur, 40g granola", calorias: "360", proteinas: "22", carbos: "48", grasas: "8" },
      almuerzo: { food: "Bistec de res + papa sancochada + ensalada completa", notes: "Día de brazos, menos carbos que en piernas", calorias: "640", proteinas: "56", carbos: "60", grasas: "18" },
      merienda: { food: "Batido de proteínas + leche + plátano", notes: "Post-entreno brazos", calorias: "360", proteinas: "38", carbos: "40", grasas: "4" },
      cena:     { food: "Pollo al horno con romero + quinua + brócoli con aceite", notes: "Cena proteica sin exceso de carbos", calorias: "520", proteinas: "50", carbos: "40", grasas: "16" },
    },
    Viernes: {
      desayuno: { food: "Bowl de avena caliente con proteína, nueces y miel", notes: "100g avena, 1 scoop proteína, 20g nueces", calorias: "620", proteinas: "44", carbos: "70", grasas: "16" },
      media:    { food: "Batido pre-entreno: avena + leche + plátano + proteína", notes: "Tomar 45 min antes de entrenar", calorias: "500", proteinas: "38", carbos: "62", grasas: "8" },
      almuerzo: { food: "Arroz con leche de coco + pollo thai + ensalada asiática", notes: "Día libre de elección de proteína", calorias: "680", proteinas: "50", carbos: "75", grasas: "16" },
      merienda: { food: "Batido de recuperación + barrita de proteínas", notes: "Sesión de espalda y pierna fue dura", calorias: "420", proteinas: "44", carbos: "42", grasas: "8" },
      cena:     { food: "Tortilla grande de 4 huevos con verduras + pan integral", notes: "Cena de fin de semana, más relajada", calorias: "480", proteinas: "38", carbos: "38", grasas: "18" },
    },
    Sábado: {
      desayuno: { food: "Desayuno completo: huevos, tocino de pavo, tostadas, fruta, leche", notes: "Desayuno fuerte de fin de semana", calorias: "720", proteinas: "48", carbos: "68", grasas: "24" },
      media:    { food: "Batido de frutas + proteína + mantequilla de maní", notes: "Día de hombros y cardio ligero", calorias: "440", proteinas: "36", carbos: "48", grasas: "10" },
      almuerzo: { food: "Caldo de res con papas + arroz blanco + lomo saltado", notes: "Comida peruana clásica de volumen", calorias: "780", proteinas: "56", carbos: "88", grasas: "18" },
      merienda: { food: "Arroz con leche + 1 plátano + café", notes: "Merienda calórica de recuperación", calorias: "360", proteinas: "12", carbos: "68", grasas: "5" },
      cena:     { food: "Pizza integral casera con pollo, queso y vegetales", notes: "Cena libre controlada del sábado", calorias: "580", proteinas: "44", carbos: "62", grasas: "16" },
    },
  },
};
