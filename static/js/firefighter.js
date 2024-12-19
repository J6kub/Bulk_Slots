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


async function reqFire(idata = undefined) {
    try {
        let linker;
        if (idata === undefined) {
            linker = '/GetFire';
        } else {
            linker = `/GetFire?x=${idata.x}&y=${idata.y}`;
        }

        const response = await fetch(linker);
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;  // Return null or handle the error as needed
    }
}
function FireFighter(idata) {
    idata = {"x":idata.offsetX, "y":idata.offsetY}
    reqFire(idata).then(ReqData => {
        MoneyO.innerHTML = ReqData.userdata.money;
        //console.log(ReqData.firedata)
        if (ReqData.firedata.x == Buttons[0].x && ReqData.firedata.y == Buttons[0].y) {

        } else {
            Buttons[0] = new Button(function(){
                console.log("I'm fired up")
            },ReqData.firedata.x,ReqData.firedata.y,ReqData.firedata.size,ReqData.firedata.size,'flame/frame_',ReqData.firedata.id)
        }
    })
}



function RenderFrame(wins=false) {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,1200,700)

    img('background2',0,0)

    for (let i=0; i<Buttons.length; i++) {Buttons[i].render()}

}

events = [];
function RemoveEvent(evt) {
    i = events.indexOf(evt);
    if (i !== -1) {
        events.splice(i,1);
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
    constructor(func,x,y,width,height,image,id,states=true) {
        this.funct = func;
        this.x = x;
        this.y = y;
        this.id = id;
        this.width = width;
        this.height = height;
        this.img = image;
        this.states = true;
        this.state = 0;
    }
    func() {
        this.update();
        this.funct();
    }
    update() {
        if (this.state < 38) {
            this.state++
        } else {
            this.state = 0
        }
    }

    render() {
        let imgsrc = this.img
        let nummy = this.state;
        if (nummy <= 9) {nummy = "0" + nummy}

        imgsrc = imgsrc + '' + nummy + "_delay-0.06s";

        img(imgsrc,this.x,this.y,this.width,this.height);
    }

}


canvas.addEventListener('click',function (e){FireFighter(e)});
function btw(a,b,c) {return (a > b && a < c) ? true : false}

function color(col) {
    ctx.fillStyle = col;
}

Buttons.push(new Button(function(){
    console.log("How's snooping around little man?")
},850,510,200,200,'flame/frame_',69))

window.onload = function() {
    for (let i=0;i<3;i++) {
        setTimeout(RenderFrame, i*50)
    }
}

const RENDERER = setInterval(function() {
    RenderFrame();
    for (let i=0; i<Buttons.length; i++) {
        Buttons[i].update();
        Buttons[i].render();
    }
},50)

canny.onload() = FireFighter({offsetX:0, offsetY:0})