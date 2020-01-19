import React from "react";
import axios from 'axios';
import { Link} from 'react-router-dom';

import { AutoComplete, Typography, Form, Button, Row, Col, Tag } from 'antd';
import {connect} from "react-redux";
import logo from "../logo.png";
import search from "../search.png"
import eatWith from "../eat_with_logo.png"
import Reminder from "../components/Reminder";


const { Title } = Typography;



class MainPage extends React.Component {

    state = {
        dishes: [],
        area: '',
        init_tags: ['Asian', 'Vegan', 'Vegetarian', 'Shit', 'Kosher', 'PeanutsFree'],
        possible_tags: [],
        tags: [],
        init_areas: ['Tel Aviv', 'City Center', 'City North'],
        possible_areas: [],
        areas: [],
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

    setTags = obj => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/tag`).then(res => {
            temp = res.data.map(tag=>tag['title']);
            this.setState({
                init_tags: temp
            });
        });
    };

    setCityAreas = obj => {
        let temp;
        axios.get(`http://127.0.0.1:8000/api/cityarea`).then(res => {
            temp = res.data.map(tag=>tag['name']);
            this.setState({
                init_areas: temp
            });
        });
    };


    dishToPicLocation = name => {
        let out;
        out = name.replace(/ /g, '_');
        return 'http://127.0.0.1:8000/api/pic/'+out;
    };

    setInitDishes = stam => {
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


    onSetTag = tag => {
        this.setState(state => {
            const tags = state.tags.concat(tag);
            return {tags,};
        });
    };

    handleCloseTag = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({tags});
    };

    onSearchTag = searchText => {
        this.setState({
            possible_tags: !searchText ? [] : this.state.init_tags.filter(tag => tag.toLowerCase().startsWith(searchText.toLowerCase())),
        });
    };

    onSetArea = area => {
        this.setState(state => {
            const areas = state.areas.concat(area);
            return {areas,};
        });
    };

    handleCloseArea = removedArea => {
        const areas = this.state.areas.filter(area => area !== removedArea);
        this.setState({areas});
    };

    onSearchArea = searchText => {
        this.setState({
            possible_areas: !searchText ? [] : this.state.init_areas.filter(area => area.toLowerCase().startsWith(searchText.toLowerCase())),
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        axios.get(`http://127.0.0.1:8000/api/search`, {
            params: {
                tags: this.state.tags,
                area: this.state.areas,
                user_name: this.state.user_name
            }
        }).then(res => {
            console.log(res);
            this.setState({
                dishes: res.data

            });
        });
    };

    gutt = -16;


    render() {
        return (
            <div>
                {this.props.isAuthenticated ?
                    <div>
                    <Title level={2}>Welcome, {this.state.user_name}</Title>
                    {this.state.searches.length > 0 ?
                    <div>
                        <h3>Have you tried these courses?</h3>
                        <br/>
                        <Reminder data={this.state.searches}/>
                    </div>
                    : null}
                    <div style={{
                        display: "inline-flex",
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}><Link to={'search'}><img src={search}/></Link>
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