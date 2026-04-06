import T from "./theme";

export const weekData = [
  { d: "Lun", ing: 88,  egr: 65  },
  { d: "Mar", ing: 122, egr: 80  },
  { d: "Mié", ing: 96,  egr: 72  },
  { d: "Jue", ing: 138, egr: 98  },
  { d: "Vie", ing: 115, egr: 85  },
  { d: "Sáb", ing: 145, egr: 110 },
  { d: "Dom", ing: 108, egr: 78  },
];

export const monthData = Array.from({ length: 30 }, (_, i) => ({
  d: `${i + 1}`,
  ing: Math.floor(60 + Math.random() * 80),
  egr: Math.floor(40 + Math.random() * 55),
}));

export const plansPie = [
  { name: "Mensual",    value: 185, color: T.yellow   },
  { name: "Trimestral", value: 98,  color: "#888888"  },
  { name: "Semestral",  value: 120, color: "#444444"  },
  { name: "Anual",      value: 47,  color: "#2A2A2A"  },
];

export const initialUsers = [
  { id: 1,  name: "Carlos Pérez",   email: "carlos@gmail.com",  phone: "984-630-7723", plan: "Mensual",    start: "01/03/2025", end: "01/04/2025", daysLeft: 7,   born: "12/05/1990", status: "Activo" },
  { id: 2,  name: "Ana Gómez",      email: "ana@gmail.com",     phone: "994-553-7723", plan: "Trimestral", start: "15/01/2025", end: "15/04/2025", daysLeft: 21,  born: "08/09/1995", status: "Activo" },
  { id: 3,  name: "Luis Torres",    email: "luis@gmail.com",    phone: "984-953-7723", plan: "Mensual",    start: "01/03/2025", end: "01/04/2025", daysLeft: 7,   born: "22/11/1988", status: "Activo" },
  { id: 4,  name: "María Ruiz",     email: "maria@gmail.com",   phone: "994-653-7723", plan: "Anual",      start: "01/01/2025", end: "01/01/2026", daysLeft: 281, born: "03/07/1993", status: "Activo" },
  { id: 5,  name: "Laura Silva",    email: "laura@gmail.com",   phone: "994-453-7723", plan: "Semestral",  start: "01/10/2024", end: "01/04/2025", daysLeft: 7,   born: "15/03/1992", status: "Activo" },
  { id: 6,  name: "Jorge Lira",     email: "jorge@gmail.com",   phone: "974-950-7723", plan: "Semestral",  start: "01/10/2024", end: "07/04/2025", daysLeft: 13,  born: "28/12/1987", status: "Activo" },
  { id: 7,  name: "Pedro Martínez", email: "pedro@gmail.com",   phone: "984-123-7723", plan: "Mensual",    start: "01/03/2025", end: "31/03/2025", daysLeft: 2,   born: "19/06/1996", status: "Activo" },
  { id: 8,  name: "Sonia Ríos",     email: "sonia@gmail.com",   phone: "994-234-7723", plan: "Trimestral", start: "15/01/2025", end: "28/03/2025", daysLeft: 3,   born: "07/01/1991", status: "Activo" },
  { id: 9,  name: "Roberto Díaz",   email: "roberto@gmail.com", phone: "965-321-7723", plan: "Mensual",    start: "10/03/2025", end: "10/04/2025", daysLeft: 16,  born: "14/04/1985", status: "Activo" },
  { id: 10, name: "Carmen Vega",    email: "carmen@gmail.com",  phone: "987-456-7723", plan: "Anual",      start: "15/02/2025", end: "15/02/2026", daysLeft: 327, born: "30/08/1998", status: "Activo" },
];

export const initAttendance = [
  { name: "Carlos Pérez", time: "08:15 AM", date: "25/03/2025" },
  { name: "Ana Gómez",    time: "08:10 AM", date: "25/03/2025" },
  { name: "Luis Torres",  time: "07:45 AM", date: "25/03/2025" },
  { name: "María Ruiz",   time: "07:30 AM", date: "25/03/2025" },
  { name: "Laura Silva",  time: "07:20 AM", date: "25/03/2025" },
  { name: "Jorge Lira",   time: "07:05 AM", date: "25/03/2025" },
];

export const PLANS_CATALOG = [
  { name: "Mensual",    price: "S/. 70",  duration: "30 días",  color: T.yellow   },
  { name: "Trimestral", price: "S/. 185", duration: "90 días",  color: T.info     },
  { name: "Semestral",  price: "S/. 330", duration: "180 días", color: "#A78BFA"  },
  { name: "Anual",      price: "S/. 600", duration: "365 días", color: T.success  },
];
