import React from "react";
import axios from 'axios';
import { Link} from 'react-router-dom';

import { Typography, notification } from 'antd';
import {connect} from "react-redux";
import logo from "../logo.png";
import search from "../search.png"
import eatWith from "../eat_with_logo.png"
import Reminder from "../components/Reminder";


const { Title } = Typography;



class MainPage extends React.Component {

    state = {
        dishes: [],
        init_tags: ['Asian', 'Vegan', 'Vegetarian', 'Shit', 'Kosher', 'PeanutsFree'],
        init_areas: ['Tel Aviv', 'City Center', 'City North'],
        reviews: [],
        searches: [],
        user_name: localStorage.getItem('username'),
    };

    fetchUser = async () => {
        const token = localStorage.getItem('token');
        await axios.get(`http://127.0.0.1:8000/api/userreviews/${token}/`).then(res => {
            this.setState({
                reviews: res.data
            });
        });
        axios.get(`http://127.0.0.1:8000/api/user/${token}/`).then(res => {
            let updatedHistory = [...res.data.searches];
            for(let i = 0; i < this.state.reviews.length; i++) {
                const index = updatedHistory.indexOf(Number(this.state.reviews[i].dish));
                if (index !== -1) {
                    updatedHistory.splice(index, 1);
                }
            }
            this.setState({
                searches: updatedHistory
            });
        }).catch( () => {
            this.setState({
                searches: []
            });
        });
    };

    setTags = () => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/tag`).then(res => {
            temp = res.data.map(tag=>tag['title']);
            this.setState({
                init_tags: temp
            });
        });
    };

    setCityAreas = () => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/cityarea`).then(res => {
            temp = res.data.map(tag=>tag['name']);
            this.setState({
                init_areas: temp
            });
        });
    };


    setInitDishes = ()=> {
        axios.get(`http://127.0.0.1:8000/api/dish/`).then(res => {
            this.setState({
                dishes: res.data
            });
        });
    };

    componentDidMount() {
        this.fetchUser();
        this.setTags();
        this.setCityAreas();
        this.setInitDishes();

        this.setState({
            user_name: localStorage.getItem('username'),
        });
    }

    openNotification = () => {
        const args = {
            message: 'What about some review??',
            description:
                <Reminder data={this.state.searches}/>,
            duration: 0,
        };
        notification.open(args);
    };


    render() {
        return (
            <div>
                {this.props.isAuthenticated ?
                    <div>
                        <Title level={2} style={{fontFamily: 'Raleway'}}>Welcome, {this.state.user_name}</Title>
                        {this.state.searches.length > 0 ?
                            this.openNotification()
                            : null}
                        <div style={{
                            display: "inline-flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}><Link to={'search'}><img src={search} style={{marginRight: 200}}/></Link>
                            <Link to={'eatwith'}><img src={eatWith}/></Link></div>
                    </div>
                    :
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}><img src={logo}/></div>

                }

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null,
        token: state.token
    }
};

export default connect(mapStateToProps)(MainPage);