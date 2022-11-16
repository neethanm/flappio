url = 'localhost:3000/'
post_path = 'leaderboard'
class App {
    constructor(props) {
        super(props)
        this.state = {
            values: []
        }
        fetch(`http://${url+post_path}`, {
            method: "POST",
            body: JSON.stringify(new Date())
        })
        .then(val=>{
            this.setState({
                values: val
            })
        })
    }
    render() {
        return <>
            {values}
        </>
    }
}

ReactDOM.render(<App/>, document.querySelector('#app'))