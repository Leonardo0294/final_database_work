# fill-db-10k-ruchi

## Modelo de datos

Ejemplo del registro que devuelve este script

```bash
{
"\_id": 123456789, // DNI aleatorio
"nombres": "Sofía", // Nombre aleatorio de la lista de nombres femeninos/masculinos
"apellidos": "García", // Apellido aleatorio de la lista de apellidos
"genero": "Femenino", // Género (en este caso, femenino)
"localidad": { "name": "Formosa Capital" }, // Localidad aleatoria de la lista de localidades
"domicilio": {
"tipo:" "casa" //difiere la propiedad del objeto domicilio segun el tipo de residencia
"barrio": "Guadalupe", // Barrio aleatorio de Fsa Capital
"calle": "Calle 1", // Calle aleatoria
"casa": 1 // Número de casa
},
"edad": 9, // Edad dentro del rango adecuado (en este caso, primaria)
"nivel": "Primaria", // Nivel escolar (Primaria, Secundaria o Terciario)
"Grado": 1, // Grado escolar (1 al 6 para primaria)
"modalidad": null, // Modalidad (null para primaria)
"notas": {
"Materia1": 7, // Notas aleatorias para las materias (1 al 10)
"Materia2": 6,
// ... (8 materias en total para primaria)
},
"establecimiento": {
"codigo": 102, // Código de establecimiento según el nivel
"nombre": "Escuela 1" // Nombre aleatorio para el establecimiento
}
}
```

varrios clori 25 de Mayo, 1ro de Mayo, Porteño norte, porteño sur, 240 viviendas, Nazareno, 500 viviendas, Libertad, 140 viviendas
