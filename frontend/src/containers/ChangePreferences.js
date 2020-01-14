import React from "react";
import PreferencesForm from "./UserPreferencesForm";


class ChangePreferences extends React.Component {

    render() {
        return (
           <div>
               <h2>Update your preferences:</h2>
               <PreferencesForm requestType="put"/>
           </div>
        )
    }
}

export default ChangePreferences;