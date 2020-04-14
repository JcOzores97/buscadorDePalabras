//elementos de la interfaz
const artistInput = document.getElementById('artist-input');
const songInput = document.getElementById('song-input');
const wordInput = document.getElementById('word-input');
const form = document.getElementById('form');
const resultsContainer = document.getElementById('results-container');

//objetos

const songAnalizer = {
	countWord(strToAnalize, regExp) {
		//retorna la cantidad de coincidencias
		let matches = strToAnalize.match(regExp);
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
			div.innerHTML = `<strong>${artist} utiliza la palabra "${word}"  ${result} veces en ${song}</strong>`;
		}
		resultsContainer.appendChild(div);
	},
	clearResultsSection() {
		resultsContainer.innerHTML = '';
	},
	showSong(lyrics, word, regExp) {
		let p = document.createElement('p');
		p.className = 'song';

		//resaltado de las coincidencias en la letra de la canción
		lyrics = lyrics.replace(regExp, ` <span class="match-word">${word}</span>`);
		lyrics = lyrics.replace(/\n/g, '<br>');
		lyrics = lyrics.replace(
			/\r/g,
			`
		`
		);
		p.innerHTML = lyrics;

		resultsContainer.appendChild(p);
	}
};

//eventListeners
form.addEventListener('submit', (ev) => {
	UI.clearResultsSection();
	ev.preventDefault();

	//valores del formulario
	let artist = artistInput.value;
	let song = songInput.value;
	let wordToSearch = `${wordInput.value}`;

	//regExp
	let regExp = new RegExp(`\\s${wordToSearch}(?=,|!|\\s|\\?|")`, 'gi');
	//url
	let url = `https://api.lyrics.ovh/v1/${artist.replace(' ', '-')}/${song.replace(' ', '-')}`;
	form.reset();

	//Errores:
	const notFoundError = new Error(
		'No se encontraron resultados para su búsqueda, verifique si rellenó correctamente todos los campos'
	);

	//petición de datos segun valores del form y manipulación de los mismos
	fetch(url)
		.then((response) => {
			if (response.status == 404) {
				throw notFoundError;
			} else {
				return response.json();
			}
		})
		.then((jsonData) => {
			let result = songAnalizer.countWord(jsonData.lyrics, regExp);
			UI.updateResults(result, artist, song, wordToSearch);
			UI.showSong(jsonData.lyrics, wordToSearch, regExp);
		})
		.catch((err) => {
			if (err == notFoundError) {
				UI.updateResults(err);
			}
		});
});
