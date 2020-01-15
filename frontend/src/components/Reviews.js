import React from "react";
import { List, Icon, Rate, Button } from 'antd';
import {connect} from "react-redux";
import axios from "axios";


const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);


class Reviews extends React.Component {

    state = {
        likes: []
    };

    handleLike = (authorToken, reviewID, currentLikes) => {
        if (this.props.token !== authorToken) {
            axios.get(`http://127.0.0.1:8000/api/user/${this.props.token}/`).then(res => {
                this.setState({
                    likes: res.data.likes
                });
            });

            axios.put(`http://127.0.0.1:8000/api/updateuser/${this.props.token}/`, {
                likes: [...this.state.likes, reviewID]
            })
            .then(res => console.log(res))
            .catch(error => console.log(error));

            axios.put(`http://127.0.0.1:8000/api/updatereviews/${reviewID}/`, {
                likes: currentLikes + 1
            })
            .then(res => console.log(res))
            .catch(error => console.log(error));
        }
    };

    render() {
        console.log(this.props.token);
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
                        actions={[
                            //<div>By: {item.username}</div>, add username to Review!!!!!!!!!!!!!
                            <Rate disabled defaultValue={item.stars} />,
                            <Button onClick={this.handleLike(item.author, item.id, item.likes)} shape="circle" icon="like" />,
                            //<IconText onClick={this.handleLike(item.author, item.id, item.likes)} type="like-o" text={item.likes} key="list-vertical-like-o"/>,
                        ]}
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />
                        }
                    >
                        <List.Item.Meta
                            title={<a href={`/${item.id}/`}>{item.dish.title}</a>}
                            description={item.description}
                        />
                        {item.content}
                    </List.Item>
                )}
            />
        );
    }
}

export default Reviews;