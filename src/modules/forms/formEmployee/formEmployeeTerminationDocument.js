import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import Api from "../../../Services/Api"
import * as R from 'ramda'
import M from 'moment'
import FileViewer from 'react-file-viewer'
import { connect } from 'react-redux'
// import { FilePond, registerPlugin } from 'react-filepond'
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import UploadFile from '../../upload/upload'
import Stomp from 'stompjs'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'
import { Rabbit as Button } from 'react-button-loaders'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions4()

// registerPlugin(FilePondPluginImagePreview)

class formEmployeeTerminationDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.rawData,
            buttonVisible: false,
            viewVisible: false,
            editVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            formFileVisible: false,
            fileUrl: "",
            fileType: "",
            auth: props.auth,
            notifVisible:false,
            message:''
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.rawData !== prevProps.rawData) {
            this.onFinishFetch();
            this.getDocument(this.props.rawData)
            this.setState({
                data: this.props.rawData
            })
        }
    }

    componentDidMount() {
        this.onFinishFetch();
        this.getDocument(this.state.data)
    }

    connectWebsocket = async () => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
          console.log('Connected: ' + frame)
          stompClient.subscribe('/topic/termination/post.termination.document/' + employeeID, (message) => {
            let res = JSON.parse(message.body)
            console.log('messages: ' + res.messages)
            this.setState({ notifVisible: true, message: res.messages})
            setTimeout(() => {
              this.setState({
                notifVisible:false
              })
            }, 2000);
          })
        })
      }
    
    closeNotif() {
        this.setState({ notifVisible: false })
    }

    getDocument(data) {
        let documents = []
        documents.push([
            data.terminationDocumentURL.split("document/tmn_doc/")
        ])
        this.setState({
            documents
        })
    }

    deleteDocument() {
        let documents = []
        documents = []
        this.setState({
            documents,
            data: {
                ...this.state.data,
                terminationDocumentURL: ''
            },
        })
        this.openDeletePopup()
    }

    async uploadDocument(formData) {
        this.connectWebsocket()
        if (!R.isNil(this.state.url) || !R.isEmpty(this.state.url)) {
            this.setState({ uploadStatus: 'upload' })
            if ((this.state.url.type === "application/pdf") || (this.state.url.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                let response = await Api.create("TERMINATION").uploadTerminationDoc(formData, {
                    onUploadProgress: (progress) => {
                        if (progress.lengthComputable) {
                            if (progress.total >= 1000000) {
                                this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
                            } else {
                                var percentCompleted = Math.round((progress.loaded * 100) / progress.total)
                                this.setState({ percentage: percentCompleted })
                                if (progress.loaded === progress.total) {
                                    this.setState({ result: 'success'})
                                }
                            }
                        }
                    }
                });
                if (!response.ok && response.status === 413) {
                    alert("Your Document Too Large, Please Select Another Document")
                    this.setState({ result: 'error', percentage: '0' })
                }
                if (!response.ok && response.status === 500) {
                    alert("Please Select Document")
                    this.setState({ result: 'error' })
                }
                if (!response.ok && R.isNil(response.status)) {
                    alert(response.problem)
                    this.setState({ result: 'error' })
                }

                if (!R.isNil(response.data)) {
                    switch (response.data.status) {
                        case "S":
                            if (response.data.code === "201") {
                                this.setState({
                                    // data: {
                                    //     ...this.state.data,
                                    //     terminationDocumentURL: '/home/' + this.state.url.name
                                    // },
                                    result: 'success'
                                })
                                // this.openSavePopUp()
                                this.props.getData()
                                this.getDocument(this.props.rawData)
                            }
                            else alert("Failed: " + response.data.message);
                            break;
                        default:
                            break;
                    }
                }
            } else {
                alert("Unsupported File Type")
            }
        }
    }

    async getFile() {
        let { data } = this.state
        let terminationID = data.terminationID
        let length = data.terminationDocumentURL.split(".").length
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + "tmncmd/api/termination.document.get/" + terminationID, {
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
                "Content-Type": "application/pdf"
            }
        })
        response = await response.blob()
        if (response.size > 0) {
            response = URL.createObjectURL(response);
            this.setState({
                fileUrl: response,
                fileType: data.terminationDocumentURL.split(".")[length - 1],
                formFileVisible: !this.state.formFileVisible
            });
        } else {
            alert("Failed: Document Not Found")
        }
    }

    handleFile(event) {
        let { data } = this.state;
        var url = event;
        var number = data.terminationID;

        const formData = new FormData();
        formData.append("terminationID", number);
        formData.append("file", url);
        formData.append("updatedBy",this.props.auth.user.employeeID)
        formData.append("updatedDate",M().format("DD-MM-YYYY HH:mm:ss"))

        this.setState({ formData, url });
    }


    // handleChange(event) {
    //     let { data } = this.state;
    //     var url = event.target.files[0];
    //     var number = data.terminationID;

    //     const formData = new FormData();
    //     formData.append("terminationID", number);
    //     formData.append("file", url);

    //     this.setState({ formData, url });

    //     console.log('old file', this.state.url)
    // }

    startFetch = () => {
        this.LoadingBar.continousStart();
    }

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    }

    openView(selectedIndex) {
        this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
    }

    openFile() {
        this.setState({ formFileVisible: !this.state.formFileVisible });
    }

    handleDelete = () => {
        this.setState({ deletePopUpVisible: false })
    }
    openDeletePopup = (index) => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
    };
    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible, result: null })
    };

    //document
    columnsDocument = [
        {
            name: "Document",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <i className="fas fa-lw fa-file" /> {val}
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
                                type="button"
                                className="btnAct"
                                style={{ marginRight: 15 }}
                                onClick={() => this.getFile()}
                            >
                                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            {this.props.type !== "view" ?
                                <button
                                    type="button"
                                    className="btnAct"
                                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                </button>
                                : null}

                        </div>

                    );
                }
            }
        }
    ]

    dataDocument = []

    renderFile = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Document Viewer
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.openFile.bind(this)}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        {
                            this.state.fileType === 'jpg' ||
                                this.state.fileType === 'png' ||
                                this.state.fileType === 'jpeg' ?
                                (
                                    <img src={this.state.fileUrl} width={'50%'} alt="" />
                                ) : (
                                    <FileViewer
                                        fileType={this.state.fileType}
                                        filePath={this.state.fileUrl} />
                                )}
                    </div>
                    <div className="padding-15px background-grey">
                        <div className="grid margin-top-15px">
                            <div className="content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.openFile.bind(this)}
                                >
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="margin-bottom-20px"></div>
            </div>
        )
    }


    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="padding-15px grid">
                        <div className="padding-5px" />
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                data={this.state.data.terminationDocumentURL === "" ? this.dataDocument : this.state.documents}
                                columns={this.columnsDocument}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {this.props.type !== "view" ?
                        <div className="padding-15px">
                            <div className="padding-5px">
                                <span className="txt-site txt-11 txt-main txt-bold">
                                    <h4>File <span style={{ color: "red" }}>*format file (docx & pdf)</span></h4>
                                </span>
                            </div>

                            <UploadFile
                                type={this.state.uploadStatus}
                                percentage={this.state.percentage}
                                result={this.state.result}
                                acceptedFiles={['pdf', 'docx']}
                                onHandle={(dt) => {
                                    this.handleFile(dt)
                                    this.setState({ uploadStatus: 'idle', percentage: '0' })
                                }}
                                onUpload={() => {
                                    this.uploadDocument(this.state.formData)
                                }} />

                            {/* <FilePond
                                allowMultiple={false}
                                onupdatefiles={
                                    fileItems => {
                                        // this.handleFile(fileItems)
                                        let file = fileItems.map(fileItem => fileItem.file)
                                        this.handleFile(file[0])
                                        if (file[0]) {
                                            this.setState({
                                                buttonVisible: true
                                            })
                                        } else {
                                            this.setState({
                                                buttonVisible: false
                                            })
                                        }
                                    }
                                }
                                onremovefile={
                                    () => {
                                        this.setState({
                                            buttonVisible: false
                                        })
                                    }
                                } />

                       
                            {this.state.buttonVisible
                                ? <button
                                    type="button"
                                    className="btn btn-blue btn-width-all margin-top-5px"
                                    onClick={() => this.uploadDocument(this.state.formData)}>
                                    Upload File
                              </button>
                                : null} */}

                        </div>
                        : null}
                    <div className="padding-15px">
                        <div className="grid">
                            {/* <div className="col-1" /> */}
                            <div className="col-2 content-right">
                                {this.props.type !== "view" ?
                                <Button
                                type='button'
                                state={this.props.sendState}
                                style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 70 }}
                                className="btn btn-blue"
                                onClick={() => {
                                    let payload = this.state.data
                                    if (R.isEmpty(payload.terminationDocumentURL) || R.isNil(payload.terminationDocumentURL)) return alert('Please Upload Document.')
                                    payload = {
                                        terminationID: payload.terminationID,
                                        terminationDocumentNumber: payload.terminationDocumentNumber,
                                        terminationSPKNumber: !R.isNil(payload.terminationSPKNumber) ? payload.terminationSPKNumber : "",
                                        terminationSPKDate: payload.terminationSPKDate,
                                        terminationDocumentDate: payload.terminationDocumentDate,
                                        terminationRequestDate: payload.terminationRequestDate,
                                        terminationEffectiveDate: payload.terminationEffectiveDate,
                                        terminationPPHEndDate: payload.terminationPPHEndDate,
                                        terminationNotes: payload.terminationNotes,
                                        terminationDocumentURL: payload.terminationDocumentURL,
                                        terminationStatus: payload.terminationStatus,
                                        employeeID: !R.isNil(payload.employee.employeeID) ? payload.employee.employeeID : "",
                                        requestBy: payload.requestBy.employeeID,
                                        terminationType: payload.terminationType.bizparKey,
                                        terminationCategory: payload.terminationCategory.bizparKey,
                                        terminationReason: payload.terminationReason.bizparKey,
                                        updatedBy: "SYSTEM",
                                        updatedDate: M().format("DD-MM-YYYY HH:mm:ss")
                                    };
                                    this.props.onClickSave(payload)
                                }}>
                                    <span>SAVE</span>
                                </Button>
                                    // <button
                                    //     style={{ marginLeft: "15px" }}
                                    //     className="btn btn-blue"
                                    //     type="button"
                                    //     onClick={() => {
                                    //         let payload = this.state.data
                                    //         if (R.isEmpty(payload.terminationDocumentURL) || R.isNil(payload.terminationDocumentURL)) return alert('Please Upload Document.')
                                    //         payload = {
                                    //             terminationID: payload.terminationID,
                                    //             terminationDocumentNumber: payload.terminationDocumentNumber,
                                    //             terminationSPKNumber: !R.isNil(payload.terminationSPKNumber) ? payload.terminationSPKNumber : "",
                                    //             terminationSPKDate: payload.terminationSPKDate,
                                    //             terminationDocumentDate: payload.terminationDocumentDate,
                                    //             terminationRequestDate: payload.terminationRequestDate,
                                    //             terminationEffectiveDate: payload.terminationEffectiveDate,
                                    //             terminationPPHEndDate: payload.terminationPPHEndDate,
                                    //             terminationNotes: payload.terminationNotes,
                                    //             terminationDocumentURL: payload.terminationDocumentURL,
                                    //             terminationStatus: payload.terminationStatus,
                                    //             employeeID: !R.isNil(payload.employee.employeeID) ? payload.employee.employeeID : "",
                                    //             requestBy: payload.requestBy.employeeID,
                                    //             terminationType: payload.terminationType.bizparKey,
                                    //             terminationCategory: payload.terminationCategory.bizparKey,
                                    //             terminationReason: payload.terminationReason.bizparKey,
                                    //             updatedBy: "SYSTEM",
                                    //             updatedDate: M().format("DD-MM-YYYY HH:mm:ss")
                                    //         };
                                    //         this.props.onClickSave(payload)
                                    //     }}
                                    // >
                                    //     <span>SAVE</span>
                                    // </button>
                                    : null}
                                {this.props.type === "update" ? (
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={() => {
                                            let payload = this.state.data
                                            if (R.isEmpty(payload.terminationDocumentURL) || R.isNil(payload.terminationDocumentURL)) return alert('Please Upload Document.')
                                            payload = {
                                                "taskID": "",
                                                "senderUserID": this.state.auth.user.userID,
                                                "senderEmpID": this.state.auth.user.employeeID,
                                                "senderNotes": "",
                                                "senderBPMStatus": "INITIATE",
                                                "data": {
                                                    terminationID: payload.terminationID,
                                                    terminationDocumentNumber: payload.terminationDocumentNumber,
                                                    terminationSPKNumber: !R.isNil(payload.terminationSPKNumber) ? payload.terminationSPKNumber : "",
                                                    terminationSPKDate: payload.terminationSPKDate,
                                                    terminationDocumentDate: payload.terminationDocumentDate,
                                                    terminationRequestDate: payload.terminationRequestDate,
                                                    terminationEffectiveDate: payload.terminationEffectiveDate,
                                                    terminationPPHEndDate: payload.terminationPPHEndDate,
                                                    terminationNotes: payload.terminationNotes,
                                                    terminationStatus: payload.terminationStatus,
                                                    terminationDocumentURL: payload.terminationDocumentURL,
                                                    employeeID: payload.employee.employeeID,
                                                    requestBy: payload.requestBy.employeeID,
                                                    terminationType: payload.terminationType.bizparKey,
                                                    terminationCategory: payload.terminationCategory.bizparKey,
                                                    terminationReason: payload.terminationReason.bizparKey,
                                                    "createdBy": "SYSTEM",
                                                    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                                                    "updatedBy": null,
                                                    "updatedDate": null
                                                }
                                            }
                                            // return console.log(JSON.stringify(payload))
                                            this.props.onSubmit(payload)
                                        }}
                                    >
                                        <span>SAVE & SUBMIT</span>
                                    </button>
                                ) : null}

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
                    {/* {this.renderFooter()} */}
                </form>
                {/* {this.renderFooter()} */}
                {this.state.notifVisible && (<WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)}/>)}

                {this.state.formFileVisible && this.renderFile()}

                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openSavePopUp}
                    />
                )}
                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClickDelete={this.deleteDocument.bind(this)}
                        onClick={this.openDeletePopup.bind(this)}
                    />
                )}
            </div>
        );
    }
}

// export default formEmployeeTerminationDocument;
const mapStateToProps = state => {
    return {
        auth: state.auth,
    };
};

export default connect(mapStateToProps)(formEmployeeTerminationDocument)


