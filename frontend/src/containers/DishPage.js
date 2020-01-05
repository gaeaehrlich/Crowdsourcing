import React from "react";
import axios from 'axios';

import {Card} from 'antd';
import { List, Typography } from 'antd';
import { Tag } from 'antd';
import { Row, Col } from 'antd';


const { Title } = Typography;

class DishPage extends React.Component {

    state = {
        dish_id: 0,
        dish_name: 'The New Noodle',
        restaurant_name: 'Giraffe',
        price: 58,
        tags:['Asian', 'Vegan', 'shit'],
        dish: {}
    };

    componentDidMount() {
        this.setState({
            dish_id: this.props.match.params.dishID
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


                <Card title={this.state.dish_id} >
                    <p>{this.state.dish_id}</p>
                </Card>
            </dom>
        )
    }
}
export default DishPage;