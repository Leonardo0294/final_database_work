import fs from "fs/promises";
import express from "express";

// Se asume que dbConection se importa desde "./database.js"

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

// Relaciones nombre genero
const DataNombresFemeninos = nombresFemeninosOriginales.map((nombre) => ({
  name: nombre,
  gender: "Femenino",
}));
const DataNombresMasculinos = nombresMasculinosOriginales.map((nombre) => ({
  name: nombre,
  gender: "Masculino",
}));

// Array de apellidos
const DataApellidos = [
  "Monzon",
  "Ibarra",
  "Servian",
  "Insaurralde",
  // Agregar más apellidos si es necesario
];

// Falta formular, aquí irán las unidades educativas, diferenciando entre primaria, secundario y terciario
const DataEstablecimientos = [
  // {
  //   name: "ESTABLECIMIENTO 1", type: Secundario
  //   name: "ESTABLECIMIENTO 2", type: Primario
  //   name: "ESTABLECIMIENTO 2", type: Terciario
  // },
  // Agregar lógica para asociar edades, alumnos y tipos según el establecimiento.
];

// Array de materias, primaria, secundaria y terciario respectivamente
const DataMaterias = {
  Primario: [
    { name: "MATEMÁTICAS" },
    { name: "LENGUA Y LITERATURA" },
    { name: "CIENCIAS SOCIALES" },
    { name: "CIENCIAS NATURALES" },
    { name: "INGLÉS" },
    // Agregar más materias si es necesario
  ],
  Secundario: [
    { name: "ALGEBRA Y ARITMÉTICA" },
    { name: "TECNOLOGÍA" },
    { name: "LENGUA Y LITERATURA" },
    { name: "ECONOMÍA" },
    { name: "QUÍMICA" },
    // Agregar más materias si es necesario
  ],
  Terciario: [
    { name: "BASE DE DATOS" },
    { name: "ALGORITMOS" },
    { name: "TALLER DE LENGUAJE DE PROGRAMACIÓN" },
    { name: "PROYECTO INTEGRADOR" },
    { name: "MATEMÁTICA APLICADA" },
    // Agregar más materias si es necesario
  ],
};

// Array de localidades, Formosa Argentina
const DataLocalidades = [
  { name: "Formosa Capital" },
  { name: "El Colorado" },
  { name: "Clorinda" },
  { name: "Laguna Blanca" },
  { name: "General Belgrano" },
  // Agregar más localidades si es necesario
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

// Array de barrios, respectivos para c/ localidad
const DataBarrios = {
  "Formosa Capital": [
    { name: "12 DE OCTUBRE", houses: 526 },
    { name: "2 DE ABRIL", houses: 1022 },
    { name: "BARRIO MILITAR", houses: 119 },
    // Agregar más barrios si es necesario
  ],
  // Agregar barrios para otras localidades si es necesario
};

// Array modalidades asignadas a partir del 4to año de secundaria
const DataModalidadesSecundaria = [
  { name: "Cs. Sociales" },
  { name: "Cs. Naturales" },
  { name: "Economía y Comercio" },
  { name: "Producción de Bienes y Servicios" },
];

// Función obtener elemento aleatorio
function obtenerElementoAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generar DNI como id.
function generarDNIaleatorio(usedDNIs) {
  let dni;
  do {
    dni = Math.floor(100000000 + Math.random() * 900000000);
  } while (usedDNIs.has(dni));
  usedDNIs.add(dni);
  return dni;
}

// Generador de edad y franjas etarias
function generarEdadAleatoria(nivel) {
  let edadMinima, edadMaxima;
  if (nivel === "Primario") {
    edadMinima = 6;
    edadMaxima = 11; // 6 años de primaria
  } else if (nivel === "Secundario") {
    edadMinima = 12; // Inicio de secundaria
    edadMaxima = 17; // Fin de secundaria
  } else {
    edadMinima = 18; // Inicio de terciario
    edadMaxima = 30; // Edad máxima de 30 años para terciario
  }
  return Math.floor(edadMinima + Math.random() * (edadMaxima - edadMinima + 1));
}

// Obtener barrio de los arrays de arriba, según localidad
function obtenerBarrioAleatorio(localidadName) {
  const barrios = DataBarrios[localidadName] || [];
  return barrios.length > 0
    ? obtenerElementoAleatorio(barrios).name
    : localidadName;
}

// Generador de domicilio, la estructura del objeto "domicilio", difiere según el tipo; "Edificio", "Vivienda", "Casa", respectivamente
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

// Función principal, generación de registro, unión de todas las otras funciones
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

// Función de guardado con FS
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

// Starter
guardarAlumnos();
