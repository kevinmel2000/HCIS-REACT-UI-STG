import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import PopUp from '../../../../../pages/PopUpAlert'
import FormCreateOrg from '../../create/org/formCreateOrg'
import TableOrgDetail from '../../../tables/confCorporateTPL/tableOrgDetail'
import { getBizpar } from '../../../../../../Services/Utils'
import * as R from 'ramda'
import API from '../../../../../../Services/Api'
import Loader from 'react-loader-spinner'
import Api from '../../../../../../Services/Api'

class EditOrg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                ...this.props.rawData,
                orgStructureTPLStatus: this.props.rawData.orgStructureTPLStatus === 'ACTIVE' ? true : false
            },
            createOrg: false,
            savePopUpVisible: false,
            chartVisible: false,
            esData: [],
            loading: false
        }
        this.handleChange = this.handleChange.bind(this);
    }

    opPopupPage = (type) => {
        let savePopUpVisible;
        this.setState({
            editTravel: false,
            classAppSlidePage: 'app-side-page'
        })
        switch (type) {
            case "popup-org":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createOrg: !this.state.createOrg, savePopUpVisible })
                break;
            default:
                break;
        }
    }

    openSavePopUp = () => {
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible
        })
    }

    openChart = () => {
        this.setState({ chartVisible: !this.state.chartVisible })
    }

    getAllBizpar = async () => {
        let bizparCorporateLevel = await getBizpar('CORPORATE_LEVEL')
        let bizparCorporateGrade = await getBizpar('CORPORATE_GRADE')

        this.setState({
            bizparCorporateLevel,
            bizparCorporateGrade
        })
    }

    async getBizparPosition(value) {
        console.log("ini " + value)
        Api.create("BIZPAR").getCountBizparByStatus("ACTIVE").then((res) => {
        let payload = {
            params: {
                parentKey: value === undefined ? "" : value,
                bizparCategory: "CORPORATE_POSITION"
            },
            offset: 0,
            limit: res.data.data
        }
        API.create("BIZPAR")
            .getBizparByParentKey(payload)
            .then(res => {
                console.log(JSON.stringify(res.data))
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === "S") {
                        this.setState({
                            bizparCorporatePosition: res.data.data
                        })
                    }
                }
            });
        })
    }

    async handleChange(event) {
        let { data } = this.state
        const formData = new FormData();
        formData.append('file', event.target.files[0])
        // console.log(event.target.files)
        formData.append('orgStructureTPLID', data.orgStructureTPLId)
        let response = await API.create('CFG').postPhotoOrg(formData)
        if (!response.ok) alert(typeof response.data === "string" ? response.data : JSON.stringify(response.data))
        switch (response.data.status) {
            case "S":
                let res = await API.create('CFG').getCorporateOrgStructureTplById(data.orgStructureTPLId)
                data = {
                    ...data,
                    orgStructureTPLPhotoURL: res.data.data.orgStructureTPLPhotoURL
                }
                console.log('res img', response.data)
                this.setState({ imageUrl: "", data }, () => {
                    this.getImage()
                })
                break;
            default:
                break;
        }
    }

    async getImage() {
        this.setState({ loading: true, imageUrl: '' })
        let { rawData } = this.props
        console.log('dataID', this.props.rawData.orgStructureTPLId)
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'cfg/api/corporate.orgstructure.tpl.photo.get/' + rawData.orgStructureTPLId, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        // console.log('response ', response)
        response = await response.blob()
        if (response.size > 0) {
            setTimeout(() => {
                response = URL.createObjectURL(response);
                this.setState({ imageUrl: response, loading: false })
            }, 500)
        } else {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 500)
        }

        let res = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/EMP-205', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        res = await res.blob()
        if (res.size > 0) {
            res = URL.createObjectURL(res);
            this.setState({ imageEmp: res })
        }
    }

    async getReport() {
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/pph.report', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                'Content-Type': 'application/pdf',
            }
        })

        console.log(response)
        response = await response.blob()
        console.log(response)
        if (response.size > 0) {
            response = URL.createObjectURL(response);
            this.setState({ reportURL: response })
        }
    }

    async getDetail(value) {
        let res = await API.create('CFG').getParentOrgStruct(value)
        console.log('res detail', res)
        if (res.data && res.data.status === 'S') {
            let dataTableDetail = res.data.data
            this.setState({
                dataTableDetail
            })
        } else {
            this.setState({
                dataTableDetail: []
            })
        }
    }

    async getES() {
        let res = await API.create('CFG').getCorporateOrgStructureTplById(this.state.data.orgStructureTPLId)
        if (res.data && res.data.status === "S") {
            this.setState({ esData: res.data.data && res.data.data.orgStructureTPLDetails ? res.data.data.orgStructureTPLDetails[0] : [] })
        } else {
            alert(res.data && res.data.message ? res.data.message : res.problem)
        }
    }

    componentDidMount() {
        this.getAllBizpar()
        this.getImage()
        this.getDetail(this.state.data.orgStructureTPLId)
        this.getES()
        this.getBizparPosition()
    }

    componentDidUpdate(prevProps) {
        if (this.props.rawData !== prevProps.rawData) {
            let data = { ...this.props.rawData, orgStructureTPLStatus: this.props.rawData.orgStructureTPLStatus === 'ACTIVE' ? true : false }
            // this.props.rawData
            this.setState({
                data
            }, () => {
                this.getImage()
                this.getDetail(data.orgStructureTPLId)
                this.getES()
            })
        }

    }

    cardMain = (name, about, job, report) => {
        if (report === '') {
            var bot = ''
        } else {
            bot = (
                <div className="co-bot">
                    <div className="txt-site txt-9 txt-primary">{report}</div>
                </div>
            )
        }
        return (
            <div className="card-org">
                <div className="co-top co-grid">
                    <div className="co-col-1">
                        <div className="image image-45px image-center image-circle background-dark-grey"></div>
                        <div className="margin-top-5px">
                            <div className="txt-site txt-center txt-9 txt-bold color-post">{job}</div>
                        </div>
                    </div>
                    <div className="co-col-2">
                        <div className="margin-top-5px">
                            <div className="txt-site txt-11 txt-bold txt-main">{name}</div>
                        </div>
                        <div className="margin-bottom-5px">
                            <div className="txt-site txt-10 txt-primary">{about}</div>
                        </div>
                    </div>
                </div>
                {bot}
            </div>
        )
    }

    cardSpace = (title, report) => {
        if (report === '') {
            var bot = ''
        } else {
            bot = (
                <div className="txt-site txt-9 txt-primary">{report}</div>
            )
        }
        return (
            <div className="card-org">
                <div className="co-top display-flex-normal">
                    <div className="width width-40px">
                        <div className="image image-40px image-circle background-blue">
                            <img src={this.state.imageEmp} alt='' />
                        </div>
                    </div>
                    <div className="margin-left-10px">
                        <div className="txt-site txt-middle">
                            <div className="txt-site txt-11 txt-thin txt-main">{title}</div>
                            {bot}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderChildren = (data) => {
        return (
            <ul style={{ whiteSpace: 'nowrap' }}>
                {data.ouchildren.map((data, index) => {
                    return (
                        <li>
                            <label for={'child-' + data.ouid} style={{ flexWrap: 'wrap' }}>
                                {data.ouposition === null ? '' : this.cardSpace(data.ouposition.bizparValue, '')}
                            </label>
                            <input
                                checked={true}
                                id={'child-' + data.ouid}
                                className="tree-button"
                                type="checkbox" />
                            {data.ouchildren.length > 0 && this.renderChildren(data)}
                        </li>
                    )
                })}
            </ul>
        )
    }

    renderOrgChart = () => {
        let { esData } = this.state
        if (esData && esData.ouposition) {
            return (
                <div className="tree hidden background-dark-grey">
                    <ul style={{ whiteSpace: 'nowrap' }}>
                        <li>
                            <label for='parent'>
                                {this.cardSpace(esData.ouposition.bizparValue, '')}
                            </label>
                            <input
                                id='parent'
                                checked={true}
                                className="tree-button"
                                type="checkbox" />
                            {esData.ouchildren.length > 0 && this.renderChildren(esData)}
                        </li>
                    </ul>
                </div>
            )
        }
    }

    render() {
        let { orgStructureTPLId, orgStructureTPLName, orgStructureTPLStatus, orgStructureTPLPhotoURL } = this.state.data
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-sitemap"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Organization Structure Template
                                </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                onClick={this.props.closeSlide}
                                className="btn btn-circle btn-grey">
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="a-s-p-mid a-s-p-pad border-bottom">
                    <form action='#'
                    // onSubmit={(e) => {
                    //     e.preventDefault()
                    //     this.props.onClickSave(this.state.data, 'org')
                    // }}
                    >
                        <div>
                            <div className="app-open-close margin-bottom-20px">
                                <input
                                    type="checkbox"
                                    name="navmenu"
                                    className="app-open-close-input"
                                    id="navmenu-cah" />
                                <div className="grid grid-2x margin-bottom-10px">
                                    <div className="col-1">
                                        <div className="display-flex-normal margin-top-10px">
                                            <i className="fa fa-1x fa-sitemap margin-right-5px"></i>
                                            <span className="txt-site txt-11 txt-main">Organization Structure Template Header</span>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-cah">
                                            <div className="app-open-close-icon"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="app-open-close-content">
                                    <div>
                                        <div className="margin-15px">
                                            <div>
                                                <div className="margin-30px">
                                                    <div className="image image-100px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                                        {this.state.loading && (
                                                            <Loader
                                                                type="ThreeDots"
                                                                style={{ display: 'flex', justifyContent: 'center', marginTop: 45 }}
                                                                color={"#somecolor"}
                                                                height={30}
                                                                width={30}
                                                                loading={this.state.loading} />
                                                        )}
                                                        {!R.isNil(orgStructureTPLPhotoURL) && !R.isEmpty(orgStructureTPLPhotoURL) ? (
                                                            <img width="100%" height="100%" src={this.state.imageUrl} alt="" />
                                                        ) : this.state.loading === true ? <i /> : <i className="icn fa fa-2x fa-image"></i>
                                                        }
                                                        {/* <i className="icn fa fa-2x fa-user"></i> */}
                                                    </div>
                                                </div>

                                                <div className="txt-site txt-13 txt-bold txt-main content-center">
                                                    <input
                                                        type="file"
                                                        id="pick-image"
                                                        style={{ display: "none" }}
                                                        onChange={this.handleChange} />
                                                    <label htmlFor="pick-image">
                                                        <div className="btn btn-div btn-grey-dark">
                                                            <i className="fa fa-1x fa-upload margin-right-10px"></i>
                                                            Pick Image
                                                         </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="margin-15px">
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Template ID: {orgStructureTPLId}</h4>
                                                </div>
                                                <div className="margin-5px">
                                                    <p className="txt-site txt-11 txt-primary">
                                                        The Organization Strcuture template menu is to be used to create detail Organization Strcuture template.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Template Name <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                                <div className="margin-5px">
                                                    <div className="card-date-picker">
                                                        <div className="double">
                                                            <input
                                                                type="text"
                                                                className="txt txt-sekunder-color"
                                                                placeholder=""
                                                                required
                                                                value={orgStructureTPLName}
                                                                onChange={(e) => this.setState({
                                                                    data: {
                                                                        ...this.state.data,
                                                                        orgStructureTPLName: e.target.value
                                                                    }
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Activation</h4>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" checked={orgStructureTPLStatus}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    orgStructureTPLStatus: e.target.checked
                                                                }
                                                            })}
                                                            disabled
                                                        />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate Now
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </div>
                            </div>

                            <div className="app-open-close margin-bottom-20px">
                                <input
                                    type="checkbox"
                                    name="navmenu"
                                    className="app-open-close-input"
                                    id="navmenu-cih" />
                                <div className="grid grid-2x margin-bottom-10px">
                                    <div className="col-1">
                                        <div className="display-flex-normal margin-top-10px">
                                            <i className="fa fa-1x fa-sitemap margin-right-5px"></i>
                                            <span className="txt-site txt-11 txt-main"> Organization Structure Template Detail</span>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-cih">
                                            <div className="app-open-close-icon"></div>
                                        </label>
                                        <button
                                            type='button'
                                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                                            onClick={() => this.opPopupPage("popup-org")}>
                                            <i className="fa fa-lw fa-plus" />
                                        </button>
                                    </div>
                                </div>
                                {this.state.createOrg &&
                                    <FormCreateOrg
                                        bizparCorporateLevel={this.state.bizparCorporateLevel}
                                        bizparCorporateGrade={this.state.bizparCorporateGrade}
                                        bizparCorporatePosition={this.state.bizparCorporatePosition}
                                        getBizparPosition={(value) => this.getBizparPosition}
                                        rawData={this.props.rawData}
                                        dataTableDetail={this.state.dataTableDetail}
                                        rawDataPayroll={this.props.rawDataPayroll}
                                        rawDataTax={this.props.rawDataTax}
                                        rawDataCNB={this.props.rawDataCNB}
                                        rawDataFacility={this.props.rawDataFacility}
                                        onClickSave={this.props.onClickSave.bind(this)}
                                        onClickClose={() => this.opPopupPage("popup-org")}
                                    />
                                }
                                <div className="app-open-close-content">
                                    <TableOrgDetail
                                        bizparCorporateLevel={this.state.bizparCorporateLevel}
                                        bizparCorporateGrade={this.state.bizparCorporateGrade}
                                        bizparCorporatePosition={this.state.bizparCorporatePosition}
                                        dataTableDetail={this.state.dataTableDetail}
                                        rawDataPayroll={this.props.rawDataPayroll}
                                        rawDataTax={this.props.rawDataTax}
                                        rawDataCNB={this.props.rawDataCNB}
                                        rawDataFacility={this.props.rawDataFacility}
                                        onClickSave={this.props.onClickSave.bind(this)}
                                        onClickClose={() => this.opPopupPage("popup-org")}
                                        data={this.props.rawData} />
                                </div>
                            </div>

                            <div className="app-open-close margin-bottom-20px">
                                <input
                                    type="checkbox"
                                    name="navmenu"
                                    className="app-open-close-input"
                                    id="navmenu-cuh" />
                                <div className="grid grid-2x margin-bottom-10px">
                                    <div className="col-1">
                                        <div className="display-flex-normal margin-top-10px">
                                            <i className="fa fa-1x fa-sitemap margin-right-5px"></i>
                                            <span className="txt-site txt-11 txt-main"> Organization Structure Template Visualization</span>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <button
                                            type="button"
                                            onClick={this.openChart.bind(this)}
                                            className="btn btn-small-circle btn-sekunder margin-left-5px">
                                            <i className="fa fa-lw fa-expand-arrows-alt" />
                                        </button>
                                    </div>
                                    {this.state.chartVisible && (
                                        <div className="app-popup app-popup-show">
                                            <div className="padding-top-20px" />
                                            <div className="popup-content background-white border-radius" style={{ width: 1500 }}>

                                                <div className="popup-panel grid grid-2x">
                                                    <div className="col-1">
                                                        <div className="popup-title">
                                                            Org Structure Template Visualization: {this.state.data.orgStructureTPLId}
                                                        </div>
                                                    </div>
                                                    <div className="col-2 content-right">
                                                        <button
                                                            type="button"
                                                            className="btn btn-circle btn-grey"
                                                            onClick={this.openChart.bind(this)}>
                                                            <i className="fa fa-lg fa-times" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="display-flex-normal" style={{ justifyContent: "center" }}>
                                                    {this.state.esData && this.state.esData.ouposition ? this.renderOrgChart() : <div style={{ padding: "15px", margin: "15px" }}> Visualization Not Found </div>}
                                                </div>
                                                <div className="padding-10px content-right">
                                                    <button
                                                        style={{ marginLeft: "15px" }}
                                                        className="btn btn-primary"
                                                        type="button"
                                                        onClick={this.openChart.bind(this)}
                                                    >
                                                        <span>CLOSE</span>
                                                    </button>
                                                </div>
                                                <div className="margin-bottom-15px"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="app-open-close-content">
                                    {this.renderOrgChart()}
                                </div>
                            </div>
                        </div>
                        <div className="display-flex-normals margin-bottom-15px">
                            <div className="border-top padding-top-20px">
                                <div className="grid grid-2x">
                                    <div className="col-1 content-left">

                                    </div>
                                    <div className="col-2 content-right">
                                        <button
                                            type="button"
                                            className="btn btn-blue"
                                            onClick={() => {
                                                if (R.isEmpty(this.state.data.orgStructureTPLName)) return alert('Organization Structure Template Name is Required.')
                                                this.props.onClickSave(this.state.data, 'org')
                                            }}>
                                            SAVE
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.opPopupPage("popup-org")}
                    />
                )}
                <ReactTooltip />
            </div >
        )
    }
}

export default EditOrg