import React from "react";
import axios from 'axios';


import {List, Typography} from 'antd';
import { Card } from 'antd';

const { Meta } = Card;


const { Title } = Typography;

class RestPage extends React.Component {

    state = {
        rest_id: 0,
        rest_name: '',
        address: 'Here goes the Address',
        dishes: []
    };

    componentDidMount() {
        const restID = this.props.match.params.restID
        this.setState({
            rest_id: restID
        });
        axios.get(`http://127.0.0.1:8000/api/rest/${restID}`).then(res => {
            console.log(res.data.reviews);
            this.setState({
                rest_name: res.data.name,
                // address: res.data.restaurant.street.name,
                dishes: res.data.dishes,

            });
        });
    }

    render() {
        return(
            <dom>
                <Title level={2}>
                    {this.state.rest_name}
                </Title>
                <Title level={4}>
                    {this.state.address}
                </Title>

                <List
                    // itemLayout="horizontal"
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={this.state.dishes}
                    // test={str.concat("http://127.0.0.1:3000/dish/", this.state.rest_id)}
                    renderItem={dish => (
                            <Card
                    style={{ width: 300 }}
                    cover={
                        <a href={'http://127.0.0.1:3000/dish/'+dish.id}>
                        <img
                            alt="example"
                            src="https://live.staticflickr.com/2671/3810412617_d912cd013d_b.jpg"
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
                    )}
                />


            </dom>
        )
    }
}
export default RestPage;