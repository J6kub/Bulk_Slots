canvas = document.getElementById('canny');
ctx = canvas.getContext('2d');
//ctx.fillRect(0,00,9000,9000)
offset = 20
Spinnable = true;

function fetchSlots() {
    fetch('/GetSlots')
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            return data
        })
        .catch(error => {console.log(error)})
}

function RenderFrame() {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,1200,700)
    img('background',0,0)
}
function Spin() {
    if (Spinnable) {

        SpinInterval = setInterval(Spinner())
    }
}
var SpinInterval
events = [];
function Spinner() {
    Slots = []
}
class Slot {
    constructor(symbol, column) {
        this.y = 0;
        this.x = (column * 150) + offset
    }
}
    move() {
        this.y++
    }
}

function img(image, x=0,y=0,xw=0,yw=0) {
    imageSrc = 'static/img/' + image + '.png'
    imageC = new Image();
    imageC.src = imageSrc
    if (yw > 0 && xw > 0) {
        ctx.drawImage(imageC,x,y,xw,yw)
    } else {

        ctx.drawImage(imageC,x,y)
    }
}

function color(col) {
    ctx.fillStyle = col;
}