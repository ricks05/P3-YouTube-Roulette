
const apiKey = 'AIzaSyBuZkUa38HhrXa26ZnszYCHVRjouDrZPYc';

async function getVideo() {
    try {
        const query = document.getElementById('searchQuery').value;

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
            duration: videoData.items[0].contentDetails.duration
        };
    })
    return refinedVideos;
}
