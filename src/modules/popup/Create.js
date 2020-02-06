import React, { Component } from 'react'

var clContentPopup = 'app-menu-popup app-menu-popup-hide'

var opButtonBig = 'btn btn-green active'
var clButtonBig = 'btn btn-grey'

class Pages extends Component {

  constructor () {
    super()
    this.state = {
    	createClass: clContentPopup,
      smallCreateClass: clButtonBig,
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
      this.setState({smallCreateClass: clButtonBig})
      document.removeEventListener('click', outsideclickListener)
    }

    document.addEventListener('click', outsideclickListener)
  }

  opCreate = () => {
    var element = document.getElementById('app-create')
    element.style.display = 'block'
    this.setState({smallCreateClass: opButtonBig})
    this.handleClickOutside(element)
    // if (this.state.createClass === clContentPopup) {
    //   this.setState({createClass: opContentPopup})
    //   this.setState({smallCreateClass: opButtonBig})
    // } else {
    //   this.setState({createClass: clContentPopup})
    //   this.setState({smallCreateClass: clButtonBig})
    // }
  }

  render () {
		return (
      <div>
      	<button 
          onClick={this.opCreate}
          className={this.state.smallCreateClass}>
          <i className="fa fa-lw fa-plus" /> Create
        </button>

        <div
          style={{top: "45px", width: "250px"}} 
          id="app-create"
          className={this.state.createClass}>
          <ul>
            <li>
              <i className="icn fa fa-lw fa-car color-green"></i>
              Add New Car
            </li>
            <li>
              <i className="icn fa fa-lw fa-laptop color-green"></i>
              Add New Monitor
            </li>
            <li className="bdr-bottom">
              <i className="icn fa fa-lw fa-school color-green"></i>
              Add New Student
            </li>
            <li>
              <i className="icn fa fa-lw fa-database color-post"></i>
              Create New Database
            </li>
            <li className="bdr-bottom">
              <i className="icn fa fa-lw fa-users color-post"></i>
              Create New Account
            </li>
            <li>
              <i className="icn fa fa-lw fa-cog color-red"></i>
              Settings
            </li>
          </ul>
        </div>

      </div>
    )
  }

}

export default Pages