var apiKey = 'ebd5f559316479fee95ab51cbb0ffad5'

function getTrackLyrics(songArtist, songTitle) {
    //format the api url
    var apiUrl = 'https://api.vagalume.com.br/search.php?art=' + songArtist + '&mus=' + songTitle + '&apikey=' + apiKey
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lyricsEl = document.getElementById('test')
                var lyrics = document.createElement('p')
                lyrics.textContent = data.mus[0].text
                //lyricsEl.appendChild(lyrics)
                console.log(lyrics)
                console.log(data)
            })
        } else {
            alert("Error: Cannot Find Lyrics")
            console.log(apiUrl)
        }
    }).catch(function(error) {
        alert("Unable to connect to the Data")
    })
}

getTrackLyrics('Queen', 'Killer Queen')

var lyrics = document.getElementsByClassName('playlist-song');

for(i = 0; i < lyrics.length; i++) {
    lyrics[i].addEventListener('click', getTrackLyrics('Quinn xcii', 'Straightjacket'))
}
