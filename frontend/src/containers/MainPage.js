import React from "react";
import axios from 'axios';

import { AutoComplete} from 'antd';
import { Tag } from 'antd';
import { Row, Col } from 'antd';
import {connect} from "react-redux";
import logo from "../logo.png";
import Reminder from "../components/Reminder";



class MainPage extends React.Component {

    state = {
        dishes: [],
        area: '',
        init_tags: ['Asian', 'Vegan', 'Vegetarian', 'Shit', 'Kosher', 'PeanutsFree'],
        possible_tags: [],
        tags: [],
        init_areas: ['Tel Aviv', 'City Center', 'City North'],
        possible_areas: [],
        areas: [],
        reviews: [],
        searches: []
    };

    fetchUser = () => {
        const token = localStorage.getItem('token');
        axios.get(`http://127.0.0.1:8000/api/user/${token}/`).then(res => {
            console.log(res.data);
            this.setState({
                searches: res.data.searches
            });
        }).catch( () => {
            this.setState({
                searches: []
            });
        });
    };

    componentDidMount() {
        const dishID = this.props.match.params.dishID;
        this.fetchUser();
        this.setState({
            dish_id: dishID
        });
        axios.get(`http://127.0.0.1:8000/api/dish/${dishID}`).then(res => {
            console.log(res.data);
            this.setState({
                dish_name: res.data.title,
                restaurant_name: res.data.restaurant.name,
                // address: res.data.restaurant.street.name,
                price: res.data.price,
                reviews: res.data.reviews,

            });
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
        console.log(tags);
        this.setState({tags});
    };

    onSearchTag = searchText => {
        this.setState({
            possible_tags: !searchText ? [] : this.state.init_tags.filter(tag => tag.startsWith(searchText)),
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
        this.setState({areas});
    };

    onSearchArea = searchText => {
        this.setState({
            possible_areas: !searchText ? [] : this.state.init_areas.filter(area => area.startsWith(searchText)),
        });
    };


    render() {
        return (
            <div>
                {this.props.isAuthenticated && this.state.searches.length > 0 ?
                    <div>
                        <h3>Have you tried these courses?</h3>
                        <br/>
                        <Reminder data={this.state.searches}/>
                    </div>
                    : null}
                {!this.props.isAuthenticated ?
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}><img src={logo}/></div>
                    : <dom>
                        <Row>
                            <Col>
                                <AutoComplete
                                    dataSource={this.state.possible_tags}
                                    style={{width: 400}}
                                    onSelect={this.onSetTag}
                                    onSearch={this.onSearchTag}
                                    placeholder="Tags"
                                />
                            </Col>

                            <Col>
                                {this.state.tags.map((tag) =>
                                    <Tag key={tag} closable onClose={() => this.handleCloseTag(tag)}>{tag}</Tag>
                                )}
                            </Col>
                        </Row>
                        <Row>
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
                    </dom>
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

export default connect(mapStateToProps)(MainPage);