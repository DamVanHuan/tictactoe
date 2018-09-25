import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
    if (props.highlight) {
        return (
            <button className="square" style={{color: "#ff0000"}} onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
    else
    {
        return (
            <button className="square" onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        let won = false;
        if (this.props.winnerPos && this.props.winnerPos.indexOf(i) >= 0) {
            won = true;
        }

        return (
            <Square
                key= {i}
                highlight={won}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let board = [];

        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare(i*3 + j));
            }
            board.push(<div className="board-row" key={i}>{row}</div>);
        }
        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    col: null,
                    row: null
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    col: i % 3,
                    row: parseInt(i / 3, 10)
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,

        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    sortMove() {
        this.setState({
            isAscending: !this.state.isAscending
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Move #' + move + ' ('  + step.col + ', ' + step.row + ')' :
                'Start';
            return (
                <li key={move} >
                    <button onClick={() => this.jumpTo(move)} style={this.state.stepNumber === move ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>{desc}</button>
                </li>
            );
        });

        if (!this.state.isAscending) {
            moves.reverse();
        }

        let status, winnerLine;
        if (winner) {
            status = "Winner: " + winner[0];
            winnerLine = winner[1];
        } else if (this.state.stepNumber === 9) {
            status = "Draw!";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winnerPos={winnerLine}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <button className="revertButton" onClick={() => this.sortMove()}>
                        {this.state.isAscending ? 'Sort by ascending' : 'Sort by descending'}
                    </button>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return null;
}
