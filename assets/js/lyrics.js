var apiKey = '7e0363dc461206b83c2b3b6300cd4a3c'

function lyricSearch(song) {

    var trackId = getTrackID(song)
    //format the api url
    var apiUrl = 'https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=' + trackId + '&apikey=' + apiKey
    fetch(apiUrl, { mode: 'no-cors'}).then(function(response) {
        //request was successful
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data)
            });
        } else {
            alert("Error: Lyrics Not Found");
        }
    }).catch(function(error) {
        alert("Unable to connect to MusixMatch")
    })
}

function getTrackID(songTitle) {
    //format the api url
    var apiUrl = 'https://api.musixmatch.com/ws/1.1/track.search?q_track=' + songTitle + '&apikey=' + apiKey
    fetch(apiUrl, { mode: 'no-cors'}).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var commontrack_id = data.body.track_list[0].commontrack_id
                return commontrack_id
            })
        } else {
            alert("Error: Cannot Find Track")
            console.log(apiUrl)
        }
    }).catch(function(error) {
        alert("Unable to connect to the Track")
    })
}