import React from "react";
import PreferencesForm from "../components/UserPreferencesForm";


class ChangePreferences extends React.Component {

    render() {
        return (
           <div>
               <h2 style={{fontFamily: 'Raleway'}}>Update your preferences:</h2>
               <PreferencesForm requestType="put"/>
           </div>
        )
    }
}

export default ChangePreferences;