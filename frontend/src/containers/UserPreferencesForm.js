import React from "react";
import {Form, Select, Checkbox, Row, Col,} from 'antd';

const { Option } = Select;

class PreferencesForm extends React.Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
      const {getFieldDecorator} = this.props.form;
      return (
          <Form onSubmit={this.handleSubmit}>

              <Form.Item label="Allergies: ">
                  {getFieldDecorator('select-multiple', {
                      rules: [
                          {required: false, type: 'array'},
                      ],
                  })(
                      <Select mode="multiple" placeholder="Please select if you have any allergies">
                          <Option value="peanuts">Peanuts</Option>
                          <Option value="lactose">Lactose</Option>
                          <Option value="eggs">Eggs</Option>
                          <Option value="wheat">Wheat</Option>
                          <Option value="soy">Soy</Option>
                      </Select>,
                  )}
              </Form.Item>

              <Form.Item label="preferences">
                  {getFieldDecorator('checkbox-group', {initialValue: [],})
                  (
                      <Checkbox.Group style={{width: '100%'}}>
                          <Row>
                              <Col span={8}><Checkbox value="cosher">Cosher</Checkbox></Col>
                              <Col span={8}><Checkbox value="vegetarian">Vegetarian</Checkbox>
                              </Col><Col span={8}><Checkbox value="vegan">Vegan</Checkbox></Col>
                          </Row>
                      </Checkbox.Group>,
                  )}
              </Form.Item>

          </Form>
      );
  }
}

export default PreferencesForm;