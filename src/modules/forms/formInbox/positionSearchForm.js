import React, { Component } from "react"
import { connect } from 'react-redux'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import API from '../../../Services/Api'

const ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class positionSearchForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: props.auth.user,
      dataTable: [],
      rawData: []
    }
  }

  componentWillMount() {
    this.getData()
  }

  columns = [
    "Ouid",
    "Ouname",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                onClick={() => this.props.onChoose(this.state.rawData[tableMeta.rowIndex])}
                className="btn btn-circle background-blue">
                <i className="fa fa-1x fa-plus" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  getData = async () => {
    let response = await API.create('ES').getTplJson(this.state.auth.companyID)
    console.log('TPL JSON : ', response)
    if (response && response.data && response.data.status === "S") {
      let dataTable = response.data.data.map((data, index) => {
        return [
          data.ouid,
          data.ouposition && data.ouposition.bizparValue
        ]
      })

      this.setState({
        dataTable,
        rawData: response.data.data
      })
    }
  }

  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                Position - Search Form
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
            <div className="padding-15px grid-mobile-none">
              <div className="margin-bottom-15px">
                <MuiThemeProvider theme={getMuiTheme()}>
                  <MUIDataTable
                    data={this.state.dataTable}
                    columns={this.columns}
                    options={options}
                  />
                </MuiThemeProvider>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={this.props.onClickClose}
                  >
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

const mapStateToProps = state => {
	return {
    masterdata: state.masterdata,
    auth: state.auth
	};
};

export default connect(mapStateToProps, null)(positionSearchForm);