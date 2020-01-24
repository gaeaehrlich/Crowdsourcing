import React from "react";

import { Row, Col, AutoComplete} from 'antd';
import { Form, Input, Icon, Button, message } from 'antd';
import { Typography } from 'antd';
import axios from "axios";

import Dishes from "../components/Dishes";

const { Title } = Typography;


let id = 0;


class EatwithPage extends React.Component {
    state = {
        dishes: [],
        area: '',
        init_tags: ['Asian', 'Vegan', 'Vegetarian',  'Shit', 'Kosher', 'PeanutsFree'],
        possible_tags: [],
        tags: [],
        init_areas: ['Tel Aviv', 'City Center', 'City North'],
        possible_areas: [],
        rest_hidden: true,
        rest_name: '',
        rest_id: '',
        success: true
    };

    setTags = () => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/tag`).then(res => {
            temp = res.data.map(tag=>tag['title']);
            this.setState({
                init_tags: temp
            });
        });
    };

    setCityAreas = () => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/cityarea`).then(res => {
            temp = res.data.map(tag=>tag['name']);
            this.setState({
                init_areas: temp
            });
        });
    };

    componentDidMount() {
        this.setTags();
        this.setCityAreas()
    }

    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }

        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(typeof values['area'] === "undefined") {
                    message.warning('Please insert area');
                    return;
                }
                if(typeof values['names'] === "undefined") {
                    message.warning('Please insert user');
                    return;
                }
                const { keys, names } = values;
                console.log('Received values of form: ', values);
                console.log('Merged values:', keys.map(key => names[key]));
                axios.get(`http://127.0.0.1:8000/api/search_eatwith`, {
                    params: {
                        tags: values['tags'],
                        area: values['area'],
                        users: values['names'],
                    }
                }).then(res => {
                    console.log("res " , res);
                    if(res.data.rest.name.trim() !== '') {
                        this.setState({
                        dishes: res.data.dishes,
                        rest_name: res.data.rest.name,
                        rest_id: res.data.rest.id,
                        rest_hidden: false,
                        success: true
                    }) } else {
                        this.setState({
                        dishes: [],
                        rest_hidden: true,
                        rest_name: '',
                        rest_id: '',
                        success: false
                    }) }
                }).catch(error => {
                    console.log(error);
                    this.setState({
                        dishes: [],
                        rest_hidden: true,
                        rest_name: '',
                        rest_id: '',
                        success: false
                    })
                });
            }
        });
    };

    onSearchTag = searchText => {
        this.setState({
            possible_tags: !searchText ? [] : this.state.init_tags.filter(tag => tag.toLowerCase().startsWith(searchText.toLowerCase())),
        });
    };

    onSelectTag = tag => {
        this.setState({
            possible_tags: [],
        });
    };

    onSearchArea = searchText => {
        this.setState({
            possible_areas: !searchText ? [] : this.state.init_areas.filter(area => area.toLowerCase().startsWith(searchText.toLowerCase())),
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Row>
                <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'User:' : ''}
                    required={false}
                    key={k}
                >
                    {getFieldDecorator(`names[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input passenger's name or delete this field.",
                            },
                        ],
                    })(<Input placeholder="User Name" style={{ width: '70%', marginRight: 30 }} />)}
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => this.remove(k)}
                        />
                    ) : null}
                </Form.Item>
                <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'Tags' : ''}
                    required={false}
                    key={k}
                >
                    {getFieldDecorator(`tags[${k}][0]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: false,
                                whitespace: true,
                            },
                        ],
                    })(<AutoComplete
                        dataSource={this.state.possible_tags}
                        style={{ width: '100%' }}
                        onSelect={this.onSelectTag}
                        onSearch={this.onSearchTag}
                        placeholder="Tag"
                    />)}

                </Form.Item>
                <Row>
                    <Col >
                        <Form.Item
                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            label={index === 0 ? 'Tags' : ''}
                            required={false}
                            key={k}
                            style={{visibility:"visible"}}
                        >
                            {getFieldDecorator(`tags[${k}][1]`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [
                                    {
                                        required: false,
                                        whitespace: true,
                                    },
                                ],
                            })(<AutoComplete
                                dataSource={this.state.possible_tags}
                                style={{ width: '100%' }}
                                onSelect={this.onSelectTag}
                                onSearch={this.onSearchTag}
                                placeholder="Tag"
                            />)}

                        </Form.Item>
                    </Col>
                    <Col >
                        <Form.Item
                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            label={index === 0 ? 'Tags' : ''}
                            required={false}
                            key={k}
                            style={{visibility:"visible", }}
                        >
                            {getFieldDecorator(`tags[${k}][2]`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [
                                    {
                                        required: false,
                                        whitespace: true,
                                    },
                                ],
                            })(<AutoComplete
                                dataSource={this.state.possible_tags}
                                style={{ width: '100%' }}
                                onSelect={this.onSelectTag}
                                onSearch={this.onSearchTag}
                                placeholder="Tag"
                            />)}

                        </Form.Item>
                    </Col>
                </Row>

            </Row>

        ));
        return (
            <div>
            <Title level={2} style={{fontFamily: 'Raleway'}}>Eat With</Title>
            <Form onSubmit={this.handleSubmit}>
                <div style={{display: "flex"}}>
                    <br/>
                <Form.Item
                    style={{visibility:"visible", }}
                >
                    {getFieldDecorator(`area`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: false,
                                whitespace: true,
                                message: 'Please enter area'
                            },
                        ],
                    })(<AutoComplete
                        dataSource={this.state.possible_areas}
                        style={{ width: 200, marginRight: 10 }}
                        onSearch={this.onSearchArea}
                        placeholder="Area"
                    />)}

                </Form.Item>
                {formItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{ width: '110%' }}>
                        <Icon type="plus" /> Add User
                    </Button>
                </Form.Item>

                </div>
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
                {this.state.success ?
                    <Title level={4} style={{fontFamily: 'Raleway'}}>
                    <a href={'http://127.0.0.1:3000/rest/' + this.state.rest_id} hidden={this.state.rest_hidden}>
                        We know you want: {this.state.rest_name}
                    </a>
                    </Title>
                    :
                    <h4 style={{fontFamily: 'Raleway'}}>
                        Couldn't find a matching restaurant. Please try a different search.
                    </h4>
                }

            </Form>
            {this.state.dishes.length > 0 ? <Dishes data={this.state.dishes}/> : null }
            </div>
        );
    }
}

export default Form.create()(EatwithPage);




