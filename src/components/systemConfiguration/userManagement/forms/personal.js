import React, { Component } from 'react'
import TimePicker from '../../../../modules/popup/Time'
import DatePicker from '../../../../modules/popup/Date'
import CalendarPicker from '../../../../modules/popup/Calendar'
import DropDown from '../../../../modules/popup/DropDown'
import DDLMenu from '../../../../modules/popup/DDLMenu'
import PopUp from '../../../pages/PopUpAlert'
import WebsocketNotif from '../../../../modules/popup/WebsocketNotif'

const clSlidePage = 'a-s-p-main'
const socketUrl = "https://salty-woodland-32231.herokuapp.com/"

class Personal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      popup: false,
      popupConfirm: false,
      popupAlert: false,
      websocketVisible: false,
      classAppSlidePage: 'app-side-page',
      classAppSlidePageMain: clSlidePage,
      exampleDropDown: [
        { id: '1', title: 'Drop Down 1', value: 'DD-1' },
        { id: '2', title: 'Drop Down 2', value: 'DD-2' },
        { id: '3', title: 'Drop Down 3', value: 'DD-3' },
        { id: '4', title: 'Drop Down 4', value: 'DD-4' },
        { id: '5', title: 'Drop Down 5', value: 'DD-5' },
        { id: '6', title: 'Drop Down 6', value: 'DD-6' }
      ],
      url: "",
      type: ""
    }
  }

  opPopUp = () => {
    if (this.state.popup) {
      this.setState({ popup: false })
    } else {
      this.setState({ popup: true })
    }
  }

  opPopUpConfirm = () => {
    if (this.state.popupConfirm) {
      this.setState({ popupConfirm: false })
    } else {
      this.setState({ popupConfirm: true })
    }
  }

  opPopUpAlert = () => {
    if (this.state.popupAlert) {
      this.setState({ popupAlert: false })
    } else {
      this.setState({ popupAlert: true })
    }
  }

  handleSocket = (type) => {
    this.setState({ url: socketUrl, websocketVisible: !this.state.websocketVisible, type })
  }

  render() {
    return (
      <div className={this.state.classAppSlidePage}>
        <div className={this.state.classAppSlidePageMain}>
          <div
            className="a-s-p-place a-s-p-content active"
            id={this.props.target}>

            {this.state.websocketVisible && (
              <WebsocketNotif url={this.state.url} timeout={5000} type={this.state.type} />
            )}

            <div className="padding-15px display-flex-normal">
              <div style={{ width: '350px' }}>
                <h1 className="margin-15px">Component</h1>
                <div className="margin-15px">
                  <TimePicker time="15:15:33" onChange={(e) => {
                    console.log('start date', e)
                  }} />
                </div>
                <div className="margin-15px">
                  <DatePicker />
                </div>
                <div className="margin-15px">
                  <CalendarPicker onChange={(e) => { console.log('calendar', e) }} />
                </div>
                <div className="margin-15px">
                  <DropDown
                    onChange={(e) => { console.log('data', e) }}
                    data={this.state.exampleDropDown} />
                </div>
                <div className="margin-15px">
                  <button
                    className="btn btn-all btn-blue margin-right-10px"
                    onClick={this.opPopUp}>
                    Done
                  </button>
                  <button
                    className="btn btn-all btn-blue margin-right-10px"
                    onClick={this.opPopUpConfirm}>
                    Alert
                  </button>
                  <button
                    className="btn btn-all btn-blue margin-right-10px"
                    onClick={this.opPopUpAlert}>
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="btn btn-all btn-blue margin-right-10px"
                    onClick={() => this.handleSocket("stack")}>
                    Socket Stack
                  </button>
                  <button
                    type="button"
                    className="btn btn-all btn-blue margin-top-10px"
                    onClick={() => this.handleSocket("float")}>
                    Socket Float
                  </button>

                  {(this.state.popup)
                    ? <PopUp
                      type={"save"}
                      class={"app-popup app-popup-show"}
                      onClick={this.opPopUp} />
                    : <div></div>}

                  {(this.state.popupConfirm)
                    ? <PopUp
                      type={"confirm"}
                      class={"app-popup app-popup-show"}
                      onClick={this.opPopUpConfirm} />
                    : <div></div>}

                  {(this.state.popupAlert)
                    ? <PopUp
                      type={"delete"}
                      class={"app-popup app-popup-show"}
                      onClick={this.opPopUpAlert} />
                    : <div></div>}
                </div>
              </div>
              <div style={{ width: '350px' }} className="margin-left-15px">
                <h1 className="margin-15px">Drop Down Tree Menus</h1>
                <div className="margin-15px">
                  <DDLMenu
                    title="Please pick ..."
                    data={[
                      {
                        id: '1', title: 'Head Office 1', value: 'DD-1', subMenu: [
                          { id: '1-1', title: 'Branch Office 1', value: 'bo-1-1', subMenu: [] },
                          { id: '1-2', title: 'Branch Office 3', value: 'bo-1-2', subMenu: [] },
                          {
                            id: '1-3', title: 'Branch Office 4', value: 'bo-1-3', subMenu: [
                              { id: '1-3-1', title: 'Child Office 1', value: 'co-1-3-1', subMenu: [] },
                              { id: '1-3-2', title: 'Child Office 3', value: 'co-1-3-2', subMenu: [] },
                              {
                                id: '1-3-3', title: 'Child Office 4', value: 'co-1-3-3', subMenu: [
                                  { id: '1-3-3-1', title: 'Child of Child Office 1', value: 'co-1-3-3-1' },
                                  { id: '1-3-3-2', title: 'Child of Child Office 2', value: 'co-1-3-3-2' }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        id: '2', title: 'Head Office 2', value: 'DD-2', subMenu: [
                          { id: '2-1', title: 'Branch Office 1', value: 'bo-2-1', subMenu: [] },
                          { id: '2-2', title: 'Branch Office 2', value: 'bo-2-2', subMenu: [] },
                          { id: '2-3', title: 'Branch Office 3', value: 'bo-2-3', subMenu: [] },
                          { id: '2-4', title: 'Branch Office 4', value: 'bo-2-4', subMenu: [] },
                          { id: '2-5', title: 'Branch Office 5', value: 'bo-2-5', subMenu: [] }
                        ]
                      },
                      {
                        id: '3', title: 'Head Office 3', value: 'DD-3', subMenu: [
                          { id: '3-1', title: 'Branch Office 1', value: 'bo-3-1', subMenu: [] },
                          { id: '3-2', title: 'Branch Office 3', value: 'bo-3-2', subMenu: [] }
                        ]
                      },
                      { id: '4', title: 'Head Office 4', value: 'DD-4', subMenu: [] },
                      { id: '5', title: 'Head Office 5', value: 'DD-5', subMenu: [] },
                      { id: '6', title: 'Head Office 6', value: 'DD-6', subMenu: [] }
                    ]}
                    onChange={(e) => { console.log('data', e) }} />
                  {/* <DDLMenu
                    title="Please pick ..."
                    data={[
                      {value: 'Computers & Electronics', parent: ''},
                      {value: 'Notebooks', parent: 'Computers & Electronics'},
                      {value: 'Routers', parent: 'Computers & Electronics'},
                      {value: 'Desktop Computers', parent: 'Computers & Electronics'},
                      {value: 'Macbooks', parent: 'Notebooks'},
                      {value: 'Asus', parent: 'Notebooks'},
                      {value: 'Macbook Pro', parent: 'Macbooks'},
                      {value: 'Macbook Air', parent: 'Macbooks'},
                      {value: 'Asus Zenbook', parent: 'Asus'},
                      {value: 'Asus Vivobook', parent: 'Asus'},
                      {value: 'Asus X441', parent: 'Asus'}
                    ]}
                    onChange={(e) => { console.log('data', e) }} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="a-s-p-side"></div>
      </div>
    )
  }
}

export default Personal