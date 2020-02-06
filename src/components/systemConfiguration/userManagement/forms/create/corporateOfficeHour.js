import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import M from 'moment'
import * as R from 'ramda'

import DropDown from '../../../../../modules/popup/DropDown'
import TimePicker from '../../../../../modules/popup/Time'

const defaultPayload = {
  "corporateOfficeHourID": '',
  "esID": '',
  "dayType": '',
  "corporateOfficeHourName": '',
  "corporateOfficeHourType": '',
  "calendarType": '',
  "corporateOfficeHourStartDate": '',
  "corporateOfficeHourEndDate": '',
  "corporateOfficeHourPhotoURL": '',
  "corporateOfficeHourStatus": true,
  "corporateOfficeHourCreational": {
    "createdBy": '',
    "createdDate": '',
    "modifiedBy": '',
    "modifiedDate": '',
  }
}

class FormCorporateOfficeHour extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        ...defaultPayload,
        corporateOfficeHourID: "COPOFFHOU-" + M()
      }
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }

  removeChange = () => {
    this.setState({
      file: null
    })
  }

  render() {
    let {
      corporateOfficeHourStatus } = this.state.data
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">

          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Corporate Office Hour - Create Form
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
              if (!R.isEmpty(this.state.data.corporateOfficeHourStartDate) && !R.isEmpty(this.state.data.corporateOfficeHourEndDate) && (this.state.data.corporateOfficeHourEndDate < this.state.data.corporateOfficeHourStartDate)) return alert('End Time Should be Greater Than Start Time.')
              if (R.isEmpty(this.state.data.dayType) || R.isEmpty(this.state.data.dayType.bizparKey)) return alert('Days Name is Required')
              if (R.isEmpty(this.state.data.corporateOfficeHourType) || R.isEmpty(this.state.data.corporateOfficeHourType.bizparKey)) return alert('Type is Required')
              if (R.isEmpty(this.state.data.calendarType) || R.isEmpty(this.state.data.calendarType.bizparKey)) return alert('Calendar Type is Required')
              if (R.isEmpty(this.state.data.corporateOfficeHourStartDate)) return alert('Operation Start Time is Required')
              if (R.isEmpty(this.state.data.corporateOfficeHourEndDate)) return alert('Operation End Time is Required')
              this.props.onClickSave(this.state.data, 'corporateOfficeHour')
            }}
          >
            <div className="a-s-p-mid a-s-p-pad">

              <div className="margin-bottom-5px display-flex-normal padding-15px border-bottom">
                <i className="fa fa-lg fa-clock margin-right-10px margin-top-5px"></i>
                <h1 className="txt-site txt-18 txt-main ">Corporate Office Hour</h1>
              </div>


              <div className="display-flex-normal">
                <div style={{ width: '33.33%' }}>
                  <div className="padding-15px">
                    <div className="margin-bottom-20px">
                      <p className="txt-site txt-11 txt-primary">
                      The Corporate Office Hour menu is to be used to create list employee office hours.
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

                <div style={{ width: '33.33%' }}>
                  <div className="padding-15px">
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Days Name <span style={{ color: "red" }}>*</span></h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        The day of current status
                      </div>
                      <div className="margin-5px">
                        <DropDown
                          title="-- please select days name --"
                          onChange={(dt) => this.setState({
                            data: {
                              ...this.state.data,
                              dayType: {
                                ...this.state.data.dayType,
                                bizparKey: dt
                              }
                            }
                          })}
                          data={this.props.bizparDayType}
                          type="bizpar" />
                      </div>
                    </div>
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Type <span style={{ color: "red" }}>*</span></h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        The type of current status
                      </div>
                      <div className="margin-5px">
                        <DropDown
                          title="-- please select type --"
                          onChange={(dt) => this.setState({
                            data: {
                              ...this.state.data,
                              corporateOfficeHourType: {
                                ...this.state.data.corporateOfficeHourType,
                                bizparKey: dt
                              }
                            }
                          })}
                          data={this.props.bizparOfficeHourType}
                          type="bizpar" />
                      </div>
                    </div>
                    <div>
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Calendar Type <span style={{ color: "red" }}>*</span></h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        The calendar type of current status
                      </div>
                      <div className="margin-5px">
                        <DropDown
                          title="-- please select calendar type --"
                          onChange={(dt) => this.setState({
                            data: {
                              ...this.state.data,
                              calendarType: {
                                ...this.state.data.calendarType,
                                bizparKey: dt
                              }
                            }
                          })}
                          data={this.props.bizparCalendarType}
                          type="bizpar" />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ width: '33.33%' }}>
                  <div className="padding-15px">
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Office Hour Name <span style={{ color: "red" }}>*</span></h4>
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
                          value={this.state.corporateOfficeHourName}
                          onChange={(e) => this.setState({
                            data: {
                              ...this.state.data,
                              corporateOfficeHourName: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Operation Time <span style={{ color: "red" }}>*</span></h4>
                        {/* <i className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        Period of operation time traction
                      </div>
                      <div className="margin-15px display-flex-normals">
                        <TimePicker 
                          time="00:00"
                          onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            corporateOfficeHourStartDate: e
                          }
                        })} />
                        <div className="txt-site txt-11 txt-primary txt-center margin-10px">
                          To
												</div>
                        <TimePicker 
                          time="00:00"
                          onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            corporateOfficeHourEndDate: e
                          }
                        })} />
                      </div>
                    </div>
                    <div>
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Activation </h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        Time when the office hour is activate
                      </div>
                      <div className="margin-15px">
                        <label className="radio">
                          <input type="checkbox" name="status" checked={corporateOfficeHourStatus} disabled
                            onChange={(e) => this.setState({
                              data: {
                                ...this.state.data,
                                corporateOfficeHourStatus: e.target.checked
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
                  type='button'
                  onClick={this.props.onClickClose}
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

export default FormCorporateOfficeHour