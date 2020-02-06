import React, { Component } from 'react'
import { BrowserRouter as Router, HashRouter, Redirect } from "react-router-dom"
import logo from './../../assets/img/eksad-logo-new.jpeg'
import cover from './../../assets/img/cover/2.jpg'
import LoadingBar from 'react-top-loading-bar'
import AuthAction from '../../Redux/AuthRedux'
import { connect } from 'react-redux';

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      redirect: props.auth.user ? true : false,
      role: ['ROLE_SID_WEB_ADMIN']
    }

    this.handleChangeUsername = this.handleChangeUsername.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeUsername(event) {
    this.setState({username: event.target.value})
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    this.login()
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.auth.fetching) {
      if (newProps.auth && !newProps.auth.error) {
        this.setState({ redirect: true });
        this.onFinishFetch()
      } else {
        this.onFinishFetch()
      }
    }
  }

  login() {
    this.startFetch()
    const { username, password } = this.state
    let payload = {
      username,
      password
    }
    this.props.authRequest(payload);
  }

  startFetch = () => {
    this.LoadingBar.continousStart()
  }

  onFinishFetch = () => {
    if(typeof this.LoadingBar === "object") this.LoadingBar.complete()
  }

  render() {

    if (this.state.redirect) {
      return <Redirect push to="/home"></Redirect>
    }

    return (
      <HashRouter history={ Router.browserHistory }>
        <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
          <div 
            className="app-login background-blue">

            <div className="login-content display-flex-normal" style={{height: '550px'}}>
              <div className="width width-450px">
                <div 
                  className="image image-all background-dark-grey"
                  style={{
                    backgroundImage: 'url('+cover+')'
                  }}>
                    <div className="post-center txt-site txt-center">
                      <div className="margin-15px txt-site txt-20 txt-bold txt-shadow txt-white">
                        Try It For Free Today!
                      </div>
                      <div className="txt-site txt-10 txt-bold txt-shadow txt-white">
                        Human Resource Information System
                      </div>
                      <div className="margin-15px">
                        <input 
                          type="button"
                          value="CREATE ACCOUNT"
                          className="btn btn-width-full btn-blue"></input>
                      </div>
                    </div>
                </div>
              </div>

              <div className="width width-full display-flex-column">

                {/* top */}
                <div className="padding-15px display-flex-normal">
                  <div className="width width-100px">
                    <div className="image image-circle image-50px border-all">
                      <img src={logo} alt=""></img>
                    </div>
                  </div>
                  <div className="width width-full content-right">
                    <h1 className="txt-site txt-main txt-20">EKSADPRO2019</h1>
                    <p className="txt-site txt-primary txt-11">Human Resource Information System</p>
                  </div>
                </div>

                {/* middle */}
                <form onSubmit={this.handleSubmit}>
                  <div className="width width-center width-350px">

                    {/* <div className="padding-25px"></div> */}

                    <div className="margin-15px">
                      <h1 className="txt-site txt-center txt-blue txt-20">Welcome Back!</h1>
                    </div>

                    <div className="padding-5px"></div>

                    <div className="margin-15px">
                      <div className="margin-bottom-5px txt-site txt-10 txt-main txt-bold">
                        Email or Username
                      </div>
                      <input 
                        type="text" 
                        className="txt txt-sekunder-color"
                        value={this.state.username}
                        onChange={this.handleChangeUsername}
                        required></input>
                    </div>

                    <div className="margin-15px">
                      <div className="margin-bottom-5px txt-site txt-10 txt-main txt-bold">
                        Password
                      </div>
                      <input 
                        type="password" 
                        className="txt txt-sekunder-color"
                        value={this.state.password}
                        onChange={this.handleChangePassword}
                        required></input>
                    </div>

                    <div className="margin-15px display-flex-normal">
                      <input 
                        type="submit" 
                        value="SIGN IN"
                        className="btn btn-width-full btn-blue"></input>
                      <div className="width width-full content-right">
                        <i className="fa fa-1x fa-key txt-site txt-primary txt-9 margin-right-5px" /> 
                        <span className="txt-site txt-blue txt-bold txt-10">Forgot Password?</span>
                      </div>
                    </div>

                    {/* <div className="padding-25px"></div> */}

                  </div>
                </form>

                {/* bottom */}
                <div className="padding-15px display-flex-normal">
                  <div className="width width-full display-flex-normal">
                    <div className="txt-site txt-10 txt-primary margin-right-5px">
                      Available on
                    </div>
                    {/* <div className="txt-site txt-10 txt-primary margin-right-5px">
                      <i className="fab fa-lw fa-apple" /> iOS
                    </div> */}
                    <div className="txt-site txt-10 txt-primary">
                      <i className="fab fa-lw fa-android" /> Android
                    </div>
                  </div>
                  <div className="width width-full">
                    <div className="content-right">
                      <div className="txt-site txt-10 txt-primary">
                        <span className="margin-right-5px">Supported Browser</span>
                        <i className="fab fa-1x fa-chrome margin-right-5px" />
                        <i className="fab fa-1x fa-safari margin-right-5px" />
                        <i className="fab fa-1x fa-firefox margin-right-5px" />
                        <i className="fab fa-1x fa-edge margin-right-5px" />
                        <i className="fab fa-1x fa-internet-explorer" />
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>

          </div>
        </div>
      </HashRouter>
    )
  }
}

const mapStateToProps = state => {
	return {
		auth: state.auth
	};
};

const mapDispatchToProps = dispatch => {
	return {
		authRequest: obj => dispatch(AuthAction.authRequest(obj))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);