const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

//searchg by song or artist
// function searchSongs(term) {
//     fetch(`${apiURL}/suggest/${term}`)
//     .then(res => res.json())
//     .then(data => console.log(data));
// }
async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
    showData(data);
}

//show song and artist in dom
// function showData(data) {
//     let output = '';

//     data.data.forEach(song => {
//         output += `
//             <li>
//                 <span><strong>${song.artist.name}</strong> - ${song.title}
//                 </span>
//                 <button class="btn" data-artist="${song.artist.name}"
//                 data-songTitle="${song.title}"> Get lyrics </button>
//             </li>    
//         `;
//     });

//     result.innerHTML = `
//         <ul class="songs">
//             ${output}
//         </ul>
//     `;

// }

function showData(data) {
    result.innerHTML = `
      <ul class="songs">
        ${data.data
          .map(
            song => `<li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" 
        data-songtitle="${song.title}">Get Lyrics</button>
      </li>`
          )
          .join('')}
      </ul>
    `;
  
    if (data.prev || data.next) {
      more.innerHTML = `
        ${
          data.prev
            ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ''
        }
        ${
          data.next
            ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
            : ''
        }
      `;
    } else {
      more.innerHTML = '';
    }
  }

// get prev and next results of songs 
 async function getMoreSongs(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`); //proxy use needed
    const data = await res.json();
    showData(data);
}

//get lyric and artist for song
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>'); //regular expression

    result.innerHTML= `
    <h2><strong>${artist}</strong> - ${songTitle} </h2> 
    <span> ${lyrics} </span>
    `;

    more.innerHTML = '';
}

//get lyrics button click
result.addEventListener('click', e => {
    const clickedEl = e.target;

    if (clickedEl.tagName === 'BUTTON') { // get lyric button
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songTitle');

        getLyrics(artist, songTitle);
    }
});


//event listener
form.addEventListener('submit', e => {
    e.preventDefault();
  
    const searchTerm = search.value.trim();
  
    if (!searchTerm) {
      alert('Please type in a search term');
    } else {
      searchSongs(searchTerm);
    }
  });