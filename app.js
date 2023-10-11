//@ts-check
import fs from "fs/promises";
import { writeFile } from "fs/promises";
import { nombresFemeninosOriginales, nombresMasculinosOriginales, DataApellidos } from "./nombres.js";
import { DataLocalidades, DataBarrios, DataBarriosRurales, DataLocalidadesRurales, DataCalles, DataCallesRurales } from "./localidades.js";
import { DataModalidadesSecundaria } from "./modalidades.js";
import { DataMateriasModalidades } from "./orientaciones.js"
// import { DataMaterias } from "./materias-old.js";
import establecimientosLocalidad from "./establecimientos.js";
// import DataCarreras from "./carreras.js";
import carrerasMaterias from "./materiasCarreras.js";

//Gracias Taquini por la inspiración
//Gracias Puche por el modelo
//esquema basico, faltan datos
//Creo que funciona medianamente bien, hacer fork cualquier cosa, se aceptan suggestions

//Relaciones nombre genero
const DataNombresFemeninos = nombresFemeninosOriginales.map((nombre) => ({
  name: nombre,
  gender: "Femenino",
}));
const DataNombresMasculinos = nombresMasculinosOriginales.map((nombre) => ({
  name: nombre,
  gender: "Masculino",
}));

function obtenerElementoAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generarDNIaleatorio(level, age, iterador) {
  let dni;
  
    if (level === "Jardin") {
      dni = 56000000 + (iterador * 250) + randomNumbers(1, 99)
    } else if (level === "Primaria") {
      dni = 50000000 + (iterador * 250) + randomNumbers(1, 99)
    } else if (level === "Secundaria") {
      dni = 45000000 + (iterador * 250) + randomNumbers(1, 99)
    } else if (age < 25) {
      dni = 40000000 + (iterador * 250) + randomNumbers(1, 99)
    } else if (age < 40) {
      dni = 30000000 + (iterador * 250) + randomNumbers(1, 99)
    } else {
      dni = 25000000 + (iterador * 250) + randomNumbers(1, 99)
    }

  return dni;
}

function randomNumbers (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarEdadAleatoria(nivel) {
  let edadMinima, edadMaxima;
  if (nivel === "Jardin") {
    edadMinima = 4;
    edadMaxima = 5; 
  } else if(nivel === "Primaria") {
    edadMinima = 6;
    edadMaxima = 11; // 6 años de primaria
  } else if (nivel === "Secundaria") {
    edadMinima = 12; // Inicio de secundaria
    edadMaxima = 18; // Fin de secundaria
  } else {
    edadMinima = 19; // Inicio de terciario
    edadMaxima = 60;
  }
  let edadAleatoria = randomNumbers(edadMinima, edadMaxima)
  return edadAleatoria
}

function obtenerBarrioAleatorio(localidadName) {
  const barrios = DataBarrios[localidadName] || [];
  return barrios.length > 0
    ? obtenerElementoAleatorio(barrios).name
    : localidadName;
}

function obtenerBarrioRuralAleatorio(localidadName) {
  const barrios = DataBarriosRurales[localidadName] || [];
  return barrios.length > 0
    ? obtenerElementoAleatorio(barrios).name
    : localidadName;
}

function generarDomicilioRural(localidadName) {
  const domicilio = { calle: `Calle ${randomNumbers(1, 25)}` }

  domicilio.tipo = "Casa"
  domicilio.casa = randomNumbers(1, 25)
  domicilio.barrio = obtenerBarrioRuralAleatorio(localidadName)

  return domicilio
}

function generarDomicilio(localidadName, ambito) {
  const domicilio = {};
  let barrio = {};

  if (ambito === "Urbano") {
    barrio = DataBarrios[localidadName][randomNumbers(0, DataBarrios[localidadName].length - 1)]
    const calle = DataCalles[localidadName][barrio.name][randomNumbers(0, DataCalles[localidadName][barrio.name].length - 1)]
    domicilio.calle = calle
  } else {
    barrio = DataBarriosRurales[localidadName][randomNumbers(0, DataBarriosRurales[localidadName].length - 1)]
    domicilio.calle = DataCallesRurales[localidadName][randomNumbers(0, DataCallesRurales[localidadName].length - 1)]
  }

  domicilio.barrio = barrio.name


  if (barrio.name === "GUADALUPE") {
    domicilio.tipo = "Departamento"
    domicilio.torre = randomNumbers(1, 200)
    domicilio.dpto = randomNumbers(1, 100)
  } else {
    domicilio.tipo = "Casa"
    domicilio.casa = randomNumbers(1, barrio.houses)
  }

  return domicilio;
}

function generarTutor (apellidoAlumno) {
  const nombreTutorMasculino = obtenerElementoAleatorio(DataNombresMasculinos);
  const nombreTutorFemenino = obtenerElementoAleatorio(DataNombresFemeninos);

  const nombreTutor = Math.random() < 0.5 ? nombreTutorMasculino.name : nombreTutorFemenino.name;

  const apellidoAleatorio = obtenerElementoAleatorio(DataApellidos)

  const apellidoTutor = Math.random() > 0.95 ? 
      apellidoAleatorio :
      apellidoAlumno

  return {
    nombre: nombreTutor,
    apellido: apellidoTutor
  }
}

function generarFechaNacimiento (edad) {
  const año = 2023 - edad
  const mes = randomNumbers(1, 9)
  const dia = randomNumbers(1, 28)

  let nacimiento = `${dia}/${mes}/${año}`
  
  return nacimiento
}

const planJardin = {
  nombre: "Nivel Inicial",
  materias: [
    "Nota"
  ]
}

const planPrimaria = {
  nombre: 'Nivel Primaria',
  materias: [
    'Matemática',
    'Lengua',
    'Ciencias Sociales',
    'Ciencias Naturales'
  ]
}

const planSecundaria = {
  nombre: 'Ciclo Básico Secundario',
  materias: [
    'Matemática',
    'Lengua',
    'Biología',
    'Ciencias Físco-Químicas',
    'Formación Ética y Ciudadana',
    'Lengua Extranjera',
    'Geografía',
    'Historia',
    'Lenguaje Artístico Combinado',
    'Tecnología',
    'Educación Física',
    'Opción Institucional'
  ]
}

const planSecundariaRural = {
  nombre: "Ciclo Básico Secundario Rural",
        materias: [
          "Matemáticas",
          "Ciencias Naturales",
          "Lengua y Literatura",
          "Historia y Ciencias Sociales",
          "Educación Física",
          "Educación Artística",
          "Tecnología y Agricultura",
          "Informática Rural",
          "Ética y Ciudadanía",
          "Orientación Vocacional Rural"
        ]
}

function generarAlumno(numberAlumno) {
  const nombreMasculino = obtenerElementoAleatorio(DataNombresMasculinos);
  const segundoNombreMasculino = obtenerElementoAleatorio(DataNombresMasculinos);
  const nombreFemenino = obtenerElementoAleatorio(DataNombresFemeninos);
  const segundoNombreFemenino = obtenerElementoAleatorio(DataNombresFemeninos);

  const numNombre = Math.random()

  const nombre =
    numNombre < 0.5 ? nombreMasculino.name : nombreFemenino.name;
  
  const segundoNombre =
    numNombre < 0.5 ? segundoNombreMasculino.name : segundoNombreFemenino.name;

  const genero = nombre === nombreMasculino.name ? "Masculino" : "Femenino";

  const apellido = obtenerElementoAleatorio(DataApellidos);

  const localidad = obtenerElementoAleatorio(DataLocalidades);

  let nacionalidadNumero = Math.random()
  const nacionalidad = 
    nacionalidadNumero < 0.94 ? "Argentina" :
    nacionalidadNumero < 0.98 ? "Paraguay" :
    nacionalidadNumero < 0.99 ? "Brasil" :
    nacionalidadNumero < 0.995 ? "Bolivia" : "Uruguay"
  
  const nivel =
  Math.random() < 0.1
  ? "Jardin"
  : Math.random() < 0.3
  ? "Terciario"
  : Math.random() < 0.5
  ? "Primaria"
  : "Secundaria";

  const codNivelEducativo = 
    nivel === "Jardin" ? 101 :
    nivel === "Primaria" ? 102 :
    nivel === "Secundaria" ? 110 : 115 
  
  const edad = generarEdadAleatoria(nivel);
  const dni = generarDNIaleatorio(nivel, edad, numberAlumno);
  const nacimiento = generarFechaNacimiento(edad);
  
  const grado = 
    nivel === "Primaria" ? edad - 5 : 
    nivel === "Secundaria" ? edad - 11 :
    edad < 20 ? edad - 17 :
    randomNumbers(1, 3)

  const gradoAño = nivel === "Primaria" ? "Grado" : "Año";
  const modalidad =
    (nivel === "Secundaria" && grado > 3) ?
    obtenerElementoAleatorio(DataModalidadesSecundaria): null

  function establecimientoAleatorio (local) {
    const esta = establecimientosLocalidad[local.toLowerCase()][nivel]
    const nro = randomNumbers(0, esta.length - 1)

    const establecimiento = esta[nro].name
    return establecimiento
  }

  const establecimiento = establecimientoAleatorio(localidad.name)

  const carrera = 
    nivel === "Jardin" ? planJardin : 
    (nivel === "Secundaria" && modalidad !== null) ? 
    DataMateriasModalidades[modalidad.name][randomNumbers(0, DataMateriasModalidades[modalidad.name].length - 1)] : 
    nivel === "Secundaria" ? planSecundaria : 
    nivel === "Primaria" ? planPrimaria : carrerasMaterias[randomNumbers(17, carrerasMaterias.length - 1)] 
  
  const añoIngreso = 
    edad === 4 ? 2023 :
    edad === 5 ? 2022 :
    2023 - (grado - 1)
  
  const mesIngreso = randomNumbers(2, 3)
  const diaIngreso = randomNumbers(1, 9)

  const dataCarrera = { 
    nombre: carrera.nombre, 
    notas: {}, 
    establecimiento: establecimiento,
    codNivelEducativo: codNivelEducativo,
    ambito: "Urbano",
    ingreso: `0${diaIngreso}/0${mesIngreso}/${añoIngreso}`
  }

  if ( nivel === "Jardin" && edad === 4 ) {
    dataCarrera.notas["2023"] = {}
    dataCarrera.notas["2023"].estado = "Aprobado"
  } else if ( nivel === "Jardin" ) {
    dataCarrera.notas["2022"] = {}
    dataCarrera.notas["2023"] = {}
    dataCarrera.notas["2022"].estado = "Aprobado"
    dataCarrera.notas["2023"].estado = "Aprobado"
  } else if (grado !== 1) {
    dataCarrera.notas["2022"] = {}
    dataCarrera.notas["2023"] = {}
    if (nivel === "Terciario") {
      carrera.materias.forEach(materia => {
        dataCarrera.notas["2022"][materia] = {}
        dataCarrera.notas["2022"][materia].primerCuatrimestre = randomNumbers(1, 10)
        dataCarrera.notas["2022"][materia].segundoCuatrimestre = randomNumbers(1, 10)

        let auxiliar = 
          dataCarrera.notas["2022"][`${materia}`].primerCuatrimestre +
          dataCarrera.notas["2022"][`${materia}`].segundoCuatrimestre 

          dataCarrera.notas["2022"][`${materia}`].promedio = Math.floor(auxiliar / 2)
          dataCarrera.notas["2022"][`${materia}`].recuperatorio = null
          dataCarrera.notas["2022"][`${materia}`].notaFinal = dataCarrera.notas["2022"][`${materia}`].promedio

        if ( dataCarrera.notas["2022"][`${materia}`].promedio < 6 ) {
          dataCarrera.notas["2022"][`${materia}`].recuperatorio = randomNumbers(6, 10)
          dataCarrera.notas["2022"][`${materia}`].notaFinal = dataCarrera.notas["2022"][`${materia}`].recuperatorio
        }
      })
      carrera.materias.forEach(materia => {
        dataCarrera.notas["2023"][`${materia} II`] = {}
        dataCarrera.notas["2023"][`${materia} II`].primerCuatrimestre = randomNumbers(1, 10)
        dataCarrera.notas["2023"][`${materia} II`].segundoCuatrimestre = randomNumbers(1, 10)
      
        let auxiliar = 
          dataCarrera.notas["2023"][`${materia} II`].primerCuatrimestre +
          dataCarrera.notas["2023"][`${materia} II`].segundoCuatrimestre 

          dataCarrera.notas["2023"][`${materia} II`].promedio = Math.floor(auxiliar / 2)
          dataCarrera.notas["2023"][`${materia} II`].recuperatorio = null
          dataCarrera.notas["2023"][`${materia} II`].notaFinal = dataCarrera.notas["2023"][`${materia} II`].promedio

        if ( dataCarrera.notas["2023"][`${materia} II`].promedio < 6 ) {
          dataCarrera.notas["2023"][`${materia} II`].recuperatorio = randomNumbers(6, 10)
          dataCarrera.notas["2023"][`${materia} II`].notaFinal = dataCarrera.notas["2023"][`${materia} II`].recuperatorio
        }
      })
    } else {
      carrera.materias.forEach(materia => {
        dataCarrera.notas["2022"][materia] = {}
        dataCarrera.notas["2022"][materia].primerTrimestre = randomNumbers(1, 10)
        dataCarrera.notas["2022"][materia].segundoTrimestre = randomNumbers(1, 10)
        dataCarrera.notas["2022"][materia].tercerTrimestre = randomNumbers(1, 10)

        let auxiliar = 
          dataCarrera.notas["2022"][`${materia}`].primerTrimestre +
          dataCarrera.notas["2022"][`${materia}`].segundoTrimestre +
          dataCarrera.notas["2022"][`${materia}`].tercerTrimestre 

          dataCarrera.notas["2022"][`${materia}`].promedio = Math.floor(auxiliar / 3)
          dataCarrera.notas["2022"][`${materia}`].recuperatorio = null
          dataCarrera.notas["2022"][`${materia}`].notaFinal = dataCarrera.notas["2022"][`${materia}`].promedio

        if ( dataCarrera.notas["2022"][`${materia}`].promedio < 6 ) {
          dataCarrera.notas["2022"][`${materia}`].recuperatorio = randomNumbers(6, 10)
          dataCarrera.notas["2022"][`${materia}`].notaFinal = dataCarrera.notas["2022"][`${materia}`].recuperatorio
        }
      })
      carrera.materias.forEach(materia => {
        dataCarrera.notas["2023"][`${materia} II`] = {}
        dataCarrera.notas["2023"][`${materia} II`].primerTrimestre = randomNumbers(1, 10)
        dataCarrera.notas["2023"][`${materia} II`].segundoTrimestre = randomNumbers(1, 10)
        dataCarrera.notas["2023"][`${materia} II`].tercerTrimestre = randomNumbers(1, 10)
      
        let auxiliar = 
          dataCarrera.notas["2023"][`${materia} II`].primerTrimestre +
          dataCarrera.notas["2023"][`${materia} II`].segundoTrimestre +
          dataCarrera.notas["2023"][`${materia} II`].tercerTrimestre 

          dataCarrera.notas["2023"][`${materia} II`].promedio = Math.floor(auxiliar / 3)
          dataCarrera.notas["2023"][`${materia} II`].recuperatorio = null
          dataCarrera.notas["2023"][`${materia} II`].notaFinal = dataCarrera.notas["2023"][`${materia} II`].promedio

        if ( dataCarrera.notas["2023"][`${materia} II`].promedio < 6 ) {
          dataCarrera.notas["2023"][`${materia} II`].recuperatorio = randomNumbers(6, 10)
          dataCarrera.notas["2023"][`${materia} II`].notaFinal = dataCarrera.notas["2023"][`${materia} II`].recuperatorio
        }
    })
  }
  } else if (grado === 1) {
    dataCarrera.notas["2023"] = {}
    if (nivel === "Terciario") {
      carrera.materias.forEach(materia => {
        dataCarrera.notas["2023"][`${materia}`] = {}
        dataCarrera.notas["2023"][`${materia}`].primerCuatrimestre = randomNumbers(1, 10)
        dataCarrera.notas["2023"][`${materia}`].segundoCuatrimestre = randomNumbers(1, 10)
        
        let auxiliar = 
          dataCarrera.notas["2023"][`${materia}`].primerCuatrimestre +
          dataCarrera.notas["2023"][`${materia}`].segundoCuatrimestre

          dataCarrera.notas["2023"][`${materia}`].promedio = Math.floor(auxiliar / 2)
          dataCarrera.notas["2023"][`${materia}`].recuperatorio = null
          dataCarrera.notas["2023"][`${materia}`].notaFinal = dataCarrera.notas["2023"][`${materia}`].promedio
  
        if ( dataCarrera.notas["2023"][`${materia}`].promedio < 6 ) {
          dataCarrera.notas["2023"][`${materia}`].recuperatorio = randomNumbers(6, 10)
          dataCarrera.notas["2023"][`${materia}`].notaFinal = dataCarrera.notas["2023"][`${materia}`].recuperatorio
        }
      })
    } else {
      carrera.materias.forEach(materia => {
        dataCarrera.notas["2023"][`${materia}`] = {}
        dataCarrera.notas["2023"][`${materia}`].primerTrimestre = randomNumbers(1, 10)
        dataCarrera.notas["2023"][`${materia}`].segundoTrimestre = randomNumbers(1, 10)
        dataCarrera.notas["2023"][`${materia}`].tercerTrimestre = randomNumbers(1, 10)
        
        let auxiliar = 
          dataCarrera.notas["2023"][`${materia}`].primerTrimestre +
          dataCarrera.notas["2023"][`${materia}`].segundoTrimestre +
          dataCarrera.notas["2023"][`${materia}`].tercerTrimestre 
  
          dataCarrera.notas["2023"][`${materia}`].promedio = Math.floor(auxiliar / 3)
          dataCarrera.notas["2023"][`${materia}`].recuperatorio = null
          dataCarrera.notas["2023"][`${materia}`].notaFinal = dataCarrera.notas["2023"][`${materia}`].promedio
  
        if ( dataCarrera.notas["2023"][`${materia}`].promedio < 6 ) {
          dataCarrera.notas["2023"][`${materia}`].recuperatorio = randomNumbers(6, 10)
          dataCarrera.notas["2023"][`${materia}`].notaFinal = dataCarrera.notas["2023"][`${materia}`].recuperatorio
        }
      })
    }
  }

  const domicilio = generarDomicilio(localidad.name, "Urbano");

  const tutor = generarTutor(apellido)

  return {
    _id: dni,
    nombres: nombre,
    segundoNombre: segundoNombre,
    apellidos: apellido,
    DNI: dni,
    nacionalidad: nacionalidad,
    genero: genero,
    localidad: localidad,
    domicilio: domicilio,
    nacimiento: nacimiento,
    edad: edad,
    nivel: nivel,
    [gradoAño]: nivel === "Jardin" ? 1 : grado,
    modalidad: modalidad,
    carrera: dataCarrera,
    tutor: tutor
  };
}

function generarAlumnoRural(numberAlumno) {
  const nombreMasculino = obtenerElementoAleatorio(DataNombresMasculinos);
  const segundoNombreMasculino = obtenerElementoAleatorio(DataNombresMasculinos);
  const nombreFemenino = obtenerElementoAleatorio(DataNombresFemeninos);
  const segundoNombreFemenino = obtenerElementoAleatorio(DataNombresFemeninos);

  const numNombre = Math.random()

  const nombre =
    numNombre < 0.5 ? nombreMasculino.name : nombreFemenino.name;
  
  const segundoNombre =
    numNombre < 0.5 ? segundoNombreMasculino.name : segundoNombreFemenino.name;

  const genero = nombre === nombreMasculino.name ? "Masculino" : "Femenino";

  const apellido = obtenerElementoAleatorio(DataApellidos);

  const localidad = obtenerElementoAleatorio(DataLocalidadesRurales)

  let nacionalidadNumero = Math.random()
  const nacionalidad = 
    nacionalidadNumero < 0.94 ? "Argentina" :
    nacionalidadNumero < 0.98 ? "Paraguay" :
    nacionalidadNumero < 0.99 ? "Brasil" :
    nacionalidadNumero < 0.995 ? "Bolivia" : "Uruguay"
  
  const nivel =
  Math.random() < 0.3
  ? "Jardin"
  : Math.random() < 0.5
  ? "Primaria"
  : "Secundaria";

  const codNivelEducativo = 
    nivel === "Jardin" ? 101 :
    nivel === "Primaria" ? 102 : 110
  
  const edad = generarEdadAleatoria(nivel);
  const dni = generarDNIaleatorio(nivel, edad, numberAlumno);
  const nacimiento = generarFechaNacimiento(edad);
  
  const grado = 
    nivel === "Primaria" ? edad - 5 : 
    nivel === "Secundaria" ? edad - 11 :
    edad < 22 ? edad - 17 :
    randomNumbers(1, 5)

  const gradoAño = nivel === "Primaria" ? "Grado" : "Año";
  const modalidad =
    nivel === "Secundaria" &&
    grado > 3 &&
    obtenerElementoAleatorio(DataModalidadesSecundaria);

  function establecimientoAleatorio (local) {
    const esta = establecimientosLocalidad[local.toLowerCase()][nivel]
    const nro = randomNumbers(0, esta.length - 1)

    const establecimiento = esta[nro].name
    return establecimiento
  }

  const establecimiento = establecimientoAleatorio(localidad.name)

  const carrera = 
    nivel === "Jardin" ? planJardin : 
    (nivel === "Secundaria" && modalidad !== null) ?
    DataMateriasModalidades["Ciclo Orientado Agroambiental"][0] : 
    nivel === "Secundaria" ? planSecundariaRural : 
    nivel === "Primaria" ? planPrimaria : carrerasMaterias[randomNumbers(17, carrerasMaterias.length - 1)] 

  const añoIngreso = 
    edad === 4 ? 2023 :
    edad === 5 ? 2022 :
    2023 - (grado - 1)
  
  const mesIngreso = randomNumbers(2, 3)
  const diaIngreso = randomNumbers(1, 9)

  const dataCarrera = { 
    nombre: carrera.nombre, 
    notas: {}, 
    establecimiento: establecimiento,
    codNivelEducativo: codNivelEducativo,
    ambito: "Rural",
    ingreso: `0${diaIngreso}/0${mesIngreso}/${añoIngreso}`
  }

  if ( nivel === "Jardin" && edad === 4 ) {
    dataCarrera.notas["2023"] = {}
    carrera.materias.forEach(materia => {
      dataCarrera.notas["2023"][`${materia}`] = {}
      dataCarrera.notas["2023"][`${materia}`].primerTrimestre = randomNumbers(1, 10)
      dataCarrera.notas["2023"][`${materia}`].segundoTrimestre = randomNumbers(1, 10)
      dataCarrera.notas["2023"][`${materia}`].tercerTrimestre = randomNumbers(1, 10)

      let auxiliar = 
        dataCarrera.notas["2023"][`${materia}`].primerTrimestre +
        dataCarrera.notas["2023"][`${materia}`].segundoTrimestre +
        dataCarrera.notas["2023"][`${materia}`].tercerTrimestre 

        dataCarrera.notas["2023"][`${materia}`].promedio = Math.floor(auxiliar / 3)
        dataCarrera.notas["2023"][`${materia}`].notaFinal = dataCarrera.notas["2023"][`${materia}`].promedio

      if ( dataCarrera.notas["2023"][`${materia}`].promedio < 6 ) {
        dataCarrera.notas["2023"][`${materia}`].recuperatorio = randomNumbers(6, 10)
        dataCarrera.notas["2023"][`${materia}`].notaFinal = dataCarrera.notas["2023"][`${materia}`].recuperatorio
      }
    })
  } else if (grado !== 1) {
    dataCarrera.notas["2022"] = {}
    carrera.materias.forEach(materia => {
      dataCarrera.notas["2022"][materia] = {}
      dataCarrera.notas["2022"][materia].primerTrimestre = randomNumbers(1, 10)
      dataCarrera.notas["2022"][materia].segundoTrimestre = randomNumbers(1, 10)
      dataCarrera.notas["2022"][materia].tercerTrimestre = randomNumbers(1, 10)

      let auxiliar = 
        dataCarrera.notas["2022"][`${materia}`].primerTrimestre +
        dataCarrera.notas["2022"][`${materia}`].segundoTrimestre +
        dataCarrera.notas["2022"][`${materia}`].tercerTrimestre 

        dataCarrera.notas["2022"][`${materia}`].promedio = Math.floor(auxiliar / 3)
        dataCarrera.notas["2022"][`${materia}`].recuperatorio = null
        dataCarrera.notas["2022"][`${materia}`].notaFinal = dataCarrera.notas["2022"][`${materia}`].promedio

      if ( dataCarrera.notas["2022"][`${materia}`].promedio < 6 ) {
        dataCarrera.notas["2022"][`${materia}`].recuperatorio = randomNumbers(6, 10)
        dataCarrera.notas["2022"][`${materia}`].notaFinal = dataCarrera.notas["2022"][`${materia}`].recuperatorio
      }
    })
    dataCarrera.notas["2023"] = {}
    carrera.materias.forEach(materia => {
      dataCarrera.notas["2023"][`${materia} II`] = {}
      dataCarrera.notas["2023"][`${materia} II`].primerTrimestre = randomNumbers(1, 10)
      dataCarrera.notas["2023"][`${materia} II`].segundoTrimestre = randomNumbers(1, 10)
      dataCarrera.notas["2023"][`${materia} II`].tercerTrimestre = randomNumbers(1, 10)

      let auxiliar = 
        dataCarrera.notas["2023"][`${materia} II`].primerTrimestre +
        dataCarrera.notas["2023"][`${materia} II`].segundoTrimestre +
        dataCarrera.notas["2023"][`${materia} II`].tercerTrimestre 

        dataCarrera.notas["2023"][`${materia} II`].promedio = Math.floor(auxiliar / 3)
        dataCarrera.notas["2023"][`${materia} II`].recuperatorio = null
        dataCarrera.notas["2023"][`${materia} II`].notaFinal = dataCarrera.notas["2023"][`${materia} II`].promedio

      if ( dataCarrera.notas["2023"][`${materia} II`].promedio < 6 ) {
        dataCarrera.notas["2023"][`${materia} II`].recuperatorio = randomNumbers(6, 10)
        dataCarrera.notas["2023"][`${materia} II`].notaFinal = dataCarrera.notas["2023"][`${materia} II`].recuperatorio
      }
  })
  } else if (grado === 1) {
    dataCarrera.notas["2023"] = {}
    carrera.materias.forEach(materia => {
      dataCarrera.notas["2023"][`${materia}`] = {}
      dataCarrera.notas["2023"][`${materia}`].primerTrimestre = randomNumbers(1, 10)
      dataCarrera.notas["2023"][`${materia}`].segundoTrimestre = randomNumbers(1, 10)
      dataCarrera.notas["2023"][`${materia}`].tercerTrimestre = randomNumbers(1, 10)

      let auxiliar = 
        dataCarrera.notas["2023"][`${materia}`].primerTrimestre +
        dataCarrera.notas["2023"][`${materia}`].segundoTrimestre +
        dataCarrera.notas["2023"][`${materia}`].tercerTrimestre 

        dataCarrera.notas["2023"][`${materia}`].promedio = Math.floor(auxiliar / 3)
        dataCarrera.notas["2023"][`${materia}`].recuperatorio = null
        dataCarrera.notas["2023"][`${materia}`].notaFinal = dataCarrera.notas["2023"][`${materia}`].promedio

      if ( dataCarrera.notas["2023"][`${materia}`].promedio < 6 ) {
        dataCarrera.notas["2023"][`${materia}`].recuperatorio = randomNumbers(6, 10)
        dataCarrera.notas["2023"][`${materia}`].notaFinal = dataCarrera.notas["2023"][`${materia}`].recuperatorio
      }
    })
  }
  
  const domicilio = generarDomicilio(localidad.name, "Rural");

  const tutor = generarTutor(apellido)

  return {
    _id: dni,
    nombres: nombre,
    segundoNombre: segundoNombre,
    apellidos: apellido,
    DNI: dni,
    nacionalidad: nacionalidad,
    genero: genero,
    localidad: localidad,
    domicilio: domicilio,
    nacimiento: nacimiento,
    edad: edad,
    nivel: nivel,
    [gradoAño]: nivel === "Jardin" ? 1 : grado,
    modalidad: modalidad,
    carrera: dataCarrera,
    tutor: tutor
  };
}

async function guardarAlumnos() {
  const alumnos = [];

  for (let i = 0; i < 7000; i++) {
    alumnos.push(generarAlumno(i));
  }
  for (let i = 0; i < 3000; i++) {
    alumnos.push(generarAlumnoRural(i));
  }

  try {
    await fs.writeFile("alumnos.json", JSON.stringify(alumnos, null, 2));
    console.log(
      "Los documentos JSON de los alumnos se han generado y guardado exitosamente en el archivo 'alumnos.json'."
    );
  } catch (error) {
    console.error("Ocurrió un error al guardar los alumnos:", error.message);
  }
}

guardarAlumnos();
