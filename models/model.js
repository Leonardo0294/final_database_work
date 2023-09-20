const mongoose = require("mongoose");

const alumnoSchema = new mongoose.Schema({
  _id: Number,
  nombres: String,
  apellidos: String,
  genero: String,
  localidad: String,
  domicilio: {
    tipo: String,
    calle: String,
    // Agrega más campos según corresponda
  },
  // Agrega más campos según corresponda
});

const Alumno = mongoose.model("Alumno", alumnoSchema);

module.exports = Alumno;
