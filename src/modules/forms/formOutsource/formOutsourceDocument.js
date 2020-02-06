import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormOutsourceDocumentDetail from "./formOutsourceDocumentDetail"
import PopUp from "../../../components/pages/PopUpAlert"
import * as R from 'ramda'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormOutsourceDocument extends Component {
  constructor(props) {
    super(props);
    let docType = [
      { bizparKey: 'KTP', bizparValue: 'KTP' },
      { bizparKey: 'KK', bizparValue: 'KK' },
    ]
    this.state = {
      data: props.data,
      createVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      viewVisible: false,
      dataTable: [],
      bizparDocType: docType
    };
  }

  async handleSave(type, value) {
    let { data } = this.state
    let payload = Object.assign([], data.osDocs)
    switch (type) {
      case 'create':
        payload.push(value)
        break;
      case 'update':
        let index = R.findIndex(R.propEq('docID', value.docID))(payload)
        if (index >= 0) {
          payload[index] = value
        }
        break;
      case 'delete':
        payload.splice(this.state.selectedIndex, 1)
        break;
      default: break;
    }
    data = { ...data, osDocs: payload }
    this.props.onClickSave('workExp', data)
  }

  componentDidMount() {
    // this.getBizpar()
    let { osDocs } = this.state.data
    
    if (!R.isEmpty(osDocs)) {
      let dataTable = osDocs.map((value, index) => {
        const { docID, docType, docDesc } = value
        return [
          index += 1, docID, docType, docDesc,
        ]
      })
      this.setState({ dataTable, rawData: osDocs })
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

  //document
  columnsDocument = [
    "Document ID",
    "Document Type",
    "Description",
    {
      name: "Document",
      options: {
        customBodyRender: () => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
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
        customHeadRender: (columnMeta) => (
          <th key={columnMeta.index}
            style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "right", paddingRight: "20px", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
            {columnMeta.name}
          </th>
        ),
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== 'view' ?
              <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
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
              <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openCloseView(tableMeta.rowIndex)}
                >
                  <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div>

          );
        }
      }
    }
  ];

  data = [
    ["DOC-001", "KTP", "INFO", "DOC.pdf"]
  ]

  render() {
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
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTable}
                columns={this.columnsDocument}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </form>
        {this.state.createVisible && (
          <FormOutsourceDocumentDetail
            type={"create"}
            bizparDocType={this.state.bizparDocType}
            onClickSave={this.handleSave.bind(this)}
            onClickClose={this.openCloseCreate.bind(this)}
          />
        )}
        {this.state.editVisible && (
          <FormOutsourceDocumentDetail
            type={"update"}
            onClickSave={this.handleSave.bind(this)}
            onClickClose={this.openCloseEdit.bind(this)}
            bizparDocType={this.state.bizparDocType}
            data={this.state.rawData[this.state.selectedIndex]}
          />
        )}
        {this.state.viewVisible && (
          <FormOutsourceDocumentDetail
            type={"view"}
            onClickClose={this.openCloseView.bind(this)}
            bizparDocType={this.state.bizparDocType}
            data={this.state.rawData[this.state.selectedIndex]}
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

export default FormOutsourceDocument