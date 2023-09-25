// venta.js

import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
  fechaVenta: Date,
  montoVenta: Number,
  empleado: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
});

const Venta = mongoose.model("Venta", ventaSchema);

export default Venta;
