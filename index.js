import fs from "fs/promises";
import { writeFile } from "fs/promises";
import express, { json } from "express";
import { dbConection } from "./database.js";

const nombresFemeninosOriginales = [
  "Candela",
  "Micaela",
  "Nazarena",
  "Brenda",
  "Johanna",
  "Cecilia",
  "Sofia",
  "Ayelen",
  "Alejandra",
  "Marcela",
  "Tatiana",
  "Soledad",
  "Griselda",
  "Kiara",
];

const nombresMasculinosOriginales = [
  "José",
  "Agustin",
  "Enzo",
  "Rodrigo",
  "Esteban",
  "Ramon",
  "Santiago",
  "Facundo",
  "Vicente",
  "Juan",
  "Maximiliano",
  "Ignacio",
  "Marcelo",
  "Daniel",
  "Lucas",
  "Arnaldo",
  "Ivan",
  "David",
  "Lionel",
  "Leandro",
  "Roberto",
  "Manuel",
  "Marcos",
  "Gabriel",
  "Leopoldo",
];

//Relaciones nombre genero
const DataNombresFemeninos = nombresFemeninosOriginales.map((nombre) => ({
  name: nombre,
  gender: "Femenino",
}));
const DataNombresMasculinos = nombresMasculinosOriginales.map((nombre) => ({
  name: nombre,
  gender: "Masculino",
}));

//Array de apellidos
const DataApellidos = [
  "Monzon",
  "Ibarra",
  "Servian",
  "Insaurralde",
  "Aquino",
  "Ramirez",
  "Duarte",
  "Acosta",
  "Meza",
  "Maza",
  "Diaz",
  "Tevez",
  "Larroza",
  "Puente",
  "Atienza",
  "Vega",
  "Ayala",
  "Torales",
  "Aguayo",
  "Garcia",
  "Sosa",
  "Gonzalez",
  "Caceres",
  "Aranda",
  "Basualdo",
  "Maldonado",
  "Echeverria",
  "Dellagnolo",
  "Benitez",
  "Caballero",
];

//falta formular, aqui iran las unidades educativas, diferenciando entre primaria, secundario y terciario
const DataEstablecimientos = [
  // {
  //   name: "ESTABLECIMIENTO 1", type: Secundario
  //   name: "ESTABLECIMIENTO 2", type: Primario
  //   name: "ESTABLECIMIENTO 2", type: Terciario
  // },
  //Agregar logica para asociar edades, alumnos y tipos segun el establecimiento.
];

//Array de materias, primaria, secundaria y terciario respectivamente
const DataMaterias = {
  Primario: [
    { name: "MATEMÁTICAS" },
    { name: "LENGUA Y LITERATURA" },
    { name: "CIENCIAS SOCIALES" },
    { name: "CIENCIAS NATURALES" },
    { name: "INGLES" },
    { name: "PLASTICA Y ARTISTICA" },
    { name: "EDUCACION FISICA" },
    { name: "GEOGRAFIA" },
  ],
  Secundario: [
    { name: "ALGEBRA Y ARITMETICA" },
    { name: "TECNOLOGIA" },
    { name: "LENGUA Y LITERATURA" },
    { name: "ECONOMIA" },
    { name: "QUIMICA" },
    { name: "FISICA" },
    { name: "INGLES" },
    { name: "PLASTICA Y ARTISTICA" },
    { name: "BIOLOGIA" },
    { name: "HISTORIA CONTEMPORANEA" },
    { name: "EDUCACION FISICA" },
    { name: "ETICA Y CIUDADANIA" },
  ],
  Terciario: [
    { name: "BASE DE DATOS" },
    { name: "ALGORITMOS" },
    { name: "TALLER DE LENGUAJE DE PROGRAMACION" },
    { name: "PROYECTO INTEGRADOR" },
    { name: "MATEMATICA APLICADA" },
    { name: "VALORES CIUDADANOS" },
    { name: "INGLES" },
    { name: "MINERIA DE DATOS" },
    { name: "ARQUITECTURA Y SO" },
    { name: "TECNOLOGIA Y SOCIEDAD" },
  ],
};

//Array de localidades, Formosa Argentina
const DataLocalidades = [
  { name: "Formosa Capital" },
  { name: "El Colorado" },
  { name: "Clorinda" },
  { name: "Laguna Blanca" },
  { name: "General Belgrano" },
];
const planes = [
  {
    nombre: "Ciclo Básico Secundario",
    fechaInicio: "2003-03-01",
    materias: DataMaterias.Secundario,
  },
  {
    nombre: "Ciclo Básico Secundario Rural",
    fechaInicio: "2003-03-01",
    materias: DataMaterias.Secundario,
  },
];

//Array de barrios, respectivos para c/ localidad
const DataBarrios = {
  "Formosa Capital": [
    { name: "12 DE OCTUBRE", houses: 526 },
    { name: "2 DE ABRIL", houses: 1022 },
    { name: "BARRIO MILITAR", houses: 119 },
    { name: "OBRERO", houses: 1401 },
    { name: "BARRIO VIAL", houses: 958 },
    { name: "DON BOSCO", houses: 1606 },
    { name: "EL MISTOL", houses: 98 },
    { name: "EL RESGUARDO", houses: 513 },
    { name: "MANUEL BELGRANO", houses: 71 },
    { name: "EMILIO TOMAS", houses: 340 },
    { name: "EVA PERÓN", houses: 2200 },
    { name: "GUADALUPE", houses: 1435 },
    { name: "INDEPENDENCIA", houses: 1462 },
    { name: "J.F. KENNEDY", houses: 90 },
    { name: "JUAN D. PERÓN", houses: 1143 },
    { name: "LA FLORESTA", houses: 831 },
    { name: "LAS DELICIAS", houses: 213 },
    { name: "LIBORSI", houses: 714 },
    { name: "MARIANO MORENO", houses: 1636 },
    { name: "NANQOM", houses: 433 },
    { name: "SAN AGUSTÍN", houses: 780 },
    { name: "SAN FRANCISCO", houses: 2222 },
    { name: "SAN JOSÉ OBRERO", houses: 741 },
    { name: "SAN MARTÍN", houses: 3814 },
    { name: "SAN MIGUEL", houses: 1333 },
    { name: "SAN PEDRO", houses: 743 },
    { name: "SANTA ROSA", houses: 421 },
    { name: "SIMÓN BOLIVAR", houses: 2161 },
    { name: "VENEZUELA", houses: 619 },
    { name: "VILLA DEL ROSARIO", houses: 1106 },
    { name: "VILLA HERMOSA", houses: 505 },
    { name: "VILLA LA PILAR", houses: 954 },
    { name: "VILLA LOURDES", houses: 1244 },
    { name: "VIRGEN DE LUJÁN", houses: 316 },
    { name: "LA ESPERANZA", houses: 180 },
    { name: "7 DE MAYO", houses: 368 },
    { name: "ANTENOR GAUNA", houses: 1069 },
    { name: "1° DE MAYO", houses: 184 },
    { name: "EL PORVENIR", houses: 352 },
    { name: "BERNARDINO RIVADAVIA", houses: 890 },
    { name: "VIRGEN DE ITATÍ", houses: 782 },
    { name: "PARQUE INDUSTRIAL", houses: 27 },
    { name: "SAN JUAN BAUTISTA", houses: 671 },
    { name: "16 DE JULIO", houses: 73 },
    { name: "SAG. CORAZÓN DE MARÍA", houses: 100 },
    { name: "ARTURO ILLIA", houses: 935 },
    { name: "HIPÓLITO IRIGOYEN", houses: 193 },
    { name: "SAN CAYETANO", houses: 217 },
    { name: "FACUNDO QUIROGA", houses: 82 },
    { name: "SAN ANDRES", houses: 177 },
    { name: "SANTA LUCÍA", houses: 101 },
    { name: "LA VIRGEN NIÑA", houses: 184 },
    { name: "17 DE OCTUBRE", houses: 123 },
    { name: "LIBERTAD", houses: 129 },
    { name: "ISLAS MALVINAS", houses: 197 },
    { name: "COLLUCCIO", houses: 443 },
    { name: "SAN ISIDRO LABRADOR", houses: 396 },
    { name: "ROBERTO SOTELO", houses: 133 },
    { name: "8 DE MARZO", houses: 226 },
    { name: "CO.VI.FOL.", houses: 124 },
    { name: "FONTANA", houses: 1232 },
    { name: "SOLANO LIMA", houses: 217 },
    { name: "LA ESTRELLA", houses: 53 },
    { name: "20 de JULIO", houses: 225 },
    { name: "REPÚBLICA ARGENTINA", houses: 1895 },
    { name: "8 DE OCTUBRE", houses: 344 },
    { name: "EL QUEBRANTO", houses: 152 },
    { name: "EL QUEBRACHITO", houses: 450 },
    { name: "EL PALOMAR", houses: 493 },
    { name: "STELLA MARIS", houses: 216 },
    { name: "LOS INMIGRANTES", houses: 112 },
    { name: "LAS ORQUIDEAS", houses: 275 },
    { name: "Dr. RICARDO BALBÍN", houses: 170 },
    { name: "SAN JUAN", houses: 316 },
    { name: "SAN ANTONIO", houses: 454 },
    { name: "PARQUE URBANO", houses: 522 },
    { name: "ARTURO ILLIA II", houses: 670 },
    { name: "YAPEYÚ", houses: 536 },
    { name: "8 DE OCTUBRE BIS", houses: 234 },
    { name: "CARACOLITO", houses: 278 },
    { name: "CONO SUR", houses: 182 },
    { name: "EL PALMAR", houses: 268 },
    { name: "EL PUCÚ", houses: 321 },
    { name: "EL TIMBÓ I", houses: 156 },
    { name: "EL TIMBÓ II", houses: 299 },
    { name: "EVITA", houses: 205 },
    { name: "FEDERACIÓN", houses: 221 },
    { name: "FLEMING", houses: 169 },
    { name: "GUAYAIBÍ", houses: 304 },
    { name: "ITATÍ I", houses: 150 },
    { name: "ITATÍ II", houses: 277 },
    { name: "JUAN MANUEL DE ROSAS", houses: 189 },
    { name: "LA PAZ", houses: 253 },
    { name: "MALVINAS", houses: 212 },
    { name: "NUEVA FORMOSA", houses: 184 },
    { name: "NUEVA POMPEYA", houses: 322 },
    { name: "PARQUE URBANO I", houses: 305 },
    { name: "PARQUE URBANO II", houses: 185 },
    { name: "SAN PÍO X", houses: 257 },
    { name: "SAN JOSÉ OBRERO", houses: 311 },
    { name: "SARMIENTO", houses: 278 },
    { name: "URUNDAY", houses: 226 },
    { name: "VILLA JARDÍN", houses: 300 },
    { name: "VIRGEN DEL CARMEN", houses: 245 },
    { name: "VIRGEN NUESTRA SEÑORA DEL PILAR", houses: 178 },
    { name: "LOTE 4", houses: 158 },
    { name: "LUJAN", houses: 274 },
    { name: "ZONA RURAL", houses: 783 },
  ],
  Colorado: [
    { name: "CENTRO", houses: 287 },
    { name: "OBRERO", houses: 384 },
    { name: "SAN MIGUEL", houses: 431 },
    { name: "SAN FRANCISCO", houses: 308 },
  ],
  "General Belgrano": [
    { name: "CENTRO", houses: 391 },
    { name: "40 VIVIENDAS", houses: 492 },
    { name: "12 DE OCTUBRE", houses: 359 },
  ],
  "Laguna Blanca": [
    { name: "CENTRO", houses: 406 },
    { name: "SAN JUAN", houses: 481 },
    { name: "SAN MIGUEL", houses: 532 },
    { name: "BELGRANO", houses: 357 },
  ],
  Clorinda: [
    { name: "CENTRO", houses: 512 },
    { name: "25 DE MAYO", houses: 401 },
    { name: "LIBERTAD", houses: 535 },
    { name: "PORTEÑO NORTE", houses: 296 },
    { name: "240 VIVIENDAS", houses: 452 },
  ],
};

//Array modalidades asignadas a partir del 4to año de secundaria
const DataModalidadesSecundaria = [
  {
    name: "Cs. Sociales",
    materias: [
      { name: "Historia" },
      { name: "Geografía" },
      { name: "Sociología" },
      // Agrega las materias específicas para Cs. Sociales aquí
    ],
  },
  {
    name: "Cs. Naturales",
    materias: [
      { name: "Biología" },
      { name: "Química" },
      { name: "Física" },
      // Agrega las materias específicas para Cs. Naturales aquí
    ],
  },
  {
    name: "Economía y Comercio",
    materias: [
      { name: "Economía" },
      { name: "Contabilidad" },
      { name: "Marketing" },
      // Agrega las materias específicas para Economía y Comercio aquí
    ],
  },
  {
    name: "Producción de Bienes y Servicios",
    materias: [
      { name: "Tecnología de la Producción" },
      { name: "Gestión de la Calidad" },
      { name: "Logística" },
      // Agrega las materias específicas para Producción de Bienes y Servicios aquí
    ],
  },
];


//Funcion obtener elemento aleatorio
function obtenerElementoAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//Generar DNI como id.
function generarDNIaleatorio(usedDNIs) {
  let dni;
  do {
    dni = Math.floor(100000000 + Math.random() * 900000000);
  } while (usedDNIs.has(dni));
  usedDNIs.add(dni);
  return dni;
}

//Generador de edad y franjas etarias
function generarEdadAleatoria(nivel) {
  let edadMinima, edadMaxima;
  if (nivel === "Primaria") {
    edadMinima = 6;
    edadMaxima = 11; // 6 años de primaria
  } else if (nivel === "Secundaria") {
    edadMinima = 12; // Inicio de secundaria
    edadMaxima = 17; // Fin de secundaria
  } else {
    edadMinima = 18; // Inicio de terciario
    edadMaxima = 30;
  }
  return Math.floor(edadMinima + Math.random() * (edadMaxima - edadMinima + 1));
}

//Obtener barrio de los array de arriba, segun localidad
function obtenerBarrioAleatorio(localidadName) {
  const barrios = DataBarrios[localidadName] || [];
  return barrios.length > 0
    ? obtenerElementoAleatorio(barrios).name
    : localidadName;
}

//Generador de domicilio, la estructura del objeto "domicilio", difiere segun el tipo; "Edificio", "Vivienda", "Casa", respectivamente
function generarDomicilio(localidadName) {
  const domicilio = { calle: `Calle ${Math.floor(Math.random() * 100) + 1}` };
  if (localidadName === "Formosa Capital") {
    const tiposDomicilio = ["Edificio", "Vivienda", "Casa"];
    const tipo = obtenerElementoAleatorio(tiposDomicilio);

    if (tipo === "Edificio") {
      domicilio.tipo = "Edificio";
      domicilio.piso = Math.floor(Math.random() * 20) + 1;
      domicilio.depto = Math.floor(Math.random() * 10) + 1;
    } else if (tipo === "Vivienda") {
      domicilio.tipo = "Vivienda";
      domicilio.manzana = Math.floor(Math.random() * 20) + 1;
      domicilio.casa = Math.floor(Math.random() * 100) + 1;
    } else {
      domicilio.tipo = "Casa";
      domicilio.casa = Math.floor(Math.random() * 100) + 1;
    }
    domicilio.barrio = obtenerBarrioAleatorio(localidadName);
  } else {
    domicilio.tipo = "Casa";
    domicilio.casa = Math.floor(Math.random() * 100) + 1;
    domicilio.barrio = obtenerBarrioAleatorio(localidadName);
  }
  return domicilio;
}

//funcion principal, generacion de registro, union de todas las otras funciones
function generarAlumno(usedDNIs) {
  const nombreMasculino = obtenerElementoAleatorio(DataNombresMasculinos);
  const nombreFemenino = obtenerElementoAleatorio(DataNombresFemeninos);

  const nombre =
    Math.random() < 0.5 ? nombreMasculino.name : nombreFemenino.name;

  const genero = nombre === nombreMasculino.name ? "Masculino" : "Femenino";

  const apellido = obtenerElementoAleatorio(DataApellidos);
  const localidad = obtenerElementoAleatorio(DataLocalidades);
  const dni = generarDNIaleatorio(usedDNIs);
  const edad = generarEdadAleatoria();

  const nivel =
    Math.random() < 0.3
      ? "Terciario"
      : Math.random() < 0.5
      ? "Primaria"
      : "Secundaria";

  const grado = Math.floor(Math.random() * (nivel === "Primaria" ? 6 : 7)) + 1;
  const gradoAño = nivel === "Primaria" ? "Grado" : "Año";
  const modalidad =
    nivel === "Secundaria" &&
    grado > 3 &&
    obtenerElementoAleatorio(DataModalidadesSecundaria);

  const cantidadMaterias =
    nivel === "Primaria" ? 8 : nivel === "Secundaria" ? 12 : 8;

  const notas = {};
  for (let j = 1; j <= cantidadMaterias; j++) {
    notas[`Materia${j}`] = Math.floor(Math.random() * 10) + 1;
  }

  const establecimiento = {
    codigo: nivel === "Primaria" ? 102 : nivel === "Secundaria" ? 103 : 115,
    nombre: `Escuela ${dni}`,
  };

  const domicilio = generarDomicilio(localidad.name);
  // Generar el año de cursada aleatoriamente entre 2018 y 2019
  const añoCursada = Math.random() < 0.5 ? 2018 : 2019;
  return {
    _id: dni,
    nombres: nombre,
    apellidos: apellido,
    genero: genero,
    localidad: localidad,
    domicilio: domicilio,
    edad: edad,
    nivel: nivel,
    [gradoAño]: grado,
    modalidad: modalidad,
    notas: notas,
    establecimiento: establecimiento,
    añoCursada: añoCursada,
  };
}

//Funcion de guardado con FS
async function guardarAlumnos() {
  const usedDNIs = new Set();
  const alumnos = [];

  for (let i = 0; i < 10000; i++) {
    alumnos.push(generarAlumno(usedDNIs));
  }

  try {
    await fs.writeFile("alumnosformosa.json", JSON.stringify(alumnos, null, 2));
    console.log(
      "Los datos de los estudiantes han sido generados y almacenados exitosamente en un archivo llamado 'alumnos.json' en formato JSON."
    );
  } catch (error) {
    console.error("Ocurrió un error al guardar los alumnos:", error.message);
  }
}

//Starter
guardarAlumnos();
