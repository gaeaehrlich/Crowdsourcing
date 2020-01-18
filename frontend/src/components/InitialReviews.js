import React from "react";
import {List, Card, Rate, Form} from 'antd';
import axios from "axios";

const { Meta } = Card;

class InitialReviews extends React.Component {

    state = {
        dishes: [],
        rate: 3
    };

    setRandArr = (length) => {
        let res = [];
        if(length < 8) {
            for(let i = 0; i < length; i++) {
                res = [...res, i];
            }
        }
        else {
            let i = 0;
            while(i < 8) {
                let num = Math.floor(Math.random()*length);
                if(!res.includes(num)) {
                    res = [...res, num];
                    i++;
                }
            }
        }
        return res;
    };


    componentDidMount() {
        axios.get(`http://127.0.0.1:8000/api/dish/`).then(res => {
            const length = res.data.length;
            const rand = this.setRandArr(length);
            console.log(rand);
            let dishes = [];
            for(let i = 0; i < rand.length; i++) {
                dishes = [...dishes, res.data[rand[i]]]
            }
            console.log(dishes);
            this.setState({
                dishes: dishes
            });
        });
    }

    init_review = (username, dishid) => {
        axios.get(`http://127.0.0.1:8000/api/init_review`, {
            params: {
                user_name: username,
                dish_id: dishid
            }
        }).then(res => {
            console.log(res)
        });
    };

    handleSubmit = (event, dishID) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                return axios.post('http://127.0.0.1:8000/api/createreview/', {
                    author_token: localStorage.getItem('token'),
                    author_username: localStorage.getItem('username'),
                    dish: dishID,
                    description: "",
                    stars: values['rating'],
                    is_anonymous: true,
                    likes: 0
                }).then(res => {console.log(res);
                    this.init_review(localStorage.getItem('username'), dishID)
                })
                    .catch(error => console.log(error.response));
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <List
                grid={{gutter: 2, column: 4}}
                dataSource={this.state.dishes}
                renderItem={item => (
                    <List.Item>
                        <Card
                            hoverable
                            style={{width: 240}}
                            cover={<img alt="example"
                                        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
                        >
                            <Meta title={item.title} description={item.content}/>

                            <Form layout="vertical">
                                <Form.Item>
                                    {getFieldDecorator('rating', {
                                    })(<Rate onChange={(event) => this.handleSubmit(event, item.id)}/>)}
                                </Form.Item>
                            </Form>

                        </Card>
                    </List.Item>
                )}
            />
        );
    }

};

const WrappedForm = Form.create()(InitialReviews);

export default WrappedForm;