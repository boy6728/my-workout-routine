import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './create.css'

import { Button, Form, Col } from 'react-bootstrap'


class Create extends Component {

    render() {

        return (

            <div className="container">

                <Form>
                    <fieldset>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Exercise</Form.Label>
                            <Form.Control type="text" placeholder="Enter exercise." />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Set</Form.Label>
                            <Form.Control as="select" multiple>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Reps</Form.Label>

                            <Form.Row className="align-items-center">
                                <Col xs="auto">
                                    <Form.Control as="select" multiple>
                                        {[...Array(30)].map((n, index) => {
                                            return (
                                                <option>{index + 1}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </Col>

                                <Col xs="auto">
                                    <Form.Check type="checkbox" label="Add range." />
                                </Col>
                            </Form.Row>

                        </Form.Group>

                        <Button variant="primary" type="submit">Submit</Button>
                    </fieldset>
                </Form>

            </div>

        )
    }
}

export default Create