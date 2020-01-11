import React from "react";
import axios from 'axios';

import Reminder from "../components/Reminder";
import {connect} from "react-redux";


class HomepageLayout extends React.Component {

    state = {
        searches: [],
    };

    fetchUser = () => {
        const token = localStorage.getItem('token');
        axios.get(`http://127.0.0.1:8000/api/user/${token}/`).then(res => {
            console.log(res.data);
            this.setState({
                searches: res.data[0].searches
            });
        });
    };

    componentDidMount() {
        this.fetchUser();
    }

    render() {
        return (
            <div>
                {this.props.isAuthenticated && this.state.searches.length > 0 ?
                <div>
                <h3>Have you tried these courses?</h3>
                    <br/>
                    <Reminder data={this.state.searches}/>
               </div>
               : null }
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

export default connect(mapStateToProps)(HomepageLayout);