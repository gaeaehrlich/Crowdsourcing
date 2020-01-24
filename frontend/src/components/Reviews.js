import React from "react";
import {List, Rate, Button, message} from 'antd';
import axios from "axios";
import {connect} from "react-redux";

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
            photo_name: item.photo_name,
            spam: item.spam
        })
            .then(res => console.log(res))
            .catch(error => console.log(error));
    };


    del_review = (item) => {
          axios.get(`http://127.0.0.1:8000/api/del_review`, {
              params: {
                  user_name: item.author_username,
                  dish_id: item.dish,
                  stars: item.stars
              }
          }).then(res => {
              console.log(res)
          });
      };


    handleSpam = (item) => {
        if(item.spam === this.props.token) {
            message.error('You have already reported this review');
        }
        else if(item.spam !== "") {
            this.del_review(item);
            axios.delete(`http://127.0.0.1:8000/api/deletereview/${item.id}/`).catch(error => console.log(error));
            message.success('Thank you for reporting spam');
            setTimeout( () => window.location.reload(), 1000);
        }
        else {
            axios.put(`http://127.0.0.1:8000/api/updatereviews/${item.id}/`, {
                author_token: item.author_token,
                author_username: item.author_username,
                dish: item.dish,
                description: item.description,
                stars: item.stars,
                is_anonymous: item.is_anonymous,
                likes: item.likes,
                photo_name: item.photo_name,
                spam: this.props.token
            })
                .then(res => console.log(res))
                .catch(error => console.log(error));
            message.success('Thank you for reporting spam');
            setTimeout( () => window.location.reload(), 1000);
        }
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
            message.success('Your like has been counted!');
            setTimeout( () => window.location.reload(), 1000);
        }
        else {
            message.error('You can`t like your ouw review');
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
                            width="100px"
                            height="100px"
                        />: null
                        }
                    >
                        <List.Item.Meta
                            title={item.title}
                            content={item.description}
                        />
                        <h5 style={{fontFamily: 'Raleway'}}>{item.description}</h5>
                        <footer>
                            <h7 style={{fontFamily: 'Raleway'}}>By: {this.author(item)}</h7>
                            <br/>
                            <div style={{display: "inline-flex" , flexDirection: "row"}}>
                            <Rate style={{marginRight: 10}} disabled defaultValue={item.stars} />
                            <div style={{marginRight:10}}><Button style={{marginRight: 10}} onClick={ () => this.handleLike(item) } shape="circle" icon="like" />
                                <h7 style={{display: "inline-flex"}}>{item.likes}</h7></div>
                            </div>
                            <a onClick={() => this.handleSpam(item)}>spam</a>
                        </footer>
                    </List.Item>
                )}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null,
        token: state.token
    }
};

export default connect(mapStateToProps)(Reviews);