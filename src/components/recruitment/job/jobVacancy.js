import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../pages/PopUpAlert'
import Api from '../../../Services/Api'
import LoadingBar from "react-top-loading-bar"
import NumberFormat from 'react-number-format'
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class jobVacancy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formDetailVisible: false,
            savePopUpVisible: false,
            selectedIndex: null,
            rawData: [],
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false
        }
        this.idleTimer = null
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.startFetch()
            this.getJobVacancy()
        }
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

    async getJobVacancy() {
        let payload = {
            "limit": 20,
            "offset": 0
        }
        let response = await Api.create("RECRUITMENT_QUERY").getAllRecruitmentVacancy(payload)
        if (response.data && response.data.status === "S") {
            this.onFinishFetch()
            this.setState({ rawData: response.data.data })
        } else {
            this.onFinishFetch()
            alert("Failed: " + response.data.message)
        }
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    }

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    }

    opResizePane = () => {
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
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

    opSidePage = (menu, selectedIndex) => (e) => {
        this.setState({
            formDetailVisible: false,
            selectedIndex
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-vacancy':
                this.setState({
                    formDetailVisible: true,
                    selectedIndex,
                })
                break;
            default:
                break
        }

    }

    columns = [
        "No",
        "Vacancy ID",
        "Recruitment Type",
        "Working Type",
        "Position",
        "Publish Date",
        "Quota",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button" 
                                className="btn btn-small btn btn-radius"
                                style={{
                                    backgroundColor: val === "PUBLISH" ? "brown" : "gray",
                                    color: "white",
                                    marginRight: 15
                                }}
                                onClick={this.openSavePopUp}
                            >
                                {val}
                            </button>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-vacancy", tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20}}/>
                            </button>
                        </div>   
                    )
                }
            }
        }
    ]

    openForm = (index) => {
        this.setState({ formDetailVisible: !this.state.formDetailVisible, selectedIndex: index })
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    openSaveOk = () => {
        this.setState({ saveOk: !this.state.saveOk, savePopUpVisible: false })
    }

    formatRpTo = () => {
        return (
            <NumberFormat
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp "}
                value={this.state.rawData[this.state.selectedIndex].salaryStartTo}
                renderText={value => value + ",00 "}
            />
        )
    }
    formatRpFrom = () => {
        return (
            <NumberFormat
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp "}
                value={this.state.rawData[this.state.selectedIndex].salaryStartFrom}
                renderText={value => value + ",00 "}
            />
        )
    }

    renderDetail = () => {
        let { rawData, selectedIndex } = this.state
        let streetName = rawData[selectedIndex].workLocation && rawData[selectedIndex].workLocation.length >= 0 ? rawData[selectedIndex].workLocation[0].streetName : "-"
        let rt = rawData[selectedIndex].workLocation && rawData[selectedIndex].workLocation.length >= 0 ? "RT " + rawData[selectedIndex].workLocation[0].rt : "-"
        let rw = rawData[selectedIndex].workLocation && rawData[selectedIndex].workLocation.length >= 0 ? "RW " + rawData[selectedIndex].workLocation[0].rw : "-"
        let kelurahan = rawData[selectedIndex].workLocation && rawData[selectedIndex].workLocation.length >= 0 ? rawData[selectedIndex].workLocation[0].kelurahan && rawData[selectedIndex].workLocation[0].kelurahan.kelurahanName : "-"
        let zipcode = rawData[selectedIndex].workLocation && rawData[selectedIndex].workLocation.length >= 0 ? rawData[selectedIndex].workLocation[0].kelurahan && rawData[selectedIndex].workLocation[0].kelurahan.subZipcode : "-"
        let kabkot = rawData[selectedIndex].workLocation && rawData[selectedIndex].workLocation.length >= 0 ? rawData[selectedIndex].workLocation[0].kabkot && rawData[selectedIndex].workLocation[0].kabkot.kabkotName : "-"
        let kecamatan = rawData[selectedIndex].workLocation && rawData[selectedIndex].workLocation.length >= 0 ? rawData[selectedIndex].workLocation[0].kecamatan && rawData[selectedIndex].workLocation[0].kecamatan.kecamatanName : "-"
        let province = rawData[selectedIndex].workLocation && rawData[selectedIndex].workLocation.length >= 0 ? rawData[selectedIndex].workLocation[0].province && rawData[selectedIndex].workLocation[0].province.provinceName : "-"
        let workLocation = rawData[selectedIndex].workLocation ? streetName + ", " + rt + "/" + rw + ", " + kelurahan + ", " + kabkot + ", " + kecamatan + ", " + province + ", " + zipcode : "-"
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-id-card"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Job Vacancy - Detail Form
                                </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.clResizePane}
                            >
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <form action="#">
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Position</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                        value={rawData[selectedIndex].position}
                                        disabled
                                    ></input>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Company</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                        value={rawData[selectedIndex].companyName}
                                        disabled
                                    ></input>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Experience</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                        value={rawData[selectedIndex].experience && rawData[selectedIndex].experience.requestQualificationNotes ? rawData[selectedIndex].experience.requestQualificationNotes : "-"}
                                        disabled
                                    ></input>
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Salary</h4>
                                        </div>
                                    </div>
                                    <div className="txt txt-sekunder-color" style={{ backgroundColor: '#E6E6E6' }}>
                                        <NumberFormat
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"Rp "}
                                            value={this.state.rawData[this.state.selectedIndex].salaryStartFrom}
                                            renderText={value => value + ",00"}
                                        />
                                        {" - "}
                                        <span>
                                            <NumberFormat
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                prefix={"Rp "}
                                                value={this.state.rawData[this.state.selectedIndex].salaryStartTo}
                                                renderText={value => value + ",00"}
                                            />
                                        </span>
                                    </div>
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Work Location</h4>
                                        </div>
                                    </div>
                                    <textarea
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        rows={4}
                                        value={workLocation}
                                        disabled
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Job Description</h4>
                                        </div>
                                    </div>
                                    <textarea
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        rows={4}
                                        value={rawData[selectedIndex].jobDescription}
                                        disabled
                                    />
                                </div>

                                <div className="padding-15px">
                                    <div className="grid grid-2x">
                                        <div className="col-1" />
                                        <div className="col-2 content-right">
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={this.clResizePane}
                                            >
                                                <span>CLOSE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        let { formDetailVisible, savePopUpVisible, saveOk, rawData } = this.state
        let dataTable = rawData && rawData.map((value, index) => {
            const { recruitmentVacancyID, recruitmentVacancyType, recruitmentVacancyWorkingType, position, recruitmentVacancyPublishStartDate, recruitmentVacancyPublishEndDate, quota } = value
            return [
                index += 1,
                recruitmentVacancyID,
                recruitmentVacancyType ? recruitmentVacancyType.bizparValue : "",
                recruitmentVacancyWorkingType ? recruitmentVacancyWorkingType.bizparValue : "",
                position,
                recruitmentVacancyPublishStartDate + "-" + recruitmentVacancyPublishEndDate,
                quota,
                "PUBLISH"
            ]
        })
        return (
            <SplitPaneSecond
                split="vertical"
                defaultSize={0}
                minSize={0}
                maxSize={0}
                primary="first"
                className="main-slider"
                style={{ height: 'calc(100vh - 50px)' }}>
                <div className="col-1 backgorund-white"></div>
                <div className="col-2 background-white">
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
                                    <div className="padding-10px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                title='Job Vacancy'
                                                subtitle={'lorem ipsum dolor'}
                                                data={dataTable}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {formDetailVisible && this.renderDetail()}
                                </div>
                            )}
                        />

                        {savePopUpVisible && (
                            <PopUp
                                type={"simpan"}
                                class={"app-popup app-popup-show"}
                                onClick={this.openSavePopUp.bind(this)}
                                onClickSimpan={this.openSaveOk.bind(this)}
                            />
                        )}

                        {saveOk && (
                            <PopUp
                                type={"save"}
                                class={"app-popup app-popup-show"}
                                onClick={this.openSaveOk.bind(this)}
                            />
                        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(jobVacancy)