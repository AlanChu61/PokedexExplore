// 'use strict';

// function FetchPokemon() {
//     const [pokemons, setPokemons] = React.useState([]);

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         const query = event.target.elements.query.value;
//         fetch(`/fetch_pokemons?query=${query}`)
//             .then(response => response.json())
//             .then(data => setPokemons(data));
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="query" />
//                 <button type="submit">FetchPokemon</button>
//             </form>
//             <ul>
//                 {pokemons.map(item => <li key={item.id}>{item.name}</li>)}
//             </ul>
//         </div>
//     );
// }

// // ReactDOM.render(<FetchPokemon />, document.getElementById('pokemon_container'));
