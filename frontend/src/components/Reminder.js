import React from "react";
import {List, Card, Row} from 'antd';
import axios from "axios";
import Dishes from "./Dishes";

class Reminder extends React.Component {

    state = {
        dishes: []
    };

    componentDidMount() {
        const data = this.props.data;
        for(let i = 0; i < data.length; i++) {
            axios.get(`http://127.0.0.1:8000/api/dish/${data[i]}`).then(res => {
                console.log(res.data);
                this.setState({
                    dishes: [...this.state.dishes, res.data]
                });
            }).catch(error => console.log(error));
        }
    }

    render() {
        return (
            this.state.dishes.length>0?
            <a href={"http://127.0.0.1:3000/dish/" + this.state.dishes[0].id}>Review {this.state.dishes[0].title}</a>:
        null
        );
    }
}

export default Reminder;