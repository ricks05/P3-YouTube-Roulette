import * as algorithms from './Algorithms.js'

window.onload = init;

function init ()
{
    document.getElementById("searchButton").addEventListener("click", function(){
        showConfetti();
        getVideo();
        document.getElementById("potentialErrorCaption").style.visibility = "hidden";
    });
}

const apiKey = 'ENTER API KEY HERE';

async function getVideo() {
    try {
        const query = document.getElementById('genre').value;

        let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&q=${query}&maxResults=50`;

        if (document.getElementById('safeSearch').checked) {
            url += "&safeSearch=strict";
        }

        const response = await fetch(url);
        let data = await response.json();

        data = await refineData(data.items);
        let dataCopy = [...data];

        let timeRange = document.getElementById('timeRange').value;
        let min = 0;
        let max = Number.MAX_SAFE_INTEGER;
        if (timeRange === '0-5') {
            max = 300;
        }
        else if (timeRange === '5-15') {
            min = 300;
            max = 900;
        }
        else if (timeRange === '15-30') {
            min = 900;
            max = 1800;
        }
        else if (timeRange === '30+') {
            min = 1800;
        }

        const mergeTime = algorithms.mergeSort(data);
        const quickTime = algorithms.quickSort(dataCopy);
        
        const choice = algorithms.randomPicker(data, min, max);
        console.log(choice);

        document.getElementById("youTubeEmbed").src = choice.embeddedUrl;
        document.getElementById("quickSortBox").innerHTML = "Quick sort took " + quickTime + " ms";
        document.getElementById("mergeSortBox").innerHTML = "Merge sort took " + mergeTime + " ms";
        
    } catch (error) {
        console.error('Error searching videos:', error);
        document.getElementById("youTubeEmbed").src = "images\\errorImage.jpg";
        document.getElementById("potentialErrorCaption").style.visibility = "visible";
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