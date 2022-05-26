import React from "react";
import { Button, InputGroup, Form, FormSelect, FormControl, Row, Col, FormLabel } from 'react-bootstrap'

class ProposalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { volume: '', targetcoin: props.targetcoins[0].key, ratio: '', coins: props.targetcoins || [], key: props.coinkey };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state)
        let metamask = window.metamask;
        metamask.propose(this.state.key, this.state.targetcoin, this.state.volume, this.state.ratio)

    }


    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col size="auto">
                        <InputGroup className="mb-2">
                            <InputGroup.Text >volume:</InputGroup.Text>
                            <FormControl type="number" value={this.state.volume} name="volume" onChange={this.handleChange} />
                        </InputGroup>
                        <InputGroup className="mb-1">
                            <InputGroup.Text>ratio:</InputGroup.Text>
                            <FormControl size="3" type="number" value={this.state.ratio} name="ratio" onChange={this.handleChange} />
                        </InputGroup>
                    </Col>
                    <Col size="auto">
                        <InputGroup className="mb-3">
                            <InputGroup.Text>targetcoin:</InputGroup.Text>
                            <FormSelect value={this.state.targetcoin} name="targetcoin" onChange={this.handleChange}>
                                {this.state.coins.map(function (coin) {
                                    return <option value={coin.key}>{coin.name}</option>;
                                })}
                            </FormSelect>
                        </InputGroup>
                        <Button type="submit" >Add</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export { ProposalForm }