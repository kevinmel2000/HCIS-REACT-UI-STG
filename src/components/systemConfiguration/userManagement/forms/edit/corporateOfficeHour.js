import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import M from 'moment'
import * as R from 'ramda'
import Api from '../../../../../Services/Api'
import TimePicker from '../../../../../modules/popup/Time'
import DropDown from '../../../../../modules/popup/DropDown'
import Loader from 'react-loader-spinner'

class FormCorporateOfficeHour extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        ...this.props.rawData,
        corporateOfficeHourEndDate: M(this.props.rawData.corporateOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        corporateOfficeHourStartDate: M(this.props.rawData.corporateOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss')
      },
      loading: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // handleChange(event) {
  //   this.setState({
  //     file: URL.createObjectURL(event.target.files[0])
  //   })
  // }

  removeChange = () => {
    this.setState({
      file: null
    })
  }

  //OnUpdate==============================================================
  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.getImage()
      this.updateData()
    }

  }
  updateData() {
    let data = {
      ...this.props.rawData,
      corporateOfficeHourEndDate: M(this.props.rawData.corporateOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
      corporateOfficeHourStartDate: M(this.props.rawData.corporateOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss')
    }
    this.setState({
      data
    })
  }

  //IMG seervice =============================================================================================
  componentWillMount() {
    this.getImage()
  }

  async getImage() {
    this.setState({ loading: true, imageUrl: '' })
    let { rawData } = this.props
    // console.log('dataID', this.props.rawData.corporateOfficeHourID)
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'cfg/api/corporate.office.hour.photo.get/' + rawData.corporateOfficeHourID, {
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
        this.setState({ data: { ...rawData, corporateOfficeHourPhotoURL: "" }, loading: false })
      }, 500)
    }
  }

  async handleChange(event) {
    let { data } = this.state
    const formData = new FormData();
    let length = event.target.files[0].name.split(".").length
    let fileType = event.target.files[0].name.split(".")[length - 1]
    formData.append('file', event.target.files[0])
    formData.append('corporateOfficeHourID', data.corporateOfficeHourID)
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
      let response = await Api.create('CFG').postPhotoCorporateOfficeHour(formData)
      if (!response.ok && response.status === 413) alert("Your Image Too Large, Please Select Another Image")
      if (!response.ok && R.isNil(response.status)) alert(response.problem)
      switch (response.data.status) {
        case "S":
          let res = await Api.create('CFG').getCorporateOfficeHourByID(data.corporateOfficeHourID)
          data = {
            ...data,
            corporateOfficeHourPhotoURL: res.data.data.corporateOfficeHourPhotoURL
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

  render() {
    let {
      dayType,
      corporateOfficeHourType,
      calendarType,
      corporateOfficeHourName,
      corporateOfficeHourStatus,
      corporateOfficeHourPhotoURL } = this.state.data
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fa fa-1x fa-clock"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Corporate Office Hour
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
            if (!R.isEmpty(this.state.data.corporateOfficeHourStartDate) && !R.isEmpty(this.state.data.corporateOfficeHourEndDate) && (this.state.data.corporateOfficeHourEndDate < this.state.data.corporateOfficeHourStartDate)) return alert('End Time Should be Greater Than Start Time.')
            if (R.isEmpty(this.state.data.dayType)) return alert('Days Name is Required')
            if (R.isEmpty(this.state.data.corporateOfficeHourType)) return alert('Type is Required')
            if (R.isEmpty(this.state.data.calendarType)) return alert('Calendar Type is Required')
            let data = {
              ...this.state.data,
              corporateOfficeHourStartDate: this.state.data.corporateOfficeHourStartDate === this.props.rawData.corporateOfficeHourStartDate ? M(this.props.rawData.corporateOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') : this.state.data.corporateOfficeHourStartDate,
              corporateOfficeHourEndDate: this.state.data.corporateOfficeHourEndDate === this.props.rawData.corporateOfficeHourEndDate ? M(this.props.rawData.corporateOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') : this.state.data.corporateOfficeHourEndDate
            }
            // return console.log((data))
            this.props.onClickSave(data, 'corporateOfficeHour')
            // this.props.onClickSave(this.state.data, 'corporateOfficeHour')
          }}
        >
          <div className="a-s-p-mid a-s-p-pad border-top">
            <div className="padding-top-20px margin-bottom-20px display-flex-normal">
              <i className="fa fa-lg fa-clock margin-right-10px margin-top-5px"></i>
              <h1 className="txt-site txt-18 txt-main ">Corporate Office Hour</h1>
            </div>

            <div className="display-flex-normals margin-bottom-10px">
              <div>
                <div className="margin-bottom-20px">
                  <p className="txt-site txt-11 txt-primary">
                    The Corporate Office Hour menu is to be used to create list employee office hours.
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
                    {!R.isNil(corporateOfficeHourPhotoURL) && !R.isEmpty(corporateOfficeHourPhotoURL) ? (
                      <img width="100%" height="100%" src={this.state.imageUrl} alt="" />
                    ) : this.state.loading === true ? <i /> :  <i className="icn fa fa-2x fa-user"></i>
                    }
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
              </div>

              <div>
                <div className="padding-top-15px padding-bottom-15px">
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
                        disabled
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
                        value={dayType.bizparKey}
                        bizValue={dayType.bizparValue}
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
                        disabled
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
                        value={corporateOfficeHourType.bizparKey}
                        bizValue={corporateOfficeHourType.bizparValue}
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
                      <h4>Office Hour Name <span style={{ color: "red" }}>*</span></h4>
                      {/* <i
                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                    </div>
                    <div className="txt-site txt-11 txt-primary margin-5px">
                      The name of current status
                    </div>
                    <div className="margin-15px">
                      <input
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        value={corporateOfficeHourName}
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            corporateOfficeHourName: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                  <div className="margin-30px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>Operation Time <span style={{ color: "red" }}>*</span></h4>
                      {/* <i className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                    </div>
                    <div className="txt-site txt-11 txt-primary margin-5px">
                      Period of operation time traction
                      </div>
                    <div className="margin-15px display-flex-normals">
                      <TimePicker
                        // time={corporateOfficeHourStartDate}
                        time={M(this.props.rawData.corporateOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss')}
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
                        // time={corporateOfficeHourEndDate}
                        time={M(this.props.rawData.corporateOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss')}
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            corporateOfficeHourEndDate: e
                          }
                        })} />
                    </div>
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>Activation </h4>
                      {/* <i
                      data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                      className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                    </div>
                    <div className="txt-site txt-11 txt-primary margin-5px">
                      Time when the corporate office hour is activate
                      </div>
                    <div className="margin-15px">
                      <label className="radio">
                        <input type="checkbox" name="status" checked={corporateOfficeHourStatus} disabled={true}
                          style={{ backgroundColor: "#E6E6E6" }}
                        />
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

          </div>

        </form>

        <ReactTooltip />

      </div >
    )
  }
}

export default FormCorporateOfficeHour