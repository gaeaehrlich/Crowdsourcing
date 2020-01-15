import React from "react";
import axios from 'axios';
import {Form, Checkbox, Row, Button, Rate, Input} from 'antd';

const { TextArea } = Input;

class ReviewForm extends React.Component {

    handleSubmit = (event, token, dishID) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const description = values['review_text'];
                const stars = values['rating'];
                const anonymous = values['is_anonymous'];

                return axios.post('http://127.0.0.1:8000/api/createreview/', {
                        author_token: token,
                        author_username: localStorage.getItem('username'),
                        dish: dishID,
                        description: description,
                        stars: stars,
                        is_anonymous: anonymous,
                        likes: 0
                }).then(res => console.log(res))
                    .catch(error => console.log(error.response));
            }
            this.setState({
                visible: false,
            });
        });
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form layout="vertical" onSubmit={(event) => this.handleSubmit(event, this.props.token, this.props.dishID)}>

                <Row gutter={16}>

                    <Form.Item label="Rate">
                        {getFieldDecorator('rating', {
                            initialValue: 3,
                        })(<Rate/>)}
                    </Form.Item>
                </Row>

                <Row gutter={16}>
                    <Form.Item label="Review">
                        {getFieldDecorator('review_text', {
                            rules: [{required: false},]
                        })(
                            <TextArea
                                style={{width: '100%'}}
                                placeholder="Please enter review"
                                autoSize={{minRows: 3}}
                            />,
                        )}
                    </Form.Item>
                </Row>
                <Row gutter={16}>
                    <Form.Item>
                        {getFieldDecorator('is_anonymous', {
                                valuePropName: 'checked',
                                initialValue: false,
                            }
                        )(
                            <Checkbox>Post anonymously?</Checkbox>,
                        )}
                    </Form.Item>
                </Row>
                <Form.Item wrapperCol={{span: 12}}>
                    <Button type="primary" htmlType="submit" style={{position: "fixed", bottom: 40}}>
                        Submit
                    </Button>
                </Form.Item>

            </Form>
        );
    }
}

const WrappedForm = Form.create()(ReviewForm);

export default WrappedForm;