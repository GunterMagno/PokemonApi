'use strict'

document.addEventListener("DOMContentLoaded", () => {

    const tiposTraducidos = {
        normal: "Normal",
        fire: "Fuego",
        water: "Agua",
        electric: "Eléctrico",
        grass: "Planta",
        ice: "Hielo",
        fighting: "Lucha",
        poison: "Veneno",
        ground: "Tierra",
        flying: "Volador",
        psychic: "Psíquico",
        bug: "Bicho",
        rock: "Roca",
        ghost: "Fantasma",
        dragon: "Dragón",
        dark: "Siniestro",
        steel: "Acero",
        fairy: "Hada"
    };


    if (document.title === 'Pokedex') {
        const entradaBusqueda = document.getElementById('entrada-busqueda');
        const selectorTipo = document.getElementById('selector-tipo');
        const contenedorResultados = document.getElementById('contenedor-resultados');

        // Eventos
        entradaBusqueda.addEventListener('input', buscarPokemon);
        selectorTipo.addEventListener('change', buscarPokemon);


        // Crear popup de sugerencias
        const popup = document.createElement('div');
        popup.id = 'popup-sugerencias';
        document.body.appendChild(popup);

        const contenedorSugerencias = document.createElement('div');
        contenedorSugerencias.className = 'contenedor-sugerencias';
        popup.appendChild(contenedorSugerencias);

        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });

        // Buscar un Pokémon
        function buscarPokemon() {
            const textoBusqueda = entradaBusqueda.value.trim().toLowerCase();
            const tipoSeleccionado = selectorTipo.value;

            if (textoBusqueda.length < 3 && !tipoSeleccionado) {
                return;
            }

            fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
                .then(response => response.json())
                .then(datos => {
                    const resultados = [];

                    datos.results.forEach(pokemon => {
                        fetch(pokemon.url)
                            .then(res => res.json())
                            .then(datosPokemon => {
                                let coincideNombre = pokemon.name.includes(textoBusqueda);

                                let coincideTipo = !tipoSeleccionado;
                                if (tipoSeleccionado) {
                                    coincideTipo = false;
                                    for (let tipo of datosPokemon.types) {
                                        if (tipo.type.name === tipoSeleccionado) {
                                            coincideTipo = true;
                                        }
                                    }
                                }

                                if (coincideNombre && coincideTipo) {
                                    const pokemonFiltrado = {
                                        name: pokemon.name,
                                        types: datosPokemon.types.map(t => t.type.name),
                                        id: datosPokemon.id
                                    };
                                    resultados.push(pokemonFiltrado);
                                }

                                mostrarSugerencias(resultados);
                            })

                            .catch(error => {
                                console.error('Error al obtener detalles:', error);
                                mostrarSugerencias(resultados);
                            });
                    });
                })
                .catch(error => {
                    console.error('Error al buscar Pokémon:', error);
                    popup.style.display = 'none';
                });
        }

        // Mostrar sugerencias
        function mostrarSugerencias(pokemones) {
            contenedorSugerencias.innerHTML = '<h3>Pokémon encontrados</h3>';

            if (pokemones.length === 0) {
                contenedorSugerencias.innerHTML += '<p>No se encontraron Pokémon</p>';
            } else {
                pokemones.forEach(pokemon => {
                    const tarjeta = document.createElement('div');
                    tarjeta.className = 'pokemon-card';
                    tarjeta.style.display = 'flex';
                    tarjeta.style.alignItems = 'center';
                    tarjeta.style.padding = '10px';
                    tarjeta.style.marginBottom = '10px';
                    tarjeta.style.cursor = 'pointer';
                    tarjeta.style.backgroundColor = '#f9f9f9';
                    tarjeta.style.borderRadius = '5px';

                    const imagen = document.createElement('img');
                    imagen.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                    imagen.style.width = '50px';
                    imagen.style.height = '50px';
                    imagen.style.marginRight = '15px';
                    imagen.style.objectFit = 'contain';

                    const nombre = document.createElement('div');

                    const nombreTexto = document.createElement('div');
                    nombreTexto.style.fontWeight = 'bold';
                    nombreTexto.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

                    const tipos = document.createElement('div');
                    tipos.style.fontSize = '0.9em';

                    pokemon.types.forEach(type => {
                        const tipoSpan = document.createElement('span');
                        tipoSpan.className = `tipo ${type}`;
                        tipoSpan.textContent = tiposTraducidos[type];
                        tipos.appendChild(tipoSpan);
                    });

                    nombre.appendChild(nombreTexto);
                    nombre.appendChild(tipos);
                    tarjeta.appendChild(imagen);
                    tarjeta.appendChild(nombre);
                    contenedorSugerencias.appendChild(tarjeta);

                    tarjeta.addEventListener('click', () => {
                        mostrarPokemon(pokemon.name);
                        popup.style.display = 'none';
                    });
                });
            }

            popup.style.display = 'flex';
        }
        //Pilla todos los datos y contenedores para mostrarlos en el html
        function mostrarDatos(datos) {
            document.getElementById('nombre-pokemon').textContent = `Pokémon: ${datos.name.toUpperCase()}`;
            document.getElementById('dato-nombre').textContent = `Nombre: ${datos.name.charAt(0).toUpperCase() + datos.name.slice(1)}`;
            document.getElementById('dato-altura').textContent = `Altura: ${datos.height / 10}m`;
            document.getElementById('dato-peso').textContent = `Peso: ${datos.weight / 10}kg`;

            const contenedorTipos = document.getElementById('dato-tipos');
            contenedorTipos.innerHTML = 'Tipos: ';

            datos.types.forEach(tipo => {
                const tipoSpan = document.createElement('span');
                tipoSpan.className = `tipo ${tipo.type.name}`;
                tipoSpan.textContent = tiposTraducidos[tipo.type.name];
                contenedorTipos.appendChild(tipoSpan);
            });

            const contenedorImagen = document.getElementById('contenedor-imagen');
            contenedorImagen.innerHTML = '';
            const imagen = document.createElement('img');
            imagen.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${datos.id}.png`;
            imagen.alt = datos.name;
            imagen.style.maxWidth = '300px';
            imagen.style.height = 'auto';
            imagen.style.cursor = 'pointer';
            contenedorImagen.appendChild(imagen);
            contenedorResultados.style.display = 'block';

            //Nueva actualización
            imagen.addEventListener('click', () => {
                sessionStorage.setItem("busqueda", datos.name);
                window.open('pokemon.html')
            })
        }

        // Mostrar Pokémon seleccionado
        function mostrarPokemon(nombrePokemon) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Pokémon no encontrado');
                    }
                    return response.json();
                })
                .then(datos => {
                    mostrarDatos(datos)

                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(error.message);
                });
        }

    } else if (document.title === 'Información Pokemon') {

        const busqueda = sessionStorage.getItem("busqueda");
        document.title = `Información de ${busqueda}`

        fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda.toLowerCase()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokémon no encontrado');
                }
                return response.json();
            })
            .then(datos => {
                document.getElementById('dato-id').textContent = `NºPokedex: ${datos.id}`;
                document.getElementById('nombre-pokemon').textContent = `Pokémon: ${datos.name.toUpperCase()}`;
                document.getElementById('dato-nombre').textContent = `Nombre: ${datos.name.charAt(0).toUpperCase() + datos.name.slice(1)}`;
                document.getElementById('dato-altura').textContent = `Altura: ${datos.height / 10}m`;
                document.getElementById('dato-peso').textContent = `Peso: ${datos.weight / 10}kg`;

                const contenedorTipos = document.getElementById('dato-tipos');

                datos.types.forEach(tipo => {
                    const tipoSpan = document.createElement('span');
                    tipoSpan.className = `tipo ${tipo.type.name}`;
                    tipoSpan.textContent = tiposTraducidos[tipo.type.name];
                    contenedorTipos.appendChild(tipoSpan);
                });

                const contenedorStats = document.getElementById('datos-stats');

                datos.stats.forEach(s => {
                    const statli = document.createElement('li');
                    statli.className = `stat ${s.stat.name}`
                    statli.textContent = s.stat.name[0].toUpperCase() + s.stat.name.slice(1) + ': ' + s.base_stat;
                    contenedorStats.appendChild(statli);
                })


                
                const contenedorImagen = document.getElementById('contenedor-imagen');
                contenedorImagen.innerHTML = '';
                const imagen = document.createElement('img');
                imagen.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${datos.id}.png`;
                imagen.alt = datos.name;
                imagen.style.width = '300px';
                imagen.style.height = 'auto';
                contenedorImagen.appendChild(imagen);

                const imagen2 = document.createElement('img');
                imagen2.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${datos.id}.gif`;
                imagen2.alt = datos.name;
                imagen2.style.width = '300px';
                imagen2.style.height = 'auto';
                contenedorImagen.appendChild(imagen2);

                const imagen3 = document.createElement('img');
                imagen3.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${datos.id}.png`;
                imagen3.alt = datos.name;
                imagen3.style.width = '300px';
                imagen3.style.height = 'auto';
                contenedorImagen.appendChild(imagen3);


                const imagen4 = document.createElement('img');
                imagen4.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${datos.id}.gif`;
                imagen4.alt = datos.name;
                imagen4.style.width = '300px';
                imagen4.style.height = 'auto';
                contenedorImagen.appendChild(imagen4);

            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    }
});