import React, { Component } from 'react'

var clContentPopup = 'app-menu-popup app-menu-popup-hide'

var opButton = 'btn btn-circle btn-grey active'
var clButton = 'btn btn-circle btn-grey'

class Pages extends Component {

  constructor () {
    super()
    this.state = {
    	notifClass: clContentPopup,
      smallNotifClass: clButton,
    }
  }

  // componentDidMount() {
    // var element = document.getElementById('app-notif')
    // this.handleClickOutside(element)
  // }

  handleClickOutside(element) {
    // console.log(element)
    const outsideclickListener = event => {
      if (!element.contains(event.target)) {
        element.style.display = 'none'
        removeClickListener()
      }
    }

    const removeClickListener = () => {
      this.setState({smallNotifClass: clButton})
      document.removeEventListener('click', outsideclickListener)
    }

    document.addEventListener('click', outsideclickListener)
  }

  opNotif = () => {
    var element = document.getElementById('app-notif')
    element.style.display = 'block'
    this.setState({smallNotifClass: opButton})
    this.handleClickOutside(element)

    // if (this.state.notifClass === clContentPopup) {
    //   this.setState({notifClass: opContentPopup})
    //   this.setState({smallNotifClass: opButton})
    // } else {
    //   this.setState({notifClass: clContentPopup})
    //   this.setState({smallNotifClass: clButton})
    // }
  }

  contentNotif = (length) => {
    var data = []
    for (var i = 0; i < length; ++i) {
      data.push(
      <div className="card-notif" key={i}>
        <div className="c-n-col-1">
          <div className="image image-circle image-40px background-blue"></div>
        </div>
        <div className="c-n-col-2">
          <div className="txt-site txt-11">
            <div className="txt-site txt-bold txt-main">
              Admin2 
            </div>
            <div className="txt-site txt-description txt-thin txt-main">
              This message will be place in here
            </div>
          </div>
          <div className="txt-site txt-10 txt-thin txt-primary">
            14 April 2019 14:00
          </div>
        </div>
      </div>)
    }
    return data
  }

  render () {
		return (
      <div>

      	<button 
          onClick={this.opNotif}
          className={this.state.smallNotifClass}>
          <span className="btn-notif">2</span>
          <i className="far fa-lg fa-bell txt-site txt-15"></i>
        </button>

        <div
          id="app-notif"
          style={{top: "45px"}} 
          className={this.state.notifClass}>
          <div className="txt-site txt-left">
          	
          	<div className="padding-15px txt-site txt-12 txt-bold txt-main bdr-bottom">
          		Notifications
          	</div>

          	<div className="content">
          		{ this.contentNotif(8) }
          	</div>

          </div>
        </div>

      </div>
    )
	}

}

export default Pages