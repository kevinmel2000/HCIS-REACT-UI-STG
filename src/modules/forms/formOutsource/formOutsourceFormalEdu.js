import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
// import FormFormalEdu from "../formsRecApplicant/formFormalEducation";
import PopUp from "../../../components/pages/PopUpAlert";
import FormOutsourceFormalEduDetail from "./formOutsourceFormalEduDetail";
import * as R from 'ramda'
import { getBizpar } from '../../../Services/Utils'

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormOutsourceFormalEdu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      dataTableFormalEdu: [],
      institute: [],
      bizparEduDegreePosition: [],
      bizparEduLevel: [],
      bizparEduDep: [],
      bizparEduDegree: [],
      bizparEduType: [],
      createVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      viewVisible: false,
      refreshing: false,
      fetching: false
    };
  }

  async updateFormalEdu(type, value) {
    let { data } = this.state
    let payload = Object.assign([], data.osFormalEducation)
    switch (type) {
      case 'create':
        payload.push(value)
        break;
      case 'update':
        let index = R.findIndex(R.propEq('eduID', value.eduID))(payload)
        if (index >= 0) {
          payload[index] = value
        }
        break;
      case 'delete':
        payload.splice(this.state.selectedIndex, 1)
        break;
      default: break;
    }
    data = { ...data, osFormalEducation: payload }
    this.props.onClickSave('formalEdu', data)
  }

  async getBizpar() {
    let bizparEduLevel = await getBizpar('EDUCATION_LEVEL')
    this.setState({ bizparEduLevel })
  }

  componentDidMount() {
    // this.getBizpar()
    let { osFormalEducation } = this.state.data
    if (!R.isEmpty(osFormalEducation)) {
      let dataTableFormalEdu = osFormalEducation.map((value, index) => {
        const { eduID, eduName, eduGPA, eduType } = value
        let type = eduType === 'UNIV' && 'Universitas'
        return [
          index += 1, eduID, type, eduName, eduGPA
        ]
      })
      this.setState({ dataTableFormalEdu, rawData: osFormalEducation })
    }
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
    this.setState({
      editVisible: !this.state.editVisible,
      createPopUpVisible,
      selectedIndex
    });
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

  columnsFormEdu = [
    "No",
    "Education ID",
    "Eucation Type",
    "Name",
    "GPK",
    {
      name: "Action",
      options: {
        customHeadRender: (columnMeta) => (
          <th key={columnMeta.index}
            style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "right", paddingRight: "20px", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
            {columnMeta.name}
          </th>
        ),
        customBodyRender: (val, tableMeta) => {
          return this.props.type !== "view" ? (
            <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
                onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
              >
                <i
                  className="fa fa-pencil-alt"
                  style={{
                    backgroundColor: "transparent",
                    color: "#004c97",
                    fontSize: 20
                  }}
                />
              </button>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i
                  className="fa fa-trash-alt"
                  style={{
                    backgroundColor: "transparent",
                    color: "red",
                    fontSize: 20
                  }}
                />
              </button>
              <button
                type="button"
                className="btnAct"
                onClick={() => this.openCloseView(tableMeta.rowIndex)}
              >
                <i
                  className="fa fa-ellipsis-v"
                  style={{
                    backgroundColor: "transparent",
                    color: "#004c97",
                    fontSize: 20
                  }}
                />
              </button>
            </div>
          ) : (
              <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openCloseView(tableMeta.rowIndex)}
                >
                  <i
                    className="fa fa-ellipsis-v"
                    style={{
                      backgroundColor: "transparent",
                      color: "#004c97",
                      fontSize: 20
                    }}
                  />
                </button>
              </div>

            );
        }
      }
    }
  ];

  data = [["1", "FEDU-123", "Sekolah dasar", "Name", "3.9"]];

  render() {
    return (
      <div className="vertical-tab-content active" id="content-nav-5">
        <form action="#">
          <div className="padding-10px">
            <div className="col-1 content-right margin-bottom-10px">
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={this.openCloseCreate.bind(this)}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
              ) : null}
            </div>
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title="Formal Education"
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableFormalEdu}
                columns={this.columnsFormEdu}
                options={options}
              />
            </MuiThemeProvider>
          </div>
          {this.state.createVisible && (
            <FormOutsourceFormalEduDetail
              type={"create"}
              dataEdu={this.state.data.osFormalEducation}
              bizparEduDegreePosition={this.state.bizparEduDegreePosition}
              bizparEduDegree={this.state.bizparEduDegree}
              bizparEduDep={this.state.bizparEduDep}
              bizparEduLevel={this.state.bizparEduLevel}
              bizparEduType={this.state.bizparEduType}
              institute={this.state.institute}
              onClickClose={this.openCloseCreate.bind(this)}
              onClickSave={this.updateFormalEdu.bind(this)}
            />
          )}
          {this.state.editVisible && (
            <FormOutsourceFormalEduDetail
              type={"update"}
              dataEdu={this.state.rawData[this.state.selectedIndex]}
              bizparEduDegreePosition={this.state.bizparEduDegreePosition}
              bizparEduDegree={this.state.bizparEduDegree}
              bizparEduDep={this.state.bizparEduDep}
              bizparEduLevel={this.state.bizparEduLevel}
              bizparEduType={this.state.bizparEduType}
              institute={this.state.institute}
              onClickClose={this.openCloseEdit.bind(this)}
              onClickSave={this.updateFormalEdu.bind(this)
              }
            />
          )}
          {this.state.viewVisible && (
            <FormOutsourceFormalEduDetail
              type={"view"}
              dataEdu={this.state.rawData[this.state.selectedIndex]}
              bizparEduDegreePosition={this.state.bizparEduDegreePosition}
              bizparEduDegree={this.state.bizparEduDegree}
              bizparEduDep={this.state.bizparEduDep}
              bizparEduLevel={this.state.bizparEduLevel}
              bizparEduType={this.state.bizparEduType}
              institute={this.state.institute}
              onClickClose={this.openCloseView.bind(this)}
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
                });
              }}
            />
          )}

          {this.state.deletePopUpVisible && (
            <PopUp
              type={"delete"}
              class={"app-popup app-popup-show"}
              onClick={this.openDeletePopup.bind(this)}
              onClickDelete={() => this.updateFormalEdu('delete')}
            />
          )}
        </form>
      </div>
    );
  }
}

export default FormOutsourceFormalEdu;
