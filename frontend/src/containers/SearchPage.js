import React from "react";
import axios from 'axios';

import { AutoComplete, Typography, Form, Button, Tag, Row, Col, message } from 'antd';
import {connect} from "react-redux";
import logo from "../logo.png";
import Dishes from "../components/Dishes";


const { Title } = Typography;


class SearchPage extends React.Component {

    state = {
        dishes: [],
        area: '',
        init_tags: ['Asian', 'Vegan', 'Vegetarian', 'Shit', 'Kosher', 'PeanutsFree'],
        possible_tags: [],
        tags: [],
        init_areas: ['Tel Aviv', 'City Center', 'City North'],
        possible_areas: [],
        areas: [],
        user_name: null,
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

    setInitDishes = () => {
        axios.get(`http://127.0.0.1:8000/api/dish/`).then(res => {
            this.setState({
                dishes: res.data
            });
        });
    };

    componentDidMount() {
        this.setTags();
        this.setCityAreas();
        this.setInitDishes();

        this.setState({
            user_name: localStorage.getItem('username'),
        });
    }


    onSetTag = tag => {
        this.setState(state => {
            const tags = state.tags.concat(tag);
            return {tags,};
        });
    };

    handleCloseTag = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({tags});
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
        this.setState({areas});
    };

    onSearchArea = searchText => {
        this.setState({
            possible_areas: !searchText ? [] : this.state.init_areas.filter(area => area.toLowerCase().startsWith(searchText.toLowerCase())),
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        if(this.state.areas.length > 0 && this.state.tags > 0) {
            axios.get(`http://127.0.0.1:8000/api/search`, {
                params: {
                    tags: this.state.tags,
                    area: this.state.areas,
                    user_name: this.state.user_name
                }
            }).then(res => {
                console.log(res);
                this.setState({
                    dishes: res.data
                });
            });
        }
        else {
            message.warning('Please fill in all search criteria');
        }
    };

    gutt = -16;


    render() {
        return (
            <div>
                {this.props.isAuthenticated ?
                    <div>
                    <Title level={2} style={{fontFamily: 'Raleway'}}>What would you like to eat, {this.state.user_name}?</Title>
                    <dom>
                        <Row gutter={[this.gutt, this.gutt]}>
                            </Row>
                        <Row gutter={[this.gutt, this.gutt]}>
                                <AutoComplete
                                    dataSource={this.state.possible_tags}
                                    style={{width: 400}}
                                    onSelect={this.onSetTag}
                                    onSearch={this.onSearchTag}
                                    placeholder="Tags"
                                />
                        </Row>
                        <Row gutter={[this.gutt, this.gutt]}>
                                {this.state.tags.map((tag) =>
                                    <Tag key={tag} closable onClose={() => this.handleCloseTag(tag)}>{tag}</Tag>
                                )}
                        </Row>
                        <Row gutter={[this.gutt, this.gutt]}>
                            <Col>
                                <AutoComplete
                                    dataSource={this.state.possible_areas}
                                    style={{width: 200}}
                                    onSelect={this.onSetArea}
                                    onSearch={this.onSearchArea}
                                    placeholder="Areas"
                                />
                            </Col>

                            <Col>
                                {this.state.areas.map((area) =>
                                    <Tag key={area} closable onClose={() => this.handleCloseArea(area)}>{area}</Tag>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Form onSubmit={this.handleSubmit}>
                    <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>

                </Form.Item>
                                </Form>
                </Row>
                        <Row>
                            <Dishes data={this.state.dishes}/>
                        </Row>
                    </dom>
                    </div> :
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}><img src={logo}/></div>

                }

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null,
        token: state.token
    }
};

export default connect(mapStateToProps)(SearchPage);