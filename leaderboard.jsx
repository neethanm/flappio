// var url = '10.3.32.120:3001/'
var url = '10.14.143.103:3001/'
// var url = 'localhost:3001/'
var post_path = 'leaderboard'
class App extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            values: []
        }
        fetch(`http://${url+post_path}`, {
            method: "get",
            // body: 12
        }).then(
            res=>{
                console.log(res)
                let out = res.text()
                out.then(val=>{
                    console.log("Conversion succeeded:", val)
                })
                .catch(err=>{
                    console.log('Consversion failed:', err)
                })
                return out
            }
        ).then(val=>{
            console.log('Received response:', val)
            // let x = JSON.parse(`[${val.toString()}]`)
            // console.log(x)
            this.setState({
                values: JSON.parse(val)
            })
        })
        console.log("SENT REQUEST")
    }
    render() {
        var i = 0;
        let tstyle = {border: "1px solid silver", margin: "0px", padding: "0px"}
        let list = this.state.values.map(x=>{
            i++
            return <tr style={tstyle} key={i}><td style={tstyle}>{x.IP}</td><td style={tstyle}>{x.score}</td></tr>
        })
        console.log(list)
        return <div>
            <button><a href="/" style={{ color: "#1b1b1b", textDecoration: ""}}>PLAY</a></button>
            <table style={tstyle}>
            <thead><th>IP</th><th>score</th></thead>
            {list}
            </table>
        </div>
    }
}

console.log(document.querySelector('#table'))
ReactDOM.render(<App/>, document.querySelector('#table'))
