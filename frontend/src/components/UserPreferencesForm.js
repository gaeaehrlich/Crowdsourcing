import React from "react";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import {Form, Select, Checkbox, Row, Col, Button, message} from 'antd';

const { Option } = Select;

class PreferencesForm extends React.Component {

    _isMounted = false;

    state = {
        likes: [],
        gifts: "",
        searches: [],
        constraints: []
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    init_user = (username) => {
        axios.get(`http://127.0.0.1:8000/api/init_user`, {
            params: {
                user_name: username
            }
        }).then(res => {
            console.log(res)
        });
    };

    handleSubmit = (event, requestType) => {
        event.preventDefault();
        this.props.form.validateFields((err, values, token) => {
            if (!err) {
                const token = localStorage.getItem('token');
                const username = localStorage.getItem('username');

                let tags = [];
                if (typeof values['select-multiple'] != "undefined") tags = values['select-multiple'];
                if (typeof values['checkbox-group'] != "undefined") tags = tags.concat(values['checkbox-group']);
                console.log(tags);

                axios.get(`http://127.0.0.1:8000/api/user/${token}/`).then(res => {
                    if (this._isMounted) {
                        this.setState({
                            likes: res.data.likes,
                            gifts: res.data.gifts,
                            searches: res.data.searches,
                            constraints: res.data.constraints
                        });
                    }
                });
                axios.put(`http://127.0.0.1:8000/api/updateuser/${token}/`, {
                    user: token,
                    username: username,
                    likes: this.state.likes,
                    gifts: this.state.gifts,
                    searches: this.state.searches,
                    constraints: tags
                })
                    .then(res => {
                        console.log(res);
                        this.init_user(username);
                    })
                    .catch(error => console.log(error));
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={(event) => {
                this.handleSubmit(event, this.props.requestType);
                if (this.props.requestType === 'post') {
                    this.props.step();
                }
                else {
                    message.success('Your update was successful');
                    setTimeout( () => this.props.history.push('/'), 1000);
                }
            }}>

                <Form.Item label="Allergies: ">
                    {getFieldDecorator('select-multiple', {
                    rules: [{ required: false }],
                    })(
                    <Select mode="multiple" placeholder="Please select if you have any allergies">
                        <Option value="peanut free">Peanuts</Option>
                        <Option value="gluten free">Gluten</Option>
                    </Select>
                    )}
                </Form.Item>

                <Form.Item label="preferences">
                    {getFieldDecorator('checkbox-group')(
                    <Checkbox.Group style={{width: '100%'}}>
                        <Row>
                            <Col span={8}><Checkbox value="kosher">Kosher</Checkbox></Col>
                            <Col span={8}><Checkbox value="vegetarian">Vegetarian</Checkbox>
                            </Col><Col span={8}><Checkbox value="vegan">Vegan</Checkbox></Col>
                        </Row>
                    </Checkbox.Group>
                    )}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

            </Form>
        );
    }
}

const WrappedForm = Form.create()(PreferencesForm);

export default withRouter(WrappedForm);