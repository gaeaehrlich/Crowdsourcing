import React from "react";
import axios from 'axios';

import Reviews from "../components/Reviews";


class UserReviewsList extends React.Component {

    state = {
        reviews: [],
    };


    fetchReviews = () => {
        const token = this.props.match.params.token;
        axios.get(`http://127.0.0.1:8000/api/userreviews/${token}/`).then(res => {
          this.setState({
            reviews: res.data
          });
        });
    };


    componentDidMount() {
        this.fetchReviews();
    }

    render() {
        return (
            <div>
                <Reviews data={this.state.reviews}/>
            </div>
        )
    }
}


export default UserReviewsList;