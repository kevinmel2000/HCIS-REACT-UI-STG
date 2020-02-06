import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import TimePicker from '../../../../../modules/popup/Time'
import M from 'moment'
import * as R from 'ramda'
import DropDown from '../../../../../modules/popup/DropDown'
import CalendarPicker from '../../../../../modules/popup/Calendar'
import Loader from 'react-loader-spinner'

class FormCorporateOfficeHour extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        ...this.props.rawData,
        personelOfficeHourStartDate: M(this.props.rawData.personelOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        personelOfficeHourEndDate: M(this.props.rawData.personelOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        personelOfficeDate: M(this.props.rawData.personelOfficeDate, 'DD-MM-YYYY').toDate()
      },
      loading: false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.getImage()
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.getImage()
      this.updateData()
    }
  }

  updateData() {
    let data = {
      ...this.props.rawData,
      personelOfficeHourStartDate: M(this.props.rawData.personelOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
      personelOfficeHourEndDate: M(this.props.rawData.personelOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
      personelOfficeDate: M(this.props.rawData.personelOfficeDate, 'DD-MM-YYYY').toDate()
    }
    this.setState({
      data
    })
  }

  async getImage() {
    this.setState({ loading: true, imageUrl: '' })
    let { rawData } = this.props
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + rawData.employee.employeeID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      setTimeout(() => {
        response = URL.createObjectURL(response);
        this.setState({ imageUrl: response, loading: false })
      }, 500)
    } else {
      setTimeout(() => {
        this.setState({ loading: false })
      }, 500)
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

  // opPlaceDate = () => {
  //   if (this.state.placeDate == false) {
  //     this.setState({
  //       placeDate: true
  //     })
  //   } else {
  //     this.setState({
  //       placeDate: false
  //     })
  //   }
  // }


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
      employee,
      personelOfficeHourType,
      calendarType,
      personelOfficeHourStartDate,
      personelOfficeHourEndDate,
      personelOfficeHourStatus
    } = this.state.data
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fa fa-1x fa-people-carry"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Personal Office Hour
									</span>
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                onClick={this.props.closeSlide}
                className="btn btn-circle btn-grey">
                <i className="fa fa-lg fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>
        <form action='#'
          onSubmit={(e) => {
            e.preventDefault()
            if (!R.isEmpty(this.state.data.personelOfficeHourStartDate) && !R.isEmpty(this.state.data.personelOfficeHourEndDate) && (this.state.data.personelOfficeHourEndDate < this.state.data.personelOfficeHourStartDate)) return alert('End Time Should be Greater Than Start Time.')
            if (R.isEmpty(this.state.data.personelOfficeHourType) || R.isEmpty(this.state.data.personelOfficeHourType.bizparKey)) return alert('Type is Required')
            if (R.isEmpty(this.state.data.employeeID)) return alert('Employee is Required')
            if (R.isEmpty(this.state.data.calendarType) || R.isEmpty(this.state.data.calendarType.bizparKey)) return alert('Calendar Type is Required')
            this.props.onClickSave(this.state.data, 'personalOfficeHour')
          }}
        >
          <div className="a-s-p-mid a-s-p-pad border-top">
            <div className="padding-top-20px margin-bottom-20px display-flex-normal">
              <i className="fa fa-lg fa-people-carry margin-right-10px margin-top-5px"></i>
              <h1 className="txt-site txt-18 txt-main ">Personal Office Hour</h1>
            </div>

            <div className="display-flex-normals margin-bottom-10px">
              <div>
                <div className="margin-bottom-20px">
                  <p className="txt-site txt-11 txt-primary">
                    The Personal Office Hour menu is to be used to create list personal employee office hours.
                </p>
                </div>
                <div className="margin-30px">
                  <div className="image image-150px image-circle background-white border-all" style={{ margin: 'auto' }}>
                    {this.state.loading && (
                      <Loader
                        type="ThreeDots"
                        style={{ display: 'flex', justifyContent: 'center', marginTop: 45 }}
                        color={"#somecolor"}
                        height={80}
                        width={80}
                        loading={this.state.loading} />
                    )}
                    {!R.isNil(employee.employeePhotoURL) && !R.isEmpty(employee.employeePhotoURL) ? (
                      <img width="100%" height="100%" src={this.state.imageUrl} alt="" />
                    ) : <i className="icn fa fa-2x fa-user"></i>
                    }
                  </div>
                  <div className="padding-5px content-center txt-site txt-13 txt-main txt-bold margin-top-15px">
                    {employee.employeeID + ' - ' + employee.employeeName}
                  </div>
                </div>
              </div>

              <div className="padding-top-15px padding-bottom-15px">
                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4> Pick Employee <span style={{ color: "red" }}>*</span></h4>
                    {/* <i className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                  </div>
                  <div className="txt-site txt-11 txt-primary margin-5px">
                    The employee of current status
                </div>
                  <div className="margin-5px">
                    <input
                      readOnly={false}
                      style={
                        { backgroundColor: "#E6E6E6" }
                      }
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                      value={employee.employeeID + ' - ' + employee.employeeName}
                    />
                    &nbsp;
                  {/* <button
                      className="btn btn-circle"
                    // type="button"
                    // onClick={this.props.type !== "view" ? () => this.openSearch() : null}
                    >
                      <i class="fas fa-search" />
                    </button> */}
                  </div>
                </div>
                <div>
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
                      {/* <DateTimePicker /> */}
                      <div className="margin-5px">
                        <CalendarPicker
                          disabled
                          date={this.state.data.personelOfficeDate}
                          onChange={(e) => {
                            this.handleSelectDate(e)
                          }} />
                      </div>
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
                        disabled
                        title="-- please select holiday type --"
                        onChange={(dt) => this.setState({
                          data: {
                            ...this.state.data,
                            personelOfficeHourType: {
                              ...this.state.data.personelOfficeHourType,
                              bizparKey: dt
                            }
                          }
                        })}
                        value={personelOfficeHourType.bizparKey}
                        bizValue={personelOfficeHourType.bizparValue}
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
                        disabled
                        title="-- please select holiday type --"
                        onChange={(dt) => this.setState({
                          data: {
                            ...this.state.data,
                            calendarType: {
                              ...this.state.data.calendarType,
                              bizparKey: dt
                            }
                          }
                        })}
                        value={calendarType.bizparKey}
                        bizValue={calendarType.bizparValue}
                        data={this.props.bizparCalendarType}
                        type="bizpar" />
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
                    <div className="margin-5px display-flex-normals">
                      <TimePicker
                        time={personelOfficeHourStartDate}
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            personelOfficeHourStartDate: e
                          }
                        })} />
                      <div className="txt-site txt-11 txt-primary txt-center margin-10px">
                        To
                      </div>
                      <TimePicker
                        time={personelOfficeHourEndDate}
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            personelOfficeHourEndDate: e
                          }
                        })} />
                    </div>
                  </div>
                  <div className="margin-bottom-20px">
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
                        <input type="checkbox" disabled={true}
                          style={{ backgroundColor: "#E6E6E6" }} name="status" checked={personelOfficeHourStatus}
                          onChange={(e) => this.setState({
                            data: {
                              ...this.state.data,
                              personelOfficeHourStatus: e.target.checked
                            }
                          })} />
                        <span className="checkmark" />
                        <span className="txt-site txt-11 txt-bold txt-main">
                          Activate now
                          </span>
                      </label>
                    </div>
                  </div>

                  <div className="border-top padding-top-20px">
                    <div className="grid grid-2x">
                      <div className="col-1 content-left">
                        <button
                          onClick={this.props.closeSlide}
                          type='button'
                          className="btn btn-primary margin-right-10px content-left">
                          BACK
                      </button>
                      </div>
                      <div className="col-2 content-right">
                        <button
                          type="submit"
                          className="btn btn-blue"
                        >
                          SAVE
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div >

        </form>

        <ReactTooltip />

      </div >
    )
  }
}

export default FormCorporateOfficeHour