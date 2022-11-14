function init() {
    let event_queue = []
    let entities = simulate(event_queue);  // simulate() is asynchronous

    entities.push(new RodObject([.6, .56]));
    entities.push(new BlankObject([.4, .4], [.000, .000], 602, 144))
    entities.push(new RodObject([.3, .2]));
    // entities.push(new BirdObject([.1, .3], [0, 1.2], 512, 512))
    // entities.push(new BirdObject([.2, .3], [0, 1.3], 512, 512))
    // entities.push(new BirdObject([.3, .3], [0, 1.4], 512, 512))
    // entities.push(new BirdObject([.4, .3], [0, 1.5], 512, 512))
    // entities.push(new BirdObject([.5, .3], [0, 1.6], 512, 512))
    // entities.push(new BirdObject([.6, .3], [0, 1.7], 512, 512))
    
    slide_bg()

    let canvas = document.querySelector('#game-canvas')
    canvas.height = screen.height
    canvas.width  = screen.width
    let ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 150, 75);

    // setInterval(() => {
    //     for (entity of entities)
    //         entity.render(canvas.getContext("2d"))
    // }, 1000/FPS)

    getImage("sprites/rod.png").then(() => {
        // let offscreenRod = canvas;
        let rodImg = canvas;
        ctx.drawImage(rodImg, 500, 500)
    });  // canvas

    setInterval(() => {
        ctx.clearRect(0, 0, screen.width, screen.height)
        render_entities(entities, ctx)
    }, 1000/FPS);
}

function slide_bg() {
    const cloudSpeed = .2
    const bgGrassSpeed = 1
    const fgGrassSpeed = 1.5
    
    let cloudPos = 0
    let bgGrassPos = 0
    let fgGrassPos = 0
    setInterval(() => {
        document.querySelector('.clouds1').style.transform = "translate("+cloudPos+"px, 0px)"
        document.querySelector('.bgGrass1').style.transform = "translate("+bgGrassPos+"px, 0px)"
        document.querySelector('.fgGrass1').style.transform = "translate("+fgGrassPos+"px, 0px)"
        document.querySelector('.clouds2').style.transform = "translate("+(cloudPos+screen.width)+"px, 0px)"
        document.querySelector('.bgGrass2').style.transform = "translate("+(bgGrassPos+screen.width)+"px, 0px)"
        document.querySelector('.fgGrass2').style.transform = "translate("+(fgGrassPos+screen.width)+"px, 0px)"
        
        cloudPos = (cloudPos-cloudSpeed)%screen.width
        bgGrassPos = (bgGrassPos-bgGrassSpeed)%screen.width
        fgGrassPos = (fgGrassPos-fgGrassSpeed)%screen.width
        // console.log(bgGrassPos)
    }, 1000/FPS)
}