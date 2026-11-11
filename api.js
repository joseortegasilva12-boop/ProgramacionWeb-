// api.js
const url = "https://pokeapi.co/api/v2/pokemon/charizard";

async function main() {
  const respuesta = await fetch(url);
  console.log("Código:", respuesta.status);

  if (!respuesta.ok) {
    console.log("Error: no se pudo obtener el Pokémon. Status:", respuesta.status);
    return;
  }

  const datos = await respuesta.json();
  console.log("Nombre:", datos.name);
  console.log("Altura:", datos.height);
  console.log("Peso:", datos.weight);
  
  console.log("Tipos:", datos.types.map(t => t.type.name));
  console.log("Habilidades:", datos.abilities[1].ability.name);

}

main();