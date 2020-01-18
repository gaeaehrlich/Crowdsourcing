import React from 'react';
import { Form, Input, Icon, Button, Steps, message } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import PreferencesForm from "../components/UserPreferencesForm";
import InitialReview from "../components/InitialReviews";
import axios from "axios";

const { Step } = Steps;

const FormItem = Form.Item;

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        step: this.props.match.params.step
    };

    createProfile = () => {
        axios.post('http://127.0.0.1:8000/api/createuser/', {
            user: localStorage.getItem('token'),
            username: localStorage.getItem('username'),
            level: 1,
            likes: [],
            gifts: [],
            searches: [],
            constraints: []
        }).then(res => console.log(res))
            .catch(error => console.log(error.response));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.onAuth(
                    values.userName,
                    values.email,
                    values.password,
                    values.confirm
                );
                setTimeout(() => {
                    if (this.props.error) {
                        message.error('Error in creating new user');
                    }
                    else {
                        this.createProfile();
                        this.setState({
                            step: 2
                        });
                    }
                }, 1000);
            }
        });
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };

    stepStatus = (step) => {
        if (step === "first") {
            if (this.state.step == 1) return "process";
            else return "finished";
        }
        if (step === "second") {
            if (this.state.step == 1) return "wait";
            if (this.state.step == 2) return "process";
            if (this.state.step == 3) return "finished";
        }
        if (step === "third") {
            if (this.state.step < 3) return "wait";
            else return "process";
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div>
                <Steps>
                    <Step status={this.stepStatus("first")} title="User Signup"/>
                    <Step status={this.stepStatus("second")} title="Personal Information"/>
                    <Step status={this.stepStatus("third")} title="Initial Reviews"/>
                </Steps>
                <br/>
                {this.state.step == 1 ?
                    <Form onSubmit={this.handleSubmit}>

                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="Username"/>
                            )}
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: 'The input is not valid E-mail!',
                                }, {
                                    required: true, message: 'Please input your E-mail!',
                                }],
                            })(
                                <Input prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="Email"/>
                            )}
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: 'Please input your password!',
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="Password"/>
                            )}
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="Password" onBlur={this.handleConfirmBlur}/>
                            )}
                        </FormItem>

                        <FormItem>
                            <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>
                                Signup
                            </Button>
                            Or
                            <NavLink
                                style={{marginRight: '10px'}}
                                to='/login/'> login
                            </NavLink>
                        </FormItem>

                    </Form>
                    :
                    null
                }
                {this.state.step == 2 ?
                    <div>
                        <h2>Please select your preferences:</h2>
                        <PreferencesForm requestType="post"/>
                    </div>
                    :
                    null
                }
                {this.state.step == 3 ?
                    <div>
                        <h2>Please rate the dishes you liked:</h2>
                        <InitialReview/>
                        <Button onClick={ () => this.props.history.push('/')}>Finish</Button>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedRegistrationForm);