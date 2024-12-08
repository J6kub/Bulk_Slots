canvas = document.getElementById('canny');
ctx = canvas.getContext('2d');
//ctx.fillRect(0,00,9000,9000)
offset = 370
Spinnable = true;
Buttons = [];
const PossibleSlots = ["Linus",'Headset','Gpu','Energy','Camera','Card','Printer','Tysk']

async function fetchSlots() {
    try {
        const response = await fetch('/GetSlots');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching slots:', error);
    }
}

function RenderFrame() {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,1200,700)
    if (typeof(SM) == 'object'){
        SM.UpdateAll();
    }

    img('background',0,0)

    for (let i=0; i<Buttons.length; i++) {
        Buttons[i].render();
    }
}
var SpinInterval
events = [];
function Spin() {
    if (Spinnable) {
        CreateSM();
        Spinnable = false;
        SpinInterval = setInterval(function() {
            RenderFrame();
            if (events.includes('Finished4')) {
                RemoveEvent('Finished4');
                clearInterval(SpinInterval);
                Spinnable = true;
                setTimeout(RenderFrame,20)
            }
        },10)
    }
}
function RemoveEvent(evt) {
    i = events.indexOf(evt);
    if (i !== -1) {
        events.splice(i,1);
    }
}


class Slot {
    constructor(symbol, column, id) {
        this.y = 0 - (id * 150);
        this.x = (column * 150) + offset;
        this.id = id;
        this.symbol = symbol;
    }
    move() {
        this.y += 10
    }
}
class SlotMachine {
    constructor(data) {
        this.LastSymbols = data.symbols;
        console.log(this.LastSymbols);
        this.Rows = [];
        for (let i=0; i < this.LastSymbols.length; i++) {
            let Row = [];
            for (let j=0; j < ((i+3) * 3); j++ ) {
                let Slt = new Slot(PossibleSlots[Math.floor(Math.random() * PossibleSlots.length)],i,j)
                Row.push(Slt)
            }
            for (let j=0; j < this.LastSymbols[i].length; j++) {
                let slt = this.LastSymbols[i][j];
                Row.push(new Slot(slt,i,Row[Row.length-1].id + 1))
            }

            this.Rows.push(Row);
        }


    }
    UpdateAll() {
        let size = 150
        for (let i = 0; i < this.Rows.length; i++) {
            let cRow = this.Rows[i];

            for (let j = 0; j < this.Rows[i].length; j++) {
                let slt = this.Rows[i][j];
                if (cRow[cRow.length - 1 ].y < 50) {
                    slt.move();
                } else {
                    if (!events.includes('Finished' + i)) {
                        events.push('Finished' + i)
                        if (i == 4) {
                            console.log('SPinbutton!')
                            events.push('spinbutton');
                        }
                    }
                }
                img('slots/' + slt.symbol, slt.x, slt.y, size, size);
            }

        }
    }
}
let SM;
function CreateSM() {
    fetchSlots().then(data => {
        SM = new SlotMachine(data);
    });
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

class Button {
    constructor(func,x,y,width,height,image, states=false) {
        this.funct = func;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = image;
        this.states = states
        this.state = true;
    }
    func() {
        this.state = false;
        this.funct();
    }

    render() {
        let imgsrc = this.img

        if (events.includes(this.img)) {
            this.state = true;
            RemoveEvent(this.img)
        }

        if (this.states) {
            imgsrc = imgsrc + '-' + this.state;
        }
        img(imgsrc,this.x,this.y,this.width,this.height);
    }

}

function ClickHandling(evt) {
    let Cords = {"x": evt.offsetX, "y":evt.offsetY}
    console.log(Cords);
    for (let i=0; i<Buttons.length; i++) {
        let button = Buttons[i];
        console.log(button);
        if ( btw(Cords.x,button.x,button.x+button.width) && btw(Cords.y,button.y,button.y+button.height)) {
            button.func();
        }
    }
}
canvas.addEventListener('click',ClickHandling);
function btw(a,b,c) {return (a > b && a < c) ? true : false}

function color(col) {
    ctx.fillStyle = col;
}

Buttons.push(new Button(Spin,850,510,200,200,'spinbutton',true))

window.onload = function() {
    for (let i=0;i<3;i++) {
        setTimeout(RenderFrame, i*50)
    }
}