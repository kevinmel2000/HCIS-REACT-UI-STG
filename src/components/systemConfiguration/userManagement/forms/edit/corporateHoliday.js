import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import CalendarPicker from '../../../../../modules/popup/Calendar'
import TimePicker from '../../../../../modules/popup/Time'
import DropDown from '../../../../../modules/popup/DropDown'
import M from 'moment'
import Api from '../../../../../Services/Api';
import * as R from 'ramda'
import Loader from 'react-loader-spinner'

class FormCorporateHoliday extends Component {
  constructor(props) {
    super(props)
    let { rawData } = this.props
    this.state = {
      bizparHolidayType: this.props.bizparHolidayType,
      data: {
        ...rawData,
        holidayStartDate: M(rawData.holidayStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        holidayEndDate: M(rawData.holidayEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        // holidayDate: M(rawData.holidayDate, 'DD-MM-YYYY').toDate()
      },
      placeDate: false,
      // holidayDate: new Date(),
      placePriode: false,
      priodePicker: new Date(),
      imageUrl: "",
      loading: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log(JSON.stringify(this.state.data))
  }

  componentWillMount() {
    this.getImage()
    console.log('bizpar', this.props.bizparHolidayType)
  }

  async getImage() {
    this.setState({ loading: true, imageUrl: '' })
    let { rawData } = this.props
    console.log('dataID', this.props.rawData.corporateHolidayID)
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'cfg/api/corporate.holiday.photo.get/' + rawData.corporateHolidayID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    // console.log('response ', response)
    response = await response.blob()
    if (response.size > 0) {
      setTimeout(() => {
        response = URL.createObjectURL(response);
        this.setState({ imageUrl: response, loading: false })
      }, 500)
    } else {
      setTimeout(() => {
        this.setState({ data: { ...rawData, corporateHolidayPhotoURL: "" }, loading: false })
      }, 500)
    }
  }

  handleSelectDate = (date) => {
    this.setState({
      data: {
        ...this.state.data,
        holidayDate: M(date).format("DD-MM-YYYY")
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

  async handleChange(event) {
    let { data } = this.state
    const formData = new FormData();
    let length = event.target.files[0].name.split(".").length
    let fileType = event.target.files[0].name.split(".")[length - 1]
    formData.append('file', event.target.files[0])
    formData.append('corporateHolidayID', data.corporateHolidayID)
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
      let response = await Api.create('CFG').postPhotoCorporateHoliday(formData)
      if (!response.ok && response.status === 413) alert("Your Image Too Large, Please Select Another Image")
      if (!response.ok && R.isNil(response.status)) alert(response.problem)
      switch (response.data.status) {
        case "S":
          let res = await Api.create('CFG').getCorporateHolidayByID(data.corporateHolidayID)
          data = {
            ...data,
            corporateHolidayPhotoURL: res.data.data.corporateHolidayPhotoURL
          }
          console.log('res img', response.data)
          this.setState({ imageUrl: "", data }, () => {
            this.getImage()
          })
          break;
        default:
          break;
      }
    } else {
      alert("Unsupported Media Type")
    }
  }

  removeChange = () => {
    this.setState({
      file: null
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.updateData()
      this.getImage()
    }

  }

  updateData() {
    let data = {
      ...this.props.rawData,
      holidayStartDate: M(this.props.rawData.holidayStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
      holidayEndDate: M(this.props.rawData.holidayEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
      holidayDate: M(this.props.rawData.holidayDate, 'DD-MM-YYYY').toDate()
    }
    this.setState({
      data
    })
  }

  render() {
    let { holidayName, corporateHolidayPhotoURL, holidayDate, holidayType, holidayStartDate, holidayEndDate, holidayStatus, isAllDay } = this.state.data
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fa fa-1x fa-calendar"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Corporate Holiday
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
            if ((this.state.data.isAllDay === false && this.state.data.holidayStartDate === "Invalid date") || (this.state.data.isAllDay === false && this.state.data.holidayEndDate === "Invalid date")) return alert('Operation Time is Required.')
            if (!R.isEmpty(this.state.data.holidayStartDate) && !R.isEmpty(this.state.data.holidayEndDate) && (this.state.data.holidayEndDate < this.state.data.holidayStartDate)) return alert('End Time Should be Greater Than Start Time.')
            if (R.isEmpty(this.state.data.holidayType) || R.isEmpty(this.state.data.holidayType.bizparKey)) return alert('Holiday Type is Required')
            this.props.onClickSave(this.state.data, 'corporateHoliday')
          }}
        >
          <div className="a-s-p-mid a-s-p-pad border-top">
            <div className="padding-top-20px margin-bottom-20px display-flex-normal">
              <i className="fa fa-lg fa-calendar margin-right-10px margin-top-5px"></i>
              <h1 className="txt-site txt-18 txt-main ">Corporate Holiday</h1>
            </div>

            <div className="display-flex-normals margin-bottom-15px">
              <div>
                <div className="margin-bottom-20px">
                  <p className="txt-site txt-11 txt-primary">
                    The Corporate Holiday menu is to be used to create list national holiday.
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
                    {!R.isNil(corporateHolidayPhotoURL) && !R.isEmpty(corporateHolidayPhotoURL) ? (
                      <img width="100%" height="100%" src={this.state.imageUrl} alt="" />
                    ) : this.state.loading === true ? <i /> :  <i className="icn fa fa-2x fa-user"></i>
                    }
                  </div>
                </div>

                <div className="txt-site txt-11 txt-bold txt-main content-center">
                  <input
                    type="file"
                    id="pick-image"
                    style={{ display: "none" }}
                    onChange={this.handleChange} />
                  <label htmlFor="pick-image">
                    <div className="btn btn-div btn-grey-dark">
                      <i className="fa fa-1x fa-upload margin-right-10px"></i>
                      Pick Image
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <div className="padding-top-15px padding-bottom-15px">
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
                      <CalendarPicker date={M(holidayDate, 'DD-MM-YYYY').toDate()} onChange={(e) => {
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
                    <div>
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
                        value={holidayType.bizparKey}
                        bizValueHolidayType={holidayType.bizparValue}
                        type="bizpar" />
                    </div>
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>All day long</h4>
                      {/* <i
                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                    </div>
                    <div className="txt-site txt-11 txt-primary margin-5px">
                      Option for determining holiday
                      </div>
                    <div className="margin-15px">
                      <label className="radio">
                        <input type="checkbox" name="all-day" checked={isAllDay}
                          onChange={(e) => this.setState({
                            data: {
                              ...this.state.data,
                              isAllDay: e.target.checked,
                              holidayStartDate: "Invalid date",
                              holidayEndDate: "Invalid date"
                            }
                          })} />
                        <span className="checkmark" />
                        <span className="txt-site txt-11 txt-bold txt-main">
                          This Holiday is All day long
                          </span>
                      </label>
                    </div>
                  </div>

                  {/* <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>Priode</h4> 
                    <i 
                      data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                      className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                  </div>
                  <div className="txt-site txt-11 txt-primary margin-5px">
                    Put your valid priode
                  </div>
                  <div className="margin-5px">
                    <DateTimePicker />
                  </div>
                </div> */}
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
                        value={holidayName}
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
                        {/* <i
                          data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                          className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                      </div>
                      <div className="txt-site txt-11 txt-primary margin-5px">
                        Period of holiday time traction
                                  </div>
                      <div className="margin-5px display-flex-normals">

                        <TimePicker time={holidayStartDate} onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            holidayStartDate: e
                          }
                        })} />
                        <div className="txt-site txt-11 txt-primary txt-center margin-10px">
                          To
                              </div>
                        <TimePicker time={holidayEndDate} onChange={(e) => this.setState({
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
                        <input type="checkbox" name="status" checked={holidayStatus} disabled
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
                        // onClick={() => this.props.onClickSave(this.state.data, 'corporateHoliday')}
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

export default FormCorporateHoliday