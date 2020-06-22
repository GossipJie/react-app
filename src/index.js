
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*
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
        // let player = {score: 1, name: 'Jeff'};
        // let playerNew = Object.assign({}, player, {score: 2})
        // player 的值没有改变, 但是 newPlayer 的值是 {score: 2, name: 'Jeff'}
        // 使用对象展开语法，就可以写成：
        // let newPlayer = {...player, score: 2}
    }
    // 不直接修改（或改变底层数据）这种方式和前一种方式的结果是一样的,这种方式的好处：
    /!*
    * 1.简化复杂的功能：追溯历史记录
    * 2.跟踪数据的改变：跟踪不可变数据的变化相对来说就容易多了。如果发现对象变成了一个新对象，那么我们就可以说对象发生改变了。
    * 3.确定在React中何时重新渲染
    * *!/
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
                {/!*<div className="status">{status}</div>*!/}
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
            posts: [],
            comments: []
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                posts: ['posts', 'posts2']
            }, () => {
                console.log('-------posts--------')
                console.log(this.state)
                console.log(this.state.posts)
                console.log(this.state.comments)
            });
        })
        setTimeout(() => {
            this.setState({
                comments: ['comments', 'comments2']
            }, () => {
                console.log('-------comments--------')
                console.log(this.state)
                console.log(this.state.posts)
                console.log(this.state.comments)
            });
        })
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
            return squares[a]
        }
    }
    return null
}

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
)
*/

/*class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isToggleOn: true}

        // 为了在回调中使用
        // this.handleClick1 = this.handleClick.bind(this)
    }
    // handleClick() {
    //     this.setState(state => ({
    //         isToggleOn: !state.isToggleOn
    //     }))
    // }
    // class fields 正确的绑定回调函数
    handleClick = () => {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }))
    }
    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.isToggleOn ? 'ON' : 'OFF'}
            </button>
        )
    }
}*/

function UserGreeting(props) {
    return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
    return <h1>Please sign up.</h1>;
}

function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <UserGreeting />;
    }
    return <GuestGreeting />;
}

function LoginButton(props) {
    return (
        <button onClick={props.onClick}>
            Login
        </button>
    )
}

function LogoutButton(props) {
    return (
        <button onClick={props.onClick}>
            Logout
        </button>
    )
}

class LoginControl extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoggedIn: true}
    }

    handleLoginClick = () => {
        this.setState(state => ({
            isLoggedIn: true
        }))
    }

    handleLogoutClick = () => {
        this.setState(state => ({
            isLoggedIn: false
        }))
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;
        let button;

        if (isLoggedIn) {
            button = <LogoutButton onClick={this.handleLogoutClick}/>
        } else {
            button = <LoginButton onClick={this.handleLoginClick}/>
        }

        return (
            <div>
                <Greeting isLoggedIn={isLoggedIn}/>
                {button}
            </div>
        )
    }
}

ReactDOM.render(
    <LoginControl/>,
    document.getElementById('root')
)

function Mailbox(props) {
    const unreadMessages = props.unreadMessages;
    return (
        <div>
            <h1>Hello!</h1>
            {
                unreadMessages.length > 0 &&
                    <h2>
                        You have {unreadMessages.length} unread message.
                    </h2>
            }
        </div>
    )
}

const messages = ['React', 'Re: React', 'Re:Re: React'];

ReactDOM.render(
    <Mailbox unreadMessages={messages}/>,
    document.getElementById('mailBox')
)

const numbers = [1,2,3,4,5]

function ListItem(props) {
    return <li>{props.value}</li>
}

function NumberList(props) {
    const numbers = props.numbers
    /*const listItems = numbers.map((number) =>
        // key 帮助 React 识别哪些元素改变了，比如被添加或删除。
        // <li key={number.toString()}>{number}</li>
        <ListItem key={number.toString()} value={number}/>
    )
    return <ul>{listItems}</ul>
    */
    // 在 JSX 中嵌入 map()
    return (
        <ul>
            {numbers.map(number => [
                <ListItem key={number.toString()} value={number}/>
            ])}
        </ul>
    )
}

ReactDOM.render(
    <NumberList numbers={numbers}/>,
    document.getElementById('list')
)

function BoilingVerdict(props) {
    if (props.celsius >= 100) {
        return <p>the water would boil.</p>
    }
    return <p>The water would not boil</p>
}

class Calculator extends React.Component{
    constructor(props) {
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = {temperature: '', scale: 'c'};
    }

    handleCelsiusChange(temperature) {
        this.setState({scale: 'c', temperature})
    }

    handleFahrenheitChange(temperature) {
        this.setState({scale: 'f', temperature})
    }

    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature
        const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature
        return(
            <div>
                <TemperatureInput
                    scale="c"
                    temperature={celsius}
                    onTemperatureChange={this.handleCelsiusChange} />
                <TemperatureInput
                    scale="f"
                    temperature={fahrenheit}
                    onTemperatureChange={this.handleFahrenheitChange} />

                <BoilingVerdict
                    celsius={parseFloat(celsius)} />
            </div>
        )
    }
}

const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onTemperatureChange(e.target.value);
    }

    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return(
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]};</legend>
                <input
                    value={temperature}
                    onChange={this.handleChange}/>
            </fieldset>
        )
    }
}

// 编写转换函数
function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 /9;
}

function toFahrenheit (celsius) {
    return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
        return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}


ReactDOM.render(
    <Calculator/>,
    document.getElementById('calculator')
)

// 组合 VS 继承
function FancyBorder(props) {
    return(
        <div className={'FancyBorder FancyBorder-' + props.color}>
            {props.children}
        </div>
    )
}

function WelcomeDialog() {
    return (
        <FancyBorder color="blue">
            <h1 className="Dialog-title">
                Welcome
            </h1>
            <p className="Dialog-message">
                Thank you for visiting our spacecraft!
            </p>
        </FancyBorder>
    )
}

ReactDOM.render(
  <WelcomeDialog/>,
  document.getElementById('dialog')
);

function Contacts() {
    return <div className="Contacts" />;
}

function Chat() {
    return <div className="Chat"/>
}

function SplitPane(props) {
    return (
        <div className="SplitPane">
            <div className="SplitPane-left">
                {props.left}
            </div>
            <div className="SplitPane-right">
                {props.right}
            </div>
        </div>
    )
}

function App() {
    return (
        <SplitPane left={
            <Contacts />
        }
        right={
           <Chat />
        } />
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
)

// React 哲学
class ProductCategoryRow extends React.Component {
    render() {
        const category = this.props.category;
        return (
            <tr>
                <td colSpan = "2">
                    {category}
                </td>
            </tr>
        )
    }
}

class ProductRow extends React.Component {
    render() {
        const product = this.props.product;
        const name = product.stocked ?
            product.name :
            <span style={{color: 'red'}}>
        {product.name}
      </span>;

        return (
            <tr>
                <td>{name}</td>
                <td>{product.price}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {
    render() {
        const rows = [];
        let lastCategory = null;

        this.props.products.forEach((product) => {
            if (product.category !== lastCategory) {
                rows.push(
                    <ProductCategoryRow
                        category={product.category}
                        key={product.category} />
                );
            }
            rows.push(
                <ProductRow
                    product={product}
                    key={product.name} />
            );
            lastCategory = product.category;
        });

        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    render() {
        return (
            <form>
                <input type="text" placeholder="Search..." />
                <p>
                    <input type="checkbox" />
                    {' '}
                    Only show products in stock
                </p>
            </form>
        );
    }
}

class FilterableProductTable extends React.Component{
    render() {
        return (
            <div>
                <SearchBar/>
                <ProductTable products={this.props.products}/>
            </div>
        )
    }
}

const PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
    <FilterableProductTable products={PRODUCTS}/>,
    document.getElementById('container')
);
