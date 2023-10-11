import fs from "fs";
import { DataMateriasGeneradas } from "./materias_generadas.js";

function randomNumbers (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const carrerasFile = fs.readFileSync("./plan202309201116.json", "utf-8")
const materiasFile = fs.readFileSync("./materia2023092007.json", "utf-8")

const DataCarreras = JSON.parse(carrerasFile)
let DataMaterias = JSON.parse(materiasFile)

DataMaterias.forEach(materia => {
    if (materia.espacio.includes("1") || materia.espacio.includes("2") || materia.espacio.includes("3")) {
        let nombreSolo = materia.espacio.replace(/\s\d+$/, '')
        materia.espacio = nombreSolo
    }
})

DataMaterias = DataMaterias.concat(DataMateriasGeneradas)

const carrerasMateriasBrutas = []

for (let i = 0; i < DataCarreras.length; i++) {
    carrerasMateriasBrutas.push({ nombre: DataCarreras[i].carrera })
    carrerasMateriasBrutas[i].materias = []
    DataMaterias.forEach(materia => {
        if (DataCarreras[i]._id === materia.plan_id) {
            carrerasMateriasBrutas[i].materias.push(materia.espacio)
        }
    });
}

let carrerasMaterias = []

function filtrarMaterias () {
    
    carrerasMateriasBrutas.forEach((carrera, index) => {
        let carreraBuscada = carrerasMaterias.find(career => career.nombre === carrera.nombre)
        if (!carreraBuscada) {
            carrerasMaterias.push({ nombre: carrera.nombre, materias: [] })
        }

        carrera.materias.forEach(mat => {
            if (!carrerasMaterias[index].materias.includes(mat)) {
                carrerasMaterias[index].materias.push(mat)
            }
        })
    })
}

filtrarMaterias()

fs.writeFile("carreras.json", JSON.stringify(carrerasMaterias, null, 2), (err) => console.error(err))

console.log(carrerasMaterias);
export default carrerasMaterias