FPS = 60

function init() {
    let event_queue = []
    let entities = simulate(event_queue);  // simulate() is asynchronous
    
    slide_bg()

    let canvas = document.querySelector('#game-canvas')

    setInterval(() => {
        for (entity of entities)
            entity.render(canvas)
    }, 1000/FPS)

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
