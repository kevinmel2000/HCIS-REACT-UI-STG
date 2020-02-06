import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from 'react-top-loading-bar'
import FormRequestSelection from '../../../modules/forms/formInbox/recruitmentRequestSelection'
import PopUp from '../../pages/PopUpAlert'
import API from '../../../Services/Api'

var ct = require("../../../modules/custom/customTable")

class Pages extends Component {

  constructor () {
    super()
    this.state = {
      clEditAble: '',
      editAble: false,
      saveClass : 'app-popup',
      deleteClass : 'app-popup',
      createClassRequestSelection : 'app-popup',
      createClassRequest : 'app-popup',
      createClassEmployee : 'app-popup',
      type: 'create',
      rawData:[],
      dataTable:[]

    }
  }

openCreateFormRequestSelection = (type = 'create', index) => {
  if (this.state.createClassRequestSelection === 'app-popup app-popup-show') {
    this.setState({createClassRequestSelection: 'app-popup', type, selectedIndex: null})
  } else {
    this.setState({createClassRequestSelection: 'app-popup app-popup-show', type, selectedIndex: index})
  }
}

openCreateFormRequest = (type = 'create', index) => {
  if (this.state.createClassRequest === 'app-popup app-popup-show') {
    this.setState({createClassRequest: 'app-popup', type, selectedIndex: null})
  } else {
    this.setState({createClassRequest: 'app-popup app-popup-show', type, selectedIndex: index})
  }
}

openCreateEmplyeeForm = (type = 'create', index) => {
  if (this.state.createClassEmployee === 'app-popup app-popup-show') {
    this.setState({createClassEmployee: 'app-popup', type, selectedIndex: null})
  } else {
    this.setState({createClassEmployee: 'app-popup app-popup-show', type, selectedIndex: index})
  }
}

openSavePopUp = () => {
  if (this.state.saveClass === 'app-popup app-popup-show') {
    this.setState({saveClass: 'app-popup'})
  } else {
    this.setState({saveClass: 'app-popup app-popup-show'})
  }
}

openDeletePopup = () => {
  if (this.state.deleteClass === 'app-popup app-popup-show') {
    this.setState({deleteClass: 'app-popup'})
  } else {
    this.setState({deleteClass: 'app-popup app-popup-show'})
  }
}

getDataInbox() {
  let payload = {
      offset: 0,
      limit: 100
  }

  API.create('RECRUITMENT_QUERY').getRecruitmentReqAll(payload).then(
    (res) => {
      if(res.status === 200) {
      console.log(res.data);
      if(res.data.status === 'S') {
        console.log(res.data);
        this.onFinishFetch()
        let dataTable = res.data.data.map((value, index) => {
          const {recruitmentRequestBy,recruitmentRequestDate } = value;
          return [
            recruitmentRequestBy.employeeName,
            "RECRUITMENT REQUEST SELECTION",
            recruitmentRequestDate,
          ]
        })

        this.setState({
          rawData: res.data.data,
          dataTable
        })
      }
    }
  }
  )
}


componentDidMount() {
  this.startFetch();
  this.getDataInbox();
}

startFetch = () => {
  this.LoadingBar.continousStart()
}

onFinishFetch = () => {
  if(typeof this.LoadingBar === "object") this.LoadingBar.complete()
}

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions()

  columns = [
    {
        name: "Requestor",
        options: {
          customBodyRender: (val) => {
            return (
              <div style={{fontWeight:'bold',fontSize:15,}}>
                <i className="far fa-lw fa-user-circle" style={{color: 'blue', marginRight: 10, fontSize: 44}} />
                  {val}
              </div>
            )
          }
        }
      },
      {
        name: "Task Summary",
        options: {
            customBodyRender: (val) => {
            return (
              <div className="padding-15px">
                <div>
                  <div className="txt-site txt-12 txt-bold post-center" style={{fontWeight:'bold'}}>
                      {val.split("-")[0]}
                  </div>
                </div>
                <div>
                  {val.split("-")[1]}
                </div>
              </div>
            )
          }
        }
      },
    "Request Date", 
    {
      name: "Action",
      options: {
        customBodyRender: (val,tableMeta) => {
          return (
            <div>
              <button 
                className="btn btn-blue"
                onClick={ () => tableMeta.rowData[1].split('-')[0] === 'RECRUITMENT REQUEST' ? this.openCreateFormRequest('create') : tableMeta.rowData[1].split('-')[0] === 'RECRUITMENT REQUEST SELECTION' ? this.openCreateFormRequestSelection('create') : this.onClick }>
                CLAIM
              </button>
            </div>
          )
        }
      }
    }
  ]

  data = [
      ["JOHN DOE","MPP APPROVAL-Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "22-July-2019 10:00:00"],
      ["JOHN DOE","RECRUITMENT REQUEST-Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "22-July-2019 10:00:00"],
      ["JOHN DOE","RECRUITMENT REQUEST SELECTION-Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "22-July-2019 10:00:00"]
  ]

  render () {

    return (
      <div className="main-content">
      <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-15px txt-site txt-18 txt-bold txt-main padding-top-5px margin-left-5px margin-bottom-5px">
          <div className="col-1">
            REQUEST SELECTION
          </div>
        </div>

        <div className="padding-5px">
            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                data={this.state.dataTable}
                columns={this.columns}
                options={this.options}
            />
            </MuiThemeProvider>
        </div>

        <FormRequestSelection
          className={this.state.createClassRequestSelection}
          type={this.state.type}
          onClickClose={this.openCreateFormRequestSelection}
          onClickSave={this.openSavePopUp}
          onClickDelete={this.openDeletePopup} />

        <PopUp type={'save'} class={this.state.saveClass} onClick={this.openSavePopUp} />
        <PopUp type={'delete'} class={this.state.deleteClass} onClick={this.openDeletePopup} />
      </div>
    )
  }

}

export default Pages