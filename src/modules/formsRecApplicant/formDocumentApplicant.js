import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../components/pages/PopUpAlert";
import FormDocument from "./formDocument";
import API from '../../Services/Api';
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class formDocumentApplicant extends Component {
  constructor(props) {
    super(props);
    let { applicantData, bizparDocument } = this.props;

    this.state = {
      applicantData,
      dataTableDocument: [],
      createVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      viewVisible: false,
      refreshing: false,
      fetching: false,
      bizparDocument,
      notifVisible: false,
      message: "",
      auth: props.auth,
      sendState: "",
      isWeb: false,
      defaultValue: []
    };
  }

  connectWebsocket = async (type) => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    console.log('/topic/applicant/put.applicant.document/' + employeeID)
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/applicant/put.applicant.document/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        if (type !== "delete") {
          setTimeout(() => {
            this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false, isWeb: false })
                this.props.onSelect({
                  message: res.messages,
                  formLanguageSkillVisible: false,
                  formApplicantDetailUpdateVisible: false,
                  formApplicantDataVisible: false
                })
                this.props.onFinishFetch()
              }, 500);
            })
          }, 500);
        } else {
          this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false })
          this.props.onSelect({
            message: res.messages,
            formDocumentVisible: false,
            formApplicantDetailUpdateVisible: false,
            formApplicantDataVisible: false
          })
        }
      })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  componentDidMount() {
    this.getAllDocument(this.state.applicantData);
  }

  componentWillReceiveProps(newProps) {
    let { applicantData } = newProps
    this.setState({ applicantData })
    this.getAllDocument(applicantData)
  }

  getAllDocument(applicantData) {
    let dataTableDocument = applicantData.applicantDocuments.map(value => {
      const {
        applicantDocumentID,
        documentType,
        documentNotes
      } = value;
      return [
        applicantDocumentID,
        documentType && documentType.bizparValue,
        documentNotes
      ];
    });
    this.setState({ dataTableDocument });
  }

  handleSubmit(value, type = "") {
    this.setState({ defaultValue: value, sendState: "loading" })
    // console.log('pay', JSON.stringify(value))
    let { applicantDocuments, applicantNumber } = this.state.applicantData
    let data = Object.assign([], applicantDocuments)
    data = data.map((value, index) => {
      return {
        ...value,
        documentType: value.documentType.bizparKey
      }
    })

    switch (type) {
      case "create":
        value = {
          ...value,
          applicantDocumentID: "D-" + M(),
          documentType: value.documentType.bizparKey
        }
        data.push(value)
        break;
      case "edit":
        value = {
          ...value,
          documentType: value.documentType.bizparKey
        }
        let status = R.findIndex(R.propEq('applicantDocumentID', value.applicantDocumentID))(data)
        if (status >= 0) {
          data[status] = value
        }
        break;
      case "delete":
        data.splice(this.state.selectedIndex, 1)
        break;
      default:
        break
    }

    applicantDocuments = data
    let payload = {
      applicantNumber,
      applicantDocuments,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    this.connectWebsocket(type)
    API.create('RECRUITMENT').updateApplicantDocument(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
            if (type !== "delete") this.setState({
              //createPopUpVisible: true 
            })
            else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.props.getApplicantName({
              "params": {
                applicantName: this.props.name
              },
              "offset": 0,
              "limit": this.props.limit
            })
            if (type === "delete") {
              //this.props.backToPage()
            }
          } else {
            alert("Failed: " + res.data.message)
          }
        }
      }
    )
  }

  openCloseCreate() {
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      createPopUpVisible
    });
  }

  openCloseEdit(selectedIndex) {
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({ editVisible: !this.state.editVisible, selectedIndex, createPopUpVisible });
  }

  openCloseView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  openDeletePopup(selectedIndex) {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  }

  async getDocument(selectedIndex) {
    let { applicantData } = this.state
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'recruitmentcmd/api/applicant.document.get/' + applicantData.applicantNumber + '/' + applicantData.applicantDocuments[selectedIndex].documentType.bizparKey, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      let a = document.createElement('a');
      a.href = response;
      a.download = applicantData.applicantDocuments[selectedIndex].documentURL;
      a.click()
      // window.open(response)
    } else {
      alert("Failed: Document Not Found")
    }
  }

  handleDelete() {
    this.deleteDocument();
  }

  //document
  columnsDocument = [
    "Document Number",
    "Type",
    "Information",
    {
      name: "Document",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
                onClick={() => this.getDocument(tableMeta.rowIndex)}
              >
                <i className="fa fa-1x fa-download" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
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
            this.props.type !== 'view' ?
              <div>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                >
                  <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openCloseView(tableMeta.rowIndex)}
                >
                  <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div> :
              <button
                type="button"
                className="btnAct"
                onClick={() => this.openCloseView(tableMeta.rowIndex)}
              >
                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
          );
        }
      }
    }
  ];

  render() {
    let { selectedIndex } = this.state;
    return (
      <div className="vertical-tab-content active" id="content-nav-3">
        <form action="#">
          <div className="padding-10px">
            <div className="col-1 content-right margin-bottom-10px">
              {this.props.type !== 'view' ?
                <button
                  onClick={this.openCloseCreate.bind(this)}
                  type="button"
                  className="btn btn-circle background-blue"
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title='Document'
                subtitle={'lorem ipsum dolor'}
                data={this.state.dataTableDocument}
                columns={this.columnsDocument}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </form>
        {this.state.notifVisible && (
          <WebsocketNotif message={this.state.message} timeout={5000} type={"float"}
            onClickClose={this.closeNotif.bind(this)} />
        )}
        {this.state.createVisible && (
          <FormDocument
            type={"create"}
            sendState={this.state.sendState}
            applicantData={this.state.applicantData}
            bizparDocument={this.state.bizparDocument}
            onClickSave={(value) => this.handleSubmit(value, "create")}
            onClickClose={this.openCloseCreate.bind(this)}
          />
        )}
        {this.state.editVisible && (
          <FormDocument
            type={"update"}
            sendState={this.state.sendState}
            onClickSave={(value) => this.handleSubmit(value, "edit")}
            onClickClose={this.openCloseEdit.bind(this)}
            bizparDocument={this.state.bizparDocument}
            applicantData={this.state.applicantData}
            applicantDataDocuments={this.state.applicantData.applicantDocuments[selectedIndex]}
          />
        )}
        {this.state.viewVisible && (
          <FormDocument
            type={"view"}
            // handleChange={this.handleChange.bind(this)}
            onClickClose={this.openCloseView.bind(this)}
            bizparDocument={this.state.bizparDocument}
            applicantData={this.state.applicantData}
            applicantDataDocuments={this.state.applicantData.applicantDocuments[selectedIndex]}
          />
        )}
        {this.state.createPopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => {
              this.setState({
                createVisible: false,
                editVisible: false,
                createPopUpVisible: false
              })
              //this.props.backToPage()
            }}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            onClickDelete={(value) => this.handleSubmit(value, "delete")}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    recruitment: state.recruitment,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getApplicant: obj => dispatch(RecruitmentAction.getApplicant(obj)),
    getApplicantName: obj => dispatch(RecruitmentAction.getApplicantName(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(formDocumentApplicant);
