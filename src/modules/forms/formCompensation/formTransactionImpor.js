import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import FormTransactionImporUpload from './formTransactionImporUpload'
import FormTransactionImporDetail from './formTransactionImporDetail'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormTransactionImpor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formUploadVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false,
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
        "No",
        "Date",
        "Component Name",
        "Period",
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
        "Request By",
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
        ["1", "20/03/2019 00:45:46", "Allocation Allowance", "201906", "7", "", "Lilyana Tan 10000018"],
        ["2", "27/02/2019 10:42:00", "Basic Salary", "201902", "1", "", "Lilyana Tan 10000018"],
    ]

    render() {
        let { downloadVisible, formUploadVisible, formDetailVisible, savePopUpVisible, deletePopUpVisible } = this.state
        return (
            <div>
                <div className="padding-5px grid grid-2x">
                    <div className="col-1"></div>
                    <div className="col-2 content-right">
                        <button type="button" className="btn btn-circle background-blue margin-right-5px">
                            <i className='fa fa-1x fa-download'></i>
                        </button>
                        <button type="button" className="btn btn-circle background-blue margin-right-5px" onClick={this.openUploadForm}>
                            <i className='fa fa-1x fa-upload'></i>
                        </button>
                    </div>
                </div>
                <div className="border-bottom padding-10px grid-mobile-none gap-20px">
                  <div className="padding-5px" />
                  <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                      title='Impor'
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
                    <FormTransactionImporUpload
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openUploadForm.bind(this)}
                    />
                )}

                {formDetailVisible && (
                    <FormTransactionImporDetail 
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

export default FormTransactionImpor