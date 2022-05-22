import React from "react";
import { ProposalForm } from "./ProposalForm"
import { Button, Col, Row, Table } from 'react-bootstrap'

class TradeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = props
    }
    render() {
        const columns = [];
        this.state.coins.forEach((coin) => {
            columns.push(
                <Col xs lg="3">
                    <CoinTable coinkey={coin.key} coinname={coin.name} coinicon={coin.icon} proposals={coin.proposals} coins={this.state.coins} />
                    <ProposalForm coinkey={coin.key} targetcoins={this.state.coins} />
                </Col>
            )
        });
        return (
            <Row className="justify-content-md-left">
                {columns}
            </Row>
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
            <Col>
                <div className="text-center">
                    {this.props.coinname}
                </div>
                <Table>
                    {rows}
                </Table>
            </Col>
        );
    }
}

class TradeRow extends React.Component {
    render() {
        return (
            <Row>
                <Col>
                    volume: {this.props.volume}
                </Col>
                <Col>
                    ratio: {this.props.ratio}
                </Col>
                <Col>
                    target-coin: {this.props.targetcoin}
                </Col>
                <Col>
                    <Button>approve</Button>
                </Col>
            </Row>
        )
    };
}

export { TradeTable }