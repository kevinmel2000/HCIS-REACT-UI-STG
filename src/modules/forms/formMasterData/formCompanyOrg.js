import React, { Component } from "react";
import PopUp from "../../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import * as R from 'ramda'
import FormJobDetail from "./formOrgJobDetail";
import FormGradeDetail from "./formOrgGradeDetail";
import API from "../../../Services/Api"
import LoadingBar from "react-top-loading-bar";
import logo from "./../../../assets/img/StrukturOrg.jpeg"

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormCompany extends Component {
  constructor(props) {
    super(props);
    let { payloadOrg } = this.props;

    this.state = {
      payloadOrg: payloadOrg,
      createJobDescVisible: false,
      createGradeVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      dataTableJob: [],
      dataTableGrade: [],
      rawData: [],
      selectedIndexJob: null,
      selectedIndexGrade: null
    };
  }

  // componentWillReceiveProps(newProps) {
  //   let { payloadOrg } = newProps
  //   this.setState({ payloadOrg })
  // }

  componentWillMount() {
    this.getDataTable(this.state.payloadOrg);
  }

  handleUpdate() {
    let { payloadOrg } = this.state
    let { ouname, ouid, ouparentID } = payloadOrg

    payloadOrg = {
      ...payloadOrg,
      orgStructureTPL: {
        ...payloadOrg.orgStructureTPL,
        payload: {
          ...payloadOrg.orgStructureTPL.payload,
          ouparentID: ouparentID,
          ouname: ouname,
          ouid: ouid
        }
      }
    }
    delete payloadOrg.ouparentID
    delete payloadOrg.ouname
    delete payloadOrg.ouid

    this.props.onClickSave(payloadOrg)
  }

  getDataTable(payloadOrg) {
    let payloadTab = {
      "esid": payloadOrg.esid,
      "ouid": payloadOrg.orgStructureTPL.payload.ouid,
    }
    API.create('ES').getEsByOuid(payloadTab).then(
      (res) => {
        if(res.status === 200) {
          console.log(res.data);
          if(res.data.status === 'S' && res.data.code === "201") {
            let dataTableGrade = res.data.data.ougrade.map((value, index) => {
              return value === null ? [] : [value]
            });

            let dataTableJob = res.data.data.oujobDesc.map((value, index) => {
              return value === null ? [] : [value]
            });

            payloadOrg = {
              ...payloadOrg,
              ouparentID: res.data.data.ouparentID,
              ouname: res.data.data.ouname,
              ouid: res.data.data.ouid
            }
        
            this.setState({
              dataTableJob,
              dataTableGrade,
              rawData: res.data.data,
              payloadOrg
            })
          } else {
            alert("Error: " + res.data.message)
          }
        }
      }
    )
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  openCloseCreateJobDesc() {
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      createJobDescVisible: !this.state.createJobDescVisible,
      createPopUpVisible
    });
  }

  openCloseCreateGrade() {
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      createGradeVisible: !this.state.createGradeVisible,
      createPopUpVisible
    });
  }

  openDeletePopup(type, index) {
    switch(type) {
      case "deleteJob":
        this.setState({
          deletePopUpVisible: !this.state.deletePopUpVisible,
          selectedIndexJob: index,
          selectedIndexGrade: null
        });
        break;
      case "deleteGrade":
        this.setState({
          deletePopUpVisible: !this.state.deletePopUpVisible,
          selectedIndexGrade: index,
          selectedIndexJob: null
        });
        break;
      default:
        break;
    }
  }

  handleSubmit(data, type = "") {
    this.setState({ createJobDescVisible: false, createGradeVisible: false })
    let { payloadOrg, selectedIndexJob, selectedIndexGrade } = this.state
    let oujobDesc = Object.assign([], payloadOrg.orgStructureTPL.payload.oujobDesc)
    let ougrade = Object.assign([], payloadOrg.orgStructureTPL.payload.ougrade)

    switch(type) {
      case "job":
        oujobDesc.push(data)
        break;
      case "grade":
        ougrade.push(data)
        break;
      case "deleteJob":
        oujobDesc.splice(selectedIndexJob, 1)
        break;
      case "deleteGrade":
        ougrade.splice(selectedIndexGrade, 1)
        break;
      default:
        break;
    }

    let dataSppd = Object.assign([], payloadOrg.sppdTPL)
    dataSppd = dataSppd.map((value, index) => {
      return {
        ...value,
        sppdPayloads: value.sppdPayloads.map((data, index) => {
          return {
            ...data,
            sppdCategory: typeof data.sppdCategory === "object" ? data.sppdCategory.bizparKey : data.sppdCategory,
            sppdTripType: typeof data.sppdTripType === "object" ? data.sppdTripType.bizparKey : data.sppdTripType,
            sppdType: typeof data.sppdType === "object" ? data.sppdType.bizparKey : data.sppdType,
            sppdTPLJSONDetails: data.sppdTPLJSONDetails.map((datas, index) => {
              return {
                ...datas,
                budgetCategory: typeof datas.budgetCategory === "object" ? datas.budgetCategory.bizparKey : datas.budgetCategory,
                budgetType: typeof datas.budgetType === "object" ? datas.budgetType.bizparKey : datas.budgetType,
                budgetClass: typeof datas.budgetClass === "object" ? datas.budgetClass.bizparKey : datas.budgetClass,
                budgetCurrency: typeof datas.budgetCurrency === "object" ? datas.budgetCurrency.bizparKey : datas.budgetCurrency,
              }
            })
          }
        })
      }
    })

    let dataLeave = Object.assign([], payloadOrg.leaveSetup)
    dataLeave = dataLeave.map((value, index) => {
      return {
        ...value,
        leaveReligion: typeof value.leaveReligion === "object" ? value.leaveReligion.bizparKey : value.leaveReligion,
        leaveType: typeof value.leaveType === "object" ? value.leaveType.bizparKey : value.leaveType,
        leaveCategory: typeof value.leaveCategory === "object" ? value.leaveCategory.bizparKey : value.leaveCategory,
        leaveGender: typeof value.leaveGender === "object" ? value.leaveGender.bizparKey : value.leaveGender,
      }
    })

    let dataTax = Object.assign([], payloadOrg.taxTPL.taxPayload)
    dataTax = dataTax.map((value, index) => {
      return {
        ...value,
        taxRecipientIdentities: value.taxRecipientIdentities.map((data, index) => {
          return {
            ...data,
            taxRecipientItemType: typeof data.taxRecipientItemType === "object" ? data.taxRecipientItemType.bizparKey : data.taxRecipientItemType,
            taxRecipientIdentityDetails: data.taxRecipientIdentityDetails.map((datas, index) => {
              return {
                ...datas,
                taxReceiptIdentityDetailType: typeof datas.taxReceiptIdentityDetailType === "object" ? datas.taxReceiptIdentityDetailType.bizparKey : datas.taxReceiptIdentityDetailType,
              }
            })
          }
        }),
        taxTPLJSONTaxIncomes: value.taxTPLJSONTaxIncomes.map((data, index) => {
          return {
            ...data,
            taxPPH21IncomeType: typeof data.taxPPH21IncomeType === "object" ? data.taxPPH21IncomeType.bizparKey : data.taxPPH21IncomeType,
            taxPPH21IncomeCategory: typeof data.taxPPH21IncomeCategory === "object" ? data.taxPPH21IncomeCategory.bizparKey : data.taxPPH21IncomeCategory,

          }
        }),
        taxTPLHeaderType: typeof value.taxTPLHeaderType === "object" ? value.taxTPLHeaderType.bizparKey : value.taxTPLHeaderType
      }
    })

    let dataPayrollTpl = Object.assign([], payloadOrg.payrollTPL && payloadOrg.payrollTPL.payrollPayload)
    dataPayrollTpl = dataPayrollTpl.map((value, index) => {
      let payrollTPLJSONDetails = value.payrollTPLJSONDetails.map((data, index) => {
        return {
          ...data,
          taxType: typeof data.taxType === "object" ? data.taxType.bizparKey : data.taxType,
          tax1721A1Type: typeof data.tax1721A1Type === "object" ? data.tax1721A1Type.bizparKey : data.tax1721A1Type,
          payrollComponent: typeof data.payrollComponent === "object" ? data.payrollComponent.payrollComponentID : data.payrollComponent,
          coaCategory: typeof data.coaCategory === "object" ? data.coaCategory.bizparKey : data.coaCategory
        }
      })
      return {
        ...value,
        payrollTPLJSONDetails
      }
    })

    payloadOrg = {
      ...payloadOrg,
      orgStructureTPL: {
        ...payloadOrg.orgStructureTPL,
        payload: {
          ...payloadOrg.orgStructureTPL.payload,
          oujobDesc: oujobDesc,
          ougrade: ougrade
        }
      },
      sppdTPL: dataSppd,
      leaveSetup: dataLeave,
      taxTPL: {
        ...payloadOrg.taxTPL,
        taxPayload: dataTax
      },
      payrollTPL: {
        ...payloadOrg.payrollTPL,
        payrollPayload: dataPayrollTpl
      }
    }

    console.log('payload =>', JSON.stringify(payloadOrg))
    API.create('ES').updateCompGeneral(payloadOrg).then(
      (res) => {
        if(res.status === 200) {
          if(res.data.status === 'S') {
            this.setState({ createPopUpVisible: true, payloadOrg })
            this.getDataTable(payloadOrg)
            if(type === "deleteJob" || type === "deleteGrade") this.setState({ deletePopUpVisible: false })
          } else {
            alert("Failed: "+res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  columnsJobDesc = [
    "Job Description",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {this.props.type !== 'view' ?
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  onClick={() => this.openDeletePopup("deleteJob", tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-trash-alt" />
                </button>
                : null }
            </div>
          );
        }
      }
    }
  ];

  columnsGrade = [
    "Grade",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {this.props.type !== 'view' ?
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  onClick={() => this.openDeletePopup("deleteGrade", tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-trash-alt" />
                </button>
                : null }
            </div>
          );
        }
      }
    }
  ];

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
          {this.props.type !== "view" ? (
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="button"
              onClick={this.handleUpdate.bind(this)}
            >
              <span>SAVE</span>
            </button>
          ) : null}
          <button
            style={{ marginLeft: "15px" }}
            className="btn btn-blue"
            type="button"
            onClick={this.props.onClickClose}
          >
            <span>CLOSE</span>
          </button>
        </div>
      </div>
    </div>
  );

  render() {
    let { payloadOrg, selectedIndexJob, rawData } = this.state

    return (
      <div className="vertical-tab-content active">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <form action="#">
          <div className="border-bottom padding-10px grid-mobile-none gap-20px">
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      OUID Parent
                    </span>
                  </div>
                  <select
                    className="cf-select slc slc-sekunder"
                    required
                    disabled={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    onChange={(e) => this.setState({
                      payloadOrg: {
                        ...payloadOrg,
                        ouparentID: e.target.value
                      }
                    })}
                    value={payloadOrg.ouparentID}
                  >
                    <option value="">-- please select ouid parent --</option>
                    <option value="OU-001">OU-001</option>
                    <option value="OU-002">OU-002</option>
                  </select>
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      OUID
                    </span>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    value={payloadOrg.ouid}
                    onChange={(e) => this.setState({
                      payloadOrg: {
                        ...payloadOrg,
                        ouid: e.target.value
                      }
                    })}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      OU Name
                    </span>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    value={payloadOrg.ouname}
                    onChange={(e) => this.setState({
                      payloadOrg: {
                        ...payloadOrg,
                        ouname: e.target.value
                      }
                    })}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      OU Level
                    </span>
                  </div>
                  <input
                    value={rawData.oulevel}
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                {/* JobDesc */}
                <div className="col-1 content-right">
                  {this.props.type !== 'view' ?
                    <button
                      type="button"
                      className="btn btn-circle background-blue"
                      style={{ marginRight: 5 }}
                      onClick={this.openCloseCreateJobDesc.bind(this)}
                    >
                      <i className="fa fa-1x fa-plus" />
                    </button>
                    : null }
                </div>

                <div className="padding-5px">
                  <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                      data={this.state.dataTableJob}
                      columns={this.columnsJobDesc}
                      options={options}
                    />
                  </MuiThemeProvider>
                </div>

                {/* Grade */}
                <div className="col-1 content-right">
                  {this.props.type !== 'view' ?
                    <button
                      type="button"
                      className="btn btn-circle background-blue"
                      style={{ marginRight: 5 }}
                      onClick={this.openCloseCreateGrade.bind(this)}
                    >
                      <i className="fa fa-1x fa-plus" />
                    </button>
                    : null }
                </div>

                <div className="padding-5px">
                  <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                      data={this.state.dataTableGrade}
                      columns={this.columnsGrade}
                      options={options}
                    />
                  </MuiThemeProvider>
                </div>
              </div>

              <div className="column-2" style={{imageOrientation:'landscape'}}>
                <div>
                  <img src={logo} alt=""></img>
                </div>
              </div>
            </div>
          </div>

          {this.state.createJobDescVisible && (
            <FormJobDetail
              type={"create"}
              onClickClose={this.openCloseCreateJobDesc.bind(this)}
              onClickSave={value => this.handleSubmit(value, "job")}
            />
          )}

          {this.state.createGradeVisible && (
            <FormGradeDetail
              type={"create"}
              onClickClose={this.openCloseCreateGrade.bind(this)}
              onClickSave={value => this.handleSubmit(value, "grade")}
            />
          )}
          {this.state.createPopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={
                () => {
                  this.setState({
                    createGradeVisible: false,
                    createJobDescVisible: false,
                    createPopUpVisible: false
                  })
                }
              }
            />
          )}

          {this.state.deletePopUpVisible && (
            <PopUp
              type={"delete"}
              class={"app-popup app-popup-show"}
              onClick={!R.isNil(selectedIndexJob) ? () => this.openDeletePopup("deleteJob") : () => this.openDeletePopup("deleteGrade")}
              onClickDelete={value => !R.isNil(selectedIndexJob) ? this.handleSubmit(value, "deleteJob") : this.handleSubmit(value, "deleteGrade")}
            />
          )}
          {this.renderFooter()}
        </form>
      </div>
    );
  }
}

export default (FormCompany);