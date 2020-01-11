import React from "react";
import axios from 'axios';

import Reminder from "../components/Reminder";


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
                {this.state.searches ?
                <div>
                <h3>Have you tried these courses?</h3>
                    <Reminder data={this.state.searches}/>
               </div>
               : null }
           </div>
        )
    }
}


export default HomepageLayout;