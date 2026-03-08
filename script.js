const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const dropArea = document.getElementById("dropArea");

const originalPreview = document.getElementById("originalPreview");
const compressedPreview = document.getElementById("compressedPreview");

const originalSizeText = document.getElementById("originalSize");
const compressedSizeText = document.getElementById("compressedSize");

const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");

const progressBar = document.getElementById("progressBar");

const darkToggle = document.getElementById("darkToggle");

let uploadedImage;
let originalFile;

selectBtn.onclick = () => fileInput.click();

fileInput.addEventListener("change", handleFile);

function handleFile(e){

originalFile = e.target.files[0];

const reader = new FileReader();

reader.readAsDataURL(originalFile);

reader.onload = function(event){

uploadedImage = new Image();
uploadedImage.src = event.target.result;

originalPreview.src = uploadedImage.src;

originalSizeText.innerText =
"Original Size: " + (originalFile.size/1024).toFixed(2) + " KB";

}

}

/* DRAG DROP */

dropArea.addEventListener("dragover",e=>{
e.preventDefault();
dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave",()=>{
dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop",e=>{
e.preventDefault();
dropArea.classList.remove("dragover");

fileInput.files = e.dataTransfer.files;

const event = new Event("change");
fileInput.dispatchEvent(event);
});

/* COMPRESSION */

compressBtn.addEventListener("click", function(){

if(!uploadedImage) return;

progressBar.style.width="0%";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = uploadedImage.width;
canvas.height = uploadedImage.height;

ctx.drawImage(uploadedImage,0,0);

const originalSize = originalFile.size;

const qualities = [0.9,0.8,0.7,0.6,0.5,0.4,0.3];
const formats = ["image/webp","image/jpeg"];

let bestImage = null;
let bestSize = originalSize;

let progress = 0;

const interval = setInterval(()=>{

progress += 10;
progressBar.style.width = progress + "%";

if(progress >= 100){

clearInterval(interval);

/* Try multiple compressions */

formats.forEach(format => {

qualities.forEach(q => {

const data = canvas.toDataURL(format,q);

/* estimate size from base64 */
const size = Math.round((data.length*3/4));

if(size < bestSize){

bestSize = size;
bestImage = data;

}

});

});

/* If compressed version is smaller */
if(bestImage){

compressedPreview.src = bestImage;

compressedSizeText.innerText =
"Compressed Size: " + (bestSize/1024).toFixed(2) + " KB";

downloadBtn.href = bestImage;

downloadBtn.download = "compressed-image";

downloadBtn.style.display = "block";

}else{

compressedPreview.src = originalPreview.src;

compressedSizeText.innerText =
"Image already optimized. No smaller version found.";

downloadBtn.href = originalPreview.src;
downloadBtn.download = originalFile.name;
downloadBtn.style.display = "block";

}

}

},100);

});

/* DARK MODE */

darkToggle.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark"))
darkToggle.innerText="Light Mode";
else
darkToggle.innerText="Dark Mode";

});