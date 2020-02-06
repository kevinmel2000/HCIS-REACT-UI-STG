import React, { Component } from 'react'
import { NavLink } from "react-router-dom"
import AuthAction from '../../Redux/AuthRedux'
import { connect } from 'react-redux'
import * as R from 'ramda'

var opActivePopup = 'app-small-profile active'
var clActivePopup = 'app-small-profile'

var clContentPopup = 'app-menu-popup app-menu-popup-hide'

class Pages extends Component {

  constructor(props) {
    super(props)
    this.state = {
      profileClass: clContentPopup,
      smallProfileClass: clActivePopup,
      auth: props.auth
    }
  }

  componentWillReceiveProps(newProps) {
    let { auth } = newProps
    this.setState({ auth })
    if(!R.isNil(auth.user)) this.getImage(auth)
  }

  componentWillMount() {
    let { auth } = this.state
    if(!R.isNil(auth.user)) this.getImage(auth)
  }

  async getImage(value) {
    let employeeID = !R.isNil(value.user) ? value.user.employeeID : ""
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + employeeID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
  if (response.size > 0) {
    response = URL.createObjectURL(response);
    this.setState({ imageUrl: response })
    }
  }

  handleClickOutside(element) {
    // console.log(element)
    const outsideclickListener = event => {
      if (!element.contains(event.target)) {
        element.style.display = 'none'
        removeClickListener()
      }
    }

    const removeClickListener = () => {
      this.setState({smallProfileClass: clActivePopup})
      document.removeEventListener('click', outsideclickListener)
    }

    document.addEventListener('click', outsideclickListener)
  }

  opProfile = () => {
    var element = document.getElementById('app-profile')
    element.style.display = 'block'
    this.setState({smallProfileClass: opActivePopup})
    this.handleClickOutside(element)
    // if (this.state.profileClass === clContentPopup) {
    //   this.setState({ profileClass: opContentPopup })
    //   this.setState({ smallProfileClass: opActivePopup })
    // } else {
    //   this.setState({ profileClass: clContentPopup })
    //   this.setState({ smallProfileClass: clActivePopup })
    // }
  }

  logout() {
    this.props.authLogout()
  }

  render() {
    return (
      <div>
        <div
          onClick={this.opProfile}
          className={this.state.smallProfileClass}
          style={{ float: 'right' }}>
          <div className="asp-col-1">
            <div className="image image-circle image-30px background-blue">
              <img src={this.state.imageUrl} alt=""/>
            </div>
          </div>
          <div className="asp-col-2">
            <div className="ttl">
              <i className="fa fa-lw fa-angle-down txt-site txt-primary txt-16" />
            </div>
            {/*<div className="ttl">
              <div className="txt-site txt-main txt-12 txt-cap">
              	Admin
              </div>
            </div>*/}
          </div>
        </div>

        <div
          style={{ top: "45px", width: "200px" }}
          id="app-profile"
          className={this.state.profileClass}>
          <ul>
            <NavLink to="/ess-biodata">
              <li>
                <i className="icn fa fa-lw fa-user"></i>
                Profile
              </li>
            </NavLink>
            <NavLink to="/">
              <li onClick={this.logout.bind(this)}>
                <i className="icn fa fa-lw fa-power-off"></i>
                Logout
              </li>
            </NavLink>
          </ul>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pages);