import * as algorithms from './Algorithms.js'

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

        data = await refineData(data.items);

        let timeRange = document.getElementById('timeRange').value;
        let min = 0;
        let max = Number.MAX_SAFE_INTEGER;
        if (timeRange === '0-10') {
            max = 600;
        }
        else if (timeRange === '10-30') {
            min = 600;
            max = 1800;
        }
        else if (timeRange === '30-60') {
            min = 1800;
            max = 3600;
        }
        else if (timeRange === '60+') {
            min = 3600;
        }

        console.log(data);
        
    } catch (error) {
        console.error('Error searching videos:', error);
    }
}

async function refineData(videos) {
    const refinedVideos = await Promise.all(videos.map(async video => {
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=contentDetails&id=${video.id.videoId}`;
        const response = await fetch(url);
        const videoData = await response.json();

        return {
            title: video.snippet.title,
            embeddedUrl: `https://www.youtube.com/embed/${videoData.items[0].id}`,
            duration: convertDuration(videoData.items[0].contentDetails.duration)
        };
    }));
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