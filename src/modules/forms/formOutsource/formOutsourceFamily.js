import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import FormOutsourceFamilyDetail from "./formOutsourceFamilyDetail"

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormOutsourceFamily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeFamily: "create",
      createVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      viewVisible: false,
      refreshing: false,
      fetching: false,
      rawData: [],
      bizparFamilyType: [],
      bizparFamilyRelational: [],
      bizparGender: [],
      bizparReligion: [],
      bizparEducationLevel: [],
      bizparNationality: []
    };
  }

  async saveDataFamily(payload, type = "") {
    this.setState({ createPopUpVisible: true, deletePopUpVisible: false })
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
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
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

  openCreateFormFamily = (typeFamily = "create") => {
    if (this.state.createClassFamily === "app-popup app-popup-show") {
      this.setState({ createClassFamily: "app-popup", typeFamily });
    } else {
      this.setState({
        createClassFamily: "app-popup app-popup-show",
        typeFamily
      });
    }
  };

  columnsFamily = [
    "Family Number",
    "Type",
    "Relationship",
    "Name",
    "NIK",
    "Date of Birth",
    "Gender",
    "Education",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== 'view' ?
              <div className='grid grid-3x'>
                <div className='column-1'>
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
                <div className='column-2'>
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button>
                </div>
                <div className='column-3'>
                  <button
                    type="button"
                    className="btnAct"
                    onClick={() => this.openCloseView(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
              </div> :
              <button
                type="button"
                className="btnAct"
                onClick={() => this.openCloseView(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
          );
        }
      }
    }
  ];

  data = [
      ["FAM-001", "KK", "KAKAK", "IRENE", "NIK-001", "03-03-1991", "FEMALE", "S1"]
  ]

  render() {
    return (
      <div className="vertical-tab-content active" id="content-nav-3">
        <form action="#">
          <div className="border-bottom padding-10px  grid-mobile-none gap-20px">
            <div className="col-1 content-right margin-bottom-10px">
              {this.props.type !== 'view' ?
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={this.openCloseCreate.bind(this)}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title='Family'
                subtitle={"lorem ipsum dolor"}
                data={this.data}
                columns={this.columnsFamily}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </form>
        {this.state.createVisible && (
          <FormOutsourceFamilyDetail
            type={"create"}
            applicantData={this.state.applicantData}
            onSave={() => this.setState({ createPopUpVisible: !this.state.createPopUpVisible })}
            bizparFamilyType={this.state.bizparFamilyType}
            bizparFamilyRelational={this.state.bizparFamilyRelational}
            bizparGender={this.state.bizparGender}
            bizparReligion={this.state.bizparReligion}
            bizparEducationLevel={this.state.bizparEducationLevel}
            bizparNationality={this.state.bizparNationality}
            label="Create Applicant Familiy"
            onClickClose={this.openCloseCreate.bind(this)}
          />
        )}
        {this.state.editVisible && (
          <FormOutsourceFamilyDetail
            type={"update"}
            label="Update Applicant Familiy"
            onSave={() => this.setState({ createPopUpVisible: !this.state.createPopUpVisible })}
            onClickClose={this.openCloseEdit.bind(this)}
            bizparFamilyType={this.state.bizparFamilyType}
            bizparFamilyRelational={this.state.bizparFamilyRelational}
            bizparGender={this.state.bizparGender}
            bizparReligion={this.state.bizparReligion}
            bizparEducationLevel={this.state.bizparEducationLevel}
            bizparNationality={this.state.bizparNationality}
            applicantData={this.state.applicantData}
          />
        )}
        {this.state.viewVisible && (
          <FormOutsourceFamilyDetail
            type={"view"}
            onClickClose={this.openCloseView.bind(this)}
            bizparFamilyType={this.state.bizparFamilyType}
            bizparFamilyRelational={this.state.bizparFamilyRelational}
            bizparGender={this.state.bizparGender}
            bizparReligion={this.state.bizparReligion}
            bizparEducationLevel={this.state.bizparEducationLevel}
            bizparNationality={this.state.bizparNationality}
            applicantData={this.state.applicantData}
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
            }}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            onClickDelete={this.openDeletePopup.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default FormOutsourceFamily
