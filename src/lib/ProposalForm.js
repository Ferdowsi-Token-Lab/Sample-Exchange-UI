import React from "react";

class ProposalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { volume: '', targetcoin: '', ratio: '', coins: props.targetcoins || [] };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    purpose() {
        window.metamask.purpose(this.props.coinkey, this.state.volume, this.state.targetcoin, this.state.ratio * this.state.volume)
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>volume:</label>
                    <input type="number" value={this.state.volume} name="volume" onChange={this.handleChange} />
                </div>
                <label>ratio:</label>
                <input size="3" type="number" value={this.state.ratio} name="ratio" onChange={this.handleChange} />
                <label>targetcoin:</label>
                <select value={this.state.targetcoin} name="targetcoin" onChange={this.handleChange}>
                    {this.state.coins.map(function (coin) {
                        return <option value={coin.key}>{coin.name}</option>;
                    })}
                </select>
                <button>Add</button>
            </form>
        );
    }
}

export { ProposalForm }