import React, { Component } from "react";
import M from "moment";
import ReactTooltip from "react-tooltip";

class FormTraining extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: props.tData
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.tData !== undefined) {
      if (this.props.tData !== prevProps.tData) {
        this.setState({
          payload: {
            ...this.props.tData,
            trainingRegistrationDate: M(
              this.props.tData.trainingRegistrationDate,
              "DD/MM/YYYY"
            ).format("DD/MM/YYYY")
            // trainingEndDate: M(
            //   this.props.tData.trainingEndDate,
            //   "DD/MM/YYYY"
            // ).format("DD/MM/YYYY"),
            //   startTime:
            //     this.props.tData.trainingStartTime === "Invalid date"
            //       ? ""
            //       : M(
            //           this.props.tData.trainingStartTime,
            //           "DD/MM/YYYY HH:mm:ss"
            //         ).format("HH:mm"),
            //   endTime:
            //     this.props.tData.trainingEndTime === "Invalid date"
            //       ? ""
            //       : M(
            //           this.props.tData.trainingEndTime,
            //           "DD/MM/YYYY HH:mm:ss"
            //         ).format("HH:mm")
          }
        });
      }
    }
  }

  render() {
    let { payload } = this.state;
    // let startTime = payload
    //   ? M(payload.trainingStartTime, "DD/MM/YYYY HH:mm:ss").format("HH:mm")
    //   : "";
    // let endTime = payload
    //   ? M(payload.trainingEndTime, "DD/MM/YYYY HH:mm:ss").format("HH:mm")
    //   : "";
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-info-circle"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Training - Info Form
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                onClick={this.props.closeSlide}
                className="btn btn-circle btn-grey"
              >
                <i className="fa fa-lg fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>
        <form action="#">
          <div className="a-s-p-mid a-s-p-pad border-top">
            <div className="display-flex-normals margin-bottom-10px">
              <div className="padding-top-15px padding-bottom-15px border-bottom">
                {/* <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Training Name
                    </span>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    required
                    placeholder=""
                    value={payload ? payload.trainingRegistrationName : ""}
                  ></input>
                </div> */}

                {/* <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Period
                    </span>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    required
                    placeholder=""
                    value={
                      payload
                        ? M(payload.trainingStartDate, "DD/MM/YYYY").format(
                            "MMMM YYYY"
                          )
                        : ""
                    }
                  />
                </div> */}

                {/* <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Quota Remaining
                    </span>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    required
                    placeholder=""
                    value={payload ? payload.availableCapacity : ""}
                  ></input>
                </div> */}

                {/* <div className="margin-bottom-15px">
                  <div className="grid grid-2x grid-mobile-none gap-30px">
                    <div className="column-1">
                      <div className="margin-5px">
                        <span className="txt-site txt-11 txt-main txt-bold">
                          Start Date
                        </span>
                      </div>
                      <input
                        style={{
                          backgroundColor: "#E6E6E6",
                          marginRight: 10
                        }}
                        className="txt txt-sekunder-color"
                        type="date"
                        readOnly
                        placeholder=""
                        value={
                          payload
                            ? M(payload.trainingStartDate, "DD/MM/YYYY").format(
                                "YYYY-MM-DD"
                              )
                            : ""
                        }
                      ></input>
                    </div>
                    <div className="column-2">
                      <div className="margin-5px">
                        <span className="txt-site txt-11 txt-main txt-bold">
                          End Date
                        </span>
                      </div>
                      <input
                        style={{
                          backgroundColor: "#E6E6E6",
                          marginRight: 10
                        }}
                        className="txt txt-sekunder-color"
                        type="date"
                        readOnly
                        placeholder=""
                        value={
                          payload
                            ? M(payload.trainingEndDate, "DD/MM/YYYY").format(
                                "YYYY-MM-DD"
                              )
                            : ""
                        }
                      ></input>
                    </div>
                  </div>
                </div>

                <div className="margin-bottom-15px">
                  <div className="grid grid-2x grid-mobile-none gap-30px">
                    <div className="column-1">
                      <div className="margin-5px">
                        <span className="txt-site txt-11 txt-main txt-bold">
                          Start Time
                        </span>
                      </div>
                      <input
                        style={{
                          backgroundColor: "#E6E6E6",
                          marginRight: 10
                        }}
                        className="txt txt-sekunder-color"
                        type="time"
                        readOnly
                        placeholder=""
                        value={startTime}
                      ></input>
                    </div>
                    <div className="column-2">
                      <div className="margin-5px">
                        <span className="txt-site txt-11 txt-main txt-bold">
                          End Time
                        </span>
                      </div>
                      <input
                        style={{
                          backgroundColor: "#E6E6E6",
                          marginRight: 10
                        }}
                        className="txt txt-sekunder-color"
                        type="time"
                        readOnly
                        placeholder=""
                        value={endTime}
                      ></input>
                    </div>
                  </div>
                </div> */}

                {/* <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Location
                    </span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                    value={payload ? payload.trainingLocation : ""}
                  />
                </div> */}
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Registration ID
                    </span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                    value={payload ? payload.trainingRegistrationID : ""}
                  />
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Registration Date
                    </span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                    value={payload ? payload.trainingRegistrationDate : ""}
                  />
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Type
                    </span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                    value={payload ? payload.trainingRegistrationType : ""}
                  />
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Status
                    </span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                    value={payload ? payload.trainingRegistrationStatus : ""}
                  />
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Training Info
                    </span>
                  </div>
                  <textarea
                    className="form-control rounded-0"
                    type="text"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    required
                    placeholder=""
                    rows="5"
                    value={
                      payload ? payload.trainingRegistrationDescription : ""
                    }
                  />
                </div>
              </div>

              <div className="padding-15px">
                <div className="grid grid-2x">
                  <div className="col-1" />
                  <div className="col-2 content-right">
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
          </div>
        </form>
        <ReactTooltip />
      </div>
    );
  }
}

export default FormTraining;
