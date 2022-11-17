const FPS = 60  // combine into one file
const GRAVITY = .0981/FPS

class GameEvent {
    constructor(type, time, props) {
        this.type = type
        this.time = time
        this.props = props
    }
}

async function getImage(path, w, h, scale){
    // conver image loading from async to synchronous using a Promise
    return await new Promise(ret => {
        let img = new Image();
        img.src = path;
        img.onload = () => ret(img);  // return when img is loaded
    })

    // let canvas = document.createElement('canvas');
    // canvas.width= w*scale;
    // canvas.height= h*scale;
    // context = canvas.getContext("2d", {willReadFrequently: true});

    // // console.error(canvas.getBoundingClientRect());
    
    // // return img1;
    // context.scale(scale, scale)
    // context.drawImage(img1, 0, 0);
    // context.setTransform(1, 0, 0, 1, 0, 0)
    // // context.fillStyle = '#00ff0080'
    // // context.fillRect(0, 0, 1e4, 1e4)
    // // console.error(context.width)
    // return [canvas, w*scale, h*scale];
}

class GameObject {
    constructor(pos, vel) {
        this.pos = pos
        this.vel = vel
        this.id = new Date()
        this.set_canvas = this.set_canvas.bind(this)
    }

    set_canvas(img) {
        // console.log("Trying to set canvas for", this)
        // let [canvas, w, h] = props
        this.img = img
        // this.ctx = canvas.getContext('2d')
        // this.w = w
        // this.h = h
        // this.ctx = canvas.getContext('2d', {willReadFrequently: true})
    }
    
    tick() {
        this.pos[0] += this.vel[0]
        this.pos[1] += this.vel[1]

        // console.log("OBJ", screen.width*this.pos[0], screen.height*this.pos[1])
        
        if (this.pos[0] < -.6 || 1.6 < this.pos[0]) return false;
        if (this.pos[1] < -.6 || 1.6 < this.pos[1]) return false;
        return true;
    }

    render(canvas_context) {
        let offscreenRod = this.img
        let pos = [this.pos[0]*screen.width,this.pos[1]*screen.height];
        // TODO: Center the rod
        canvas_context.drawImage(offscreenRod, pos[0], pos[1]);
    }

}

class RodObject extends GameObject {
    rod_vel = -.013;
    rod_gap = 550
    rod_scale = .4
    // rod_vel = -.000;

    img_promise = getImage("sprites/rod.png")
    
    constructor(pos) {
        super(pos, [0, 0], 10, 10)
        this.vel[0] = this.rod_vel
        this.img_promise.then(this.set_canvas)
    }

    render(canvas_context) {
        // console.log(this.ctx)
        if (this.img === undefined) return;
        let offscreenRod = this.img
        let pos = [this.pos[0]*screen.width/this.rod_scale,this.pos[1]*screen.height];
        // TODO: Center the rod
        canvas_context.scale(.5, .5)
        canvas_context.drawImage(offscreenRod, pos[0], +pos[1]+this.rod_gap/2);
        // console.log(pos[0], pos[0]+this.w/2, this.w)
        // canvas_context.fillStyle = "#ffffff"
        // canvas_context.fillRect(...pos, 12, 12)
        // canvas_context.fillStyle = "#1b1b1b"
        // canvas_context.fillRect(...pos, 10, 10)
        canvas_context.scale(1, -1)
        canvas_context.drawImage(offscreenRod, pos[0], -pos[1]+this.rod_gap/2);
        canvas_context.setTransform(1, 0, 0, 1, 0, 0)
    }
}

class BirdObject extends GameObject {
    auto_thresh = .9
    tap_speed = -.026

    img_promise = getImage("sprites/bird not angry big.png")

    constructor(pos, vel) {
        super(pos, vel)
        // if (vel) this.tap_speed = vel[1]
        this.img_promise.then(this.set_canvas)
    }

    tick() {
        this.pos[0] += this.vel[0]
        this.pos[1] += this.vel[1]

        this.vel[1] += GRAVITY
        // console.log(this.pos[1], this.vel[1])

        // console.log("OBJ", screen.width*this.pos[0], screen.height*this.pos[1])
        
        if (this.pos[1] > this.auto_thresh) this.vel[1] = this.tap_speed;
        return true;
    }
}

class BlankObject extends GameObject {
    img_promise = getImage('Sprites/blank.png')
    
    constructor(pos) {
        super(pos, [0, 0])
        this.img_promise.then(this.set_canvas)
    }
    
    render(canvas_context) {
        let ctx = this.canvas.getContext("2d")
        let pos = [this.pos[0]*screen.width, this.pos[1]*screen.height]

        let data = ctx.getImageData(0, 0, this.w, this.h)
    
        canvas_context.putImageData(data, pos[0], pos[1])
        // console.log(this, ":- Image has been drawn")
    }
}

function render_entities(entities, canvas_context) {
    for (entity of entities) entity.render(canvas_context)
}

function handleGameEvent(event, entities, birds) {
    switch (event.type) {
    case 'Rod':
        // console.log("Inserted new rod from event")
        entities.push(new RodObject(
            [1.5, event.props.height]));
        break;
    case 'Bird':
        console.log("Bird Tap!")
        for (let bird of birds)
            bird.vel[1] = bird.tap_speed
    }
}

function simulate(queue, start_time) {
    const MAX_EVENT_DELAY = 1200

    event_generator(queue, start_time);

    let entities = []
    let birds = []

    console.log('Bird Object:', (new BirdObject()).tap_speed)
    birds.push(new BirdObject([.2, 1], [0, (new BirdObject()).tap_speed]))
    // birds.push(new BirdObject([.5, .5], [0, -.032]))
    // birds.push(new BirdObject([.4, .6], [0, -.033]))
    // birds.push(new BirdObject([.3, .7], [0, -.034]))
    // birds.push(new BirdObject([.2, .8], [0, -.035]))
    // birds.push(new BirdObject([.1, .9], [0, -.036]))
    for (let bird of birds)
        entities.push(bird)

    setInterval(function simulation_tick() {
        let now = new Date().getTime() - start_time;
        // console.log("SIMULATION TICK", now)
        
        // TODO: change entities from events
        let ended_events = [];
        // if (queue.length) console.log('NEW HANDLING')
        for (let event_idx in queue) {
            let event = queue[event_idx];
            let delta = event.time - now;
            if (-11 < delta && delta < 13) {
                handleGameEvent(event, entities, birds);
                // console.log("HANDLING EVENT", entities)
            } else if (delta < -MAX_EVENT_DELAY) {
                ended_events.push(event_idx);
            }
        }

        ended_events.reverse()
        if (queue.length > 150) console.log('Q', queue.length)
        for (let event_idx of ended_events) {
            queue.splice(event_idx, 1)
        }

        // tick all entities
        let ended = []
        for (let rod_idx in entities) {
            let exists = entities[rod_idx].tick()
            // console.log(entities[rod_idx]);
            if (!exists) ended.push(rod_idx)
        }
        // console.log("ELEN", entities.length)
        // if (ended.length) console.log("DELETED THINGS")

        // remove entities that won't be simulated anymore
        ended.reverse()
        for (let rod_idx of ended) {
            entities.splice(rod_idx, 1)
        }

        // console.log(entities)
        // console.log(queue);

    }, 1000/FPS);

    // setInterval(() => {
    //     console.log("ENTITIES", entities)
    // }, 1000);
    
    return entities
}

function event_generator(queue, start_time) {  // imitates server and user sending events
    const ROD_INTERVAL = 1500
    
    setInterval(() => {
        // console.log("NEW ROD EVENT")
        let now = new Date() - start_time;
        queue.push(new GameEvent('Rod', now+ROD_INTERVAL, {
            height: Math.random()+.2
        }));
        // console.log(queue.length)
        // console.log("QUEUE", queue)
    }, ROD_INTERVAL);
    
    const BIRD_INTERVAL = 1200
    
    // setInterval(() => {
    //     // console.log("NEW ROD EVENT")
    //     let now = new Date() - start_time;
    //     queue.push(new GameEvent('Bird', now+BIRD_INTERVAL, {
    //         vel: [.1, Math.random()*.8+.4]
    //     }));
    //     // console.log("QUEUE", queue)
    // }, BIRD_INTERVAL);
    
    return start_time;

}
