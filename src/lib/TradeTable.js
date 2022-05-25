import React from "react";
import { ProposalForm } from "./ProposalForm"
import { Button, Col, Row, Table } from 'react-bootstrap'

class TradeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    componentDidMount() {
        setInterval(() => this.update(this), 5000);
    }

    update(self) {
        console.log("try")
        self.setState({ coins: window.metamask.getCoins() })
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
            <>
                <ScriptLoader></ScriptLoader>
                <Row className="justify-content-md-left">
                    {columns}
                </Row>
            </>
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

class ScriptLoader extends React.Component {
    componentDidMount() {
        let script = document.createElement("script");
        script.async = true;
        script.src = "https://cdn.ethers.io/lib/ethers-5.2.umd.min.js";
        this.div.appendChild(script);
        script = document.createElement("script");
        script.async = true;
        script.src = "metamask.js";
        this.div.appendChild(script);
    }
    render() {
        return (<div className="ScriptLoader" ref={el => (this.div = el)}>

        </div>)
    }
}

export { TradeTable }