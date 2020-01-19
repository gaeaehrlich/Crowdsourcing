import React from "react";
import axios from 'axios';

import Gifts from "../components/Gifts";
import {Steps, Icon, List, Button, Modal} from 'antd';
import share from "../facebbok.png"

const { Step } = Steps;

class UserGiftsList extends React.Component {

    state = {
        gifts: [{id: 0, restaurant_name: "girrafe1", description: "You get 20% off your next order!"},
            {id: 1, restaurant_name: "girrafe2", description: "You get 20% off your next order!"},
            {id: 2, restaurant_name: "girrafe3", description: "You get 20% off your next order!"},
            {id: 3, restaurant_name: "girrafe4", description: "You get 20% off your next order!"},
            {id: 4, restaurant_name: "girrafe5", description: "You get 20% off your next order!"}],
        level: 0,
        used: [],
        visible: false
    };


    fetchGifts = () => {
        const token = this.props.match.params.token;
        axios.get(`http://127.0.0.1:8000/api/usergifts/${token}/`).then(res => {
            this.setState({
                gifts: res.data
            });
        });
    };

    fetchUser = () => {
        const token = this.props.match.params.token;
        axios.get(`http://127.0.0.1:8000/api/user/${token}/`).then(res => {
            console.log(res.data);
            this.setState({
                level: res.data.level
            });
        });
    };

    componentDidMount() {
        //this.fetchGifts();
        this.fetchUser();
        console.log(this.state.used)
    }

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleClick = (itemID) => {
        console.log(this.state.used);
        this.setState({
            used: [...this.state.used, itemID],
            visible: true,
        });

    };

    render() {

        const ProgressBarStatus = (title) => {
            if (title === "Beginner" && this.state.level >= 2) return "finish";
            if (title === "Intermediate" && this.state.level >= 3) return "finish";
            if (title === "Reliable" && this.state.level >= 4) return "finish";
            if (title === "Critic" && this.state.level >= 5) return "finish";
            return "wait";
        };

        const maxLevel = this.state.level > 5 ? 5 : this.state.level;
        return (
            <div>
                <h3>Your level: {this.state.level ? maxLevel : 0} / 5</h3>
                <br/>
                <Steps>
                    <Step status={ProgressBarStatus("Beginner")} title="Beginner" icon={<Icon type="user"/>}/>
                    <Step status={ProgressBarStatus("Intermediate")} title="Intermediate" icon={<Icon type="meh"/>}/>
                    <Step status={ProgressBarStatus("Reliable")} title="Reliable" icon={<Icon type="smile"/>}/>
                    <Step status={ProgressBarStatus("Critic")} title="Critic" icon={<Icon type="trophy"/>}/>
                </Steps>
                <br/>
                <img style={{width: "15%", height: "15%"}} src={share}/>
                <br/><br/>
                <h3>Available gifts:</h3>
                {this.state.level ?
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.gifts.slice(0, maxLevel)}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<a>{item.restaurant_name}</a>}
                                    description={item.description}
                                />
                                {this.state.used.indexOf(item.id) == -1 ?
                                    <Button onClick={() => this.handleClick(item.id)}>Use gift</Button>
                                    :
                                    <Button disabled={true}>Used!</Button>
                                }
                                <Modal
                                    title="Your gift token:"
                                    visible={this.state.visible}
                                    onOk={this.handleOk}
                                    closable={false}
                                    mask={false}
                                    maskClosable={false}
                                    footer={[
                                        <Button key="back" onClick={this.handleOk}>
                                            Ok
                                        </Button>
                                    ]}
                                >
                                    <p>{localStorage.getItem('token').slice(0, 10)}</p>
                                </Modal>
                            </List.Item>
                        )}
                    />
                    // <Gifts data={this.state.gifts.slice(0, maxLevel)}/>
                    :
                    <h4>No available gifts. To get gifts you need to LEVEL UP! to do so you need to get likes on your
                        reviews</h4>}
            </div>
        )
    }
}


export default UserGiftsList;