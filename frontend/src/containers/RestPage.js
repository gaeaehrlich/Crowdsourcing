import React from "react";
import axios from 'axios';
import Dishes from "../components/Dishes";


import {List, Typography, Row, Col} from 'antd';
import { Card } from 'antd';

const { Meta } = Card;


const { Title } = Typography;

class RestPage extends React.Component {

    state = {
        rest_id: 0,
        rest_name: '',
        rest_street: 'Here goes the Address',
        rest_number: null,
        rest_city_area: null,
        dishes: []
    };

    componentDidMount() {
        const restID = this.props.match.params.restID;
        this.setState({
            rest_id: restID
        });
        axios.get(`http://127.0.0.1:8000/api/rest/${restID}`).then(res => {
            console.log(res.data);
            this.setState({
                rest_name: res.data.name,
                rest_number: res.data.number,
                rest_street: res.data.street,
                rest_city_area: res.data.city_area.city.name + ' '+  res.data.city_area.name,
                dishes: res.data.dish,

            });
        });
    }

    render() {
        return(
            <dom>
                <Title level={2} style={{fontFamily: 'Raleway'}}>
                    {this.state.rest_name}
                </Title>
                <Row>
                    <Title level={4} style={{fontFamily: 'Raleway'}}>
                        {this.state.rest_street} {this.state.rest_number}, {this.state.rest_city_area}
                    </Title>
                </Row>
                    <Dishes data={this.state.dishes}/>


            </dom>
        )
    }
}
export default RestPage;