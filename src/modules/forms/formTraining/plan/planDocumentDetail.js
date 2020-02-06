import React, { Component } from "react";
// import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
// import MUIDataTable from "mui-datatables";
import PopUp from "../../../../components/pages/PopUpAlert";
import DropDown from '../../../../modules/popup/DropDown';

// var ct = require("../../modules/custom/customTable");
// const getMuiTheme = () => createMuiTheme(ct.customTable());
// const options = ct.customOptions();

class formDocumentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createPopUpVisible: false,
      deletePopUpVisible: false
    };
  }

  async uploadDocument(formData) {
    // let response = await Api.create('RECRUITMENT').updateApplicantFileDocument(formData)
    // if (!response.ok) alert(typeof response.data == "string" ? response.data : JSON.stringify(response.data))
    // console.log('upload', response.data)
    // switch(response.data.status) {
    //   case "S":
    //     if(response.data.code === "201")
    //       this.setState({
    //         applicantDataDocuments: {
    //         ...this.state.applicantDataDocuments,
    //         documentURL: '/home/'+this.state.url.name
    //       },
    //       createPopUpVisible: !this.state.createPopUpVisible
    //     })
    //   else alert("Failed: ", response.data.message)
    //     break;
    //   default:
    //     break;
    // }
  }

  handleChange(event) {
    // let {applicantData, applicantDataDocuments} = this.state
    // var url = event.target.files[0]
    // var number = applicantData.applicantNumber
    // var type = applicantDataDocuments.documentType.bizparKey
    // var doc = applicantDataDocuments.applicantDocumentID
    // var note = applicantDataDocuments.documentNotes
    // if (type === '') {
    //   alert('Document Type Is Empty')
    // } else {
    //   const formData = new FormData()
    //   formData.append('file', url)
    //   formData.append('applicantNumber', number)
    //   formData.append('documentType', type)
    //   formData.append('applicantDocumentID', doc)
    //   formData.append('documentNotes', note)
    //   this.setState({ formData, url })
    // }
  }

  removeChange(event) {
    this.setState({
      file: null
    });
  }

  openDeletePopup(selectedIndex) {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  }

  //   handleDelete() {
  //     this.setState({
  //       applicantDataDocuments: {
  //         ...this.state.applicantDataDocuments,
  //         documentURL: ""
  //       },
  //       deletePopUpVisible: false
  //     });
  //   }

  renderForm = () => (
    <div className="padding-15px border-bottom">
      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>Document Type <span style={{ color: "red" }}>*</span></h4>
          </div>
        </div>
        <DropDown
                  title="-- please select document type --"
                  onChange={(dt) => console.log(dt)}
                  // type="bizpar"
                  // disabled={this.props.type === "edit" ? true : false}
                  data={[
                    {id: '1', title: 'internal', value: 'internal'}, 
                    {id: '1', title: 'eksternal', value: 'eksternal'}]} />
      </div>

      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>Information</h4>
          </div>
        </div>
        <input
          type="text"
          className="txt txt-sekunder-color"
          placeholder=""
          required
        />
      </div>

      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>Document File</h4>
          </div>
        </div>
        <input type="file" onChange={this.handleChange.bind(this)} required />
        <button
          type="button"
          className="btn btn-blue"
          // onClick={() => this.uploadDocument(this.state.formData)}
          onClick={() => this.props.onClickSave()}
        >
          Upload
        </button>
      </div>
    </div>
  );

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="button"
              onClick={() => this.props.onClickSave()}
            >
              <span>SAVE</span>
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
  );

  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Training Plan - Document - Create Form
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#">
            {this.renderForm()}
            {this.renderFooter()}
          </form>
        </div>
        <div className="padding-bottom-20px" />

        {this.state.createPopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => {
              this.setState({
                createPopUpVisible: false
              });
            }}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            // onClickDelete={this.handleDelete.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default formDocumentDetail;
