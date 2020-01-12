import React from "react";
import axios from 'axios';
import {Form, Select, Checkbox, Row, Col, Button} from 'antd';

const { Option } = Select;

class PreferencesForm extends React.Component {
    handleSubmit = (event, requestType) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let tags = values['select-multiple'].concat(values['checkbox-group']);
                switch (requestType) {
                    case 'post':
                        axios.post('http://127.0.0.1:8000/api/user/', {
                                user: ,
                                level: 0,
                                likes: [],
                                gifts: [],
                                searches: [],
                                preferences: tags

                        })
                }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>

                <Form.Item label="Allergies: ">
                    {getFieldDecorator('select-multiple', {
                    rules: [{ required: false }],
                    })(
                    <Select mode="multiple" placeholder="Please select if you have any allergies">
                        <Option value="peanuts">Peanuts</Option>
                        <Option value="lactose">Lactose</Option>
                        <Option value="eggs">Eggs</Option>
                        <Option value="wheat">Wheat</Option>
                        <Option value="soy">Soy</Option>
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