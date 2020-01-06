import React from "react";
import axios from 'axios';

import Reviews from "../components/Reviews";
import connect from "react-redux/lib/connect/connect";

class HistoryList extends React.Component {

    state = {
        reviews: []
    };

    fetchReviews = () => {
        const token = this.props.match.params.token;
        axios.get(`http://127.0.0.1:8000/api/history/${token}/`).then(res => {
          this.setState({
            reviews: res.data
          });
        });
    };

    componentDidMount() {
        this.fetchReviews();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token) {
            axios.defaults.headers = {
                "Content-Type" : "application/json",
                Authorization: newProps.token
            }
            this.fetchReviews();
        }
    }

    render() {
        return (
            <Reviews
                data={this.state.reviews}
                />
        )
    }
}


export default HistoryList;