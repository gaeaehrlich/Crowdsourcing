import React from "react";
import axios from 'axios';

import Gifts from "../components/Gifts";
import { Steps, Icon } from 'antd';

const { Step } = Steps;

class UserGiftsList extends React.Component {

    state = {
        gifts: [{restaurant_name: "girrafe1", description: "You get 20% off your next order!"},
        {restaurant_name: "girrafe2", description: "You get 20% off your next order!"},
        {restaurant_name: "girrafe3", description: "You get 20% off your next order!"},
        {restaurant_name: "girrafe4", description: "You get 20% off your next order!"}],
        level: 0
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
    }

    render() {
        const ProgressBarStatus = (title) => {
            if(title === "Beginner" && this.state.level >= 2) return "finish";
            if(title === "Intermediate" && this.state.level >= 3) return "finish";
            if(title === "Reliable" && this.state.level >= 4) return "finish";
            if(title === "Critic" && this.state.level === 5) return "finish";
            return "wait";
        };

        return (
            <div>
                <h3>Your level: {this.state.level ? this.state.level : 0}</h3>
                <br/>
              <Steps>
                <Step status={ProgressBarStatus("Beginner")} title="Beginner" icon={<Icon type="user" />} />
                <Step status={ProgressBarStatus("Intermediate")} title="Intermediate" icon={<Icon type="meh" />} />
                <Step status={ProgressBarStatus("Reliable")} title="Reliable" icon={<Icon type="smile" />} />
                <Step status={ProgressBarStatus("Critic")} title="Critic" icon={<Icon type="trophy" />} />
              </Steps>
                <br /><br/><br/>
                <h3>Available gifts:</h3>
                {this.state.level ? <Gifts data={this.state.gifts[this.state.level - 1]}/> : <h4>No available gifts. To
                        get gifts you need to LEVEL UP! to do so you need to get likes on your reviews</h4>}
            </div>
        )
    }
}


export default UserGiftsList;