canvas = document.getElementById('canny');
ctx = canvas.getContext('2d');
//ctx.fillRect(0,00,9000,9000)
offset = 370;
let Money = 1000;
let MoneyO = document.getElementById('money')
let bet = 10;
Spinnable = true;
Buttons = [];
let LoadedImages = {};
let SM;
const PossibleSlots = ["Linus",'Headset','Gpu','Energy','Camera','Card','Printer','Tysk']

async function fetchSlots() {
    try {
        const response = await fetch('/GetSlots?bet=' + bet);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching slots:', error);
    }
}

function RenderFrame(wins=false) {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,1200,700)
    if (typeof(SM) == 'object'){
        SM.RenderAll();
    }

    img('background',0,0)

    for (let i=0; i<Buttons.length; i++) {
        Buttons[i].render();
    }
    if (wins) {
        SM.RenderWins();
    }
    TextBoxRender()
}

events = [];
function Spin() {
    if (Spinnable) {
        SM = null;
        Money -= bet;
        fetchSlots().then(data => {
            if (data['balance'] == 0) {
                alert('not enough money');
                return false;
            }
            Spinnable = false;
            Money = data['money']
            SM = new SlotMachine(data);
            console.log('Initiated SlotMachine')
            const SpinInterval = setInterval(function() {
                //console.log('Running interval')
                SM.UpdateAll()
                RenderFrame();
                if (events.includes('Finished4')) {
                    RemoveEvent('Finished4');
                    clearInterval(SpinInterval);
                    Spinnable = true;
                    RenderFrame(true);
                    SM.RenderWins();
                    events.push('PrintMoney')

                }
            },10)
        });
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
        this.y += 20
    }
}
class SlotMachine {
    constructor(data) {
        this.size = 150;
        this.LastSymbols = data.symbols;
        this.winlines = data.winlines;
        this.winnings = data.winnings;
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

    RenderAll() {
        for (let i = 0; i < this.Rows.length; i++) {
            for (let j = 0; j < this.Rows[i].length; j++) {
                let slt = this.Rows[i][j];
                img('slots/' + slt.symbol, slt.x, slt.y, this.size, this.size);
            }
        }
    }

    UpdateAll() {
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
                            events.push('spinbutton');
                            this.RenderWins()
                        }
                    }
                }
                //img('slots/' + slt.symbol, slt.x, slt.y, size, size);
            }

        }
    }
    RenderWins() {
        let winlines = this.winlines
        for (let i = 0; i < winlines.length; i++) {
            for (let j = 0; j < winlines[i].length; j++) {
                if (winlines[i][j] == 1) {
                    let slt = this.Rows[i][j + this.Rows[i].length - 3];
                    img('win',slt.x,slt.y,this.size,this.size);
                }
            }
        }
    }
}



function img(image, x=0,y=0,xw=0,yw=0) {
    let imageSrc = 'static/img/' + image + '.png'
    let imageC = LoadedImages[imageSrc];

    if (imageC === undefined) {
        console.log('preloaded ' + image);
        imageC = new Image();
        imageC.src = imageSrc
        LoadedImages[imageSrc] = imageC
    }
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
function TextBox(txt, x, y) {
    ctx.font = '50px Arial';
    ctx.fillText(txt,x,y);
}
function TextBoxRender() {
    TextBox(bet,670,630);
}

function ClickHandling(evt) {
    let Cords = {"x": evt.offsetX, "y":evt.offsetY}
    for (let i=0; i<Buttons.length; i++) {
        let button = Buttons[i];
        if ( btw(Cords.x,button.x,button.x+button.width) && btw(Cords.y,button.y,button.y+button.height)) {
            console.log(button.img +' has been pressed')
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
Buttons.push(new Button(lowerBet,750,560,100,100,'subbet'))
Buttons.push(new Button(function() {RenderFrame(); bet += 10},550,560,100,100,'addbet'))

function lowerBet() {
    if (bet - 10 > 0) {
        bet -= 10
    } else {
        alert('reached minimum bet')
    }
    RenderFrame()
}

window.onload = function() {
    for (let i=0;i<3;i++) {
        setTimeout(RenderFrame, i*50)
    }
    fetch('/GetUserData')
        .then(resp => resp.json())
        .then(data => { const Money = data.money; MoneyO.innerHTML = Money; })
}

const RENDERER = setInterval(function() {
    if (Spinnable && SM !== undefined) {
        try {
            RenderFrame()
            SM.RenderWins();
        } catch {

        }



    }
    if (events.includes('PrintMoney')) {
        RemoveEvent('PrintMoney');
        Money += SM.winnings;
        MoneyO.innerHTML = Money + " + " + SM.winnings
    }

    Buttons.forEach(x => x.render())
},250)