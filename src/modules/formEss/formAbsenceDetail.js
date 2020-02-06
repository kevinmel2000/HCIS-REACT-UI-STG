import React, { Component } from "react";
import { connect } from "react-redux";
import M from "moment";
import * as R from "ramda";
import DropDown from "../../modules/popup/DropDown";
import ReactTooltip from "react-tooltip";
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayloadAbs = {
  hcisRequestID: "",
  hcisRequestDate: "",
  hcisRequestPayload: {
    employeeID: "",
    absenceTime: "",
    absenceType: "",
    absenceReason: ""
  },
  hcisRequestBy: "",
  esID: "",
  requestType: "ABSENCE_REQUEST",
  requestStatus: "INITIATE",
  createdBy: "",
  createdDate: "",
  updatedBy: "",
  updatedDate: "",
  recordID: ""
};

class absenceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeSave: "",
      auth: props.auth,
      notifVisible: false,
      message: "",
      payloadAbsence: props.data
        ? {
          ...props.data
        }
        : {
          ...defaultPayloadAbs,
          hcisRequestID: "REQ-" + M(),
          createdDate: M().format("DD-MM-YYYY HH:mm:ss")
        }
    };
  } 

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  componentDidUpdate(prevProps) {
    if (this.props.type !== "create" && this.props.data !== undefined) {
      if (this.props.data !== prevProps.data) {
        this.setState({
          payloadAbsence: {
            ...this.props.data,
            currentDate:
              this.props.data.createdDate === "Invalid date"
                ? ""
                : M(this.props.data.currentDate).format("YYYY-MM-DD"),
            currentTime:
              this.props.data.createdDate === "Invalid date"
                ? ""
                : M(this.props.data.currentDate).format("HH:mm")
          }
        });
      }
    }
  }

  renderEditTimesheet = () => {
    let { auth, payloadAbsence } = this.state;
    let currentDate =
      payloadAbsence.createdDate !== undefined
        ? M(payloadAbsence.createdDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        : M(payloadAbsence.hcisRequestDate, "DD-MM-YYYY").format("YYYY-MM-DD");

    let currentTime =
      payloadAbsence.createdDate !== undefined
        ? M(payloadAbsence.createdDate, "DD-MM-YYYY HH:mm:ss").format("HH:mm")
        : M(payloadAbsence.hcisRequestDate, "DD-MM-YYYY HH:mm:ss").format(
          "HH:mm"
        );

    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fa fa-1x fa-clock"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Timesheet - {this.props.type === "edit" ? "Edit" : "View"} Form
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.props.closeSlide}
              >
                <i className="fa fa-lg fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>

        <form
          action="#"
          onSubmit={e => {
            e.preventDefault();
            if (
              R.isEmpty(
                this.state.payloadAbsence.hcisRequestPayload.absenceType
              )
            )
              return alert("Absence Type is Required.");
            let typeSave = this.state.typeSave;
            switch (typeSave) {
              case "final":
                this.props.onClickSubmit(this.state.payloadAbsence);
                break;
              default:
                this.props.onClickSave(this.state.payloadAbsence);
                break;
            }
          }}
        >
          <div className="a-s-p-mid a-s-p-pad border-top">
            <div className="display-flex-normals margin-bottom-10px">
              <div className="padding-top-15px padding-bottom-15px border-bottom">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Request ID</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    className="txt txt-sekunder-color"
                    required
                    value={payloadAbsence.hcisRequestID}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>NIK</h4>
                    </div>
                  </div>
                  <input
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    className="txt txt-sekunder-color"
                    required
                    value={auth.user.employeeID}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Employee Name</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    className="txt txt-sekunder-color"
                    required
                    value={auth.user.employeeName}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Current Date</h4>
                    </div>
                  </div>
                  <input
                    type="date"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    className="txt txt-sekunder-color"
                    required
                    value={currentDate}
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Current Time</h4>
                    </div>
                  </div>
                  <input
                    type="time"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    className="txt txt-sekunder-color"
                    required
                    value={currentTime}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Absence Type <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- Select Absence Type --"
                    onChange={dt =>
                      this.setState({
                        payloadAbsence: {
                          ...this.state.payloadAbsence,
                          hcisRequestPayload: {
                            ...this.state.payloadAbsence.hcisRequestPayload,
                            absenceType: dt
                          }
                        }
                      })
                    }
                    type="bizpar"
                    data={[
                      {
                        id: "1",
                        bizparValue: "CHECK IN",
                        bizparKey: "CHECK_IN"
                      },
                      {
                        id: "2",
                        bizparValue: "CHECK OUT",
                        bizparKey: "CHECK_OUT"
                      }
                    ]}
                    value={payloadAbsence.hcisRequestPayload.absenceType}
                    bizValue={payloadAbsence.hcisRequestPayload.absenceType
                      .split("_")
                      .join(" ")}
                    disabled={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Reason <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={payloadAbsence.hcisRequestPayload.absenceReason}
                    onChange={e =>
                      this.setState({
                        payloadAbsence: {
                          ...this.state.payloadAbsence,
                          hcisRequestPayload: {
                            ...this.state.payloadAbsence.hcisRequestPayload,
                            absenceReason: e.target.value
                          }
                        }
                      })
                    }
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                  />
                </div>
              </div>

              <div className="padding-15px">
                <div className="content-right">
                  {this.props.type !== "view" ? (
                    <Button
                    state={this.props.sendState}
                    style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90 }}
                      className="btn btn-blue"
                      type="submit"
                    >
                      <span>SAVE</span>
                    </Button>
                  ) : null}
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="submit"
                      onClick={() => {
                        this.setState({
                          typeSave: "final"
                        });
                      }}
                    >
                      <span>SAVE & SUBMIT</span>
                    </button>
                  ) : null}
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-primary"
                    type="button"
                    onClick={this.props.closeSlide}
                  >
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <ReactTooltip />
      </div>
    );
  };

  render = () => {
    let { auth, payloadAbsence } = this.state;
    let currentDate =
      payloadAbsence.createdDate !== undefined
        ? M(payloadAbsence.createdDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        : M(payloadAbsence.hcisRequestDate, "DD-MM-YYYY").format("YYYY-MM-DD");

    let currentTime =
      payloadAbsence.createdDate !== undefined
        ? M(payloadAbsence.createdDate, "DD-MM-YYYY HH:mm:ss").format("HH:mm")
        : M(payloadAbsence.hcisRequestDate, "DD-MM-YYYY HH:mm:ss").format(
          "HH:mm"
        );

    return this.props.type !== "create" ? (
      this.renderEditTimesheet()
    ) : (
        <div className={"app-popup app-popup-show"}>
          <div className="padding-top-20px" />
          <div className="popup-content-small background-white border-radius">
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  {this.props.type === "create"
                    ? "Timesheet - Create Form"
                    : "Timesheet - Edit Form"}
                </div>
              </div>
              <div className="col-2 content-right">
                <button
                  className="btn btn-circle btn-grey"
                  onClick={this.props.onClickClose}
                >
                  <i className="fa fa-lg fa-times" />
                </button>
              </div>
            </div>

            <form
              action="#"
              onSubmit={e => {
                e.preventDefault();
                if (
                  R.isEmpty(
                    this.state.payloadAbsence.hcisRequestPayload.absenceType
                  )
                )
                  return alert("Absence Type is Required.");
                let typeSave = this.state.typeSave;
                switch (typeSave) {
                  case "final":
                    this.props.onClickSubmit(this.state.payloadAbsence);
                    break;
                  default:
                    this.props.onClickSave(this.state.payloadAbsence);
                    break;
                }
              }}
            >
              <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                <div className="column-1">
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Request ID</h4>
                      </div>
                    </div>
                    <input
                      type="text"
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      className="txt txt-sekunder-color"
                      required
                      value={payloadAbsence.hcisRequestID}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>NIK</h4>
                      </div>
                    </div>
                    <input
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      className="txt txt-sekunder-color"
                      required
                      value={auth.user.employeeID}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Employee Name</h4>
                      </div>
                    </div>
                    <input
                      type="text"
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      className="txt txt-sekunder-color"
                      required
                      value={auth.user.employeeName}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Current Date</h4>
                      </div>
                    </div>
                    <input
                      type="date"
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      className="txt txt-sekunder-color"
                      required
                      value={currentDate}
                    />
                  </div>
                </div>
                <div className="column-2">
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Current Time</h4>
                      </div>
                    </div>
                    <input
                      type="time"
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      className="txt txt-sekunder-color"
                      required
                      value={currentTime}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Absence Type <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <DropDown
                      title="-- Select Absence Type --"
                      onChange={dt =>
                        this.setState({
                          payloadAbsence: {
                            ...this.state.payloadAbsence,
                            hcisRequestPayload: {
                              ...this.state.payloadAbsence.hcisRequestPayload,
                              absenceType: dt
                            }
                          }
                        })
                      }
                      type="bizpar"
                      data={[
                        {
                          id: "1",
                          bizparValue: "CHECK IN",
                          bizparKey: "CHECK_IN"
                        },
                        {
                          id: "2",
                          bizparValue: "CHECK OUT",
                          bizparKey: "CHECK_OUT"
                        }
                      ]}
                      value={payloadAbsence.hcisRequestPayload.absenceType}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Reason <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <textarea
                      rows={5}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                      value={payloadAbsence.hcisRequestPayload.absenceReason}
                      onChange={e =>
                        this.setState({
                          payloadAbsence: {
                            ...this.state.payloadAbsence,
                            hcisRequestPayload: {
                              ...this.state.payloadAbsence.hcisRequestPayload,
                              absenceReason: e.target.value
                            }
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="padding-15px">
                <div className="grid grid-2x">
                  <div className="col-1" />
                  <div className="col-2 content-right">
                    <Button
                      state={this.props.sendState}
                      style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: '15px' }}
                      className="btn btn-blue"
                      type="submit"
                    >
                      <span>SAVE</span>
                    </Button>
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="submit"
                      onClick={() => {
                        this.setState({
                          typeSave: "final"
                        });
                      }}
                    >
                      <span>SAVE & SUBMIT</span>
                    </button>
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.props.onClickClose}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="padding-bottom-20px" />
        </div>
      );
  };
}

const mapStateProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateProps)(absenceDetail);
