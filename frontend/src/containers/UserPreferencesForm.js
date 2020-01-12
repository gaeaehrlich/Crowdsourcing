import React from "react";
import {Form, Select, Checkbox, Row, Col, Button} from 'antd';

const { Option } = Select;

let selected = [];
let kosher = 0, vegetarian = 0, vegan = 0;

class PreferencesForm extends React.Component {
    handleSelect = e => {
        selected.push(e);
    };

    handleCheck = e => {
        if(e.checked) {
            if(e.value === "cosher") kosher = 1;
            if(e.value === "vegetarian") vegetarian = 1;
            if(e.target.value === "vegan") vegan = 1;
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
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