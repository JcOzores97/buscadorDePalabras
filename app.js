//elementos de la interfaz
const artistInput = document.getElementById('artist-input');
const songInput = document.getElementById('song-input');
const wordInput = document.getElementById('word-input');
const form = document.getElementById('form');
const resultsContainer = document.getElementById('results-container');

//objetos

const songAnalizer = {
	countWord(word, strToAnalize) {
		//retorna la cantidad de coincidencias
		let pattern = new RegExp(word, 'gi');
		let matches = strToAnalize.match(pattern);
		if (matches == null) {
			return 0;
		} else {
			return matches.length;
		}
	}
};

const UI = {
	updateResults(result, artist, song, word) {
		let div = document.createElement('div');
		div.className = 'coincidences';
		if (result.name == 'Error') {
			div.textContent = result;
		} else {
			div.textContent = `${artist} utiliza la palabra "${word}"  ${result} veces en ${song}`;
		}
		resultsContainer.appendChild(div);
	},
	clearResultsSection() {
		resultsContainer.innerHTML = '';
	},
	showSong(lyrics) {
		let p = document.createElement('p');
		p.className = 'song';
		p.textContent = lyrics;
		resultsContainer.appendChild(p);
	}
};

//eventListeners
form.addEventListener('submit', (ev) => {
	UI.clearResultsSection();
	ev.preventDefault();

	//enviar una petición según las características que se completaron en el formulario
	let artist = artistInput.value;
	let song = songInput.value;
	let wordToSearch = wordInput.value;
	let url = `https://api.lyrics.ovh/v1/${artist.replace(' ', '-')}/${song.replace(' ', '-')}`;
	form.reset();

	//Errores:
	const notFoundError = new Error(
		'No se encontraron resultados para su búsqueda, verifique si rellenó correctamente todos los campos'
	);

	//petición de datos y manipulación de los mismos
	fetch(url)
		.then((response) => {
			if (response.status == 404) {
				throw notFoundError;
			} else {
				return response.json();
			}
		})
		.then((jsonData) => {
			let result = songAnalizer.countWord(wordToSearch, jsonData.lyrics);
			UI.updateResults(result, artist, song, wordToSearch);
			UI.showSong(jsonData.lyrics);
		})
		.catch((err) => {
			if (err == notFoundError) {
				UI.updateResults(err);
			}
		});
});
