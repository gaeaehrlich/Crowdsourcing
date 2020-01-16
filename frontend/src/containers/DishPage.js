import React from "react";
import axios from 'axios';

import {Button, Icon, List, Comment, Rate, Upload} from 'antd';
import { Typography } from 'antd';
import { Tag , Drawer, Form, Input, Checkbox, } from 'antd';
import { Row, Col } from 'antd';


const { Title } = Typography;
const { TextArea } = Input;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

class DishPage extends React.Component {

    state = {
        dish_id: 0,
        dish_name: 'The New Noodle',
        restaurant_name: 'Giraffe',
        rest_id: 0,
        address: '',
        price: 0,
        tags:['Asian', 'Vegan'],
        reviews: [],
        visible: false,
    };

    componentDidMount() {
        const dishID = this.props.match.params.dishID
        this.setState({
            dish_id: dishID
        });
        axios.get(`http://127.0.0.1:8000/api/dish/${dishID}`).then(res => {
            console.log(res.data);
            this.setState({
                dish_name: res.data.title,
                restaurant_name: res.data.restaurant.name,
                rest_id: res.data.restaurant.id,
                price: res.data.price,
                reviews: res.data.reviews,
                tags: res.data.tags.map(tag=>(tag['title'])),
            });
        });
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });

    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            this.setState({
                visible: false,
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

    normFile = e => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    dishToPicLocation = name => {
        let out;
        out = name.replace(/ /g, '_');
        return 'http://127.0.0.1:8000/api/pic/'+out;
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return(
            <dom>
                <Row>
                    <Col span={12}>
                        <Title level={2}>
                            {this.state.dish_name}
                        </Title>
                        <Title level={3}>
                            <a href={'http://127.0.0.1:3000/rest/'+this.state.rest_id}>
                                {this.state.restaurant_name}
                            </a>
                        </Title>
                        <h6 style={{marginRight: 0, display: 'inline' }}>Tags:</h6>
                        <div>
                            {this.state.tags.map((tag) =>
                                <Tag>{tag}</Tag>
                            )}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Title level={3} className="w3-tag w3-teal w3-round">
                            {this.state.price}
                        </Title>
                    </Col>
                </Row>
                <Row>
                    <img
                        alt="example"
                        src={this.dishToPicLocation(this.state.dish_name)}
                        width="300"
                    />
                </Row>

                <Button type="primary" onClick={this.showDrawer} style={{marginTop:3}}>
                    <Icon type="plus" /> Add review
                </Button>
                <Drawer
                    title="Add review"
                    width={360}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>

                        <Row gutter={16}>

                            <Form.Item label="Rate">
                                {getFieldDecorator('rating', {
                                    initialValue: 3,
                                })(<Rate />)}
                            </Form.Item>
                        </Row>

                        <Row gutter={16}>
                            <Form.Item label="Review">
                                {getFieldDecorator('review_text', {
                                    rules: [{ required: true, message: 'Please enter a review' },]
                                    // {validator:(rule, value, callback)=>{return value}}],
                                })(
                                    <TextArea
                                        style={{ width: '100%' }}
                                        placeholder="Please enter review"
                                        autoSize={{ minRows: 3 }}
                                    />,
                                )}
                            </Form.Item>
                        </Row>

                        <Row gutter={16}>
                            <Col>
                                <Form.Item label="Upload">
                                    {getFieldDecorator('upload', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFile,
                                    })(
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            // beforeUpload={beforeUpload}
                                            onChange={this.handleUploadChange}
                                        >
                                            {this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                        </Upload>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    {getFieldDecorator('is_anonymous', {
                                            valuePropName: 'checked',
                                            initialValue: false,
                                        }
                                    )(
                                        <Checkbox>Post anonymously?</Checkbox>,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item wrapperCol={{ span: 12 }}>
                            <Button type="primary" htmlType="submit" style={{position:"fixed", bottom:40}}>
                                Submit
                            </Button>
                        </Form.Item>

                    </Form>
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                        }}
                    >
                        {/*<Button onClick={this.onClose} style={{ marginRight: 8 }}>*/}
                        {/*    Cancel*/}
                        {/*</Button>*/}
                        {/*<Button onClick={this.onClose} type="primary">*/}
                        {/*    Submit*/}
                        {/*</Button>*/}
                    </div>
                </Drawer>

                <List
                    itemLayout="horizontal"
                    dataSource={this.state.reviews}
                    renderItem={review => (
                        <li>
                            <Comment
                                // actions={item.actions}
                                author={review.author.username}
                                // avatar={item.avatar}
                                content={review.description}
                                // datetime={item.datetime}
                            />
                        </li>
                    )}
                />
            </dom>
        )
    }
}
// export default DishPage;
export default Form.create()(DishPage)