import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import TimePicker from '../../../../../modules/popup/Time'
import M from 'moment'
import DropDown from '../../../../../modules/popup/DropDown'
import CalendarPicker from '../../../../../modules/popup/Calendar'
import * as R from 'ramda'
import Loader from 'react-loader-spinner'

class FormSide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        ...this.props.rawData,
        shiftStartTime: M(this.props.rawData.shiftStartTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        shiftEndTime: M(this.props.rawData.shiftEndTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss')
      },
      placeDateRange: false,
      dateRangePicker: {
        selection: {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
          color: '#2ecc71'
        },
        compare: {
          startDate: new Date(),
          endDate: new Date(),
          key: 'compare',
        },
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
      shiftStartTime: M(this.props.rawData.shiftStartTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
      shiftEndTime: M(this.props.rawData.shiftEndTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss')
    }
    this.setState({
      data
    })
  }

  async getImage() {
    this.setState({ loading: true, imageUrl: '' })
    let { rawData } = this.props
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + rawData.shiftLeader.employeeID, {
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

  handleSelectDate = (range) => {
    this.setState({
      datePicker: range
    })
  }

  handleRangeChange = (which, payload) => {
    console.log(which, payload);
    this.setState({
      [which]: {
        ...this.state[which],
        ...payload,
      },
    })
  }

  opPlaceDateRange = () => {
    if (this.state.placeDateRange === false) {
      this.setState({
        placeDateRange: true
      })
    } else {
      this.setState({
        placeDateRange: false
      })
    }
  }

  render() {
    let {
      shiftCode, shiftLeader, shiftType, shiftStartDate, shiftEndDate, shiftStartTime, shiftEndTime, shiftStatus, calendarType
    } = this.state.data
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fa fa-1x fa-building"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Office Shift Hour
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
        <form action="#"
          onSubmit={(e) => {
            e.preventDefault()
            if (!R.isEmpty(this.state.data.shiftStartTime) && !R.isEmpty(this.state.data.shiftEndTime) && (this.state.data.shiftEndTime < this.state.data.shiftStartTime)) return alert('End Time Should be Greater Than Start Time.')
            if (R.isEmpty(this.state.data.shiftType) || R.isEmpty(this.state.data.shiftType.bizparKey)) return alert('Shift Type is Required')
            if (R.isEmpty(this.state.data.calendarType) || R.isEmpty(this.state.data.calendarType.bizparKey)) return alert('Calendar Type is Required')
            if (R.isNil(this.state.data.shiftLeader.employeeID)) return alert('Shift Leader is Required')
            if (R.isEmpty(this.state.data.shiftStartDate)) return alert('Operation Date is Required')
            if (R.isEmpty(this.state.data.shiftEndDate)) return alert('Operation Date is Required')
            this.props.onClickSave(this.state.data, 'officeShiftHour')
          }}
        >
          <div className="a-s-p-mid a-s-p-pad border-top">
            <div className="padding-top-20px margin-bottom-20px display-flex-normal">
              <i className="fa fa-lg fa-building margin-right-10px margin-top-5px"></i>
              <h1 className="txt-site txt-18 txt-main ">Office Shift Hour</h1>
            </div>

            <div className="display-flex-normals margin-bottom-10px">
              <div>
                <div className="margin-bottom-20px">
                  <p className="txt-site txt-11 txt-primary">
                    The Office Shift Hour menu is to be used to create list shift employee office hours.
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
                    {this.state.imageUrl ? (
                      <img width="100%" height="100%" src={this.state.imageUrl} alt="" />
                    ) : this.state.loading === true ? <i /> : <i className="icn fa fa-2x fa-user"></i>}
                  </div>
                  <div className="padding-5px content-center txt-site txt-13 txt-main txt-bold margin-top-15px">
                    {shiftLeader.employeeID + ' - ' + shiftLeader.employeeName}
                  </div>
                </div>
                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>Shift Leader <span style={{ color: "red" }}>*</span></h4>
                    {/* <i
                      data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                      className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                  </div>
                  <div className="txt-site txt-11 txt-primary margin-5px">
                    The shift leader of current status
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
                      value={shiftLeader.employeeID + ' - ' + shiftLeader.employeeName}
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
              </div>

              <div>
                <div>
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>Shift Code</h4>
                      {/* <i
                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                    </div>
                    <div className="txt-site txt-11 txt-primary margin-5px">
                      The shift code of current status
                  </div>
                    <div className="margin-5px">
                      <input
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={shiftCode}
                      />
                    </div>
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>Shift Type <span style={{ color: "red" }}>*</span></h4>
                      {/* <i
                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                    </div>
                    <div className="txt-site txt-11 txt-primary margin-5px">
                      The shift type of current status
                      </div>
                    <div className="margin-5px">
                      <DropDown
                        disabled
                        title="-- please select shift type --"
                        onChange={(dt) => this.setState({
                          data: {
                            ...this.state.data,
                            shiftType: {
                              ...this.state.data.shiftType,
                              bizparKey: dt
                            }
                          }
                        })}
                        value={shiftType.bizparKey}
                        bizValue={shiftType.bizparValue}
                        data={this.props.bizparShiftType}
                        type="bizpar" />
                    </div>
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>Operation Date <span style={{ color: "red" }}>*</span></h4>
                      {/* <i
                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                    </div>
                    <div className="txt-site txt-11 txt-primary margin-5px">
                      The date of current status
                  </div>
                    <div className="margin-5px display-flex-normals">
                      <CalendarPicker
                        // date={shiftStartDate}
                        date={M(shiftStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}
                        disabled
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            shiftStartDate: M(e).format("YYYY-MM-DD")
                          }
                        })} />
                      <div className="txt-site txt-11 txt-primary txt-center margin-10px">
                        To
                        </div>
                      <CalendarPicker
                        date={M(shiftEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}
                        disabled
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            shiftEndDate: M(e).format("YYYY-MM-DD")
                          }
                        })} />
                    </div>
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>Operation Time <span style={{ color: "red" }}>*</span></h4>
                      {/* <i
                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                    </div>
                    <div className="txt-site txt-11 txt-primary margin-5px">
                      Period of operation time traction
                    </div>
                    <div className="margin-5px display-flex-normals">
                      <TimePicker
                        time={shiftStartTime}
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            shiftStartTime: e
                          }
                        })} />
                      <div className="txt-site txt-11 txt-primary txt-center margin-10px">
                        To
                      </div>
                      <TimePicker
                        time={shiftEndTime}
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            shiftEndTime: e
                          }
                        })} />
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
                        value={calendarType.bizparKey}
                        bizValue={calendarType.bizparValue}
                        data={this.props.bizparCalendarType}
                        type="bizpar" />
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
                      Time when the office shift hour is activate
                    </div>
                    <div className="margin-5px">
                      <label className="radio">
                        <input type="checkbox" name="status" disabled={true}
                          style={{ backgroundColor: "#E6E6E6" }} checked={shiftStatus} />
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
                        // onClick={() => this.props.onClickSave(this.state.data, 'officeShiftHour')}
                        >
                          SAVE
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
        <ReactTooltip />

      </div>
    )
  }
}

export default FormSide