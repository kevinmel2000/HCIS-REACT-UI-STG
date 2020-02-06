import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormNES from "../../modules/forms/formMasterData/formNesCountry";
import PopUp from "../pages/PopUpAlert";
import API from "../../Services/Api"
import M from 'moment'
import { connect } from 'react-redux'
import MasterdataAction from '../../Redux/MasterdataRedux'
import ResizeSlider from "../../modules/resize/Slider";
import SlideNes from "../../modules/forms/formMasterData/slideNes";
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../modules/custom/customTable");
const clSlidePage = 'a-s-p-main'

const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Pages extends Component {
  constructor() {
    super();
    this.state = {
      createVisible: false,
      editVisible: false,
      detailVisible: false,
      deletePopUpVisible: false,
      savePopUpVisible: false,
      selectedIndex: null,
      rawData: [],
      dataTableNes: [],
      // important for resize pane
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      slideNes: false,
      classAppSlidePage: 'app-side-page',
      classAppSlidePageMain: clSlidePage,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      nesCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
    };
    this.idleTimer = null
  }

  logout() {
    this.props.authLogout()
    return <Redirect to={{ pathname: "/" }} ></Redirect>
  }

  onAction() {
    this.setState({ isTimedOut: false })
  }

  onActive() {
    this.setState({ isTimedOut: false })
  }

  onIdle() {
    const isTimedOut = this.state.isTimedOut
    if (isTimedOut) {
      alert("Your session has timed out. Please log in again")
      this.logout()
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true })
    }
  }

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 870
    })
  }

  clResizePane = () => {
    this.setState({
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  opSidePage = (menu, data) => (e) => {
    e.preventDefault()
    this.setState({
      classAppSlidePage: 'app-side-page op-app-side',
      slideNes: false,
    })

    this.opResizePane()

    switch (menu) {
      case 'slide-menu-1':
        this.setState({
          slideNes: true,
          selectedIndex: data,
          slideType: 'edit'
        })
        break
      case 'view':
        this.setState({
          slideNes: true,
          selectedIndex: data,
          slideType: 'detail'
        })
        break
      default:
        break
    }

  }

  clSidePage = () => {
    this.setState({ classAppSlidePage: 'app-side-page' })
  }

  componentWillReceiveProps(newProps) {
    let { country, fetching } = newProps.masterdata

    if (!fetching) {
      this.onFinishFetch()
      console.log(newProps.masterdata)
      if (country === null) {
        this.setState({ dataTableNes: [] })
      } else {
        let dataTableNes = country.map((value) => {
          const { countryID, countryName, countryStatus } = value;
          return [
            countryID,
            countryName,
            countryStatus
          ]
        })
        this.setState({
          dataTableNes,
          rawData: country
        })
      }
    }

  }

  openCreateForm = () => {
    this.clResizePane()
    this.setState({ createVisible: !this.state.createVisible })
  };

  openEditForm = (index = null) => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex: index })
  };

  openDetailForm = (index) => {
    this.clResizePane()
    this.setState({ detailVisible: !this.state.detailVisible, selectedIndex: index })
  };

  openSavePopUp = () => {
    this.clResizePane()
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
  };

  openDeletePopup = (index) => {
    this.clResizePane()
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
  };

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch()
      this.getDataNes(this.state.table_page, this.state.table_limit)
    }
  }

  getDataNes = (page, limit) => {
    let payload = {
      params: {
        countryStatus: "ACTIVE"
      },
      offset: page,
      limit: limit
    }
    this.props.getCountry(payload)
    this.getCountPage()
  }

  getCountPage = async () => {
    let res = await API.create('MASTERDATA').getCountCountryByStatus('ACTIVE')
    let countActive = res.data.data
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create('MASTERDATA').getCountCountryByName(this.state.table_query)
      if (response.ok) {
        this.setState({ nesCount: response.data.data })
      }
      let body = {
        "limit": this.state.table_limit,
        "offset": this.state.table_page,
        "params": {
          "countryName": this.state.table_query
        }
      }
      let res = await API.create('MASTERDATA').getCountryByName(body)
      if (res.ok) {
        if( res.data.data === null ){ 
          this.setState({ dataTableNes: [] })
        } else {
          let dataTableNes = res.data.data.map((value) => {
            const { countryID, countryName, countryStatus } = value;
            return [
              countryID,
              countryName,
              countryStatus
            ]
          })
          this.setState({
            dataTableNes,
            rawData: res.data.data
          })
        } 
      }
    } else {
      this.setState({ nesCount: countActive })
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columns = [
    "Country ID",
    "Country Name",
    {
      name: "Country Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
              {val === "ACTIVE" ? (
                <div>
                  <i
                    className="fa fa-lw fa-circle"
                    style={{ color: "green", marginRight: 10 }}
                  />
                  {val}
                </div>
              ) : (
                  <div>
                    <i
                      className="fa fa-lw fa-circle"
                      style={{ color: "red", marginRight: 10 }}
                    />
                    {val}
                  </div>
                )}
            </div>
          );
        }
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div style={{ width: '115px' }}>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage('slide-menu-1', tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
              </button>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage('view', tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  handleDelete = async () => {
    let payload = {
      referenceID: this.state.rawData[this.state.selectedIndex].countryID,
      requestBy: "DELETE-TEST",
      requestDate: M().format("DD-MM-YYYY HH:mm:ss")
    }
    // return console.log(payload)
    let response = await API.create('MASTERDATA').deleteCountry(payload)
    if (response.ok && response.data.status === 'S') {
      this.setState({ deletePopUpVisible: false })
      this.props.getCountry({
        "params": {
          "countryStatus": "ACTIVE"
        },
        "offset": this.state.table_page,
        "limit": this.state.table_limit
      });
    } else {
      if (response.data && response.data.message) alert("Failed, Please Try Again")
    }
  }

  handleSubmit = async (data) => {
    let payload = {
      ...data,
      countryCreationalDTO: {
        ...data.countryCreationalDTO,
        createdDate: M().format("DD-MM-YYYY HH:mm:ss")
      }
    }
    // return console.log(JSON.stringify(payload))
    let response = await API.create('MASTERDATA').postCountry(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp()
    } else {
      if (response.data && response.data.message) alert("Data Already Exist")
    }
  }

  handleUpdate = async (data) => {
    let payload = {
      ...data,
      countryCreationalDTO: {
        ...data.countryCreationalDTO,
        createdDate: M().format("DD-MM-YYYY HH:mm:ss")
      }
    }

    let response = await API.create('MASTERDATA').updateCountry(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp()
    } else {
      if (response.data && response.data.message) alert("Failed, Please Try Again")
    }
  }

  handlePopUp = () => {
    this.getDataNes(0, 5)
    this.clSidePage()
    this.clResizePane()
    this.setState({
      savePopUpVisible: false,
      createVisible: false,
      editVisible: false
    })
  }

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { nesCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: nesCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.setState({ table_page: tableState.page })
            this.getDataNes(tableState.page, tableState.rowsPerPage);
            break;
          case 'changeRowsPerPage':
            this.setState({ table_limit: tableState.rowsPerPage })
            this.getDataNes(tableState.page, tableState.rowsPerPage);
            break;
          case 'search':
            let searchText = tableState.searchText ? tableState.searchText : ""
            this.setState({ table_query: searchText }, () => {
              this.getDataNes(tableState.page, tableState.rowsPerPage)
            })
            break;
          default:
            break;
        }
      }
    }
    return (
      <SplitPaneSecond
        split="vertical"
        defaultSize={0}
        minSize={0}
        maxSize={0}
        primary="first"
        className="main-slider"
        style={{ height: 'calc(100vh - 50px)' }}>
        <div className='col-1'></div>
        <div className='col-2'>
          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive.bind(this)}
            onIdle={this.onIdle.bind(this)}
            onAction={this.onAction.bind(this)}
            debounce={250}
            timeout={this.state.timeout} />
          <div>
            <ResizeSlider
              allowResize={this.state.allowResize}
              defaultSize={this.state.defaultSize}
              minSize={this.state.minSize}
              maxSize={this.state.maxSize}
              main={(
                <div className='a-s-p-mid no-header'>
                  <div>
                    {/* <div className="main-content"> */}
                    <div>
                      <div className="padding-10px">
                        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                        <div className="margin-bottom-10px grid grid-2x">
                          <div className="col-1">
                            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                              {/* NES */}
                            </div>
                          </div>
                          <div className="col-2 content-right">
                            <button
                              type="button"
                              className="btn btn-circle background-blue"
                              onClick={this.openCreateForm.bind(this)}
                            >
                              <i className="fa fa-1x fa-plus" />
                            </button>
                          </div>
                        </div>

                        <MuiThemeProvider theme={getMuiTheme()}>
                          <MUIDataTable
                            key={nesCount}
                            title={'National Enterprise Structure'}
                            subtitle={"lorem ipsum dolor"}
                            data={this.state.dataTableNes}
                            columns={this.columns}
                            options={tableOptions}
                          />
                        </MuiThemeProvider>
                      </div>

                      {this.state.createVisible && (
                        <FormNES
                          user={this.props.auth.user}
                          type={"create"}
                          title={"NES Create - Country"}
                          onClickClose={this.openCreateForm}
                          onClickSave={this.handleSubmit.bind(this)}
                          onClickDelete={this.openDeletePopup}
                        />
                      )}

                      {/* {this.state.editVisible && (
                      <FormNES
                        type={"edit"}
                        data={this.state.rawData[this.state.selectedIndex]}
                        title={"NES Update - Country"}
                        onClickClose={() => this.openEditForm(null)}
                        onClickSave={this.handleUpdate.bind(this)}
                        onClickDelete={this.openDeletePopup}
                      />
                    )} */}

                      {this.state.detailVisible && (
                        <FormNES
                          user={this.props.auth.user}
                          type={"detail"}
                          title={"NES Detail - Country"}
                          data={this.state.rawData[this.state.selectedIndex]}
                          onClickClose={this.openDetailForm}
                          onClickDelete={this.openDeletePopup}
                        />
                      )}

                      {this.state.savePopUpVisible && (
                        <PopUp
                          type={"save"}
                          class={"app-popup app-popup-show"}
                          onClick={this.handlePopUp.bind(this)}
                        />
                      )}
                      {this.state.deletePopUpVisible && (
                        <PopUp
                          type={"delete"}
                          class={"app-popup app-popup-show"}
                          onClickDelete={this.handleDelete}
                          onClick={this.openDeletePopup}
                        />
                      )}
                    </div>


                  </div>
                  {/* </div> */}
                  {/* </div> */}

                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {this.state.slideNes && (
                    <SlideNes
                      user={this.props.auth.user}
                      type={this.state.slideType}
                      data={this.state.rawData[this.state.selectedIndex]}
                      title={this.state.slideType === 'edit' ? 'NES Update - Country' : 'NES Detail - Country'}
                      closeSlide={this.clResizePane}
                      onClickSave={this.handleUpdate.bind(this)}
                      onClickDelete={this.openDeletePopup} />
                  )}
                </div>
              )}
            >

            </ResizeSlider>
          </div>

        </div>

      </SplitPaneSecond>


    );
  }
}

const mapStateToProps = state => {
  return {
    masterdata: state.masterdata,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCountry: obj => dispatch(MasterdataAction.getCountry(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pages);