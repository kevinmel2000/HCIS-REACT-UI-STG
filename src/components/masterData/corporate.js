import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormCorporate from '../../modules/forms/formMasterData/formCorporate'
import FormCorporateCreate from '../../modules/forms/formMasterData/formCorporateCreate'
import PopUp from '../pages/PopUpAlert'
import API from '../../Services/Api'
import { getBizpar } from '../../Services/Utils'
import ResizeSlider from '../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import SlideCorporate from '../../modules/forms/formMasterData/slideCorporate'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import LoadingBar from "react-top-loading-bar";

const clSlidePage = 'a-s-p-main'
var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()
class Corporate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            esId: this.props.auth.user.companyID,
            formCreateVisible: false,
            formUpdateVisible: false,
            formDetailVisible: false,
            deletePopUpVisible: false,
            savePopUpVisible: false,
            dataTableCompany: [],
            bizparCorporateType: [],
            // important for resize pane
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            slideCorporate: false,
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            timeout: 1000 * 100 * 9,
            isTimedOut: false
        }
        this.idleTimer = null
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

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
            slideCorporate: false,
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
            slideCorporate: false,
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-menu-1':
                this.setState({
                    slideCorporate: true,
                    selectedIndex: data,
                    slideType: 'update'
                })
                break
            case 'slide-menu-detail':
                this.setState({
                    slideCorporate: true,
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

    async handleSubmit(data) {
        let payload = {
            ...data,
            esStatus: data.esStatus === true ? 'ACTIVE' : 'INACTIVE'
        }
        // return console.log('inputan', JSON.stringify(payload))
        let res = await API.create('ES').postCompGeneral(payload)
        console.log('res', res)
        if (res.data && res.data.status === 'S') {
            this.setState({
                savePopUpVisible: true,
                formCreateVisible: false
            })
            this.getCompanyAll()
            // this.openSavePopUp.bind(this)
        }
    }

    async handleDelete() {
        let payload = {
            "referenceID": this.state.rawDataCompany[this.state.selectedIndex].esid
        }
        let res = await API.create('ES').deleteCompany(payload)
        console.log(res)
        if (res.data && res.data.status === 'S') {
            this.setState({
                deletePopUpVisible: !this.state.deletePopUpVisible
            })
            this.getCompanyAll()
        }
    }

    openSavePopUp = () => {
        this.clResizePane()
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            formCreateVisible: false,
            formUpdateVisible: false,
            formDetailVisible: false,

        })
        this.getCompanyAll()
    }

    closeSavePopUp = () => {
        this.clResizePane()
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    getAllBizpar = async () => {
        let bizparCorporateType = await getBizpar('CORPORATE_TYPE')

        this.setState({
            bizparCorporateType
        })
    }

    async getCompanyAll() {
        let payload = {
            "limit": 200,
            "offset": 0,
            "params": {
                "esStatus": "ACTIVE"
            }
        }
        let res = await API.create('ES').getCompanyByStatus(payload)
        console.log('S', res)
        if (res.data && res.data.status === 'S') {
            this.onFinishFetch()
            let dataTableCompany = res.data.data.map((value) => {
                const { essubcoID, esname, estype, parent, esemail, esStatus } = value
                if (essubcoID === null) {
                    return []
                }
                let status = esStatus === 'ACTIVE' ? 'YES' : 'NO'
                return [
                    essubcoID,
                    esname,
                    estype ? estype.bizparValue : '',
                    parent.esname === null ? '' : parent.esname,
                    esemail,
                    status
                ]
            })
            this.setState({
                dataTableCompany,
                rawDataCompany: res.data.data
            })
        } else {
            alert("Failed: " + res.data.message)
        }
    }

    componentDidMount() {
        this.startFetch(); 
        if (!R.isNil(this.props.auth.user)) {
            this.getAllBizpar()
            this.getCompanyAll()
        }
    }

    openForm = (type, index) => {
        switch (type) {
            case "create":
                this.clResizePane()
                this.setState({ formCreateVisible: !this.state.formCreateVisible })
                break
            case "update":
                this.setState({ formUpdateVisible: !this.state.formUpdateVisible, selectedIndex: index })
                break
            case "detail":
                this.clResizePane()
                this.setState({ formDetailVisible: !this.state.formDetailVisible, selectedIndex: index })
                break
            default:
                break
        }
    }

    openDeletePopUp = (index) => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
    }

    columns = [
        'Corporate ID',
        "Corporate Name",
        "Type",
        "Holding Name",
        "Email",
        {
            name: "Corporate Status",
            options: {
                customBodyRender: val => {
                    return (
                        <div>
                            <i
                                className="fa fa-lw fa-circle"
                                style={{ color: val === "YES" ? "green" : "brown", marginRight: 10 }} />
                            {val}
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
                        <div style={{ width: '120px' }}>
                            {/* <div className="col-1"> */}
                            <button
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                onClick={this.opSidePage('slide-menu-1', tableMeta.rowIndex)}>
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            {/* </div> */}
                            {/* <div className="col-2"> */}
                            <button
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                onClick={() => this.openDeletePopUp(tableMeta.rowIndex)}>
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            {/* </div> */}
                            {/* <div className="col-3"> */}
                            <button
                                type="button"
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                onClick={this.opSidePage('slide-menu-detail', tableMeta.rowIndex)}>
                                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            {/* </div> */}
                        </div>
                    );
                }
            }
        }
    ];

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
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
                                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                    <div>
                                        <div className="padding-10px">
                                            <div className="margin-bottom-10px grid grid-2x">
                                                <div className="col-1">
                                                    <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                                                        {/* Corporate */}
                                                    </div>
                                                </div>
                                                <div className="col-2 content-right">
                                                    <button
                                                        type="button"
                                                        className="btn btn-circle background-blue"
                                                        onClick={() => this.openForm("create")}>
                                                        <i className="fa fa-1x fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <MuiThemeProvider theme={getMuiTheme()}>
                                                    <MUIDataTable
                                                        title={'Corporate'}
                                                        subtitle={"lorem ipsum dolor"}
                                                        data={this.state.dataTableCompany}
                                                        columns={this.columns}
                                                        options={options}
                                                    />
                                                </MuiThemeProvider>
                                            </div>

                                            {this.state.formCreateVisible && (
                                                <FormCorporateCreate
                                                    bizparCorporateType={this.state.bizparCorporateType}
                                                    onClickClose={() => this.openForm("create")}
                                                    onClickSave={this.handleSubmit.bind(this)}
                                                />
                                            )}

                                            {this.state.formUpdateVisible && (
                                                <FormCorporate
                                                    type={"update"}
                                                    bizparCorporateType={this.state.bizparCorporateType}
                                                    data={this.state.rawDataCompany[this.state.selectedIndex]}
                                                    esId={this.state.esId}
                                                    onClickClose={() => this.openForm("update")}
                                                    // backToPage={() => this.setState({ savePopUpVisible: !this.state.savePopUpVisible })}
                                                    backToPage={this.openSavePopUp.bind(this)}
                                                />
                                            )}

                                            {this.state.formDetailVisible && (
                                                <FormCorporate
                                                    type={"detail"}
                                                    bizparCorporateType={this.state.bizparCorporateType}
                                                    data={this.state.rawDataCompany[this.state.selectedIndex]}
                                                    onClickClose={() => this.openForm("detail")}
                                                    esId={this.state.esId}
                                                />
                                            )}

                                            {this.state.deletePopUpVisible && (
                                                <PopUp
                                                    type={"delete"}
                                                    class={"app-popup app-popup-show"}
                                                    onClick={this.openDeletePopUp}
                                                    onClickDelete={this.handleDelete.bind(this)}
                                                />
                                            )}

                                            {this.state.savePopUpVisible && (
                                                <PopUp
                                                    type={"save"}
                                                    class={"app-popup app-popup-show"}
                                                    onClick={this.closeSavePopUp.bind(this)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {/* edit */}
                                    {this.state.slideCorporate && (
                                        <SlideCorporate
                                            esId={this.state.esId}
                                            user={this.props.auth.user}
                                            type={this.state.slideType}
                                            bizparCorporateType={this.state.bizparCorporateType}
                                            data={this.state.rawDataCompany[this.state.selectedIndex]}
                                            onClickClose={this.clResizePane}
                                            getCompanyAll={this.getCompanyAll.bind(this)}
                                            // backToPage={() => this.setState({ savePopUpVisible: !this.state.savePopUpVisible })}
                                            backToPage={this.openSavePopUp.bind(this)}
                                        />
                                    )}
                                </div>
                            )}>
                            >
                        </ResizeSlider>
                    </div>
                </div>
            </SplitPaneSecond>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Corporate)