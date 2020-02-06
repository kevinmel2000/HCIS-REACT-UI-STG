import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from 'react-top-loading-bar'
import ReactTooltip from 'react-tooltip'

var ct = require("../../modules/custom/customTable")

class Pages extends Component {

  constructor () {
    super()
    this.state = {
      clEditAble: '',
      editAble: false,
      rawData: [],
      dataTable: []
    }
  }

  opEditAble = () => {
    if (this.state.editAble === false) { 
      this.setState({
        clEditAble: 'edit-able',
        editAble: true, 
      })
    } else {
      this.setState({
        clEditAble: '',
        editAble: false, 
      })
    }
  }

  opDeleteAble = () => {
    alert('delete');
  }

  componentDidMount() {
    // this.startFetch();
    // this.getData();
  }

  // getData() {
  //   fetch(proxyurl + url + 'purchase_requisition')
  //   .then((response) => response.json())
  //   .then((responseJson) => {
  //     this.onFinishFetch()
  //     let dataTable = responseJson.map((value, index) => {
  //       const { plant, number, docdate, deliverydate, kimap, materialname } = value;
  //       return [
  //         index += 1,
  //         plant,
  //         number,
  //         docdate,
  //         deliverydate,
  //         kimap,
  //         materialname
  //       ]
  //     })

  //     this.setState({
  //       rawData: responseJson,
  //       dataTable
  //     })
  //   })
  // }

  // startFetch = () => {
  //   this.LoadingBar.continousStart()
  // }

  // onFinishFetch = () => {
  //   if(typeof this.LoadingBar === "object") this.LoadingBar.complete()
  // }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions()

  columns = [
        "Facility TPL ID", "Facility TPL Name",
        {
            name: "Activation",
            options: {
                customBodyRender: (val) => (
                    <div>
                       <label
                            style={{
                                backgroundColor: val === "YES" ? "green" : "brown",
                                color: "white",
                                padding: "5px",
                                borderRadius: 4,
                                fontSize: "14px",
                                border: val === "ACTIVE" ? "4px green" : "4px brown"
                            }}
                        >
                            {val}
                        </label>
                    </div>
                )
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: () => (
                    <div>
                        <button
                            className="btn btn-blue btn-small-circle margin-left-5px"
                            onClick={this.openDeletePopUp}>
                            <i className="fa fa-lw fa-pencil-alt" />
                        </button>
                        <button
                            className="btn btn-red btn-small-circle margin-left-5px"
                            onClick={this.openDeletePopUp}>
                            <i className="fa fa-lw fa-trash-alt" />
                        </button>
                        <button 
                          data-scroll-hide="true"
                          data-tip=""
                          data-for="github-tooltip"
                          className="btn btn-green btn-small-circle margin-left-5px"
                          onClick={() => {}}>
                            <i className="fa fa-lw fa-ellipsis-h" />
                          
                        </button>
                    </div>
                )
            }
        }
  ]

  data = [
      ["FC-1032193131", "Facility Template C-LEVEL", "YES"],
      ["FC-1032193131", "Facility Template C-LEVEL", "YES"],
      ["FC-1032193131", "Facility Template C-LEVEL", "YES"],
      ["FC-1032193131", "Facility Template C-LEVEL", "YES"]
  ]

  tooltip = "Lorem ipsum dolor, sit amet consectetur adipisicing elit."

  render () {

    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />

        <div className="padding-5px">

          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={"Contoh Tabel"}
              data={this.data}
              columns={this.columns}
              options={this.options} />
          </MuiThemeProvider>

        </div>

        <ReactTooltip 
              clickable="true"
              border="true"
              type="light"
              place="bottom" 
              id="github-tooltip">
              <div className="width width-300px background-white">
                <div className="margin-10px display-flex-normal">
                  <span className="width width-25px">
                    <i className="fa fa-lw fa-box" />
                  </span>
                  <span className="txt-site txt-11 txt-main margin-right-5px">
                    Used by 
                  </span>
                  <span className="txt-site txt-11 txt-main txt-bold">
                    80,306 repositories
                  </span>
                </div>
                <div className="margin-10px display-flex-normal">
                  <div className="image image-25px background-blue margin-right-5px"></div>
                  <div className="image image-25px background-blue margin-right-5px"></div>
                  <div className="image image-25px background-blue margin-right-5px"></div>
                  <div className="image image-25px background-blue margin-right-5px"></div>
                  <div className="image image-25px background-blue margin-right-5px"></div>
                  <div className="txt-site txt-10 txt-safe txt-bold margin-top-5px">
                    +80,298
                  </div>
                </div>
                <div className="margin-20px">
                  <div className="border-top"></div>
                </div>
                <div className="margin-10px display-flex-normal">
                  <span className="width width-25px">
                    <i className="fa fa-lw fa-code" />
                  </span>
                  <span className="txt-site txt-11 txt-main">
                    Install via package
                  </span>
                </div>
                <div className="margin-10px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    npm i expo-cli --save
                  </span>
                </div>
              </div>
        </ReactTooltip>

      </div>
    )
  }

}

export default Pages