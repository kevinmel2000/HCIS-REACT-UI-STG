import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
// import FormAddressMD from './formAddressMD';
import PopUp from '../../../components/pages/PopUpAlert'
import FormOutsourceAddressDetail from "./formOutsourceAddressDetail"

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormOutsourceAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      typeAddress: "create",
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      deletePopUpVisible: false,
      createFromAddressVisible: false,
      dataTableAddress: [],
      rawDataAddress: [],
      bizparAddressType: [],
      bizparNationality: [],
      countryStatus: [],
      provinceStatus: []
    }
  }


  openCreateAddressForm(type, selectedIndex = null) {
    let { createVisible, editVisible, viewVisible, openDeletePopup } = this.state
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    switch (type) {
      case "create":
        this.setState({ createVisible: !createVisible, createPopUpVisible })
        break;
      case "edit":
        this.setState({ editVisible: !editVisible, createPopUpVisible, selectedIndex })
        break;
      case "view":
        this.setState({ viewVisible: !viewVisible, selectedIndex })
        break;
      case "delete":
        this.setState({ openDeletePopup: !openDeletePopup, selectedIndex })
        break;
      default:
        break;
    }
  }

  openSavePopUp = () => {
    if ((this.state.saveClass === "app-popup app-popup-show" && this.state.formApplicantDetailVisible) || (this.state.saveClass === "app-popup app-popup-show" && this.state.createClass === "app-popup app-popup-show")) {
      this.setState({
        dataTableAddress: [],
        saveClass: "app-popup",
        createClass: 'app-popup',
      });
    } else {
      this.setState({ saveClass: "app-popup app-popup-show" });
    }
  };

  openDeletePopup = (selectedIndex) => {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columnsAddress = [
    "Address Number",
    "Type",
    "Address",
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
                  onClick={() => this.openCreateAddressForm("edit", tableMeta.rowIndex)}
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
                  onClick={() => this.openCreateAddressForm('view', tableMeta.rowIndex)}>
                  <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div> :
              <button
                type="button"
                className="btnAct"
                onClick={() => this.openCreateAddressForm('view', tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
          )
        }
      }
    }
  ]

  data = [
    ["ADD-001", "DOMISILI", "JLN. MERDEKA"],
    ["ADD-002", "KTP", "JLN. RIAU"]
  ]

  render() {
    let { selectedIndex } = this.state
    return (
      <div className="vertical-tab-content active" id="content-nav-3">
        <form action="#">
          <div className="border-bottom padding-10px  grid-mobile-none gap-20px">
            <div className="col-1 content-right margin-bottom-10px">
              {this.props.type !== 'view' ?
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={() => this.openCreateAddressForm("create")}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title='Address'
                subtitle={"lorem ipsum dolor"}
                data={this.data}
                columns={this.columnsAddress}
                options={options}
              />
            </MuiThemeProvider>
          </div>

          {this.state.createVisible && (
            <FormOutsourceAddressDetail
              type={"create"}
              bizparAddressType={this.state.bizparAddressType}
              bizparNationality={this.state.bizparNationality}
              countryStatus={this.state.countryStatus}
              provinceStatus={this.state.provinceStatus}
              onClickSave={(value) => this.setState({ createPopUpVisible: !this.state.createPopUpVisible })}
              onClickClose={() => this.openCreateAddressForm("create")}
            />
          )}
          {this.state.editVisible && (
            <FormOutsourceAddressDetail
              type={"update"}
              bizparAddressType={this.state.bizparAddressType}
              bizparNationality={this.state.bizparNationality}
              countryStatus={this.state.countryStatus}
              provinceStatus={this.state.provinceStatus}
              kabKot={this.state.kabKot}
              kec={this.state.kec}
              kel={this.state.kel}
              dataAddress={this.state.rawDataAddress[selectedIndex]}
              onClickSave={(value) => this.setState({ createPopUpVisible: !this.state.createPopUpVisible })}
              onClickClose={() => this.openCreateAddressForm("edit")} />
          )}
          {this.state.viewVisible && (
            <FormOutsourceAddressDetail
              type={"view"}
              bizparAddressType={this.state.bizparAddressType}
              bizparNationality={this.state.bizparNationality}
              countryStatus={this.state.countryStatus}
              provinceStatus={this.state.provinceStatus}
              kabKot={this.state.kabKot}
              kec={this.state.kec}
              kel={this.state.kel}
              dataAddress={this.state.rawDataAddress[selectedIndex]}
              onClickClose={() => this.openCreateAddressForm("view")}
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
            <PopUp type={'delete'} class={"app-popup app-popup-show"}
              onClick={this.openDeletePopup.bind(this)}
              onClickDelete={this.openDeletePopup.bind(this)} />
          )}
        </form>
      </div>
    );
  }
}

export default FormOutsourceAddress