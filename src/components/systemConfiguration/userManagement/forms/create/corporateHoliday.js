import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import CalendarPicker from '../../../../../modules/popup/Calendar'
import DropDown from '../../../../../modules/popup/DropDown'
import TimePicker from '../../../../../modules/popup/Time'
import M from 'moment'
import Api from '../../../../../Services/Api';
import * as R from 'ramda'

const defaultPayload = {
  "corporateHolidayID": "",
  "esID": "",
  "holidayName": "",
  "holidayDate": "",
  "holidayType": "",
  "isAllDay": false,
  "holidayStartDate": "",
  "holidayEndDate": "",
  "corporateHolidayPhotoURL": "",
  "holidayStatus": true,
  "holidayCreationalDTO": {
    "createdBy": "SYSTEM",
    "createdDate": "26-08-2019 06:56:32",
    "modifiedBy": null,
    "modifiedDate": null
  }
}
class FormCorporateHoliday extends Component {
  constructor(props) {
    super(props)
    // let bizparHolidayType = this.props
    this.state = {
      bizparHolidayType: this.props.bizparHolidayType,
      data: {
        ...defaultPayload,
        corporateHolidayID: "COPHOL-" + M()
      },
      placeDate: false,
      placePriode: false,
      priodePicker: new Date(),
      imageUrlHolidayCreate: ""
    }
    this.handleChangeCreate = this.handleChangeCreate.bind(this);
  }

  componentWillMount() {
    this.getImageCreate()
  }

  async getImageCreate() {
    let { data } = this.state
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'cfg/api/corporate.holiday.photo.get/' + data.corporateHolidayID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({ imageUrlHolidayCreate: response })
    }
  }

  async handleChangeCreate(event) {
    let { data } = this.state
    let file = event.target.files[0]
    const formData = new FormData();
    formData.append('file', file)
    formData.append('corporateHolidayID', data.corporateHolidayID)
    console.log('corporateHolidayID saat upload ', data.corporateHolidayID)
    let response = await Api.create('CFG').postPhotoCorporateHoliday(formData)
    if (!response.ok) alert(typeof response.data === "string" ? response.data : JSON.stringify(response.data))
    switch (response.data.status) {
      case "S":
        this.setState({ imageUrlHolidayCreate: "" }, () => {
          this.getImage()
        })
        break;
      default:
        break;
    }
  }

  removeChange = () => {
    this.setState({
      file: null
    })
  }

  handleSelectDate = (date) => {
    console.log(date)
    this.setState({
      data: {
        ...this.state.data,
        holidayDate: date
      }
    })
  }

  handleSelectPriode = (range) => {
    this.setState({
      priodePicker: range
    })
  }

  opPlaceDate = () => {
    if (this.state.placeDate === false) {
      this.setState({
        placeDate: true
      })
    } else {
      this.setState({
        placeDate: false
      })
    }
  }

  opPlacePriode = () => {
    if (this.state.placePriode === false) {
      this.setState({
        placePriode: true
      })
    } else {
      this.setState({
        placePriode: false
      })
    }
  }

  render() {
    let { isAllDay } = this.state.data
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">

          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Corporate Holiday - Create Form
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}>
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>


          <form action="#"
            onSubmit={(e) => {
              e.preventDefault()
              if (this.state.data.isAllDay) {
                let data = {
                  ...this.state.data,
                  holidayStartDate: '00:00:00',
                  holidayEndDate: '23:59:59'
                }
                if (R.isEmpty(data.holidayType) || R.isEmpty(data.holidayType.bizparKey)) return alert('Holiday Type is Required.')
                if (R.isEmpty(data.holidayDate) || R.isNil(data.holidayDate)) return alert('Holiday Date is Required.')
                return this.props.onClickSave(data, 'corporateHoliday')
              }
              else {
                if (!R.isEmpty(this.state.data.holidayStartDate) && !R.isEmpty(this.state.data.holidayEndDate) && (this.state.data.holidayEndDate < this.state.data.holidayStartDate)) return alert('End Time Should be Greater Than Start Time.')
                if (R.isEmpty(this.state.data.holidayType) || R.isEmpty(this.state.data.holidayType.bizparKey)) return alert('Holiday Type is Required.')
                if (R.isEmpty(this.state.data.holidayDate) || R.isNil(this.state.data.holidayDate)) return alert('Holiday Date is Required.')
                if (R.isEmpty(this.state.data.holidayStartDate) || R.isNil(this.state.data.holidayStartDate)) return alert('Operation Start Time is Required.')
                if (R.isEmpty(this.state.data.holidayEndDate) || R.isNil(this.state.data.holidayEndDate)) return alert('Operation End Time is Required.')

                this.props.onClickSave(this.state.data, 'corporateHoliday')
              }
            }}
          >
            <div className="a-s-p-mid a-s-p-pad">

              <div className="margin-bottom-5px display-flex-normal padding-15px border-bottom">
                <i className="fa fa-lg fa-calendar margin-right-10px margin-top-5px"></i>
                <h1 className="txt-site txt-18 txt-main ">Corporate Holiday</h1>
              </div>

              <div className="display-flex-normal">
                <div style={{ width: '33.33%' }}>
                  <div className="padding-15px">
                    <div className="margin-bottom-20px">
                      <p className="txt-site txt-11 txt-primary">
                      The Corporate Holiday menu is to be used to create list national holiday.
                      </p>
                    </div>
                    <div className="margin-30px">
                      <div className="image image-150px image-circle background-white border-all" style={{ margin: 'auto' }}>
                        {this.state.imageUrlHolidayCreate ? (
                          <img width="100%" height="100%" src={this.state.imageUrlHolidayCreate} alt="img" />) :
                          <i className="icn fa fa-2x fa-user"></i>
                        }
                      </div>
                      {/* <div className="txt-site txt-11 txt-bold txt-main content-center">
                        <input
                          type="file"
                          id="pick-image"
                          style={{ display: "none" }}
                          onChange={this.handleChangeCreate} />
                        <label htmlFor="pick-image">
                          <div className="btn btn-div btn-grey-dark">
                            <i className="fa fa-1x fa-upload margin-right-10px"></i>
                            Pick Image
                             </div>
                        </label>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div style={{ width: '33.33%' }} >
                  <div className="padding-15px">
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Holiday Date <span style={{ color: "red" }}>*</span></h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        The date of current status
                        </div>
                      <div className="margin-5px">
                        <CalendarPicker onChange={(e) => {
                          this.handleSelectDate(e)
                        }} />
                      </div>
                    </div>
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Holiday Type <span style={{ color: "red" }}>*</span></h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        The date of current status
                      </div>
                      <div className="margin-5px">
                        <DropDown
                          title="-- please select holiday type --"
                          onChange={(dt) => this.setState({
                            data: {
                              ...this.state.data,
                              holidayType: {
                                ...this.state.data.holidayType,
                                bizparKey: dt
                              }
                            }
                          })}
                          data={this.props.bizparHolidayType}
                          type="bizpar" />
                      </div>
                    </div>
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>All Day Long</h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        Option for determining holiday
                        </div>
                      <div className="margin-15px">
                        <label className="radio">
                          <input type="checkbox" name="all-day" value={isAllDay}
                            onChange={(e) => this.setState({
                              data: {
                                ...this.state.data,
                                isAllDay: e.target.checked
                              }
                            })} />
                          <span className="checkmark" />
                          <span className="txt-site txt-11 txt-bold txt-main">
                            This Holiday is All day long
                            </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ width: '33.33%' }} >
                  <div className="padding-15px">
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Holiday Name <span style={{ color: "red" }}>*</span></h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        The name of current status
                        </div>
                      <div className="margin-5px">
                        <input
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                          value={this.state.data.holidayName}
                          onChange={(e) => this.setState({
                            data: {
                              ...this.state.data,
                              holidayName: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                    {!this.state.data.isAllDay && (
                      <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                          <h4>Operation Time <span style={{ color: "red" }}>*</span></h4>
                          {/* <i className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                        </div>
                        <div className="txt-site txt-11 txt-primary margin-5px">
                          Period of holiday time traction
                      </div>
                        <div className="margin-5px display-flex-normals">
                          <TimePicker 
                          time='00:00'
                          onChange={(e) => this.setState({
                            data: {
                              ...this.state.data,
                              holidayStartDate: e
                            }
                          })} />
                          <div className="txt-site txt-11 txt-primary txt-center margin-10px">
                            To
												</div>
                          <TimePicker 
                          time='00:00'
                          onChange={(e) => this.setState({
                            data: {
                              ...this.state.data,
                              holidayEndDate: e
                            }
                          })} />
                        </div>
                      </div>
                    )}
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Activation</h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        Time when the holiday is activate
                      </div>
                      <div className="margin-15px">
                        <label className="radio">
                          <input type="checkbox" name="status" checked disabled
                            onChange={(e) => this.setState({
                              data: {
                                ...this.state.data,
                                holidayStatus: e.target.checked
                              }
                            })} />
                          <span className="checkmark" />
                          <span className="txt-site txt-11 txt-bold txt-main">
                            Activate now
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-top padding-15px content-right">
                <button
                  onClick={this.props.onClickClose}
                  type='button'
                  className="btn btn-primary margin-right-10px">
                  BACK
                </button>
                <button
                  type="submit"
                  className="btn btn-blue">
                  SAVE
                </button>
              </div>
            </div>

            <ReactTooltip />

          </form>

        </div>
        <div className="padding-bottom-20px" />
      </div>
    )
  }
}

export default FormCorporateHoliday