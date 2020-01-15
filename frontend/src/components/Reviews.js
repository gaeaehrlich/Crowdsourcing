import React from "react";
import { List, Rate, Button } from 'antd';
import axios from "axios";

class Reviews extends React.Component {

    state = {
        likes: []
    };

    handleLike = async (authorToken, reviewID, currentLikes) => {
        if (this.props.token !== authorToken) {
            await axios.get(`http://127.0.0.1:8000/api/user/${this.props.token}/`).then(res => {
                this.setState({
                    likes: res.data.likes
                });
            })
            .catch(error => console.log(error));

            console.log([...this.state.likes, reviewID]);
            await axios.put(`http://127.0.0.1:8000/api/updateuser/${this.props.token}/`, {
                likes: [...this.state.likes, reviewID]
            })
            .then(res => console.log(res))
            .catch(error => console.log(error));

            await axios.put(`http://127.0.0.1:8000/api/updatereviews/${reviewID}/`, {
                likes: currentLikes + 1
            })
            .then(res => console.log(res))
            .catch(error => console.log(error));
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
                        <div>
                            <div>By: {item.author_username}</div>
                            <Rate disabled defaultValue={item.stars} />
                            <Button onClick={ () => this.handleLike(item.author_token, item.id, item.likes)} shape="circle" icon="like" />
                        </div>
                    </List.Item>
                )}
            />
        );
    }
}

export default Reviews;