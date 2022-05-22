import React from "react";
import { Button, InputGroup, Form, FormSelect, FormControl, Row, Col } from 'react-bootstrap'

class ProposalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { volume: '', targetcoin: '', ratio: '', coins: props.targetcoins || [] };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <InputGroup as={Col} className="mb-2">
                        <InputGroup.Text >volume:</InputGroup.Text>
                        <FormControl type="number" value={this.state.volume} name="volume" onChange={this.handleChange} />
                    </InputGroup>
                    <InputGroup as={Col} className="mb-1">
                        <InputGroup.Text>ratio:</InputGroup.Text>
                        <FormControl size="3" type="number" value={this.state.ratio} name="ratio" onChange={this.handleChange} />
                    </InputGroup>
                    <InputGroup as={Col} className="mb-3">
                        <InputGroup.Text>targetcoin:</InputGroup.Text>
                        <FormSelect value={this.state.targetcoin} name="targetcoin" onChange={this.handleChange}>
                            {this.state.coins.map(function (coin) {
                                return <option value={coin.key}>{coin.name}</option>;
                            })}
                        </FormSelect>
                    </InputGroup>
                    <Button as={Col}>Add</Button>
                </Row>
            </Form>
        );
    }
}

export { ProposalForm }