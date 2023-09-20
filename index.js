//@ts-check
import fs from "fs/promises";
import express from "express";

// Importa dbConnection si es necesario
// import { dbConnection } from "./database.js";

const nombresFemeninosOriginales = [
  "Candela",
  "Micaela",
  "Nazarena",
  "Brenda",
  "Johanna",
  "Cecilia",
  "Sofía",
  "Ayelén",
  "Alejandra",
  "Marcela",
  "Tatiana",
  "Soledad",
  "Griselda",
  "Kiara",
];

const nombresMasculinosOriginales = [
  "José",
  "Agustín",
  "Enzo",
  "Rodrigo",
  "Esteban",
  "Ramón",
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
  "Iván",
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

// ... (Continuar con los otros datos y funciones)

// Función principal para generar alumnos
function generarAlumno(usedDNIs) {
  // ... (Continuar con la lógica de generación de alumnos)
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

// Inicia la generación de alumnos
guardarAlumnos();

// ... (Continuar con la configuración de Express u otras funcionalidades)
