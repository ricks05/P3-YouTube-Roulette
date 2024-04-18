
window.onload = init;

function init ()
{
    document.getElementById("searchButton").addEventListener("click", function(){
        showConfetti();
        getVideo();
    });
}

const apiKey = 'AIzaSyBuZkUa38HhrXa26ZnszYCHVRjouDrZPYc';

async function getVideo() {
    try {
        const query = document.getElementById('genre').value;

        let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&q=${query}&maxResults=3`;

        if (document.getElementById('safeSearch').checked) {
            url += "&safeSearch=strict";
        }

        const response = await fetch(url);
        let data = await response.json();

        data = refineData(data.items);

        console.log(data);
        
    } catch (error) {
        console.error('Error searching videos:', error);
    }
}

async function refineData(videos) {
    const refinedVideos = videos.map(async video => {
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=contentDetails&id=${video.id.videoId}`;
        const response = await fetch(url);
        const videoData = await response.json();

        return {
            title: video.snippet.title,
            embeddedUrl: `https://www.youtube.com/embed/${videoData.items[0].id}`,
            duration: convertDuration(videoData.items[0].contentDetails.duration)
        };
    })
    return refinedVideos;
}

function convertDuration(isoDuration) {
    return moment.duration(isoDuration).asSeconds();
}

function showConfetti()
{
    // Confetti Tutorial from https://dev.to/official_fire/creating-a-confetti-effect-in-5-minutes-16h3
    const start = () => {
        setTimeout(function() {
            confetti.start()
        }, 1000);
    };
    const stop = () => {
        setTimeout(function() {
            confetti.stop()
        }, 5000);
    };
    start();
    stop();
}