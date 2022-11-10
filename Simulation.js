const FPS = 60  // combine into one file

class GameEvent {
    constructor(type, time, props) {
        this.type = type
        this.time = time
        this.props = props
    }
}

class GameObject {
    constructor(id, pos, vel, w, h, img) {
        this.pos = pos
        this.vel = vel
        this.w = w
        this.h = h
        this.img = img
        this.id = id
    }

    tick() {
        this.pos[0] += this.vel[0]
        this.pos[1] += this.vel[1]

        // console.log("OBJ", screen.width*this.pos[0], screen.height*this.pos[1])
        
        if (this.pos[0] < -.6 || 1.6 < this.pos[0]) return false;
        if (this.pos[1] < -.6 || 1.6 < this.pos[1]) return false;
        return true;
    }

    render(canvas_context) {}

}

async function getImage(path){
    // conver image loading from async to synchronous using a Promise
    img1 = await new Promise(ret => {
        let img = new Image();
        img.src = path;
        img.onload = () => ret(img);  // return when img is loaded
    })

    let canvas = document.createElement('canvas');
    // canvas.width= '1360px';
    // canvas.height= '400px';
    context = canvas.getContext("2d");

    return img1;
    // context.drawImage(img1, 0, 0);
    // URL.revokeObjectURL(url)
    // return canvas;
}

class RodObject extends GameObject {
    rod_vel = -.00352;

    x = getImage("sprites/rod.png").then((canvas) => {
        this.p = canvas;
    });  // canvas
    
    constructor(id, pos) {
        super(id, pos, [0, 0])
        this.vel[0] = this.rod_vel
    }

    render(canvas_context) {
        console.log(this.p)
        let offscreenRod = this.p.getContext('2d');
        let pos = [this.pos[0]*screen.width,this.pos[1]*screen.height];
        // TODO: Center the rod
        let offscreen_data = offscreenRod.getImageData(0, 0, 200, 200);
        // console.log(offscreenRod)
        canvas_context.drawImage(offscreen_data, pos[0], pos[1]);
        // canvas_context.drawImage(offscreenRod, pos[0], pos[1]);
        console.log()
        // canvas_context.drawImage(offscreenRod, pos[0], pos[1]);
    }
}

class BirdObject extends GameObject {

    constructor(pos, vel, /* TODO: OTHER ARGUMENTS */) {
        super(pos, vel)
        // TODO: CONSTRUCTOR CODE
    }

    tick() {
        // TODO: UPDATE BIRD HERE
    }

    render(canvas_context) {
        // TODO: RENDER THE BIRD HERE
    }
}

function render_entities(entities, canvas_context) {
    for (entity of entities) entity.render(canvas_context)
}

function handleGameEvent(event, entities) {
    switch (event.type) {
    case 'Rod':
        console.log("Inserted new rod from event")
        entities.push(new RodObject(
            new Date(), [1.1, event.props.height]));
        break;
    }
}

function simulate(queue) {

    let start_time = event_generator(queue);

    let entities = []

    setInterval(function simulation_tick() {

        
        let now = new Date().getTime() - start_time;
        // console.log("SIMULATION TICK", now)
        
        // TODO: change entities from events
        if (queue.length) console.log('NEW HANDLING')
        for (let event of queue) {
            let delta = event.time - now;
            if (-23 < delta && delta < 23) {
                handleGameEvent(event, entities);
                console.log("HANDLING EVENT", entities)
            }
        }

        // tick all entities
        let ended = []
        for (let rod_idx in entities) {
            let exists = entities[rod_idx].tick()
            // console.log(entities[rod_idx]);
            if (!exists) ended.push(rod_idx)
        }
        // console.log("ELEN", entities.length)
        if (ended.length) console.log("DELETED THINGS")

        // remove entities that won't be simulated anymore
        ended.reverse()
        for (let rod_idx of ended) {
            entities.splice(rod_idx, 1)
        }

        // console.log(entities, queue);

    }, 1000/FPS);

    setInterval(() => {
        console.log("ENTITIES", entities)
    }, 1000);
    
    return entities
}

function event_generator(queue) {  // imitates server and user sending events
    const ROD_INTERVAL = 1500;
    
    let start_time = new Date();
    setInterval(() => {
        console.log("NEW ROD EVENT")
        let now = new Date() - start_time;
        queue.push(new GameEvent('Rod', now+ROD_INTERVAL, {
            height: Math.random()
        }));
        console.log("QUEUE", queue)
    }, ROD_INTERVAL);
    
    return start_time;

}
