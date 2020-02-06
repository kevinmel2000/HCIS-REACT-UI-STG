import React, { Component } from "react"
import FormSearchEmp from "../formEmployee/formSearchEmployee"
import M from "moment"
import * as R from 'ramda'
import CalendarPicker from '../../../modules/popup/Calendar'
import { connect } from 'react-redux';
import { Rabbit as Button } from 'react-button-loaders'

class FormMovementDetail extends Component {
  constructor(props) {
    super(props);
    let { movementData } = this.props;
    this.state = {
      formSearchEmpVisible: false,
      movementData: {
        ...movementData,
        movementSPKDate: M(movementData.movementSPKDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        movementEffectiveDate: M(movementData.movementEffectiveDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      },
      dataEmployee: "",
      auth: props.auth
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.movementData !== prevProps.movementData) {
      let { movementData } = this.props
      this.setState({
        movementData: {
          ...movementData,
          movementSPKDate: M(movementData.movementSPKDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          movementEffectiveDate: M(movementData.movementEffectiveDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        },
        dataEmployeeName: movementData.employee ? movementData.employee.employeeName : "",
        dataEmployeeKk: movementData.employee ? movementData.employee.employeeID : "",
        dataEmployeeReg: movementData.employee ? movementData.employee.employeeRegistrationDate : "",
        dataEmployeeContractExit: movementData.employee ? movementData.employee.employeeExitDate : "",
        dataEmployeeType: movementData.employee && movementData.employee.employeeType ? movementData.employee.employeeType.bizparValue : "",
        dataEmployeeGrade: movementData.employee ? movementData.employee.employeeGrade : "",
      })
    }
  }

  componentDidMount() {
    let { movementData } = this.props
    this.setState({
      dataEmployeeName: movementData.employee ? movementData.employee.employeeName : "",
      dataEmployeeKk: movementData.employee ? movementData.employee.employeeID : "",
      dataEmployeeReg: movementData.employee ? movementData.employee.employeeRegistrationDate : "",
      dataEmployeeContractExit: movementData.employee ? movementData.employee.employeeExitDate : "",
      dataEmployeeType: movementData.employee && movementData.employee.employeeType ? movementData.employee.employeeType.bizparValue : "",
      dataEmployeeGrade: movementData.employee ? movementData.employee.employeeGrade : "",
    })
  }

  addEmployeeHandler(value, rawDataEmployee) {
    let selectedEmployee = rawDataEmployee[value];
    this.setState({
      dataEmployeeName: selectedEmployee.employeeName,
      dataEmployeeKk: selectedEmployee.employeeID,
      dataEmployeeReg: selectedEmployee.employeeRegistrationDate,
      dataEmployeeContractExit: selectedEmployee.employeeExitDate,
      dataEmployeeType: selectedEmployee.employeeType.bizparValue,
      dataEmployeeGrade: selectedEmployee.employeeGrade,
      record: selectedEmployee.recordID,
      formSearchEmpVisible: !this.state.formSearchEmpVisible
    });
  }

  openSearch() {
    this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible });
  }

  render() {
    let { dataEmployeeReg, movementData } = this.state;
    let x = "";
    x = M(dataEmployeeReg, "DD-MM-YYYY");
    x = x.fromNow().split(" ")[0] + (x.fromNow().split(" ")[1] === "months" ? " Months Ago" : x.fromNow().split(" ")[1] === "hours" ? " Hours Ago" : x.fromNow().split(" ")[1] === "days" ? " Days Ago" : " Years Ago");
    return (
      <div className="vertical-tab-content active">
        {this.state.formSearchEmpVisible && (
          <FormSearchEmp
            onClickClose={this.openSearch.bind(this)}
            onClickEmp={this.addEmployeeHandler.bind(this)}
          />
        )}
        <form action="#">
          <div className="padding-15px grid grid-mobile-none gap-15px">
            <div className="column-1">
              <div className="card-date-picker margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Name <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <div className='double'>
                  <input
                    value={this.state.dataEmployeeName}
                    type="text"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                    className="input"
                    placeholder="Employee Name"
                    required
                  />
                  <button
                    className="btn btn-grey border-left btn-no-radius"
                    readOnly={this.props.type === "view" ? true : false}
                    type="button"
                    onClick={
                      this.props.type !== "view" ? () => this.openSearch() : null
                    }
                  >
                    <i className="fas fa-search" />
                  </button>
                </div>
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>NIK</h4>
                  </div>
                </div>
                <input
                  value={this.state.dataEmployeeKk}
                  type="text"
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder="NIK"
                  required
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Join Date</h4>
                  </div>
                </div>
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
                  value={dataEmployeeReg ? x : ""}
                  type="text"
                  disabled
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder="Years of service"
                  required
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Type</h4>
                  </div>
                </div>
                <input
                  value={this.state.dataEmployeeType}
                  type="text"
                  disabled
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder="Years of service"
                  required
                />
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
                      To
                    </p>
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
            </div>
            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Grade Before</h4>
                  </div>
                </div>
                <input
                  value={this.state.dataEmployeeGrade}
                  type="text"
                  disabled
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder="Grade Before"
                  required
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>SPK Number <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  className="txt txt-sekunder-color"
                  placeholder="SPK Number"
                  required
                  value={movementData.movementSPKNumber}
                  onChange={(e) => this.setState({
                    movementData: {
                      ...this.state.movementData,
                      movementSPKNumber: e.target.value
                    }
                  })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>SPK Date <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <CalendarPicker
                  date={this.state.movementData.movementSPKDate}
                  disabled={this.props.type === "view" ? true : false}
                  onChange={(e) => this.setState({
                    movementData: {
                      ...this.state.movementData,
                      movementSPKDate: M(e).format("YYYY-MM-DD")
                    }
                  })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Information <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <textarea
                  rows={5}
                  type="text"
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={movementData.movementNotes}
                  onChange={(e) => this.setState({
                    movementData: {
                      ...this.state.movementData,
                      movementNotes: e.target.value
                    }
                  })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Effective Date <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <CalendarPicker
                  disabled={this.props.type === "view" ? true : false}
                  date={this.state.movementData.movementEffectiveDate}
                  onChange={(e) => this.setState({
                    movementData: {
                      ...this.state.movementData,
                      movementEffectiveDate: M(e).format("YYYY-MM-DD")
                    }
                  })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Active Status <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <div className="margin-15px">
                  <label className="radio">
                    <input type="checkbox" checked disabled />
                    <span className="checkmark" />
                    <div className="txt-site txt-11 txt-bold txt-main">
                      <h4>Active</h4>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="padding-15px">
            <div className="grid">
              <div className="col-2 content-right">
                {this.props.type === "edit" ? (
                  <Button
                  type='button'
                  state={this.props.sendState}
                  style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 70 }}
                  className="btn btn-blue"
                  onClick={() => {
                    let payload = this.state.movementData;
                    payload = {
                      movementID: payload.movementID,
                      movementSPKNumber: payload.movementSPKNumber,
                      movementSPKDate: payload.movementSPKDate !== "Invalid date" ? M(payload.movementSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                      movementNotes: payload.movementNotes,
                      movementEffectiveDate: payload.movementEffectiveDate !== "Invalid date" ? M(payload.movementEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                      movementDocumentURL: payload.movementDocumentURL,
                      movementCategory: payload.movementCategory.bizparKey,
                      movementType: payload.movementType.bizparKey,
                      movementPayroll: {
                        basicSalaryValue: !R.isNil(payload.movementPayroll.basicSalaryValue) || !R.isEmpty(payload.movementPayroll.basicSalaryValue) ? payload.movementPayroll.basicSalaryValue : "",
                        effectiveStartDate: payload.movementEffectiveDate !== "Invalid date" ? M(payload.movementEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                        effectiveEndDate: !R.isNil(payload.movementPayroll.effectiveEndDate) ? payload.movementPayroll.effectiveEndDate : ""
                      },
                      movementPosition: {
                        positionAfterEffectiveStartDate: !R.isNil(payload.movementPosition.positionAfterEffectiveStartDate) ? payload.movementPosition.positionAfterEffectiveStartDate : "",
                        positionAfterEffectiveEndDate: !R.isNil(payload.movementPosition.positionAfterEffectiveEndDate) ? payload.movementPosition.positionAfterEffectiveEndDate : "",
                        companyIDAfter: !R.isNil(payload.movementPosition.companyIDAfter) && !R.isNil(payload.movementPosition.companyIDAfter.esid) ? payload.movementPosition.companyIDAfter.esid : "",
                        companyIDBefore: !R.isNil(payload.movementPosition.companyIDBefore) && !R.isNil(payload.movementPosition.companyIDBefore.esid) ? payload.movementPosition.companyIDBefore.esid : "",
                        positionIDAfter: !R.isNil(payload.movementPosition.positionIDAfter) && !R.isNil(payload.movementPosition.positionIDAfter.ouid) ? payload.movementPosition.positionIDAfter.ouid : "",
                        positionIDBefore: !R.isNil(payload.movementPosition.positionIDBefore) && !R.isNil(payload.movementPosition.positionIDBefore.ouid) ? payload.movementPosition.positionIDBefore.ouid : "",
                      },
                      movementStatus: payload.movementStatus,
                      employeeID: this.state.dataEmployeeKk,
                      requestBy: payload.requestBy.employeeID,
                      esid: payload.esid.esid,
                      createdBy: payload.movementCreationalDTO.createdBy,
                      createdDate: payload.movementCreationalDTO.createdDate,
                      updatedBy: this.props.auth.user.employeeID,
                      updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                    };
                    this.props.onSave(payload)
                  }}
                >
                  <span>SAVE</span>
                    
                  </Button>
                  // <button
                  //   style={{ marginLeft: "15px" }}
                  //   onClick={() => {
                  //     let payload = this.state.movementData;
                  //     payload = {
                  //       movementID: payload.movementID,
                  //       movementSPKNumber: payload.movementSPKNumber,
                  //       movementSPKDate: payload.movementSPKDate !== "Invalid date" ? M(payload.movementSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                  //       movementNotes: payload.movementNotes,
                  //       movementEffectiveDate: payload.movementEffectiveDate !== "Invalid date" ? M(payload.movementEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                  //       movementDocumentURL: payload.movementDocumentURL,
                  //       movementCategory: payload.movementCategory.bizparKey,
                  //       movementType: payload.movementType.bizparKey,
                  //       movementPayroll: {
                  //         basicSalaryValue: !R.isNil(payload.movementPayroll.basicSalaryValue) || !R.isEmpty(payload.movementPayroll.basicSalaryValue) ? payload.movementPayroll.basicSalaryValue : "",
                  //         effectiveStartDate: payload.movementEffectiveDate !== "Invalid date" ? M(payload.movementEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                  //         effectiveEndDate: !R.isNil(payload.movementPayroll.effectiveEndDate) ? payload.movementPayroll.effectiveEndDate : ""
                  //       },
                  //       movementPosition: {
                  //         positionAfterEffectiveStartDate: !R.isNil(payload.movementPosition.positionAfterEffectiveStartDate) ? payload.movementPosition.positionAfterEffectiveStartDate : "",
                  //         positionAfterEffectiveEndDate: !R.isNil(payload.movementPosition.positionAfterEffectiveEndDate) ? payload.movementPosition.positionAfterEffectiveEndDate : "",
                  //         companyIDAfter: !R.isNil(payload.movementPosition.companyIDAfter) && !R.isNil(payload.movementPosition.companyIDAfter.esid) ? payload.movementPosition.companyIDAfter.esid : "",
                  //         companyIDBefore: !R.isNil(payload.movementPosition.companyIDBefore) && !R.isNil(payload.movementPosition.companyIDBefore.esid) ? payload.movementPosition.companyIDBefore.esid : "",
                  //         positionIDAfter: !R.isNil(payload.movementPosition.positionIDAfter) && !R.isNil(payload.movementPosition.positionIDAfter.ouid) ? payload.movementPosition.positionIDAfter.ouid : "",
                  //         positionIDBefore: !R.isNil(payload.movementPosition.positionIDBefore) && !R.isNil(payload.movementPosition.positionIDBefore.ouid) ? payload.movementPosition.positionIDBefore.ouid : "",
                  //       },
                  //       movementStatus: payload.movementStatus,
                  //       employeeID: this.state.dataEmployeeKk,
                  //       requestBy: payload.requestBy.employeeID,
                  //       esid: payload.esid.esid,
                  //       createdBy: payload.movementCreationalDTO.createdBy,
                  //       createdDate: payload.movementCreationalDTO.createdDate,
                  //       updatedBy: this.props.auth.user.employeeID,
                  //       updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                  //     };
                  //     this.props.onSave(payload)
                  //   }}
                  //   className="btn btn-blue"
                  //   type="button"
                  // >
                  //   <span>SAVE</span>
                  // </button>
                ) : null}
                {this.props.type === "edit" ? (
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={() => {
                      let payload = this.state.movementData
                      payload = {
                        "taskID": "",
                        "senderUserID": this.state.auth.user.userID,
                        "senderEmpID": this.state.auth.user.employeeID,
                        "senderNotes": "",
                        "senderBPMStatus": "INITIATE",
                        "data": {
                          movementID: payload.movementID,
                          movementSPKNumber: payload.movementSPKNumber,
                          movementSPKDate: payload.movementSPKDate !== "Invalid date" ? M(payload.movementSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                          movementNotes: payload.movementNotes,
                          movementEffectiveDate: payload.movementEffectiveDate !== "Invalid date" ? M(payload.movementEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                          movementDocumentURL: payload.movementDocumentURL,
                          movementCategory: payload.movementCategory.bizparKey,
                          movementType: payload.movementType.bizparKey,
                          employeeID: this.state.dataEmployeeKk,
                          movementPosition: {
                            positionAfterEffectiveStartDate: M().format("DD-MM-YYYY"),
                            positionAfterEffectiveEndDate: M().format("DD-MM-YYYY"),
                            companyIDAfter: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                            companyIDBefore: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                            positionIDAfter: payload.movementPosition.positionIDAfter.ouid,
                            positionIDBefore: payload.employee && payload.employee.positionID ? payload.employee.positionID : ""
                          },
                          movementPayroll: {
                            basicSalaryValue: !R.isNil(payload.movementPayroll.basicSalaryValue) || !R.isEmpty(payload.movementPayroll.basicSalaryValue) ? payload.movementPayroll.basicSalaryValue : "",
                            effectiveStartDate: payload.movementEffectiveDate !== "Invalid date" ? M(payload.movementEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                            effectiveEndDate: !R.isNil(payload.movementPayroll.effectiveEndDate) ? payload.movementPayroll.effectiveEndDate : ""
                          },
                          movementStatus: payload.movementStatus,
                          requestBy: payload.requestBy.employeeID,
                          esid: payload.esid.esid,
                          createdBy: payload.movementCreationalDTO.createdBy,
                          createdDate: payload.movementCreationalDTO.createdDate,
                          updatedBy: this.props.auth.user.employeeID,
                          updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                        }
                      }
                      if (R.isNil(payload.data.movementPosition) || R.isNil(payload.data.movementPosition.positionIDAfter) || R.isEmpty(payload.data.movementPosition.positionIDAfter)) return alert("Position After is Required.")
                      this.props.onClickSave(payload)
                    }}
                  >
                    <span>SAVE & SUBMIT</span>
                  </button>
                ) : null}
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
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(FormMovementDetail)
