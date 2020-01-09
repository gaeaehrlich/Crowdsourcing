import React from "react";
import axios from 'axios';

import Reviews from "../components/Reviews";
import { Steps, Icon } from 'antd';

const { Step } = Steps;

class UserReviewsList extends React.Component {

    state = {
        reviews: [],
        level: 10
    };


    fetchReviews = () => {
        const token = this.props.match.params.token;
        axios.get(`http://127.0.0.1:8000/api/userreviews/${token}/`).then(res => {
          this.setState({
            reviews: res.data
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
        this.fetchReviews();
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
            <div>Reviews level:
              <Steps>
                <Step status={ProgressBarStatus("Beginner")} title="Beginner" icon={<Icon type="user" />} />
                <Step status={ProgressBarStatus("Intermediate")} title="Intermediate" icon={<Icon type="meh" />} />
                <Step status={ProgressBarStatus("Reliable")} title="Reliable" icon={<Icon type="smile" />} />
                <Step status={ProgressBarStatus("Critic")} title="Critic" icon={<Icon type="trophy" />} />
              </Steps>
           <Reviews data={this.state.reviews}/>
            </div>
        )
    }
}


export default UserReviewsList;