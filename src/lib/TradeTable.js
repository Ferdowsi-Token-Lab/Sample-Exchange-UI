import React from "react";
import { ProposalForm } from "./ProposalForm"


class TradeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = props
    }
    render() {
        const columns = [];
        this.state.coins.forEach((coin) => {
            columns.push(<CoinTable coinkey={coin.key} coinname={coin.name} coinicon={coin.icon} proposals={coin.proposals} coins={this.state.coins} />)
        });
        return (
            <table>
                <tr>
                    {columns}
                </tr>
            </table>
        );

    }
}

class CoinTable extends React.Component {
    render() {
        const rows = [];
        this.props.proposals.forEach((proposal) => {
            rows.push(<TradeRow key={proposal.key} volume={proposal.volume} ratio={proposal.ratio} targetcoin={proposal.targetcoin} />)
        });
        return (
            <td>
                <table>
                    <tr>
                        <th>{this.props.coinname}</th>
                    </tr>
                    {rows}
                    <tr>
                        <td>
                            <ProposalForm coinkey={this.props.coinkey} targetcoins={this.props.coins} /> {/* TODO Switch props parsing to context */}
                        </td>
                    </tr>
                </table>
            </td>
        );
    }
}

class TradeRow extends React.Component {
    render() {
        return (
            <tr>
                volume: {this.props.volume},  ratio: {this.props.ratio}, target-coin: {this.props.targetcoin}
                <button>approve</button>
            </tr>
        )
    };
}

export { TradeTable }