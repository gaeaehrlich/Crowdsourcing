import React from "react";
import axios from 'axios';

import Reviews from "../components/Reviews";


class UserLikesList extends React.Component {

    state = {
        likes: [],
    };

    fetchUser = () => {
        const token = this.props.match.params.token;
        axios.get(`http://127.0.0.1:8000/api/user/${token}/`).then(res => {
            console.log(res.data);
            this.setState({
                likes: res.data[0].likes
            });
        });
    };

    componentDidMount() {
        this.fetchUser();
    }

    render() {
        return (
           <Reviews data={this.state.likes}/>
        )
    }
}


export default UserLikesList;