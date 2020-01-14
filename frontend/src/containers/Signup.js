import React from 'react';
import { Form, Input, Icon, Button, Steps } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import PreferencesForm from "../components/UserPreferencesForm";

const { Step } = Steps;

const FormItem = Form.Item;

class RegistrationForm extends React.Component {
  state = {
      confirmDirty: false,
      next: false
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
        this.setState({
            next: true
        })
      }
    });
  };

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  stepStatus = (step) => {
        switch (step) {
            case 'first':
                return this.state.next === false ? "process" : "finished";
            case 'second':
                return this.state.next === false ? "wait" : "process";
        }
  };

  render() {
      const {getFieldDecorator} = this.props.form;

      return (
          <div>
                <Steps>
                    <Step status = {this.stepStatus("first")} title="User Signup"/>
                    <Step status = {this.stepStatus("second")} title="Personal Information" />
                </Steps>
              <br/>
              {!this.state.next ?
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
                  <div>
                      <h2>Please select your preferences:</h2>
                      <PreferencesForm requestType="post"/>
                  </div>
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