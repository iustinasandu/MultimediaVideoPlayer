let mainVideo = document.querySelector('.mainV');
let mainTitle = document.querySelector('#mainTitle');

let playButton = document.querySelector('.playBtn');
let stopBtn = document.querySelector('.stopBtn');
let muteButton = document.querySelector('.muteBtn');
let volume = document.querySelector('.volume');
let nextBtn = document.querySelector('.nextBtn');
let previousBtn = document.querySelector('.previousBtn');

let currentTime = document.querySelector('.currentTime');
let durationTime = document.querySelector('.duration');

let progress = document.querySelector('#progress');
let progressBar = document.querySelector('#progressBar');


playButton.addEventListener('click', playPause);
function playPause() {
    if(mainVideo.paused){
        mainVideo.play();
        playButton.innerHTML = '⏸︎';
    }
    else{
        mainVideo.pause();
        playButton.innerHTML = '⏵︎';
    }
}


stopBtn.addEventListener('click', stopFunc);
function stopFunc() {
    if(!mainVideo.paused){
        mainVideo.pause();
        mainVideo.currentTime=0;
        playButton.innerHTML = '⏵︎';
    }
}

muteButton.addEventListener('click', mute);
function mute(){
    mainVideo.muted = !mainVideo.muted;
    if(mainVideo.muted){
        muteButton.innerHTML = '&#128263';
    }
    if(!mainVideo.muted){
        muteButton.innerHTML = '&#128266';
    }
}

volume.addEventListener('mousemove', (e)=>{
    mainVideo.volume = e.target.value;
})

const time = () =>{
    let currentMins = Math.floor(mainVideo.currentTime / 60);
    let currentSecs = Math.floor(mainVideo.currentTime - currentMins * 60);
    let durationMins = Math.floor(mainVideo.duration / 60);
    let durationSecs = Math.floor(mainVideo.duration - durationMins * 60);

    currentTime.innerHTML = `${currentMins}:${currentSecs < 10 ? '0' + currentSecs : currentSecs}`;
    durationTime.innerHTML = `${durationMins}:${durationSecs < 10 ? '0' + durationSecs : durationSecs}`;
}

mainVideo.addEventListener('timeupdate', time);


mainVideo.addEventListener('timeupdate', () =>{
    const unit = (mainVideo.currentTime / mainVideo.duration * 100);
    progressBar.style.width = `${unit}%`;
})

progress.addEventListener('click', (e) =>{
    let progressTime =(e.offsetX / progress.offsetWidth) * mainVideo.duration;
    mainVideo.currentTime = progressTime;
})


//Add new video in playlist

let newVideo = document.getElementById("newVideo");

newVideo.addEventListener("change", (event)=>{
    let fileName = event.target.files[0].name;
    let sourcePath = URL.createObjectURL(event.target.files[0]);
    
    let newVideoElement = document.createElement("video");
    newVideoElement.src = `${sourcePath}`;

    let newDiv = document.createElement("div");
    document.body.children[1].children[1].appendChild(newDiv);
    newDiv.classList.add("video");
    let listVideoLength = document.getElementById("listVideoID").childElementCount;
    document.body.children[1].children[1].children[listVideoLength-1].appendChild(newVideoElement);

    let newHeader = document.createElement('h4');
    newHeader.innerHTML = fileName.split(".")[0];
    document.body.children[1].children[1].children[listVideoLength-1].appendChild(newHeader);
    newHeader.classList.add("title");

    // console.log(listVideoLength);
     
    accessListVideo();
    accessNextPreviousVideo();

    newVideo.value='';
});

newVideo.value='';


//Delete video from playlist

let deleteBtn = document.querySelector(".deleteVideo");
deleteBtn.addEventListener("click", ()=>{
    let listVideo = document.getElementById("listVideoID");
    let listVideoLength = listVideo.childElementCount;
    for(let i=1; i<listVideoLength; i++){
        if(listVideo.children[i].classList.contains('active')){
            let childToBeDeleted = listVideo.children[i];
            listVideo.removeChild(childToBeDeleted);
            listVideo = document.querySelectorAll('div .video');
            listVideoLength = listVideo.childElementCount;
        }
    }
    accessListVideo();
    accessNextPreviousVideo();
});


//Reorder Playlist

let reorderListBtn = document.querySelector(".reorderListBtn");
reorderListBtn.addEventListener("click", ()=>{
    const inputOrder = document.querySelector(".inputOrder").value;
    let inputArray = inputOrder.split(",");
    for(let i=0; i<inputArray.length; i++){
        inputArray[i] = inputArray[i] - 1;
    }

    let listVideo=document.querySelector(".listVideo");
    const initialList = Array.from(listVideo);
    const children=listVideo.children;

    for(let i=0; i<children.length; i++){
        initialList[i] = children[inputArray[i]];
    }
    for(let i=0; i<initialList.length; i++){
        listVideo.appendChild(initialList[i]);
    }   
    accessListVideo();
    accessNextPreviousVideo(); 
});


function accessListVideo(){
let listVideo = document.querySelectorAll('.listVideo .video');
listVideo.forEach(elem =>{
elem.onclick = () => {
    listVideo.forEach(video => video.classList.remove('active'));
    elem.classList.add('active');
    if(elem.classList.contains('active')){
        let sourceVideo = elem.children[0].currentSrc;
        mainVideo.src = sourceVideo;
        let textVideo = elem.children[1].innerHTML;
        mainTitle.innerHTML = textVideo;
    }
    resetVolume();
    playButton.innerHTML = '⏵︎';
};
});
}


const displayDuration = () => {
    durationTime.textContent = `0:00`;
}

const resetVolume = () => {
    volume.value = 100;
}

if (mainVideo.readyState > 0) {displayDuration();}
else {
    mainVideo.addEventListener( 'loadedmetadata', () => {displayDuration();} );
}


// let index = Array.from(elem.parentNode.children).indexOf(elem);
//console.log(index);

// function returnIndex(){
//     let index = 0;
//     for(let i=0; i<listVideo.length; i++){
//         if(listVideo[i].children[0].currentSrc === mainVideo.currentSrc){
//             index = Array.from(listVideo[i].parentNode.children).indexOf(listVideo[i]);
//         }
//         else{
//             i++;
//         }
//         return index; 
//     }
// }

//console.log(returnIndex());

function accessNextPreviousVideo(){
let listVideo = document.querySelectorAll('.listVideo .video');
let listSrcVideo = new Array();
listVideo.forEach(video => {
    videoElem = video.children[0].src;
    listSrcVideo.push(videoElem);
});

mainVideo.addEventListener('ended', nextVideo);
nextBtn.addEventListener('click', nextVideo);

let videoNo = 0;
function nextVideo(){
    if(videoNo < listSrcVideo.length-1){
        videoNo++;
    }
    else{
        videoNo = 0;
    }
    mainVideo.src = listSrcVideo[videoNo];
    listVideo.forEach(video => video.classList.remove('active'));
    listVideo[videoNo].classList.add('active');
    let textVideo = listVideo[videoNo].children[1].innerHTML;
    mainTitle.innerHTML = textVideo;
    resetVolume();
    playButton.innerHTML = '⏵︎';
}

previousBtn.addEventListener('click', previousVideo);
let noOfVideos = listSrcVideo.length-1;
function previousVideo(){
    if(noOfVideos > 0){
        noOfVideos--;
    }
    else{
        noOfVideos = listSrcVideo.length-1;
    }
    mainVideo.src = listSrcVideo[noOfVideos];
    listVideo.forEach(video => video.classList.remove('active'));
    listVideo[noOfVideos].classList.add('active');
    let textVideo = listVideo[noOfVideos].children[1].innerHTML;
    mainTitle.innerHTML = textVideo;
    resetVolume();
    playButton.innerHTML = '⏵︎';
}

}

accessListVideo();
accessNextPreviousVideo();


//canvas

let normalBtn = document.querySelector('.normal');
let grayScale = document.querySelector('.grayScale');
let invert = document.querySelector('.invert');
let red = document.querySelector('.red');
let green = document.querySelector('.green');
let blue = document.querySelector('.blue');
let darker = document.querySelector('.darker');
let brighter = document.querySelector('.brighter');
// let threshold = document.querySelector('.threshold');

"use strict";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
mainVideo.addEventListener("loadedmetadata", function(){
    canvas.width = mainVideo.videoWidth;
    canvas.height = mainVideo.videoHeight;
});

let handler;
grayScale.addEventListener("click", function(){
    handler = requestAnimationFrame(drawGrayScale);
});

normalBtn.addEventListener("click", function(){
    handler = requestAnimationFrame(drawNormal);
});

invert.addEventListener("click", function(){
    handler = requestAnimationFrame(drawInvert);
});

red.addEventListener("click", function(){
    handler = requestAnimationFrame(drawRed);
});

green.addEventListener("click", function(){
    handler = requestAnimationFrame(drawGreen);
});

blue.addEventListener("click", function(){
    handler = requestAnimationFrame(drawBlue);
});

darker.addEventListener("click", function(){
    handler = requestAnimationFrame(drawDarker);
});

brighter.addEventListener("click", function(){
    handler = requestAnimationFrame(drawBrighter);
});

// threshold.addEventListener("click", function(){
//     handler = requestAnimationFrame(drawThreshold);
// });


function drawNormal(){
    context.drawImage(mainVideo, 0, 0);
    handler = requestAnimationFrame(drawNormal);
}

function drawGrayScale(){
    context.drawImage(mainVideo, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for(let i = 0; i < data.length; i += 4){
        const r = data[i]
        const g = data[i+1];
        const b = data[i+2];

        const average = Math.round((r+g+b)/3);

        data[i] = data[i+1] = data[i+2] = average;
    }
    context.putImageData(imageData, 0, 0);
    handler = requestAnimationFrame(drawGrayScale);
}

function drawInvert(){
    // r' = 255 – r; g' = 255 – g; b' = 255 – b;
    context.drawImage(mainVideo, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for(let i = 0; i < data.length; i += 4){
        data[i] = 255 - data[i]; //r
        data[i+1] = 255 - data[i+1]; //g
        data[i+2] = 255 - data[i+2]; //b

            // const r = data[i]
            // const g = data[i+1];
            // const b = data[i+2];

            // data[i] = 255 - r;
            // data[i+1] = 255 - g;
            // data[i+2] = 255 - b;
    }
    context.putImageData(imageData, 0, 0);
    context.shadowBlur = 10;
    handler = requestAnimationFrame(drawInvert);
}

function drawRed(){
    // r'=r; g'=0; b'=0;

    context.drawImage(mainVideo, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for(let i = 0; i < data.length; i += 4){
        const r = data[i]
        const g = data[i+1];
        const b = data[i+2];
        
        data[i] = (r+g+b)/3; //r
        data[i+1] = 0; //g
        data[i+2] = 0; //b
    }
    context.putImageData(imageData, 0, 0);
    handler = requestAnimationFrame(drawRed);
}

function drawGreen(){
    // r'=0; g'=g; b'=0;

    context.drawImage(mainVideo, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for(let i = 0; i < data.length; i += 4){
        const r = data[i]
        const g = data[i+1];
        const b = data[i+2];
        
        data[i] = 0; //r
        data[i+1] = (r+g+b)/3; //g
        data[i+2] = 0; //b
    }
    context.putImageData(imageData, 0, 0);
    handler = requestAnimationFrame(drawGreen);
}

function drawBlue(){
    // r'=0; g'=0; b'=b;

    context.drawImage(mainVideo, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for(let i = 0; i < data.length; i += 4){
        const r = data[i]
        const g = data[i+1];
        const b = data[i+2];
        
        data[i] = 0; //r
        data[i+1] = 0; //g
        data[i+2] = (r+g+b)/3; //b
    }
    context.putImageData(imageData, 0, 0);
    handler = requestAnimationFrame(drawBlue);
}

function drawDarker(){
    // r' = r - v; g' = g - v; b' = b - v;

    let v = 30;

    context.drawImage(mainVideo, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for(let i = 0; i < data.length; i += 4){
        const r = data[i]
        const g = data[i+1];
        const b = data[i+2];

        data[i] = r - v;
        data[i+1] = g - v;
        data[i+2] = b - v;
    }
    context.putImageData(imageData, 0, 0);
    handler = requestAnimationFrame(drawDarker);
}

function drawBrighter(){
    // r' = r + v; g' = g + v; b' = b + v;

    let v = 30;

    context.drawImage(mainVideo, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for(let i = 0; i < data.length; i += 4){
        const r = data[i]
        const g = data[i+1];
        const b = data[i+2];

        data[i] = r + v;
        data[i+1] = g + v;
        data[i+2] = b + v;
    }
    context.putImageData(imageData, 0, 0);
    handler = requestAnimationFrame(drawBrighter);
}

// function drawThreshold(){
//     // v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0; 
//     // r’= g’ = b’ = v;

//     context.drawImage(mainVideo, 0, 0);
//     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;

//     for(let i = 0; i < data.length; i += 4){
//         const r = data[i]
//         const g = data[i+1];
//         const b = data[i+2];

//         let v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;

//         data[i] = data[i+1] = data[i+2] = v;
//     }
//     context.putImageData(imageData, 0, 0);
//     handler = requestAnimationFrame(drawThreshold);
// }
