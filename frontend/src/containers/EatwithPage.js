import React from "react";

import { Row, Col, AutoComplete} from 'antd';
import { Form, Input, Icon, Button } from 'antd';
import { Typography } from 'antd';

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
        areas: [],
        reviews: []
    };

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
                const { keys, names } = values;
                console.log('Received values of form: ', values);
                console.log('Merged values:', keys.map(key => names[key]));
            }
        });
    };

    onSearchTag = searchText => {
        this.setState({
            possible_tags: !searchText ? [] : this.state.init_tags.filter(tag => tag.startsWith(searchText)),
        });
    };

    onSelectTag = tag => {
        this.setState({
            possible_tags: [],
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
                    label={index === 0 ? 'Passengers' : ''}
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
                    })(<Input placeholder="User Name" style={{ width: '40%', marginRight: 8 }} />)}
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => this.remove(k)}
                        />
                    ) : null}
                </Form.Item>
                {/*    </Row>*/}
                {/*<Row>*/}
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
                        style={{ width: '15%' }}
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
                        style={{ width: '15%' }}
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
                        style={{ width: '15%' }}
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
            <Form onSubmit={this.handleSubmit}>
                            <Title level={2}>Eat With</Title>
                {formItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> Add User
                    </Button>
                </Form.Item>
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(EatwithPage);




