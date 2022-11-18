function App() {
    // setTimeout(init, 1)
    return (<div>
    <canvas id="game-canvas" className="obj" width="100%" height="100%"></canvas>
    <a href="/leaderboard.html"><div id="pause1" className="obj pause"></div></a>

    {
    /* <div> 
    <button id="cog1" type="button" className="obj settings" onClick={screenLead}>
        <span className="button icon"><ion-icon name="cog-outline"></ion-icon></span>
    </button>
    </div>

    <div> <button id="play1" type="button" className="obj play"> <span className="button icon"><ion-icon name="play-outline"></ion-icon></span>
        </button>
    </div> */}

    </div>)
}
ReactDOM.render(<App />, document.querySelector('#app'))
const start_time = new Date()
var queue = init(start_time)

const BIRD_INTERVAL = 20

document.onkeydown = (e) => {
    // if (e.repeat) return;
    let now = new Date() - start_time
    // console.log(e, queue)
    switch (e.code) {
    case 'Space':
        queue.push(new GameEvent('Bird', now+BIRD_INTERVAL)); break;
    case 'Enter':
        queue.push(new GameEvent('Freeze', now+BIRD_INTERVAL)); break;

    }
}