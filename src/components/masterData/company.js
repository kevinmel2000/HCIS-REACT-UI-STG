import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormCompanyGeneral from "../../modules/forms/formMasterData/formComGeneral";
import FormCompanyAddress from "../../modules/forms/formMasterData/formCompanyAdd";
import FormCompanyDoc from "../../modules/forms/formMasterData/formCompanyDoc";
import FormCompanyOrg from "../../modules/forms/formMasterData/formCompanyOrg"
import PopUp from "../pages/PopUpAlert";
import * as R from 'ramda';
import MasterDataAction from '../../Redux/MasterdataRedux'
import { connect } from 'react-redux';
import API from '../../Services/Api'

var ct = require("../../modules/custom/customTable");

const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Company extends Component {
  constructor() {
    super();
    this.state = {
      saveClass: "app-popup",
      deleteClass: "app-popup",
      fetching: false,
      refreshing: false,
      dataTable: [],
      rawData: [],

      formCompanyDetailCreateVisible: false,
      formCompanyDetailEditVisible: false,
      formCompanyDetailViewVisible: false,
      formCompanyAddressVisible: false,
      formCompanyGeneralVisible: false,
      formCompanyDocVisible: false,
      formCompanyOrgVisible: false,
      activeTab: "",
      tabMenu: ["General", "Address", "Document", "Organization Structure"],
      tabMenuC: ["General"]
    };
    this.handleDelete = this.handleDelete.bind(this)
  }

  openCompanyDetailCreate = index => {
    let { formCompanyDetailCreateVisible } = this.state;
    this.setState({
      formCompanyDetailCreateVisible: !formCompanyDetailCreateVisible,
      selectedIndex: !formCompanyDetailCreateVisible ? index : null,
      activeTab: !formCompanyDetailCreateVisible ? "General" : "",
      formCompanyGeneralVisible: !formCompanyDetailCreateVisible ? true : false,
    });
  };

  openCompanyDetailEdit = index => {
    let { formCompanyDetailEditVisible } = this.state;
    this.setState({
      formCompanyDetailEditVisible: !formCompanyDetailEditVisible,
      selectedIndex: !formCompanyDetailEditVisible ? index : null,
      activeTab: !formCompanyDetailEditVisible ? "General" : "",
      formCompanyGeneralVisible: !formCompanyDetailEditVisible ? true : false,
      formCompanyAddressVisible: false,
      formCompanyDocVisible: false,
      formCompanyOrgVisible: false
    });
  };

  openCompanyDetailView = index => {
    let { formCompanyDetailViewVisible } = this.state;
    this.setState({
      formCompanyDetailViewVisible: !formCompanyDetailViewVisible,
      selectedIndex: !formCompanyDetailViewVisible ? index : null,
      activeTab: !formCompanyDetailViewVisible ? "General" : "",
      formCompanyGeneralVisible: !formCompanyDetailViewVisible ? true : false,
      formCompanyAddressVisible: false,
      formCompanyDocVisible: false,
      formCompanyOrgVisible: false
    });
  };

  openSavePopUp = () => {
    if ((this.state.saveClass === "app-popup app-popup-show" && this.state.formCompanyDetailCreateVisible) || (this.state.saveClass === "app-popup app-popup-show" && this.state.formCompanyDetailEditVisible)) {
      this.setState({
        dataTable: [],
        saveClass: "app-popup",
        formCompanyDetailCreateVisible: false,
        formCompanyDetailEditVisible: false,
        formCompanyGeneralVisible: false,
      });
      this.props.getCompany({
        "offset": 0,
        "limit": 100
      });
    } else {
      this.setState({ saveClass: "app-popup app-popup-show" });
    }
  };

  openDeletePopup = (index) => {
    if (this.state.deleteClass === "app-popup app-popup-show") {
      this.setState({ deleteClass: "app-popup", selectedIndex: null });
    } else {
      this.setState({ deleteClass: "app-popup app-popup-show", selectedIndex: index });
    }
  };

  async handleSubmit(payload) {
    console.log(JSON.stringify(payload))
    API.create('ES').postCompGeneral(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data)
            this.openSavePopUp()
          } else {
            console.log(res);
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  async handleUpdate(payloadOrg) {
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
    console.log('update =>', JSON.stringify(payloadOrg))
    API.create('ES').updateCompGeneral(payloadOrg).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data)
            this.openSavePopUp()
          } else {
            console.log(res);
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  deleteCompany() {
    let payload = {
      referenceID: this.state.rawData[this.state.selectedIndex].esid
    }
    API.create('ES').deleteCompany(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data)
            this.setState({ deleteClass: 'app-popup', dataTable: [] })
            this.props.getCompany({
              "offset": 0,
              "limit": 100
            });
          } else {
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  handleDelete() {
    this.deleteCompany();
  }
  componentDidMount() {
    this.startFetch();
    this.props.getCompany({
      "offset": 0,
      "limit": 100
    });
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.masterdata.fetching && !R.isNil(newProps.masterdata.company)) {
      this.onFinishFetch()
      let dataTable = newProps.masterdata.company.map((value, index) => {
        if (value === null) {
          return []
        } else {
          const { esid, esname, esemail, orgStructureTPL } = value;
          return [
            esid,
            esname,
            esemail,
            orgStructureTPL.orgStructureTPLStatus
          ]
        }
      })

      this.setState({
        rawData: newProps.masterdata.company,
        dataTable
      })
    } else {
      this.onFinishFetch()
    }

    this.setState({
      fetching: newProps.masterdata.fetching,
      refreshing: newProps.masterdata.fetching
    });
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };



  columns = [
    {
      name: "Company ID",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.openCompanyDetailView(tableMeta.rowIndex)}
              >
                {val}
              </div>
            </div>
          );
        }
      }
    },
    "Company Name",
    "Email",
    {
      name: "Company Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
              {val === "ACTIVE" ? (
                <div>
                  <i
                    className="fa fa-lw fa-circle"
                    style={{ color: "green", marginRight: 10 }}
                  />
                  {val}
                </div>
              ) : (
                  <div>
                    <i
                      className="fa fa-lw fa-circle"
                      style={{ color: "red", marginRight: 10 }}
                    />
                    {val}
                  </div>
                )}
            </div>
          );
        }
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() =>
                  this.openCompanyDetailEdit(tableMeta.rowIndex)
                }
              >
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  // important
  // vertical tab function
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
      formCompanyGeneralVisible: false,
      formCompanyAddressVisible: false,
      formCompanyDocVisible: false,
      formCompanyOrgVisible: false,
      activeTab: title
    };

    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formCompanyGeneralVisible: true
        };
        break;
      case "Address":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formCompanyAddressVisible: true
        };
        break;
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formCompanyDocVisible: true
        };
        break;
      case "Organization Structure":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formCompanyOrgVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  render() {
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-15px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              Company
            </div>
          </div>
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              style={{ marginRight: 5 }}
              onClick={() => this.openCompanyDetailCreate()}
            >
              <i className="fa fa-1x fa-plus" />
            </button>
          </div>
        </div>

        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={this.state.dataTable}
              columns={this.columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>


        {this.state.formCompanyDetailCreateVisible && (
          <div className={"app-popup app-popup-show"}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="padding-15px background-blue border-bottom grid grid-2x">
                <div className="col-1">
                  <div className="txt-site txt-12 txt-bold post-center">
                    Company - Create Form
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle background-blue"
                    onClick={this.openCompanyDetailCreate}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="popup-content-grid">
                <div className="popup-scroll popup-col-1">
                  <ul className="vertical-tab">
                    {this.state.tabMenuC.map((data, index) => {
                      return this.opNavigator(data);
                    })}
                  </ul>
                </div>

                <div className="popup-scroll popup-col-2">
                  {/* General */}
                  {this.state.formCompanyGeneralVisible && (
                    <FormCompanyGeneral
                      type={"create"}
                      onClickClose={this.openCompanyDetailCreate}
                      onClickSave={this.handleSubmit.bind(this)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="padding-bottom-20px" />
          </div>
        )}

        {this.state.formCompanyDetailEditVisible && (
          <div className={"app-popup app-popup-show"}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="padding-15px background-blue border-bottom grid grid-2x">
                <div className="col-1">
                  <div className="txt-site txt-12 txt-bold post-center">
                    Company - Edit Form
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle background-blue"
                    onClick={this.openCompanyDetailEdit}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="popup-content-grid">
                <div className="popup-scroll popup-col-1">
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => {
                      return this.opNavigator(data);
                    })}
                  </ul>
                </div>

                <div className="popup-scroll popup-col-2">
                  {/* General */}
                  {this.state.formCompanyGeneralVisible && (
                    <FormCompanyGeneral
                      type={"update"}
                      companyData={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={this.handleUpdate.bind(this)}
                      onClickClose={this.openCompanyDetailEdit}
                    />
                  )}

                  {/* ADDRESS */}
                  {this.state.formCompanyAddressVisible && (
                    <FormCompanyAddress
                      type={"update"}
                      companyData={this.state.rawData[this.state.selectedIndex]}
                    />
                  )}

                  {/* Company */}
                  {this.state.formCompanyDocVisible && (
                    <FormCompanyDoc
                      type={"update"}
                      companyData={this.state.rawData[this.state.selectedIndex]}
                      onClickClose={this.openCompanyDetailEdit}
                      onClickSave={() => {
                        this.setState({ dataTable: [] })
                        this.props.getCompany({
                          "offset": 0,
                          "limit": 100
                        });
                        this.openCompanyDetailEdit()
                      }}
                      onClickDelete={this.handleUpdate.bind(this)}
                    />
                  )}

                  {/* Oraganization Structure */}
                  {this.state.formCompanyOrgVisible && (
                    <FormCompanyOrg
                      type={"update"}
                      payloadOrg={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={this.handleUpdate.bind(this)}
                      onClickClose={this.openCompanyDetailEdit}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="padding-bottom-20px" />
          </div>
        )}

        {this.state.formCompanyDetailViewVisible && (
          <div className={"app-popup app-popup-show"}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="padding-15px background-blue border-bottom grid grid-2x">
                <div className="col-1">
                  <div className="txt-site txt-12 txt-bold post-center">
                    Company - View Form
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle background-blue"
                    onClick={this.openCompanyDetailView}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="popup-content-grid">
                <div className="popup-scroll popup-col-1">
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => {
                      return this.opNavigator(data);
                    })}
                  </ul>
                </div>

                <div className="popup-scroll popup-col-2">
                  {/* General */}
                  {this.state.formCompanyGeneralVisible && (
                    <FormCompanyGeneral
                      type={"view"}
                      companyData={this.state.rawData[this.state.selectedIndex]}
                      onClickClose={this.openCompanyDetailView}
                    />
                  )}

                  {/* ADDRESS */}
                  {this.state.formCompanyAddressVisible && (
                    <FormCompanyAddress
                      type={"view"}
                      companyData={this.state.rawData[this.state.selectedIndex]}
                    />
                  )}

                  {/* Company */}
                  {this.state.formCompanyDocVisible && (
                    <FormCompanyDoc
                      type={"view"}
                      companyData={this.state.rawData[this.state.selectedIndex]}
                      onClickClose={this.openCompanyDetailView}
                    />
                  )}

                  {/* Oraganization Structure */}
                  {this.state.formCompanyOrgVisible && (
                    <FormCompanyOrg
                      type={"view"}
                      payloadOrg={this.state.rawData[this.state.selectedIndex]}
                      onClickClose={this.openCompanyDetailView}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="padding-bottom-20px" />
          </div>
        )}

        <PopUp
          type={"save"}
          class={this.state.saveClass}
          onClick={this.openSavePopUp}
        />
        <PopUp
          type={"delete"}
          class={this.state.deleteClass}
          onClick={this.openDeletePopup}
          onClickDelete={this.handleDelete}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    masterdata: state.masterdata
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCompany: obj => dispatch(MasterDataAction.getCompany(obj))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Company);
