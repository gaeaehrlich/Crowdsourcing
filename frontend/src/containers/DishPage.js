import React from "react";
import axios from 'axios';

import {Button, Icon, Typography, Tag , Drawer, Row, Col} from 'antd';
import ReviewForm from "../components/ReviewForm";
import {connect} from "react-redux";
import Reviews from "../components/Reviews";


const { Title } = Typography;

class DishPage extends React.Component {

    state = {
        dish_id: 0,
        dish_name: '',
        restaurant_name: '',
        address: '',
        price: 0,
        tags:[],
        reviews: [],
        visible: false,
        level: 1,
        likes: [],
        gifts: [],
        searches: [],
        preferences: []
    };

    updateUserSearch = (dishID) => {
        axios.get(`http://127.0.0.1:8000/api/user/${this.props.token}/`)
            .then(res => {
            this.setState({
                level: res.data.level,
                likes: res.data.likes,
                gifts: res.data.gifts,
                searches: res.data.searches,
                preferences: res.data.preferences
            });
            })
            .catch(error => console.log(error));

        axios.put(`http://127.0.0.1:8000/api/updateuser/${this.props.token}/`, {
            user: this.props.token,
            level: this.state.level,
            likes: this.state.likes,
            gifts: this.state.gifts,
            searches: [...this.state.searches, dishID],
            preferences: this.state.preferences
        })
            .then(res => console.log(res))
            .catch(error => console.log(error));
    };

    fetchReviews = (dishID) => {
        axios.get(`http://127.0.0.1:8000/api/dishreviews/${dishID}`).then(res => {
            console.log(res.data);
            this.setState({
                reviews: res.data,
            });
        }).catch(error => console.log(error));
    };

    componentDidMount() {
        const dishID = this.props.match.params.dishID;
        this.setState({
            dish_id: dishID
        });
        axios.get(`http://127.0.0.1:8000/api/dish/${dishID}`).then(res => {
            console.log(res.data);
            this.setState({
                dish_name: res.data.title,
                restaurant_name: res.data.restaurant.name,
                price: res.data.price,
                //tags: res.data.tags,
                //constraints: res.data.constraints
            });
        }).catch(error => console.log(error));
        this.updateUserSearch(dishID);
        this.fetchReviews(dishID);
    };


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


    render() {
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <Title level={2}>
                            {this.state.dish_name}
                        </Title>
                        <Title level={3}>
                            {this.state.restaurant_name}
                        </Title>
                        <h6 style={{marginRight: 0, display: 'inline'}}>Tags:</h6>
                        <div>
                            {this.state.tags.map((tag) =>
                                <Tag>{tag}</Tag>
                            )}
                        </div>
                    </Col>
                    <Col span={12}>
                        <Title level={3}>
                            {this.state.price}
                        </Title>
                    </Col>
                </Row>

                <Button type="primary" onClick={this.showDrawer} style={{marginTop: 3}}>
                    <Icon type="plus"/> Add review
                </Button>
                <Drawer
                    title="Add review"
                    width={360}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{paddingBottom: 80}}
                >
                <ReviewForm dishID={this.state.dish_id} token={this.props.token}/>
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
                    </div>
                </Drawer>

                <Reviews data={this.state.reviews} token={this.props.token}/>
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

export default connect(mapStateToProps)(DishPage);