import React, {Component}  from 'react';

class Items extends Component {

    constructor(props) {
        super(props)
        this.state = {
            clicks:0,
            show:true
        }
    }
    IncrementItem = () => {
        this.setState({ clicks: this.state.clicks + 1 });
    }

    DecrementItem = () => {
        this.setState({ clicks: this.state.clicks - 1 });
    }

    render() {
        return (
        <div>
            <button onClick={this.IncrementItem}>Add Quantity</button>
            <button onClick={this.DecrementItem}>Decrease Quantity</button>
            <h2>Quantity : { this.state.clicks } </h2>
        </div>
        );
    }

}

export default Items