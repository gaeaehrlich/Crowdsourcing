import React from "react";
import axios from 'axios';

import {Button, Icon, Typography, Tag, Drawer, Row, Col, message} from 'antd';
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
        tags: [],
        reviews: [],
        visible: false,
        rest_id: null,
        username: "",
        likes: [],
        gifts: [],
        searches: [],
        constraints: [],
        did_user_review: false
    };


    updateUserSearch = async () => {
        await axios.get(`http://127.0.0.1:8000/api/user/${this.props.token}/`)
            .then(res => {
                this.setState({
                    likes: res.data.likes,
                    gifts: res.data.gifts,
                    searches: res.data.searches,
                    constraints: res.data.constraints
                });
            })
            .catch(error => console.log(error));

        let updatedHistory = [...this.state.searches];
        const index = updatedHistory.indexOf(Number(this.state.dish_id));
        if (index !== -1) {
            updatedHistory.splice(index, 1);
        } else {
            updatedHistory = [...updatedHistory, Number(this.state.dish_id)]
        }

        await axios.put(`http://127.0.0.1:8000/api/updateuser/${this.props.token}/`, {
            user: this.props.token,
            username: localStorage.getItem('username'),
            likes: this.state.likes,
            gifts: this.state.gifts,
            searches: updatedHistory,
            constraints: this.state.constraints
        })
            .then(res => console.log(res))
            .catch(error => console.log(error));
    };

    fetchReviews = (dishID) => {
        axios.get(`http://127.0.0.1:8000/api/dishreviews/${dishID}`).then(res => {
            const users = res.data.map(review => review.author_token);
            this.setState({
                reviews: res.data,
                did_user_review: users.includes(this.props.token)
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
                rest_id: res.data.restaurant.id,
                price: res.data.price,
                tags: res.data.tags.map(tag => (tag['title'])),
            });
        }).catch(error => console.log(error));
        setTimeout(() => this.fetchReviews(dishID), 300);
        setTimeout(() => this.updateUserSearch(), 300);
    };


    showDrawer = () => {
        setTimeout(() => {
            if (this.state.did_user_review) {
                message.error('You already gave a review for this dish');
            }
            this.setState({
                visible: !this.state.did_user_review,
            });
        }, 500);
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    dishToPicLocation = name => {
        let out;
        out = name.replace(/ /g, '_');
        return 'http://127.0.0.1:8000/api/pic/' + out;
    };


    render() {
        return (
            <div>

                <Row>
                    <Col span={16}>
                        <Row>
                            <Col span={16}>
                                <Title level={2}>
                                    {this.state.dish_name}
                                </Title>
                            </Col>
                            <Col span={8}>
                                <Title level={3}>
                                    {this.state.price} ₪
                                </Title>
                            </Col>

                        </Row>
                        <Row>
                            <Title level={3}>
                                <a href={'http://127.0.0.1:3000/rest/' + this.state.rest_id}>
                                    {this.state.restaurant_name}
                                </a>
                            </Title>
                        </Row>
                        <Row>
                            <h6 style={{marginRight: 0, display: 'inline'}}>Tags:</h6>
                            <div>
                                {this.state.tags.map((tag) =>
                                    <Tag>{tag}</Tag>
                                )}
                            </div>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <img
                            alt="So good.."
                            src={this.dishToPicLocation(this.state.dish_name)}
                            style={{width:"300px"}}
                        />
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
                {this.state.reviews.length > 0 ? <Reviews data={this.state.reviews} token={this.props.token}/> :
                    <div><br/><h5>No reviews</h5></div>}
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