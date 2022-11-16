function react_init() {
    ReactDOM.render(<App/>, document.querySelector('.app'))
    init()
}

var curr_screen = 'game';

function screenLead() {
    // screen = 'lead'
    console.log('CLICK LEAD')
}

function screenGame() {
    curr_screen = 'game'
}

function App() {
    let abs = {
        position: 'absolute'
    }
    const ocf = () => {
        init()
    }
    return (<div onClick={ocf}>
    <canvas id="game-canvas"  className="obj" width="100%" height="100%"></canvas>
        <div id="pause1" className="obj pause"></div>

        <div> 
        <button onClick={ocf} id="cog1" type="button" className="obj settings" onClick={screenLead}>
            <span className="button icon"><ion-icon name="cog-outline"></ion-icon></span>
        </button>
        </div>

        <div>
            <button id="play1" type="button" className="obj play">
                <span className="button icon"><ion-icon name="play-outline"></ion-icon></span>
            </button>
        </div>

    </div>)
}
ReactDOM.render(<App />, document.querySelector('.app'))