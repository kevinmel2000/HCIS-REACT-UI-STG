import React, { Component } from "react"
import { connect } from "react-redux"
import M from "moment"
import * as R from "ramda"
import FormSearchEmp from "../formEmployee/formSearchEmployee"
import CalendarPicker from '../../../modules/popup/Calendar'
import DropDown from '../../../modules/popup/DropDown'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayload = {
  terminationID: "",
  terminationDocumentNumber: "",
  terminationSPKNumber: "",
  terminationSPKDate: "",
  terminationDocumentDate: "",
  terminationRequestDate: "",
  terminationEffectiveDate: "",
  terminationPPHEndDate: "",
  terminationNotes: "",
  terminationDocumentURL: "",
  requestBy: "",
  terminationType: "",
  terminationCategory: "",
  terminationReason: "",
  terminationStatus: "INITIATE",
  createdBy: "SYSTEM",
  createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
  updatedBy: "SYSTEM",
  updatedDate: "",
  recordID: ""
};

class FormTerminationCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        ...defaultPayload,
        terminationID: "T-" + M()
      },
      auth: props.auth,
      formGeneral: true,
      formDetail: false,
      formDocument: false,
      activeTab: "General",
      tabMenuCreate: ["General", "Detail"],
      formSearchEmpVisible: false,
      dataEmployee: ""
    };
  }

  addEmployeeHandler(value, rawDataEmployee) {
    let selectedEmployee = rawDataEmployee[value];
    this.setState({
      dataEmployeeName: selectedEmployee.employeeName,
      dataEmployeeKk: selectedEmployee.employeeID,
      dataEmployeeReg: selectedEmployee.employeeRegistrationDate,
      dataEmployeeContractExit: selectedEmployee.employeeExitDate,
      dataEmployeeType: selectedEmployee.employeeType.bizparValue,
      record: selectedEmployee.recordID,
      dataEmployeeGrade: selectedEmployee.employeeGrade,
      formSearchEmpVisible: !this.state.formSearchEmpVisible
    });
  }

  openSearch() {
    this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible });
  }

  opNavigator = title => {
    let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();

    let allStateVisibleFalse = {
      ...this.state,
      formGeneral: false,
      formDetail: false,
      formDocument: false,
      activeTab: title
    };

    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formGeneral: true
        };
        break;
      case "Detail":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDetail: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  renderForm = () => {
    let { data, auth, dataEmployeeReg } = this.state;
    let x = "";
    x = M(dataEmployeeReg, "DD-MM-YYYY");
    x = x.fromNow();
    return (
      <div className="popup-content-grid">
        <div className="popup-scroll popup-col-1">
          <ul className="vertical-tab">
            {this.state.tabMenuCreate.map((data, index) => {
              return this.opNavigator(data, index);
            })}
          </ul>
        </div>
        <div className="popup-scroll popup-col-2">
          {/* Termintation General*/}
          {this.state.formGeneral && (
            <div className="vertical-tab-content active">
              <form action="#">
                <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                  <div style={{ marginBottom: -10 }}>
                    REQUESTOR
                  </div>

                  <div className="column-1">
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>NIK</h4>
                        </div>
                      </div>
                      <input
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
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
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={auth.user.employeeName}
                      />
                      &nbsp;
                    </div>
                  </div>

                  <div className="column-2">
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Division</h4>
                        </div>
                      </div>
                      <input
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={auth.user.positionID}
                      />
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Position</h4>
                        </div>
                      </div>
                      <input
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={auth.user.positionName}
                      // onChange={e => this.setState({ data: { ...this.state.data, languageSkillScore: e.target.value } })}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: -10,
                      marginTop: -10
                    }}
                  >
                    HEADER
                  </div>

                  <div className="column-1">
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Request Number</h4>
                        </div>
                      </div>
                      <input
                        readOnly={this.props.type !== "create" ? true : false}
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.terminationID}
                      />
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Termination Type <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select termination type --"
                        onChange={(dt) => this.setState({
                          data: {
                            ...this.state.data,
                            terminationType: {
                              ...this.state.data.terminationType,
                              bizparKey: dt
                            }
                          }
                        })}
                        type="bizpar"
                        disabled={this.props.type !== "create"}
                        data={this.props.bizparTerminationType}
                        value={this.state.data.terminationType.bizparKey} />
                      {/*<select
                        className="cf-select slc slc-sekunder"
                        disabled={this.props.type === "view" ? true : false}
                        style={
                          this.props.type === "view"
                            ? { backgroundColor: "#E6E6E6" }
                            : null
                        }
                        value={data.terminationType.bizparKey}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationType: {
                                ...data.terminationType,
                                bizparKey: e.target.value
                              }
                            }
                          })
                        }
                      >
                        <option value="">-- please movement type --</option>
                        {this.props.bizparTerminationType &&
                          this.props.bizparTerminationType.map(
                            (data, index) => {
                              return (
                                <option key={index} value={data.bizparKey}>
                                  {data.bizparValue}
                                </option>
                              );
                            }
                          )}
                      </select>*/}
                    </div>
                  </div>

                  <div className="column-2">
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Termination Category <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select termination category --"
                        onChange={(dt) => this.setState({
                          data: {
                            ...this.state.data,
                            terminationCategory: {
                              ...this.state.data.terminationCategory,
                              bizparKey: dt
                            }
                          }
                        })}
                        type="bizpar"
                        disabled={this.props.type !== "create"}
                        data={this.props.bizparTerminationCategory}
                        value={data.terminationCategory.bizparKey} />
                      {/*<select
                        className="cf-select slc slc-sekunder"
                        disabled={this.props.type === "view" ? true : false}
                        value={data.terminationCategory.bizparKey}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationCategory: {
                                ...data.terminationCategory,
                                bizparKey: e.target.value
                              }
                            }
                          })
                        }
                      >
                        <option value="">-- please movement category --</option>
                        {this.props.bizparTerminationCategory &&
                          this.props.bizparTerminationCategory.map(
                            (data, index) => {
                              return (
                                <option key={index} value={data.bizparKey}>
                                  {data.bizparValue}
                                </option>
                              );
                            }
                          )}
                      </select>*/}
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Termination Reason <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select termination reason --"
                        onChange={(dt) => this.setState({
                          data: {
                            ...this.state.data,
                            terminationReason: {
                              ...this.state.data.terminationReason,
                              bizparKey: dt
                            }
                          }
                        })}
                        type="bizpar"
                        disabled={this.props.type !== "create"}
                        data={this.props.bizparTerminationReason}
                        value={this.state.data.terminationReason.bizparKey} />
                      {/*<select
                        className="cf-select slc slc-sekunder"
                        disabled={this.props.type === "view" ? true : false}
                        value={data.terminationReason.bizparKey}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationReason: {
                                ...data.terminationReason,
                                bizparKey: e.target.value
                              }
                            }
                          })
                        }
                      >
                        {" "}
                        <option value="">-- please movement reason --</option>
                        {this.props.bizparTerminationReason &&
                          this.props.bizparTerminationReason.map(
                            (data, index) => {
                              return (
                                <option key={index} value={data.bizparKey}>
                                  {data.bizparValue}
                                </option>
                              );
                            }
                          )}
                      </select>*/}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
          {/* Termintation Detail*/}
          {this.state.formDetail && (
            <div className="vertical-tab-content active">
              {this.state.formSearchEmpVisible && (
                <FormSearchEmp
                  onClickClose={this.openSearch.bind(this)}
                  onClickEmp={this.addEmployeeHandler.bind(this)}
                />
              )}
              <form action="#">
                <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                  <div className="column-1">
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>NIK</h4>
                        </div>
                      </div>
                      <input
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={this.state.dataEmployeeKk}
                      />
                    </div>

                    <div className="card-date-picker margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Employee Name <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                        <div className='double'>
                        <input
                          readOnly
                          style={{ backgroundColor: "#E6E6E6", padding:15 }}
                          type="text"
                          className="input"
                          placeholder=""
                          required
                          value={this.state.dataEmployeeName}
                        />
                        <button
                          className="btn btn-grey border-left btn-no-radius"
                          type="button"
                          onClick={() => this.openSearch()}
                        >
                          <i class="fas fa-search" />
                        </button>
                      </div>
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Join Date</h4>
                        </div>
                      </div>
                      {/* <input
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={M(
                          this.state.dataEmployeeReg,
                          "DD/MM/YYYY"
                        ).format("YYYY-MM-DD")}
                      /> */}
                      <CalendarPicker
                        date={this.state.dataEmployeeReg && M(this.state.dataEmployeeReg, "DD-MM-YYYY").format(
                          "YYYY-MM-DD"
                        )}
                        disabled
                        onChange />
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Years of service</h4>
                        </div>
                      </div>
                      <input
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={dataEmployeeReg ? x : ""}
                      />
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Employee Type</h4>
                        </div>
                      </div>
                      <input
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={this.state.dataEmployeeType}
                      />
                      {/*<select
                        disabled
                        style={{ backgroundColor: "#E6E6E6" }}
                        className="cf-select slc slc-sekunder"
                      >
                        <option value="">{this.state.dataEmployeeType}</option>
                        
                      </select>*/}
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Employee Contract Date</h4>
                        </div>
                      </div>
                      <div className="display-flex-normal width width-full">
                        <div>
                          <CalendarPicker
                            date={this.state.dataEmployeeReg && M(this.state.dataEmployeeReg, "DD-MM-YYYY").format(
                              "YYYY-MM-DD"
                            )}
                            disabled
                            onChange
                          />
                        </div>
                        <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                          <p align="center" className="padding-5px">
                            To</p>
                        </div>
                        <div>
                          <CalendarPicker
                            date={this.state.dataEmployeeContractExit && M(this.state.dataEmployeeContractExit, "DD-MM-YYYY").format(
                              "YYYY-MM-DD"
                            )}
                            disabled
                            onChange
                          />
                        </div>
                      </div>
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>SPK Number <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.terminationSPKNumber}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationSPKNumber: e.target.value
                            }
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="column-2">
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Letter Number <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.terminationDocumentNumber}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationDocumentNumber: e.target.value
                            }
                          })
                        }
                      />
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>SPK Date <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <CalendarPicker
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            terminationSPKDate: M(e).format("YYYY-MM-DD")
                          }
                        })}
                      />
                      {/* <input
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.terminationSPKDate}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationSPKDate: e.target.value
                            }
                          })
                        }
                      /> */}
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Letter Date <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <CalendarPicker
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            terminationDocumentDate: M(e).format("YYYY-MM-DD")
                          }
                        })}
                      />
                      {/* <input
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.terminationDocumentDate}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationDocumentDate: e.target.value
                            }
                          })
                        }
                      /> */}
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Request Date <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <CalendarPicker
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            terminationRequestDate: M(e).format("YYYY-MM-DD")
                          }
                        })}
                      />
                      {/* <input
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.terminationRequestDate}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationRequestDate: e.target.value
                            }
                          })
                        }
                      /> */}
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Out Date <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <CalendarPicker
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            terminationEffectiveDate: M(e).format("YYYY-MM-DD")
                          }
                        })}
                      />
                      {/* <input
                        style={
                          this.props.type === "view"
                            ? { backgroundColor: "#E6E6E6" }
                            : null
                        }
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.terminationEffectiveDate}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationEffectiveDate: e.target.value
                            }
                          })
                        }
                      /> */}
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>PPH End Date <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <CalendarPicker
                        onChange={(e) => this.setState({
                          data: {
                            ...this.state.data,
                            terminationPPHEndDate: M(e).format("YYYY-MM-DD")
                          }
                        })}
                      />
                      {/* <input
                        readOnly={this.props.type === "view" ? true : false}
                        style={
                          this.props.type === "view"
                            ? { backgroundColor: "#E6E6E6" }
                            : null
                        }
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.terminationPPHEndDate}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationPPHEndDate: e.target.value
                            }
                          })
                        }
                      /> */}
                    </div>

                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Information <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <textarea
                        rows={5}
                        readOnly={this.props.type === "view" ? true : false}
                        style={
                          this.props.type === "view"
                            ? { backgroundColor: "#E6E6E6" }
                            : null
                        }
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.terminationNotes}
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              terminationNotes: e.target.value
                            }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
          {/* Termintation Documents*/}
          {this.state.formDetail && (
            <div className="vertical-tab-content active">
              <form action="#"></form>
            </div>
          )}
        </div>
      </div>
    );
  };

  renderFooter = () => {
    return (
      <div className="padding-15px">
        <div className="grid grid-2x">
          <div className="col-1" />
          <div className="col-2 content-right">
            {/* <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="submit">
            onClick={() => {
              let payload = this.state.data;
              payload = {
                ...payload,
                terminationID: payload.terminationID,
                terminationSPKDate: !R.isEmpty(payload.terminationSPKDate) ? M(payload.terminationSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                terminationDocumentDate: !R.isEmpty(payload.terminationDocumentDate) ? M(payload.terminationDocumentDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                terminationRequestDate: !R.isEmpty(payload.terminationRequestDate) ? M(payload.terminationRequestDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                terminationEffectiveDate: !R.isEmpty(payload.terminationEffectiveDate) ? M(payload.terminationEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                terminationPPHEndDate: !R.isEmpty(payload.terminationPPHEndDate) ? M(payload.terminationPPHEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                employeeID: this.state.dataEmployeeKk !== undefined ? this.state.dataEmployeeKk : "",
                requestBy: this.state.auth.user.employeeID,
                terminationType: payload.terminationType.bizparKey,
                terminationCategory: payload.terminationCategory.bizparKey,
                terminationReason: payload.terminationReason.bizparKey
              };
              this.props.onSave(payload)
            }}
            >
              <span>SAVE</span>
            </button> */}
            <Button
            state={this.props.sendState}
            style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: '355px'}}
            className="btn btn-blue"
            type="submit"
          >
            <span>SAVE</span>
          </Button>
            <button
              style={{ marginLeft: "15px" }}
              onClick={this.props.onClickClose}
              className="btn btn-primary"
              type="button"
            >
              <span>CLOSE</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Termination - Create Form
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
          <form action='#' onSubmit={(e) => {
            e.preventDefault()
            let payload = this.state.data;
            payload = {
              ...payload,
              terminationID: payload.terminationID,
              terminationSPKDate: !R.isEmpty(payload.terminationSPKDate) ? M(payload.terminationSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
              terminationDocumentDate: !R.isEmpty(payload.terminationDocumentDate) ? M(payload.terminationDocumentDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
              terminationRequestDate: !R.isEmpty(payload.terminationRequestDate) ? M(payload.terminationRequestDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
              terminationEffectiveDate: !R.isEmpty(payload.terminationEffectiveDate) ? M(payload.terminationEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
              terminationPPHEndDate: !R.isEmpty(payload.terminationPPHEndDate) ? M(payload.terminationPPHEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
              employeeID: this.state.dataEmployeeKk !== undefined ? this.state.dataEmployeeKk : "",
              requestBy: this.state.auth.user.employeeID,
              terminationType: payload.terminationType.bizparKey,
              terminationCategory: payload.terminationCategory.bizparKey,
              terminationReason: payload.terminationReason.bizparKey,
              createdBy:this.props.auth.user.employeeID,
              updatedBy:this.props.auth.user.employeeID
            };
            // if (R.isEmpty(payload.terminationSPKDate)) return alert('SPK Date is Required.')
            // if (R.isEmpty(payload.terminationDocumentDate)) return alert('Letter Date is Required.')
            // if (R.isEmpty(payload.terminationRequestDate)) return alert('Request Date is Required.')
            // if (R.isEmpty(payload.terminationEffectiveDate)) return alert('Effective Date is Required.')
            // if (R.isEmpty(payload.terminationPPHEndDate)) return alert('PPH End Date is Required.')
            if (R.isEmpty(payload.employeeID)) {
              return alert('Employee Name is Required.')
            }
            if (R.isEmpty(payload.terminationType) || R.isNil(payload.terminationType)) {
              return alert('Termination Type is Required.')
            }
            if (R.isEmpty(payload.terminationCategory) || R.isNil(payload.terminationCategory)) {
              return alert('Termination Category is Required.')
            }
            if (R.isEmpty(payload.terminationReason) || R.isNil(payload.terminationReason)) {
              return alert('Termination Reason is Required.')
            }
            if (R.isEmpty(payload.terminationSPKDate) || R.isNil(payload.terminationSPKDate)) {
              return alert('SPK Date is Required.')
            }
            if (R.isEmpty(payload.terminationDocumentDate) || R.isNil(payload.terminationDocumentDate)) {
              return alert('Letter Date is Required.')
            }
            if (R.isEmpty(payload.terminationRequestDate) || R.isNil(payload.terminationRequestDate)) {
              return alert('Request Date is Required.')
            }
            if (R.isEmpty(payload.terminationEffectiveDate) || R.isNil(payload.terminationEffectiveDate)) {
              return alert('Out Date is Required.')
            }
            if (R.isEmpty(payload.terminationPPHEndDate) || R.isNil(payload.terminationPPHEndDate)) {
              return alert('PPHEnd Date is Required.')
            }
            if (R.isEmpty(payload.terminationSPKNumber) || R.isNil(payload.terminationSPKNumber)) {
              return alert('SPK Number is Required.')
            }
            if (R.isEmpty(payload.terminationDocumentNumber) || R.isNil(payload.terminationDocumentNumber)) {
              return alert('Letter Number is Required.')
            }
            if (R.isEmpty(payload.terminationNotes) || R.isNil(payload.terminationNotes)) {
              return alert('Information is Required.')
            }
            else
              this.props.onSave(payload)
          }}
          >
            {this.renderForm()}
            {this.renderFooter()}
          </form>
        </div>
        <div className="padding-bottom-20px"></div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(FormTerminationCreate);
