import React, { Component } from "react";
import { Bert } from "meteor/themeteorchef:bert";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";

import FormValidation from "../../utils/FormValidation";

class SigninForm extends Component {
  state = {
    email: "",
    password: "",
    loading: false
  };

  handleChange = event => {
    let name = event.target.name,
      value = event.target.value;
    this.setState({ [name]: value });
  };

  onSubmit = () => {
    const { client, history } = this.props;
    const { email, password } = this.state;
    this.toggleLoading();
    Meteor.loginWithPassword(email, password, error => {
      Bert.alert({
        title: error ? "Error!" : "Success",
        message: error ? error.reason : "You are now logged in",
        type: error ? "danger" : "success",
        style: "growl-top-right",
        icon: error ? "fa-remove" : "fa-check"
      });
      if (!error) {
        client.resetStore(() => {
          history.push(Meteor.settings.public.router.index.PATH);
        });
      }
    });
    this.toggleLoading();
  };

  toggleLoading = () => this.setState({ loading: !this.state.loading });

  render() {
    const { email, password, confirmation, username, loading } = this.state;
    const rules = {
      password: {
        minlength: 6
      },
      confirmation: {
        equalTo: "#password"
      }
    };
    return (
      <FormValidation onHandleSubmit={this.onSubmit} rules={rules}>
        <div className="container col paper justify-content-center align-items-center">
          <h1 className="headline">
            {Meteor.settings.public.forms.accounts.signin.HEADLINE}
          </h1>
          {loading ? (
            <h1>LOADING</h1>
          ) : (
            <div className="container col align-items-center paper">
              <input
                type="email"
                className="input-text"
                required
                placeholder={
                  Meteor.settings.public.forms.accounts.signin.email.PLACEHOLDER
                }
                name="email"
                value={email}
                onChange={this.handleChange}
                required
              />
              <input
                type="password"
                className="input-text"
                required
                placeholder={
                  Meteor.settings.public.forms.accounts.signin.password
                    .PLACEHOLDER
                }
                name="password"
                id="password"
                value={password}
                onChange={this.handleChange}
                required
              />
              <input
                className="button-primary button-lg"
                type="submit"
                value={
                  Meteor.settings.public.forms.accounts.signin.submit.LABEL
                }
              />
            </div>
          )}
        </div>
      </FormValidation>
    );
  }
}

export default withApollo(withRouter(SigninForm));
