import React, {Component, Fragment}  from 'react';

class Items extends Component {

    constructor(props) {
        super(props)
        this.state = {
            clicks:0,
            show:true,
            n1: 1,
            n2: 0
        }
    }
    
    IncrementItem = () => {
        this.setState({ clicks: this.state.clicks + 1 });
    }

    DecrementItem = () => {
        this.setState({ clicks: this.state.clicks - 1 });
    }

    // fibonacci
    FibIncrease = () => {
        let number = this.state.n1 + this.state.n2
        this.setState({
            n1: number,
            n2: this.state.n1
        })
    
    }

    render() {
        return (
        <Fragment>
            <div>
                <button onClick={this.IncrementItem}>Add Quantity</button>
                <button onClick={this.DecrementItem}>Decrease Quantity</button>
                <h2>Quantity : { this.state.clicks } </h2>
                <button onClick={this.FibIncrease}>Fibonacci Button</button>
                <h2>The current numer is: {this.state.n1}</h2>
            </div>
        </Fragment>
        );
    }

}

export default Items