import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import API from '../../../Services/Api';
import M from 'moment'


var ct = require("../../../modules/custom/customTable");

class formViolation extends Component{
    constructor(props){
        super(props)

        this.state={
          createVisible: false,
          editVisible: false,
          viewVisible: false,
          savePopup: false,
          deletePopup: false,
          rawData: []
        };
    }

  getDataViolation() {
    let payload = {
        "limit": 10,
        "offset": 0,
        "params": {
          "employeeID": this.props.employeeID
        }   
      }
      API.create('BLACKLIST').getBlacklistbyEmployeeId(payload).then(
        (res) => {
          if(res.status === 200) {
          if(res.data.status === 'S') {
            this.onFinishFetch()
            let rawData = res.data.data.map((data) => {
                return {
                    ...data,
                    violationSPK: data.blacklistSPKNumber,
                    violationType: data.blacklistType.bizparKey,
                    violationCategory: data.blacklistCategory.bizparKey,
                    violationName: data.blacklistName,
                    violationStartDate: M(data.blacklistStartDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                    violationEndDate: M(data.blacklistEndDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                    violationInformation: data.blacklistNotes,
                }
            })
            this.setState({ 
              rawData
            })
          }
        }
      }
    )
  }

  componentDidMount() {
    this.getDataViolation()
    this.onFinishFetch()
  };

  startFetch = () => {
      this.LoadingBar.continousStart();     
    };
  
  onFinishFetch = () => {
      if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

    columnViolation = [
      "SPK Number",
      "Violation Type",
      "Violation Category",
      "VIolation Name",
      "Start Date",
      "End Date",
      "Information",
    ];

    render(){
        let dataViolation = this.state.rawData.map((value, index) => {
          const { violationSPK, violationType, violationCategory, violationName, violationStartDate, violationEndDate, violationInformation } = value;

          return [
            violationSPK,
            violationType,
            violationCategory,
            violationName,
            violationStartDate,
            violationEndDate,
            violationInformation
          ]
        })
        return(
                <div className="vertical-tab-content active" id="content-nav-3">
                  <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                  <div className="padding-10px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title='Violation'
                            subtitle={"lorem ipsum dolor"}
                            data={dataViolation}
                            columns={this.columnViolation}
                            options={this.options}
                        />
                        </MuiThemeProvider>
                  </div>
               </div>
        )
    }
}

export default formViolation;