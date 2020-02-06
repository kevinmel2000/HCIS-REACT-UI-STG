import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import DropDown from '../../../../../modules/popup/DropDown'
import TimePicker from '../../../../../modules/popup/Time'
import CalendarPicker from '../../../../../modules/popup/Calendar'
import M from 'moment'
import FormSearchEmp from './searchEmployee'
import * as R from 'ramda'

const defaultPayload = {
  "personelOfficeHourID": '',
  "employeeID": '',
  "esID": '',
  "personelOfficeDate": '',
  "personelOfficeHourType": '',
  "calendarType": '',
  "personelOfficeHourStartDate": '',
  "personelOfficeHourEndDate": '',
  "personelOfficeHourStatus": true,
  "personelOfficeHourCreationalDTO": {
    "createdBy": "ADMIN",
    "createdDate": "01-01-2019 07:00:00",
    "modifiedBy": null,
    "modifiedDate": null
  }
}

class FormCorporateHoliday extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        ...defaultPayload,
        personelOfficeHourID: "POH-" + M()
      },
      formSearchEmpVisible: false,
      dataEmp: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  openSearch() {
    this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible })
  }

  pickEmployee(value) {
    let dataEmp = value
    console.log('dataEmp', dataEmp)
    this.setState({ dataEmp, formSearchEmpVisible: !this.state.formSearchEmpVisible })
    this.getImage(dataEmp)
  }

  async getImage(dataEmp) {
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + dataEmp.employeeID, {
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

  handleSelectDate = (date) => {
    console.log(date)
    this.setState({
      data: {
        ...this.state.data,
        personelOfficeDate: date
      }
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
      personelOfficeHourStatus
    } = this.state.data
    return (
      <div className="app-popup app-popup-show">
        {this.state.formSearchEmpVisible && (
          <FormSearchEmp
            onClickClose={this.openSearch.bind(this)}
            onClick={this.pickEmployee.bind(this)}
          />
        )}
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">

          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Personal Office Hour - Create Form
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


          <form action='#'
            onSubmit={(e) => {
              e.preventDefault()
              if (!R.isEmpty(this.state.data.personelOfficeHourStartDate) && !R.isEmpty(this.state.data.personelOfficeHourEndDate) && (this.state.data.personelOfficeHourEndDate < this.state.data.personelOfficeHourStartDate)) return alert('End Time Should be Greater Than Start Time.')
              let data = { ...this.state.data, employeeID: this.state.dataEmp.employeeID }
              if (R.isEmpty(data.employeeID) || R.isNil((data.employeeID))) return alert('Employee is Required.')
              if (R.isEmpty(data.personelOfficeHourType) || R.isEmpty(this.state.data.personelOfficeHourType.bizparKey)) return alert('Type is Required.')
              if (R.isEmpty(data.calendarType) || R.isEmpty(this.state.data.calendarType.bizparKey)) return alert('Calendar Type is Required.')
              if (R.isEmpty(data.personelOfficeDate)) return alert('Date is Required.')
              if (R.isEmpty(data.personelOfficeHourStartDate)) return alert('Operation Time is Required.')
              if (R.isEmpty(data.personelOfficeHourEndDate)) return alert('Operation Time is Required.')
              this.props.onClickSave(data, 'personalOfficeHour')
            }}
          >
            <div className="a-s-p-mid a-s-p-pad">

              <div className="margin-bottom-5px display-flex-normal padding-15px border-bottom">
                <i className="fa fa-lg fa-people-carry margin-right-10px margin-top-5px"></i>
                <h1 className="txt-site txt-18 txt-main ">Personal Office Hour</h1>
              </div>

              <div className="display-flex-normal">
                <div style={{ width: '33.33%' }}>
                  <div className="padding-15px">
                    <div className="margin-bottom-20px">
                      <p className="txt-site txt-11 txt-primary">
                      The Personal Office Hour menu is to be used to create list personal employee office hours.
                      </p>
                    </div>

                    <div className="margin-30px">
                      <div className="image image-150px image-circle background-white border-all" style={{ margin: 'auto' }}>
                        {!R.isNil(this.state.dataEmp.employeePhotoURL) && !R.isEmpty(this.state.dataEmp.employeePhotoURL) ? (
                          <img width="100%" height="100%" src={this.state.imageUrl} alt="img" />
                        ) : <i className="icn fa fa-2x fa-user"></i>}
                      </div>
                      <div className="padding-5px content-center txt-site txt-13 txt-main txt-bold margin-top-15px">
                        {(this.state.dataEmp ? this.state.dataEmp.employeeID : "") + ' - ' + (this.state.dataEmp ? this.state.dataEmp.employeeName : "")}
                      </div>
                    </div>
                  </div>

                  <div className="padding-15px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>
                        {'Pick Employee '} <span style={{ color: "red" }}>*</span>
                      </h4>
                      {/* <i className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                    </div>
                    <div className="txt-site txt-11 txt-primary margin-5px">
                      The employee of current status
                     </div>
                    <div className="card-date-picker">
                      <div className="double">
                        <input
                          style={
                            {
                              backgroundColor: "#E6E6E6",
                              padding: 15
                              // width: "70%",
                              // marginRight: "10px"
                            }
                          }
                          type="text"
                          className="input"
                          placeholder=""
                          required
                          value={(this.state.dataEmp ? this.state.dataEmp.employeeID : "") + ' - ' + (this.state.dataEmp ? this.state.dataEmp.employeeName : "")}
                        />
                        <button
                          type="button"
                          className="btn btn-grey border-left btn-no-radius"
                          onClick={() => this.openSearch()}
                        >
                          <i className="fa fa-lg fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ width: '33.33%' }}>
                  <div className="padding-15px">
                    <div className="margin-bottom-20px">
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Date <span style={{ color: "red" }}>*</span></h4>
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
                          title="-- please select office hour type --"
                          onChange={(dt) => this.setState({
                            data: {
                              ...this.state.data,
                              personelOfficeHourType: {
                                ...this.state.data.personelOfficeHourType,
                                bizparKey: dt
                              }
                            }
                          })}
                          data={this.props.bizparOfficeHourType}
                          type="bizpar" />
                      </div>
                    </div>
                    <div className="margin-bottom-20px">
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
                          title="-- please select office hour type --"
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
                        <h4>Operation Time <span style={{ color: "red" }}>*</span></h4>
                        {/* <i className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        Period of operation time traction
                      </div>
                      <div className="margin-15px display-flex-normals">
                        <TimePicker
                        time="00:00"
                        onChange={(e) => 
                        this.setState({
                          data: {
                            ...this.state.data,
                            personelOfficeHourStartDate: e
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
                            personelOfficeHourEndDate: e
                          }
                        })} />
                      </div>
                    </div>
                    <div>
                      <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                        <h4>Activation</h4>
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        Time when the personal office hour is activate
                      </div>
                      <div className="margin-15px">
                        <label className="radio">
                          <input type="checkbox" name="status" checked={personelOfficeHourStatus} disabled
                            onChange={(e) => this.setState({
                              data: {
                                ...this.state.data,
                                personelOfficeHourStatus: e.target.checked
                              }
                            })}
                          />
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
                  type='submit'
                  className="btn btn-blue"
                >
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