import React from "react";
import axios from 'axios';

import {AutoComplete, Button, Card, Form, List} from 'antd';
import { Tag } from 'antd';
import { Row, Col } from 'antd';

const { Meta } = Card;



class MainPage extends React.Component {

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

    setTags = obj => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/tag`).then(res => {
            temp = res.data.map(tag=>tag['title']);
            this.setState({
                init_tags: temp
            });
        });
    };

    setCityAreas = obj => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/cityarea`).then(res => {
            temp = res.data.map(tag=>tag['name']);
            this.setState({
                init_areas: temp
            });
        });
    };

    dishToPicLocation = name => {
        let out;
        out = name.replace(/ /g, '_');
        return 'http://127.0.0.1:8000/api/pic/'+out;
    };

    setInitDishes = stam => {
        axios.get(`http://127.0.0.1:8000/api/dish/`).then(res => {
            console.log(res.data);
            this.setState({
                dishes: res.data

            });
        });
    };

    componentDidMount() {
        this.setTags();
        this.setCityAreas();
        this.setInitDishes();
    }


    onSetTag = tag => {
        this.setState(state => {
            const tags = state.tags.concat(tag);
            return {tags,};
        });
    };

    handleCloseTag = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

    onSearchTag = searchText => {
        this.setState({
            possible_tags: !searchText ? [] : this.state.init_tags.filter(tag => tag.toLowerCase().startsWith(searchText.toLowerCase())),
        });
    };

    onSetArea = area => {
        this.setState(state => {
            const areas = state.areas.concat(area);
            return {areas,};
        });
    };

    handleCloseArea = removedArea => {
        const areas = this.state.areas.filter(area => area !== removedArea);
        console.log(areas);
        this.setState({ areas });
    };

    onSearchArea = searchText => {
        this.setState({
            possible_areas: !searchText ? [] : this.state.init_areas.filter(area => area.toLowerCase().startsWith(searchText.toLowerCase())),
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        axios.get(`http://127.0.0.1:8000/api/search`, {
            params: {
                tags:['tag1', 'tag2'],
                area: 'asd'
            }
        }).then(res => {
            console.log(res)
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
        return(
            <dom>
                <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col>
                    <Form.Item
                        required={false}
                    >
                        {getFieldDecorator(`test`, {
                            rules: [
                                {
                                    required: false,
                                    whitespace: true,
                                },
                            ],
                        })(<AutoComplete
                            dataSource={this.state.possible_tags}
                            style={{ width: '15%' }}
                            onSelect={this.onSetTag}
                            onSearch={this.onSearchTag}
                            placeholder="Tag"
                        />)}

                    </Form.Item>
                        </Col>
                    <Col>
                    {this.state.tags.map((tag) =>
                        <Tag key={tag} closable onClose={() => this.handleCloseTag(tag)}>{tag}</Tag>
                    )}
                </Col>
                    <Col>
                        <List
                        itemLayout="inline"
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={this.state.tags.length ? this.state.tags: []}
                        renderItem={tag => (
                            <List.Item>
                                <Tag key={tag} closable onClose={() => this.handleCloseTag(tag)}>{tag}</Tag>
                            </List.Item>
                        )}
                    />
                    </Col>
                </Row>

                <Row>
                    <Form.Item
                        required={false}
                    >
                        {getFieldDecorator(`test2`, {
                            rules: [
                                {
                                    required: false,
                                    whitespace: true,
                                },
                            ],
                        })(<AutoComplete
                            dataSource={this.state.possible_areas}
                            style={{ width: '15%' }}
                            onSelect={this.onSetArea}
                            onSearch={this.onSearchArea}
                            placeholder="Area"
                        />)}

                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
                </Row>
                    </Form>
                <Col>
                        <List
                        itemLayout="inline"
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={this.state.areas}
                        renderItem={tag => (
                            <List.Item>
                                <Tag key={tag} closable onClose={() => this.handleCloseTag(tag)}>{tag}</Tag>
                            </List.Item>
                        )}
                    />
                    </Col>
                {/*<Row>*/}
                {/*    <Col>*/}
                {/*        <AutoComplete*/}
                {/*            dataSource={this.state.possible_tags}*/}
                {/*            style={{ width: 400 }}*/}
                {/*            onSelect={this.onSetTag}*/}
                {/*            onSearch={this.onSearchTag}*/}
                {/*            placeholder="Tags"*/}
                {/*        />*/}
                {/*    </Col>*/}

                {/*    <Col>*/}
                {/*        {this.state.tags.map((tag) =>*/}
                {/*            <Tag key={tag} closable onClose={() => this.handleCloseTag(tag)}>{tag}</Tag>*/}
                {/*        )}*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*    <Col>*/}
                {/*        <AutoComplete*/}
                {/*            dataSource={this.state.possible_areas}*/}
                {/*            style={{ width: 200 }}*/}
                {/*            onSelect={this.onSetArea}*/}
                {/*            onSearch={this.onSearchArea}*/}
                {/*            placeholder="Areas"*/}
                {/*        />*/}
                {/*    </Col>*/}

                {/*    <Col>*/}
                {/*        {this.state.areas.map((area) =>*/}
                {/*            <Tag key={area} closable onClose={() => this.handleCloseArea(area)}>{area}</Tag>*/}
                {/*        )}*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row>
                    <List
                        itemLayout="inline"
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={this.state.dishes}
                        // test={str.concat("http://127.0.0.1:3000/dish/", this.state.rest_id)}
                        renderItem={dish => (
                            <List.Item>
                                <Card
                                    style={{ width: 300 }}
                                    cover={
                                        <a href={'http://127.0.0.1:3000/dish/'+dish.id}>
                                            <img
                                                alt="https://live.staticflickr.com/2671/3810412617_d912cd013d_b.jpg"
                                                src={this.dishToPicLocation(dish.title)}
                                                width="300"
                                            />

                                        </a>
                                    }
                                >
                                    <Meta
                                        title={dish.title}
                                        description={dish.content}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </Row>
            </dom>
        )
    }
}
// export default DishPage;
export default Form.create()(MainPage);