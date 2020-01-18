import React from "react";
import axios from 'axios';

import Reviews from "../components/Reviews";


class UserLikesList extends React.Component {

    state = {
        likes: [],
        reviews: []
    };

    fetchUser = async () => {
        const token = this.props.match.params.token;
        await axios.get(`http://127.0.0.1:8000/api/user/${token}/`).then(res => {
            console.log(res.data);
            this.setState({
                likes: res.data.likes
            });
        });
        for(let i = 0; i < this.state.likes.length; i++) {
            axios.get(`http://127.0.0.1:8000/api/review/${this.state.likes[i]}/`).then(res => {
                console.log(res.data);
                this.setState({
                    reviews: [...this.state.reviews, res.data]
                });
            });
        }
    };

    componentDidMount() {
        this.fetchUser();
    }

    render() {
        return (
            <div>{this.state.likes.length > 0 ?
                    <Reviews data={this.state.reviews}/>
                    : <h2>You didn't like any posts</h2>
            }</div>
        )
    }
}


export default UserLikesList;