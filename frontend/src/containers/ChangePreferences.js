import React from "react";


class ChangePreferences extends React.Component {

    render() {
        return (
           <Reviews data={this.state.likes}/>
        )
    }
}


export default ChangePreferences;