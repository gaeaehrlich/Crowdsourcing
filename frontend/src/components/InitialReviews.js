import React from "react";
import {List, Card, Rate, Form, Col, Button} from 'antd';
import axios from "axios";

const { Meta } = Card;

class InitialReviews extends React.Component {

    state = {
        dishes: [],
        submitted: [],
        length: 0
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

    handleSubmit = (event, dishID) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(dishID);
                if(this.state.submitted.indexOf(dishID) === -1) {
                    return axios.post('http://127.0.0.1:8000/api/createreview/', {
                        author_token: localStorage.getItem('token'),
                        author_username: localStorage.getItem('username'),
                        dish: dishID,
                        description: "",
                        stars: values[`rating${dishID}`],
                        is_anonymous: true,
                        likes: 0,
                        photo_name: ""
                    }).then(res => {
                        console.log(res);
                        this.setState({
                            submitted: [...this.state.submitted, dishID]
                        });
                    }).catch(error => console.log(error.response));
                }
            }
        });
    };

    dishToPicLocation = name => {
        if(name) {
            let out;
            out = name.replace(/ /g, '_');
            return 'http://127.0.0.1:8000/api/pic/' + out;
        }
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
                            style={{width: 240, padding: 5 }}
                            cover={
                                <img
                                    alt="So good.."
                                    src={this.dishToPicLocation(this.state.dish_name)}
                                    width="300"
                        />}
                        >
                            <Meta title={item.title} description={item.content}/>

                            <Form layout="vertical">
                                <Form.Item>
                                    {getFieldDecorator(`rating${item.id}`, { initial: 4
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