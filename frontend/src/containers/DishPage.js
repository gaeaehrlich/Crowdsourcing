import React from "react";
import axios from 'axios';

import {Card, List, Comment} from 'antd';
import { Typography } from 'antd';
import { Tag } from 'antd';
import { Row, Col } from 'antd';


const { Title } = Typography;

class DishPage extends React.Component {

    state = {
        dish_id: 0,
        dish_name: 'The New Noodle',
        restaurant_name: 'Giraffe',
        address: '',
        price: 0,
        tags:['Asian', 'Vegan', 'shit'],
        reviews: []
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
                // address: res.data.restaurant.street.name,
                price: res.data.price,
                reviews: res.data.reviews,

            });
        });
    }

    render() {
        return(
            <dom>
                <Row>
                    <Col span={12}>
                        <Title level={2}>
                            {this.state.dish_name}
                        </Title>
                        <Title level={3}>
                            {this.state.restaurant_name}
                        </Title>
                        <h6 style={{marginRight: 0, display: 'inline' }}>Tags:</h6>
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
export default DishPage;