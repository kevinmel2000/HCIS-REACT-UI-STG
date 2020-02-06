import React, { Component } from 'react'

var opButton = 'btn btn-circle btn-grey active'
var clButton = 'btn btn-circle btn-grey'

class Pages extends Component {

  constructor () {
    super()
    this.state = {
      roomChat: 'c-p-room',
      smallChatClass: clButton,
      sttChatPopup: false,
    }
  }

  opRoomChat = () => {
    if (this.state.roomChat === 'c-p-room') { 
      this.setState({roomChat: 'c-p-room open'})
    } else {
      this.setState({roomChat: 'c-p-room'})
    }
  }

  opChatPopup = () => {
    if (this.state.sttChatPopup === false) {
      this.setState({smallChatClass: opButton})
      this.setState({sttChatPopup: true})
    } else {
      this.setState({smallChatClass: clButton})
      this.setState({sttChatPopup: false})
    }
  }

  cardProfile = (val) => {
    let dt = []
    for (let index = 0; index < val; index++) {
      dt.push(
        <div className="chat-profile" onClick={ this.opRoomChat }>
          <div className="col-1">
            <div className="image image-35px image-circle background-blue" />
          </div>
          <div className="col-2">
            <div className="c-p-name">
              Full Name
            </div>
            <div className="c-p-message">
              Lorem ipsum dolor sit amet..
            </div>
          </div>
        </div>
      )
    }
    return dt
  }

  cardMessage = (val) => {
    let dt = []

    for (let index = 0; index < val; index++) {
      dt.push(
        <div>

          <div className="card-message c-m-left">
            <div className="c-m-col-1">
              <div className="image image-40px image-circle background-blue" />
            </div>
            <div className="c-m-col-2">
              <div className="c-m-content">
                <div className="c-m-top">
                  <div className="c-m-name">
                    Full Name
                  </div>
                  <div className="c-m-date">
                    Nov 15, 19
                  </div>
                </div>
                <div className="c-m-mid">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </div>
            </div>
          </div>

          <div className="card-message c-m-right">
                  
            <div className="c-m-content">
              <div className="c-m-top">
                <div className="c-m-name">
                  Me
                </div>
                <div className="c-m-date">
                  Nov 15, 19
                </div>
              </div>
              <div className="c-m-mid">
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
              </div>

            </div>

          </div>
        </div>
      )
    }
    return dt
  }

  render () {
		return (
      <div>

        <button 
          onClick={this.opChatPopup}
          className={this.state.smallChatClass}>
          <span className="btn-notif background-red">2</span>
          <i className="far fa-lg fa-comment-alt txt-site txt-13"></i>
        </button>

        {(this.state.sttChatPopup) ? (
          <div className="chat-popup">

            <div className="c-p-list">
              <div className="c-p-top background-blue">
                <div className="grid grid-2x">
                  <div className="col-1">
                    <div className="txt-site txt-12 txt-bold txt-top">
                      Chats
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <button className="btn btn-small-circle btn-blue">
                      <i className="fa fa-lw fa-search" />
                    </button>
                    <button className="btn btn-small-circle btn-blue">
                      <i className="fa fa-lw fa-plus" />
                    </button>
                    {/*<button className="btn btn-small-circle btn-blue">
                      <i className="fa fa-lw fa-ellipsis-h" />
                    </button>*/}
                    <button 
                      onClick={this.opChatPopup}
                      className="btn btn-small-circle btn-blue">
                      <i className="fa fa-lw fa-times" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="c-p-mid background-white">
                { this.cardProfile(3) }
              </div>
            </div>

            <div className={ this.state.roomChat }>
              <div className="c-p-top background-blue">
                <div className="grid grid-2x">
                  <div className="col-1">
                    <button 
                      style={{display: 'inline-block', marginRight: '5px'}}
                      onClick={this.opRoomChat}
                      className="btn btn-small-circle btn-blue">
                      <i className="fa fa-lg fa-angle-left" />
                    </button>
                    <div style={{display: 'inline-block', verticalAlign: 'center'}}>
                      <div className="txt-site txt-12 txt-bold color-white">
                        Full Name
                      </div>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <button className="btn btn-small-circle btn-blue">
                      <i className="fa fa-lw fa-ellipsis-h" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="c-p-min background-white">
                { this.cardMessage(2) }
              </div>
              <div className="c-p-bot">
                <input 
                  className="txt txt-trans-color txt-small txt-no-shadow color-main"
                  required 
                  placeholder="Write message .." />
                <button className="btn btn-small-circle btn-pos">
                  <i className="fa fa-lw fa-paper-plane" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div></div>
        )}
      </div>
    )
	}

}

export default Pages