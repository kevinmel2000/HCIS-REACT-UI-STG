import React, { Component } from 'react'
import DropDown from '../../../modules/popup/DropDown'
import * as R from 'ramda'

const defaultMPP = {
  mppID: "",
  mppName: "MPP-NAME",
  budget: "",
  period: "",
  position: "",
  esid: "",
  mppStatus: "INITIATE"
}

class FormMpp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mppData: props.mppData ? props.mppData : defaultMPP
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.mppData !== prevProps.mppData) {
      this.setState({ mppData: this.props.mppData })
    }
  }

  handlePeriod = (e) => {
    if (isNaN(e.target.value)) return true
    this.setState({
      mppData: {
        ...this.state.mppData,
        period: e.target.value
      }
    })
  }

  handleBudget = (e) => {
    if (isNaN(e.target.value)) return true
    this.setState({
      mppData: {
        ...this.state.mppData,
        budget: e.target.value
      }
    })
  }

  renderEditForm = () => {
    let { mppData } = this.state
    let { dataPosition, type } = this.props
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1" style={{ width: "140%" }}>
              <div className="display-flex-normal margin-top-10px">
                <i className="fa fa-1x fa-bed"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Man Power Planning - {type === "update" ? "Edit" : "View"} Form
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>
        <form action="#" onSubmit={(e) => {
          e.preventDefault()
          if (R.isEmpty(this.state.mppData.position)) return alert('Position is Required.')
          this.props.onClickSave(this.state.mppData)
        }}>
          <div className="a-s-p-mid a-s-p-pad border-top">
            <div className="display-flex-normals margin-bottom-10px">
              <div className="padding-top-15px padding-bottom-15px">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Period <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    value={mppData.period}
                    type="text"
                    readOnly
                    style={{ backgroundColor: '#E6E6E6' }}
                    className="txt txt-sekunder-color"
                    placeholder=""
                    onChange={this.handlePeriod.bind(this)}
                  ></input>
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Department</h4>
                    </div>
                  </div>
                  <DropDown title="OPERATION" disabled />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Position <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select position --"
                    onChange={e =>
                      this.setState({
                        mppData: {
                          ...mppData,
                          position: {
                            ...mppData.position,
                            ouID: e
                          }
                        }
                      })}
                    disabled
                    data={dataPosition}
                    value={mppData.position ? mppData.position.ouID : ""}
                    bizValue={mppData.position ? mppData.position.ouName : "-"}
                    type="position"
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Budget <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    value={mppData.budget}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    disabled={type === "view"}
                    style={{ backgroundColor: type === "view" ? '#E6E6E6' : null }}
                    onChange={this.handleBudget.bind(this)}></input>
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Used</h4>
                    </div>
                  </div>
                  <input
                    value={mppData.used}
                    type="text"
                    readOnly
                    style={{ backgroundColor: '#E6E6E6' }}
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required></input>
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Unused</h4>
                    </div>
                  </div>
                  <input
                    value={mppData.unused}
                    type="text"
                    readOnly
                    style={{ backgroundColor: '#E6E6E6' }}
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required></input>
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Outstanding</h4>
                    </div>
                  </div>
                  <input
                    value={mppData.outstanding}
                    type="text"
                    readOnly
                    style={{ backgroundColor: '#E6E6E6' }}
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required></input>
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Status</h4>
                    </div>
                  </div>
                  <div className="margin-15px">
                    <label className="radio">
                      <input type="checkbox" checked disabled />
                      <span className="checkmark" />
                      <div className="txt-site txt-11 txt-bold txt-main">
                        <h4>Activate</h4>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-2 content-right">
                {type === "update" ?
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="submit">
                    <span>SAVE</span>
                  </button> : null}
                {type === "update" ?
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={() => this.props.onClickProcess(this.state.mppData)}>
                    <span>PROCESS</span>
                  </button> : null}
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={this.props.onClickClose}>
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

  render() {
    let { mppData } = this.state
    let { type, dataPosition } = this.props
    return (
      type !== "create" ? this.renderEditForm() :
        <div className="app-popup app-popup-show">
          <div className="padding-top-20px"></div>
          <div className="popup-content background-white border-radius">
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  {type === 'create' ? 'Man Power Planning - Create Form' : 'Man Power Planning - Edit Form'}
                </div>
              </div>
              <div className="col-2 content-right">
                <button className="btn btn-circle btn-grey" onClick={this.props.onClickClose}>
                  <i className="fa fa-lg fa-times"></i>
                </button>
              </div>
            </div>
            <form action="#" onSubmit={(e) => {
              e.preventDefault()
              if (R.isEmpty(this.state.mppData.position)) return alert('Position is Required.')
              this.props.onClickSave(this.state.mppData)
            }}>
              <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                <div className="column-1">

                  <div className="margin-bottom-20px"> {/* container input group */}
                    {/* label */}
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Period <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>

                    {/* text field */}
                    <input
                      value={mppData.period}
                      type="text"
                      required
                      readOnly={type !== 'create'}
                      style={type !== 'create' ? { backgroundColor: '#E6E6E6' } : null}
                      className="txt txt-sekunder-color"
                      placeholder=""
                      onChange={this.handlePeriod.bind(this)}
                    ></input>
                  </div>

                  <div className="margin-bottom-20px"> {/* container input group */}
                    {/* label */}
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Department</h4>
                      </div>
                    </div>

                    {/* text field */}
                    <DropDown title="OPERATION" disabled />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Position <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <DropDown
                      title="-- please select position --"
                      onChange={e =>
                        this.setState({
                          mppData: {
                            ...mppData,
                            position: {
                              ...mppData.position,
                              ouID: e
                            }
                          }
                        })}
                      disabled={type !== 'create'}
                      data={dataPosition}
                      value={mppData.position ? mppData.position.ouID : ""}
                      type="position"
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Budget <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <input
                      value={mppData.budget}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                      onChange={this.handleBudget.bind(this)}></input>
                  </div>

                </div>
                <div className="column-2">
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Used</h4>
                      </div>
                    </div>
                    <input
                      value={type !== "create" ? mppData.used : "0"}
                      type="text"
                      readOnly
                      style={{ backgroundColor: '#E6E6E6' }}
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required></input>
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Unused</h4>
                      </div>
                    </div>
                    <input
                      value={type !== "create" ? mppData.unused : "0"}
                      type="text"
                      readOnly
                      style={{ backgroundColor: '#E6E6E6' }}
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required></input>
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Outstanding</h4>
                      </div>
                    </div>
                    <input
                      value={type !== "create" ? mppData.outstanding : "0"}
                      type="text"
                      readOnly
                      style={{ backgroundColor: '#E6E6E6' }}
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required></input>
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Status</h4>
                      </div>
                    </div>
                    <div className="margin-15px">
                      <label className="radio">
                        <input type="checkbox" checked disabled />
                        <span className="checkmark" />
                        <div className="txt-site txt-11 txt-bold txt-main">
                          <h4>Activate</h4>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="padding-15px">
                <div className="grid grid-2x">
                  <div className="col-1"></div>
                  <div className="col-2 content-right">
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="submit">
                      <span>SAVE</span>
                    </button>
                    {type !== "create" ?
                      <button
                        style={{ marginLeft: "15px" }}
                        className="btn btn-blue"
                        type="button"
                        onClick={() => this.props.onClickProcess(this.state.mppData)}>
                        <span>PROCESS</span>
                      </button> : null}
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.props.onClickClose}>
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="padding-bottom-20px"></div>
        </div>
    )
  }
}

export default FormMpp
