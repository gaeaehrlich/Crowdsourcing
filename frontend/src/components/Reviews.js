import React from "react";
import {List, Rate, Button, message, Col} from 'antd';
import axios from "axios";

class Reviews extends React.Component {

    state = {
        likes: [],
        gifts: [],
        searches: [],
        constraints: [],
        prev_reviews: [],
    };

    updateUserLikes = (item) => {
        axios.put(`http://127.0.0.1:8000/api/updateuser/${this.props.token}/`, {
            user: this.props.token,
            username: localStorage.getItem('username'),
            likes: [...this.state.likes, item.id],
            gifts: this.state.gifts,
            searches: this.state.searches,
            constraints: this.state.constraints
        })
            .then(res => console.log(res))
            .catch(error => console.log(error));
    };

    updateReviewLikes = (item) => {
        axios.put(`http://127.0.0.1:8000/api/updatereviews/${item.id}/`, {
            author_token: item.author_token,
            author_username: item.author_username,
            dish: item.dish,
            description: item.description,
            stars: item.stars,
            is_anonymous: item.is_anonymous,
            likes: item.likes + 1,
        })
            .then(res => console.log(res))
            .catch(error => console.log(error));
    };

    handleLike = async (item) => {
        if (this.props.token !== item.author_token) {
            await axios.get(`http://127.0.0.1:8000/api/user/${this.props.token}/`).then(res => {
                this.setState({
                    likes: res.data.likes,
                    gifts: res.data.gifts,
                    searches: res.data.searches,
                    constraints: res.data.constraints
                });
            }).catch(error => console.log(error));

            if(this.state.likes.includes(item.id)) {
                message.error('You already likes this review');
            }
            else {
                this.updateUserLikes(item);
                this.updateReviewLikes(item);
            }
        }
    };

    author = (item) => {
        if(item.is_anonymous) return "Anonymous";
        else return item.author_username;
    };

    dishToPicLocation = name => {
        if(name) {
            let out;
            out = name.replace(/ /g, '_');
            return 'http://127.0.0.1:8000/api/pic/' + out;
        }
    };

    render() {
        return (
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={this.props.data}
                renderItem={item => (
                    <List.Item
                        key={item.title}
                        extra={item.photo_name!==''?
                        <img
                            alt="logo"
                            src={this.dishToPicLocation(item.photo_name)}
                            width="300"
                        />: null
                        }
                    >
                        <List.Item.Meta
                            description={item.description}
                        />
                        {item.content}
                        <div>
                            <div>By: {this.author(item)}</div>
                            <Rate disabled defaultValue={item.stars} />
                            <Button onClick={ () =>
                                this.handleLike(item)
                            } shape="circle" icon="like" />
                        </div>
                    </List.Item>
                )}
            />
        );
    }
}

export default Reviews;