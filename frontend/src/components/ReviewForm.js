import React from "react";
import axios from 'axios';
import {Form, Checkbox, Row, Button, Rate, Input, Upload, Icon} from 'antd';

const { TextArea } = Input;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
let uplodedFileName = '';

function beforeUpload(file) {
    uplodedFileName = file.name.replace('.jpg', '');
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        console.log('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        console.log('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}


class ReviewForm extends React.Component {


    state = {
        loading: false,
        imageUrl: null,
    };

      normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

      init_review = (username, dishid) => {
        axios.get(`http://127.0.0.1:8000/api/init_review`, {
            params: {
                user_name: username,
                dish_id: dishid
            }
        }).then(res => {
            console.log(res)
        });
    };


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
                    likes: 0,
                    photo_name: uplodedFileName,

                }).then(res => {console.log(res);
                this.init_review(localStorage.getItem('username'), dishID)
                })
                    .catch(error => console.log(error.response));
            }
            this.setState({
                visible: false,
                uplodedFileName: ''
            });
        });
    };

    handleUploadChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

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