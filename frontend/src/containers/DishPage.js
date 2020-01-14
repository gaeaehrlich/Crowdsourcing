import React from "react";
import axios from 'axios';

import {Button, Icon, List, Comment, Rate} from 'antd';
import { Typography } from 'antd';
import { Tag , Drawer, Form, Input, Checkbox, } from 'antd';
import { Row, Col } from 'antd';
import ReviewForm from "../components/ReviewForm";
import {connect} from "react-redux";


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
                //reviews: res.data.reviews,
                //tags: res.data.tags,
                //constraints: res.data.constraints
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