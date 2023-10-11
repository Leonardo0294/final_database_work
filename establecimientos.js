import fs from "fs"

const establecimientosFile = fs.readFileSync("./padron.establecimientos.json", "utf-8")

const establecimientosJson = JSON.parse(establecimientosFile)
const DataEstablecimientos = establecimientosJson.map(esta => {
    if (esta.hasOwnProperty("mod_comun")) {
        return {
            nombre: esta.nombre,
            localidad: esta.localidad.toLowerCase(),
            jardin: esta.hasOwnProperty("ec_jar") ? 1 : 0,
            primaria: esta.hasOwnProperty("ec_pri") ? 1 : 0,
            secundaria: esta.hasOwnProperty("ec_sec") ? 1 : 0,
            superior: esta.hasOwnProperty("ec_SNU") ? 1 : 0
        }
    }
}).filter(establecimiento => establecimiento !== undefined)

const establecimientosLocalidad = {}

for (let esta of DataEstablecimientos) {
    let nivel_educativo = []
    if (esta.jardin === 1) {
        nivel_educativo.push("Jardin")
    } 
    if (esta.primaria === 1) {
        nivel_educativo.push("Primaria")
    } 
    if (esta.secundaria === 1) {
        nivel_educativo.push("Secundaria")
    } 
    if (esta.superior === 1) {
        nivel_educativo.push("Terciario")
    }
    
    if (!establecimientosLocalidad.hasOwnProperty(esta.localidad)) {
        establecimientosLocalidad[esta.localidad] = {}
    }

    nivel_educativo.forEach(nivel => {
        if (!establecimientosLocalidad[esta.localidad].hasOwnProperty(nivel)) {
            establecimientosLocalidad[esta.localidad][nivel] = []
        }

        establecimientosLocalidad[esta.localidad][nivel].push({name: esta.nombre})
    })
}

// console.log(establecimientosLocalidad["las cañitas"]);

export default establecimientosLocalidad