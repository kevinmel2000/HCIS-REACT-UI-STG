import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../pages/PopUpAlert';
import SalaryChangeUpload from '../../modules/forms/formCompensation/formSalaryChangeUpload';
import FormSalaryChange from '../../modules/forms/formCompensation/formSalaryChange';

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class SalaryChange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deletePopUpVisible: false,
            savePopUpVisible: false,
            formUploadVisible: false,
            downloadVisible: false
        }
    }

    openPrint = () => {
        this.setState({ downloadVisible: !this.state.downloadVisible })
       };

    openUploadForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ formUploadVisible: !this.state.formUploadVisible, savePopUpVisible })
    }

    openDetailForm = () => {
        this.setState({ formDetailVisible: !this.state.formDetailVisible })
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    openDeletePopUp = () => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }

    columns = [
        "Import ID",
        "Request By",
        "Change Type",
        "Amount of Data",
        {
            name: "Data FIle",
            options: {
              customBodyRender: (val, tableMeta) => {
                return (
                        <div>
                            <button
                                type="button"
                                className="btn btn-small-circle"
                                style={{ marginRight: 5 }}
                                onClick={this.openPrint}
                            >
                                <i className="fa fa-lw fa-print" />
                            </button>
                        </div>
                      )
                }
            }         
          },
        "Information",
        {
            name: "Document Status",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <label
                                style={{
                                    backgroundColor: val !== "Approved" ? "orange" : "brown",
                                    color: "white",
                                    padding: "5px",
                                    borderRadius: 4,
                                    fontSize: "14px",
                                    border: val !== "Approved" ? "4px orange" : "4px brown"
                                }}
                            >
                                {val}
                            </label>
                        </div>
                    )
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: () => {
                    return (
                        <div>
                            <button
                                className="btn btn-red btn-small-circle"
                                style={{ marginRight: 5 }}
                                onClick={() => this.openDetailForm()}>
                                <i className="fa fa-lw fa-pencil-alt" />
                            </button>
                            <button
                                className="btn btn-red btn-small-circle"
                                onClick={this.openDeletePopUp}>
                                <i className="fa fa-lw fa-trash-alt" />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    data = [
        ["27", "LILYANA TAN | 21/08/2019", "PROMOSI", "1", "", "ALLOCATION_ALLOWANCE", "Approved"],
        ["26", "LILYANA TAN", "UPDATE KE 0", "0", "", "BASIC_SALARY", "Reviewed"]
    ]

    render() {
        let { downloadVisible, deletePopUpVisible, savePopUpVisible, formUploadVisible, formDetailVisible } = this.state
        return (
            <div className="main-content">
                <div className="padding-15px grid grid-2x">
                    <div className="col-1">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                            {/* COMPENSATION - SALARY CHANGE */}
                        </div>
                    </div>
                    <div className="col-2 content-right">
                        <button
                            type="button"
                            className="btn btn-circle background-blue"
                            style={{ marginRight: 5 }}
                            onClick={this.openUploadForm}
                        >
                            <i className="fa fa-1x fa-upload" />
                        </button>
                    </div>
                </div>

                <div className="padding-5px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='Salary Change'
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>
                {downloadVisible &&
                <div className="app-popup app-popup-show">
                  <div className="popup-content-mikro background-white border-radius post-center">
                      <div className="padding-15px background-white border-bottom grid grid-2x">
                          <div className="col-1">
                              <div className="txt-site txt-12 txt-bold post-center">
                                  REPORT VIEWER
                              </div>
                          </div>

                      </div>
                      <div className="content-right padding-15px ">
                          <button
                              className="btn"
                          >
                              <i className="fa fa-lw fa-print" />
                          </button>
                      </div>
                      <div className="padding-15px background-grey">
                          <div className="grid margin-top-15px">
                              <div className="content-right">
                                  <button
                                      style={{ marginLeft: "15px" }}
                                      className="btn btn-red"
                                      type="button"
                                  >
                                      <span>SAVE PDF</span>
                                  </button>
                                  <button
                                      style={{ marginLeft: "15px" }}
                                      className="btn btn-blue"
                                      type="button"
                                      onClick={this.openPrint}
                                  >
                                      <span>CLOSE</span>
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
                </div> }

                {formUploadVisible && (
                    <SalaryChangeUpload 
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openUploadForm.bind(this)}
                    />
                )}

                {formDetailVisible && (
                    <FormSalaryChange 
                        onClickClose={this.openDetailForm.bind(this)}
                    />
                )}

                {savePopUpVisible && (
                    <PopUp 
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openUploadForm.bind(this)}
                    />
                )}

                {deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp.bind(this)}
                        onClickDelete={this.openDeletePopUp.bind(this)}
                    />
                )}

            </div>
        )
    }
}

export default SalaryChange