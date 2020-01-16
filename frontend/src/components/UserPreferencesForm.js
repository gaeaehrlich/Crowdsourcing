import React from "react";
import axios from 'axios';
import {Form, Select, Checkbox, Row, Col, Button} from 'antd';

const { Option } = Select;

class PreferencesForm extends React.Component {

    state = {
        level: 1,
        likes: [],
        gifts: [],
        searches: [],
        preferences: []
    };

    handleSubmit = (event, requestType) => {
        event.preventDefault();
        this.props.form.validateFields((err, values, token) => {
            if (!err) {
                const token = localStorage.getItem('token');

                let tags = [];
                if(typeof values['select-multiple'] != "undefined") tags = values['select-multiple'];
                if(typeof values['checkbox-group'] != "undefined") tags = tags.concat(values['checkbox-group']);
                console.log(tags);



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
                         axios.get(`http://127.0.0.1:8000/api/user/${token}/`).then(res => {
                             this.setState({
                                 level: res.data.level,
                                 likes: res.data.likes,
                                 gifts: res.data.gifts,
                                 searches: res.data.searches,
                                 preferences: res.data.preferences
                             });
                         });
                        return axios.put(`http://127.0.0.1:8000/api/updateuser/${token}/`, {
                            user: token,
                            level: this.state.level,
                            likes: this.state.likes,
                            gifts: this.state.gifts,
                            searches: this.state.searches,
                            preferences: tags
                        })
                        .then(res => console.log(res))
                        .catch(error => console.log(error));
                }
                //this.props.history.push('/');
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