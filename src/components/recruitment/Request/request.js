import React, { Component } from 'react'
import FlexView from 'react-flexview'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from 'react-top-loading-bar'
import PopUp from '../../pages/PopUpAlert'
import FormRequest from '../../../modules/forms/formInbox/recruitmentRequest'
import API from '../../../Services/Api'

const ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class Pages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rawData:[],
      dataTable:[],
      createVisible: false,

      bizparRecruitmentType: [],
      bizparRecruitmentCategory: [],
      bizparRequestType: [],
      bizparEmployeeStatusType: [],
      bizparEmployeeStatusCategory: []
    }
  }

  getBizpar = async (cat) => {
    let payload = {
      params: {
        bizparCategory: cat
      },
        offset: 0,
        limit: 1000
    }
    
    let response = await API.create('BIZPAR').getBizparByCategory(payload)
    if (response.data && response.data.status == "S") {
      return response.data.data
    } else {
      return []
    }
  }

  getAllBizpar = async () => {
    let bizparRecruitmentType = await this.getBizpar('RECRUITMENT_TYPE')
    let bizparRecruitmentCategory = await this.getBizpar('CATEGORY_EMPLOYEE_STATUS')
    let bizparRequestType = await this.getBizpar('EMPLOYEE_STATUS')
    let bizparEmployeeStatusType = await this.getBizpar('RECRUITMENT_REQUEST_TYPE')
    let bizparEmployeeStatusCategory = await this.getBizpar('RECRUITMENT_CATEGORY')

    this.setState({
      bizparRecruitmentType,
      bizparRecruitmentCategory,
      bizparRequestType,
      bizparEmployeeStatusCategory,
      bizparEmployeeStatusType
    })
  }

  getDataInbox() {
    let payload = {
        offset: 0,
        limit: 100
    }

    API.create('RECRUITMENT_QUERY').getRecruitmentReqAll(payload).then(
      (res) => {
        console.log('Data : ', res)
        if(res.status === 200) {
          if(res.data.status === 'S') {
            this.onFinishFetch()
            let rawData = []
            let dataTable = res.data.data.map((value, index) => {
              const { recruitmentRequestBy, recruitmentRequestDate } = value;
              
              let parsedItem = {
                ...value,
                recruitmentCategory: value.recruitmentCategory.bizparKey,
                recruitmentEmployeeStatus: value.recruitmentEmployeeStatus.bizparKey,
                recruitmentEmployeeStatusCategoryType: value.recruitmentEmployeeStatusCategoryType.bizparKey,
                recruitmentRequestType: value.recruitmentRequestType.bizparKey,
                recruitmentType: value.recruitmentType.bizparKey
              }

              rawData.push(parsedItem)
              
              return [
                recruitmentRequestBy.employeeName,
                "RECRUITMENT REQUEST",
                recruitmentRequestDate,
              ]
            })
            
            this.setState({
              rawData,
              dataTable
            })
          }
        }
      }
    )
  }

  openCreateForm = () => this.setState({ createVisible: !this.state.createVisible })

  componentDidMount() {
    this.LoadingBar.continousStart()
  }

  componentWillMount() {
    this.getDataInbox()
    this.getAllBizpar()
  }

  onFinishFetch = () => {
    if(typeof this.LoadingBar === "object") this.LoadingBar.complete()
  }

  columns = [
    {
        name: "Requestor",
        options: {
          customBodyRender: (val) => {
            return (
              <FlexView vAlignContent="center">
                <FlexView>
                  <i className="far fa-lw fa-user-circle" style={{color: 'blue', marginRight: 10, fontSize: 44}} />
                </FlexView>
                <div style={{ fontWeight:'bold', fontSize:15 }}>
                    {val}
                </div>
              </FlexView>
            )
          }
        }
      },
      {
        name: "Task Summary",
        options: {
            customBodyRender: (val) => {
            return (
              <FlexView vAlignContent="center">
                {val}
              </FlexView>
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
                className="btn btn-red btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() => console.log(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
              <button
                className="btn btn-red btn-small-circle"
                onClick={() => console.log(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
            </div>
          )
        }
      }
    }
  ]

  render () {
    let {
      bizparRecruitmentType,
      bizparRecruitmentCategory,
      bizparRequestType,
      bizparEmployeeStatusCategory,
      bizparEmployeeStatusType
    } = this.state
    
    return (
      <div className="main-content">
      <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-15px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              REQUEST
            </div>
          </div>
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              style={{ marginRight: 5 }}
              onClick={this.openCreateForm.bind(this)}
            >
              <i className="fa fa-1x fa-plus" />
            </button>
          </div>
        </div>

        <div className="padding-5px">
            <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                data={this.state.dataTable}
                columns={this.columns}
                options={options}
            />
            </MuiThemeProvider>
        </div>

        {this.state.createVisible && (
          <FormRequest
            bizparRecruitmentType={bizparRecruitmentType}
            bizparRecruitmentCategory={bizparRecruitmentCategory}
            bizparRequestType={bizparRequestType}
            bizparEmployeeStatusCategory={bizparEmployeeStatusCategory}
            bizparEmployeeStatusType={bizparEmployeeStatusType}
            type={"create"}
            onClickClose={this.openCreateForm.bind(this)}
            onClickSave={this.openSavePopUp}
          />
        )}

        {/* <PopUp type={'save'} class={"app-popup app-popup-show"} onClick={this.openSavePopUp} /> */}
        {/* <PopUp type={'delete'} class={"app-popup app-popup-show"} onClick={this.openDeletePopup} /> */}
      </div>
    )
  }

}

export default Pages