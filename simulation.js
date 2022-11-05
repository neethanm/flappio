const FPS = 60  // combine into one file

class GameEvent {
    constructor(type, time, prop) {
        this.type = type
        this.time = time
        this.prop = prop
    }
}

class GameObject {
    constructor(pos, vel, w, h, img) {
        this.pos = pos
        this.vel = vel
        this.w = w
        this.h = h
        this.img = img;
    }

    tick() {
        this.pos[0] += this.vel[0]
        this.pos[1] += this.vel[1]

        if (this.pos[0] < 0 || this.pos[0] < 500) return false;
        if (this.pos[1] < 0 || this.pos[1] < 500) return false;
        return true;
    }

    render(canvas) {
        
    }

}

class RodObject extends GameObject {
    this_vel = 1;
    
    constructor(pos) {
        super(pos, this_vel)
    }

    render(canvas) {
        // TODO: RENDER THE ROD HERE
        var offscreen_Rod = this.getElementsByClassName("rod_g0");
        var onscreen_canvas = this.getElementById("game-canvas");
        var onscreen_context = onscreen_canvas.getContext("2d");
        onscreen_context.putImageData(offscreen_Rod,this.pos[0],this.pos[1]);

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

    render(canvas) {
        // TODO: RENDER THE BIRD HERE
        var offscreen_Bird = document.getElementsByClassName("bird");
        var onscreen_canvas = document.getElementById("game-canvas");
        var onscreen_context = onscreen_canvas.getContext("2d");

        onscreen_context.drawImage(offscreen_Bird);
    }
}

function render_entities(entities, canvas) {
    for (entity of entities) entity.render(canvas)
}

function simulate(queue) {

    event_gatherer(queue);

    let entities = []
    
    setInterval(function simulation_tick() {

        // TODO: change entities from events

        // tick all entities
        let ended = []
        for (rod_idx in entities) {
            let exists = entities[rod_idx].tick()
            console.log(entitues[rod_idx]);
            if (!exists) ended.push(rod_idx)
        }

        // remove entities that won't be simulated anymore
        ended.reverse()
        for (rod_idx of ended) {
            entities.splice(rod_idx, 1)
        }
        // console.log("The simulation is running indeed")


    }, 1000/FPS);

    return entities

}

function event_gatherer(queue) {  // imitates server and user sending events
    let rodN = 0;
    const ROD_INTERVAL = 6000;
    
    setInterval(() => {
        queue.push(new GameEvent('Rod', rodN*ROD_INTERVAL, {
            height: Math.random()
        }));
        rodN++;
    }, ROD_INTERVAL);

}

exports.simulate = simulate;