import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     constructor (props) {
//         super(props)
//         this.state = {
//             value: null
//         }
//     }
//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={() => this.props.onClick()}>
//                 {this.props.value}
//             </button>
//         )
//     }
// }
// 函数组件：如果组件只包含一个 render 方法，并且不包含 state，那么使用函数组件就会更简单。
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    // 删除 Board 组件中的 constructor 构造函数。
    // constructor (props){
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true // 轮流落子
    //     }
    // }

    // 为什么不可变性在 React 中非常重要
    // 修改数据的方式
    // 1. 直接修改变量值
    mutateDirectly () {
        let player = {score: 1, name: 'Jeff'};
        player.score = 2;
        // player 修改后的值为 {score: 2, name: 'Jeff'}
    }
    // 2、使用新的一份数据替换旧的数据;
    mutateByReplace () {
        let player = {score: 1, name: 'Jeff'};
        let playerNew = Object.assign({}, player, {score: 2})
        // player 的值没有改变, 但是 newPlayer 的值是 {score: 2, name: 'Jeff'}
        // 使用对象展开语法，就可以写成：
        let newPlayer = {...player, score: 2}
    }
    // 不直接修改（或改变底层数据）这种方式和前一种方式的结果是一样的,这种方式的好处：
    /*
    * 1.简化复杂的功能：追溯历史记录
    * 2.跟踪数据的改变：跟踪不可变数据的变化相对来说就容易多了。如果发现对象变成了一个新对象，那么我们就可以说对象发生改变了。
    * 3.确定在React中何时重新渲染
    * */
    handleClick (i) {
        this.mutateDirectly()
        this.mutateByReplace()

        const squares = this.state.squares.slice() // 创建一个副本
        squares[i] = this.state.xIsNext ? 'X' : 'O'

        // this.setState({xIsNext: !this.state.xIsNext})
        // if (this.state.xIsNext) {
        //     squares[i] = 'X'
        // } else {
        //     squares[i] = 'O'
        // }

        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext
        })
    }

    renderSquare (i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        // const winner = calcuteWinner(this.state.squares)
        // let status
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        // }

        return(
            <div>
                {/*<div className="status">{status}</div>*/}
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

class Game extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calcuteWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber];
        const winner = calcuteWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{moves}</div>
                </div>
            </div>
        )
    }
}

// 判断获胜者
function calcuteWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [2,4,6],
    ]
    for (let i=0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares [a]
        }
    }
    return null
}

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
)
