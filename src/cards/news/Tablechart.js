import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions6();

class TblChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
      subtitle: this.props.subtitle,
      icon:this.props.icon,
      data:this.props.data,
      columns:this.props.columns
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
  }
  
  render() {
    return (
      <div className="card df-card">
        <div className="padding-10px background-white display-flex-normal">
          <div className="width width-full">
            <div className="txt-site txt-bold text-main txt-12">
                { this.state.title }
            </div>
            <div className="txt-site txt-thin text-primary txt-10 margin-top-5px">
                { this.state.subtitle }
            </div>
          </div>
          <div className="width width-90px" style={{height: '25px', borderRadius: '25px', backgroundColor: '#0088FE'}}>
              <div class="txt-site txt-9 txt-thin txt-white txt-center txt-top">This Month</div>
          </div>
        </div>
        <div className="display-flex-normal padding-10px">
          <i className={this.state.icon} />
        </div>
        <div className="display-flex-normal padding-10px">
        <div className="app-open-close">
            <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                    data={this.state.data}
                    columns={this.state.columns}
                    options={options}
                />
            </MuiThemeProvider>
        </div>
        </div>
      </div>
    )
  }
}

export default TblChart