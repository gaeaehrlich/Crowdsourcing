import React from "react";
import axios from 'axios';

import Gifts from "../components/Gifts";
import { Steps, Icon } from 'antd';

const { Step } = Steps;

class UserGiftsList extends React.Component {

    state = {
        gifts: [],
        level: 10
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
                level: res.data[0].level
            });
        });
    };

    componentDidMount() {
        this.fetchGifts();
        this.fetchUser();
    }

    render() {
        const ProgressBarStatus = (title) => {
            if(title === "Beginner" && this.state.level >= 10) return "finish";
            if(title === "Intermediate" && this.state.level >= 25) return "finish";
            if(title === "Reliable" && this.state.level >= 75) return "finish";
            if(title === "Critic" && this.state.level == 100) return "finish";
            return "wait";
        };

        return (
            <div> Reviews level:
              <Steps>
                <Step status={ProgressBarStatus("Beginner")} title="Beginner" icon={<Icon type="user" />} />
                <Step status={ProgressBarStatus("Intermediate")} title="Intermediate" icon={<Icon type="meh" />} />
                <Step status={ProgressBarStatus("Reliable")} title="Reliable" icon={<Icon type="smile" />} />
                <Step status={ProgressBarStatus("Critic")} title="Critic" icon={<Icon type="trophy" />} />
              </Steps>
            <Gifts data={this.state.gifts}/>
            </div>
        )
    }
}


export default UserGiftsList;