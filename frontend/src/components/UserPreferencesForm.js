import React from "react";
import axios from 'axios';
import {Form, Select, Checkbox, Row, Col, Button} from 'antd';

const { Option } = Select;

class PreferencesForm extends React.Component {
    handleSubmit = (event, requestType) => {
        event.preventDefault();
        this.props.form.validateFields((err, values, token) => {
            if (!err) {
                const token = localStorage.getItem('token');

                let tags = values['select-multiple'].concat(values['checkbox-group']);
                let preferences = [];
                tags.map(tag => {
                    preferences.push({"title" : tag})
                });
                console.log(preferences);

                switch (requestType) {
                    case 'post':
                        return axios.post('http://127.0.0.1:8000/api/createuser/', {
                                user: token,
                                level: 1,
                                likes: [],
                                gifts: [],
                                searches: [],
                                preferences: tags
                        }).then(res => console.log(res))
                        .catch(error => console.log(error.response));
                    case 'put':
                        axios.put(`http://127.0.0.1:8000/api/updateuser/${token}/`, {
                                preferences:tags
                        })
                        .then(res => console.log(res))
                        .catch(error => console.log(error));
                }
                this.props.history.push('/');
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={(event) => this.handleSubmit(event, this.props.requestType)}>

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

export default WrappedForm;