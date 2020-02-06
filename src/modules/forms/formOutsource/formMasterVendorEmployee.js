import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import Dropzone from 'react-dropzone'
import PopUp from '../../../components/pages/PopUpAlert'
import FormOutsourceIdentity from './formOutsourceIdentity'
import FormOutsourceDocument from './formOutsourceDocument'
import FormOutsourceAddress from './formOutsourceAddress'
import FormOutsourceLanguage from './formOutsourceLanguage'
import FormOutsourceWork from './formOutsourceWork'
import FormOutsourceFormalEdu from './formOutsourceFormalEdu'
import FormOutsourceInformalEdu from './formOutsourceInformalEdu'
import FormOutsourceFamily from './formOutsourceFamily'
import FormOutsourceSkill from './formOutsourceSkill'
import M from "moment";
import Api from '../../../Services/Api'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

const dataCreate = {
    "outsourceID": "",
    "outsourceName": "",
    "outsourceStatus": "",
    "employeeID": "",
    "osDefaultBillingRate": "",
    // "osDocs": [],
    "osEmail": "",
    // "osFormalEducation": [],
    "osKITAS": "",
    "osKTP": "",
    "osKtpAddress": "",
    // "osLangs": [],
    "osNoWorkExperienceYear": '',
    "osPhoneHP": "",
    // "osSkillSet": [],
    // "osWorkExperience": [],
    "osVendorID": "",
    "osDateOfBirth": "",
    "osPlaceOfBirth": "",
    "osGender": "",
    "osReligion": "",
    "createdBy": "",
    "createdDate": '',
}

class FormMasterVendorEmployee extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTable: [],
            rawData: [],
            dataCreate: { ...dataCreate, outsourceID: "OUT-" + M() },
            vendorID: props.vendorID,
            type: props.type,
            createVisible: false,
            editVisible: false,
            viewVisible: false,
            deletePopUpVisible: false,
            savePopUpVisible: false,
            selectedIndex: null,
            imageUrl: "",
            loading: false,
            tabMenu: [
                'Identity',
                // 'Address',
                // 'Family',
                'Formal Education',
                // 'Informal Education',
                'Work Experience',
                'Mastery of Language',
                'Skill Set',
                'Document',
            ],
            activeTab: "Identity",
            formIdentityVisible: true,
            formAddressVisible: false,
            formFamilyVisible: false,
            formFormalEducationVisible: false,
            formInformalEducationVisible: false,
            formDocumentVisible: false,
            formWorkExperienceVisible: false,
            formLanguageSkillVisible: false,
            formSkillVisible: false
        }
    }

    async getDataOutsource(vendorID) {
        let payload = {
            "limit": 50,
            "offset": 0,
            "params": {
                "osVendorID": vendorID
            }
        }
        let res = await Api.create('OUTSOURCE_QUERY').getOutsourceByVendorID(payload)
        if (res.data.status === 'S') {
            let dataTable = res.data.data.map((value) => {
                const { outsourceID, outsourceName, osDateOfBirth, osPlaceOfBirth, osGender, osReligion } = value
                return [
                    outsourceID,
                    outsourceName,
                    osGender,
                    osPlaceOfBirth,
                    osDateOfBirth && M(osDateOfBirth).format('DD-MMM-YYYY'),
                    osReligion
                ]
            })
            this.setState({ dataTable, rawData: res.data.data })
        }
    }

    componentDidMount() {
        this.getDataOutsource(this.state.vendorID)
    }

    componentDidUpdate(prevProps) {
        if (this.props.vendorID !== prevProps.vendorID) {
            this.getDataOutsource(this.props.vendorID)
        }
    }

    async postOutsource(value) {
        let payload = {
            "outsourceID": value.outsourceID,
            "outsourceName": value.outsourceName,
            "outsourceStatus": "ACTIVE",
            "employeeID": "",
            "osDefaultBillingRate": value.osDefaultBillingRate,
            // "osDocs": [],
            "osEmail": value.osEmail,
            // "osFormalEducation": [],
            "osKITAS": value.osKITAS,
            "osKTP": value.osKTP,
            "osKtpAddress": value.osKtpAddress,
            // "osLangs": [],
            "osNoWorkExperienceYear": value.osNoWorkExperienceYear,
            "osPhoneHP": value.osPhoneHP,
            // "osSkillSet": [],
            // "osWorkExperience": [],
            "osVendorID": this.props.vendorID,
            "osDateOfBirth": value.osDateOfBirth,
            "osPlaceOfBirth": value.osPlaceOfBirth,
            "osGender": value.osGender,
            "osReligion": value.osReligion,
            "createdBy": this.props.createdBy,
            "createdDate": M().format('DD-MM-YYYY HH:mm:ss'),
        }
        // return console.log(payload)
        let res = await Api.create('OUTSOURCE').postOutsource(payload)
        if (res.data.status === 'S') {
            this.openPopUp('save')
            this.getDataOutsource(this.props.vendorID)
        }
    }

    async updateOutsource(type, value) {
        let payload = ''
        switch (type) {
            case 'identity':
                payload = {
                    ...value,
                    "outsourceID": value.outsourceID,
                    "outsourceName": value.outsourceName,
                    "outsourceStatus": "ACTIVE",
                    "osDefaultBillingRate": value.osDefaultBillingRate,
                    "osEmail": value.osEmail,
                    "osKTP": value.osKTP,
                    "osKtpAddress": value.osKtpAddress,
                    "osNoWorkExperienceYear": value.osNoWorkExperienceYear,
                    "osPhoneHP": value.osPhoneHP,
                    "osVendorID": this.props.vendorID,
                    "osDateOfBirth": value.osDateOfBirth,
                    "osPlaceOfBirth": value.osPlaceOfBirth,
                    "osGender": value.osGender,
                    "osReligion": value.osReligion,
                    "updatedBy": this.props.createdBy,
                    "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
                }
                break;
            case 'formalEdu':
                // payload = {...value, eduGPA: value.eduGPA && value.eduGPA.replace(/./gi,'')}
                payload = {
                    ...value,
                    "updatedBy": this.props.createdBy,
                    "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
                }
                break;
            case 'workExp':
                payload = {
                    ...value,
                    "updatedBy": this.props.createdBy,
                    "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
                }
            case 'language':
                payload = {
                    ...value,
                    "updatedBy": this.props.createdBy,
                    "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
                }
            case 'skill':
                payload = {
                    ...value,
                    "updatedBy": this.props.createdBy,
                    "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
                }
            default:
                break;
        }
        // return console.log(payload)
        let res = await Api.create('OUTSOURCE').putOutsource(payload)
        if (res.data.status === 'S') {
            this.openPopUp('save')
            this.getDataOutsource(this.props.vendorID)
        }
    }

    async deleteOutsource(index) {
        let payload = {
            "outsourceID": this.state.rawData[index].outsourceID,
            "outsourceStatus": "INACTIVE",
            "updatedBy": this.props.createdBy,
            "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
        }
        let res = await Api.create('OUTSOURCE').deleteOutsource(payload)
        if (res.data.status === 'S') {
            this.setState({ deletePopUpVisible: false })
            this.openPopUp('save')
            this.getDataOutsource(this.props.vendorID)
        }
    }

    columns = [
        "NIK",
        "Employee Name",
        "Gender",
        "Birth Place",
        "Date of Birth",
        "Religion",
        {
            name: "Action",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.index}
                        style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "right", paddingRight: "20px", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        {columnMeta.name}
                    </th>
                ),
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                            {this.state.type !== "view" ?
                                <div>
                                    <button
                                        type='button'
                                        onClick={() => this.openEditForm("edit", tableMeta.rowIndex)}
                                        className="btnAct margin-right-10px">
                                        <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => this.openPopUp("delete", tableMeta.rowIndex)}
                                        className="btnAct margin-right-10px">
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => this.openEditForm("view", tableMeta.rowIndex)}
                                        className="btnAct">
                                        <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div> :
                                <button
                                    type='button'
                                    onClick={() => this.openEditForm("view", tableMeta.rowIndex)}
                                    className="btnAct">
                                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>}
                        </div>
                    )
                }
            }
        }
    ]

    dataCitizenship = [
        {
            "bizparKey": "WNI",
            "bizparValue": "WNI"
        },
        {
            "bizparKey": "WNA",
            "bizparValue": "WNA"
        }
    ]

    opNavigator = (title) => {
        let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
        return (
            <li key={title} className={cl} onClick={this.opContent(title)}>
                {title}
            </li>
        )
    }

    opContent = title => e => {
        e.preventDefault();

        let allStateVisibleFalse = {
            ...this.state,
            formIdentityVisible: false,
            formAddressVisible: false,
            formFamilyVisible: false,
            formFormalEducationVisible: false,
            formInformalEducationVisible: false,
            formWorkExperienceVisible: false,
            formLanguageSkillVisible: false,
            formSkillVisible: false,
            formDocumentVisible: false,
            activeTab: title
        }

        switch (title) {
            case "Identity":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formIdentityVisible: true
                }
                break;
            // case "Address":
            //     allStateVisibleFalse = {
            //         ...allStateVisibleFalse,
            //         formAddressVisible: true
            //     }
            //     break;
            // case "Family":
            //     allStateVisibleFalse = {
            //         ...allStateVisibleFalse,
            //         formFamilyVisible: true
            //     }
            //     break;
            case "Formal Education":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formFormalEducationVisible: true
                }
                break;
                // case "Informal Education":
                //     allStateVisibleFalse = {
                //         ...allStateVisibleFalse,
                //         formInformalEducationVisible: true
                //     }
                break;
            case "Work Experience":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formWorkExperienceVisible: true
                }
                break;
            case "Mastery of Language":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formLanguageSkillVisible: true
                }
                break;
            case "Skill Set":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formSkillVisible: true
                }
                break;
            case "Document":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formDocumentVisible: true
                }
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse);
    }

    openEditForm(type, index) {
        this.setState({ selectedIndex: index })
        switch (type) {
            case "edit":
                this.setState({ editVisible: !this.state.editVisible, type })
                break
            case "view":
                this.setState({ viewVisible: !this.state.viewVisible, type })
                break
            default:
                break
        }
    }

    openCreateForm() {
        this.setState({ createVisible: !this.state.createVisible, type: "create" })
    }


    openPopUp = (type) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, createVisible: false, editVisible: false })
                break
            case "delete":
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
                break
            default:
                break
        }
    }

    renderFormCreate() {
        let { dataCreate } = this.state
        return (
            <div className="app-popup app-popup-show" >
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Employee Outsource - Create Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.openCreateForm.bind(this)}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action="#">
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                            <div className="column-1">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Outsource ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={dataCreate.outsourceID}
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        required
                                        placeholder={"Outsource ID"}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>KTP Number<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        readOnly={this.props.type === 'view'}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder={"KTP Number"}
                                        required
                                        value={dataCreate.osKTP}
                                        onChange={(e) => this.setState({
                                            dataCreate: { ...dataCreate, osKTP: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Name<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        readOnly={this.props.type === 'view'}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder={"Name"}
                                        required
                                        value={dataCreate.outsourceName}
                                        onChange={(e) => this.setState({
                                            dataCreate: { ...dataCreate, outsourceName: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>
                                                Address<span style={{ color: "red" }}>*</span>
                                            </h4>
                                        </div>
                                    </div>
                                    <textarea
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        readOnly={this.props.type === 'view'}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        rows={4}
                                        required
                                        placeholder={"Address"}
                                        value={dataCreate.osKtpAddress}
                                        onChange={(e) => this.setState({
                                            dataCreate: { ...dataCreate, osKtpAddress: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="column-2">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Phone Number</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        readOnly={this.props.type === 'view'}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder={"Phone Number"}
                                        value={dataCreate.osPhoneHP}
                                        onChange={(e) => this.setState({
                                            dataCreate: { ...dataCreate, osPhoneHP: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Email</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        readOnly={this.props.type === 'view'}
                                        type="email"
                                        className="txt txt-sekunder-color"
                                        placeholder={"Email"}
                                        value={dataCreate.osEmail}
                                        onChange={(e) => this.setState({
                                            dataCreate: { ...dataCreate, osEmail: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Work Experience In Year</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        readOnly={this.props.type === 'view'}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder={"Work Experience"}
                                        value={dataCreate.osNoWorkExperienceYear}
                                        onChange={(e) => this.setState({
                                            dataCreate: { ...dataCreate, osNoWorkExperienceYear: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Default Billing Rate<span style={{ color: "red" }}>*(Day/Month)</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        readOnly={this.props.type === 'view'}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder={"Default Billing"}
                                        required
                                        value={dataCreate.osDefaultBillingRate}
                                        onChange={(e) => this.setState({
                                            dataCreate: { ...dataCreate, osDefaultBillingRate: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Gender<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        data={[
                                            { bizparKey: 'MALE', bizparValue: 'MALE' },
                                            { bizparKey: 'FEMALE', bizparValue: 'FEMALE' }
                                        ]}
                                        type='bizpar'
                                        title='-- please select gender --'
                                        value={dataCreate.osGender}
                                        onChange={(e) => this.setState({
                                            dataCreate: { ...dataCreate, osGender: e }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Religion<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        data={[
                                            { bizparKey: 'BUDHA', bizparValue: 'BUDHA' },
                                            { bizparKey: 'KRISTEN', bizparValue: 'KRISTEN' },
                                            { bizparKey: 'ISLAM', bizparValue: 'ISLAM' },
                                            { bizparKey: 'HINDU', bizparValue: 'HINDU' },
                                        ]}
                                        type='bizpar'
                                        title='-- please select religion --'
                                        value={dataCreate.osReligion}
                                        onChange={(e) => this.setState({
                                            dataCreate: { ...dataCreate, osReligion: e }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="padding-15px">
                            <div className="col-2 content-right">
                                <button
                                    className="btn btn-blue margin-right-10px"
                                    type="button"
                                    onClick={() => this.postOutsource(dataCreate)}>
                                    <span>SAVE</span>
                                </button>
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.openCreateForm.bind(this)}>
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="margin-bottom-10px"></div>
            </div>
        )
    }

    renderFormEdit(type) {
        let { formIdentityVisible, formAddressVisible, formDocumentVisible, formFamilyVisible, formFormalEducationVisible, formInformalEducationVisible, formWorkExperienceVisible, formLanguageSkillVisible, formSkillVisible } = this.state
        return (
            <div className={'app-popup app-popup-show'}>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Profile
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={() => this.openEditForm(type, this.state.selectedIndex)}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <div className="popup-content-grid">
                        <div className="popup-scroll popup-col-1">
                            <div className="padding-10px">
                                <div
                                    className="image image-160px image-circle margin-bottom-20px"
                                    style={{
                                        margin: "auto",
                                        backgroundColor: "#f8f8f8",
                                    }}>
                                    {(this.state.imageUrl === "")
                                        ? this.state.loading === true ? <i />
                                            : (<i className="icn far fa-user fa-3x" />)
                                        : (<img src={this.state.imageUrl} alt="img" />)
                                    }
                                </div>
                                <div>
                                    {this.props.type !== 'view'
                                        ?
                                        <button
                                            className="btn btn-red btn-small-circle"
                                            type="button"
                                            align="center"
                                            style={{
                                                position: "absolute",
                                                bottom: "30px",
                                                right: "40px"
                                            }}
                                        >
                                            <Dropzone
                                            // onDrop={this.onDrop.bind(this)}
                                            >
                                                {({ getRootProps, getInputProps }) => (
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <i className="fa fa-lw fa-pencil-alt"></i>
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </button>
                                        : null}
                                </div>
                                {this.props.type !== 'view' ?
                                    <div style={{ textAlign: "center" }}>
                                        <span style={{ color: "red", fontSize: 11, marginBottom: 5 }}>*Image max 1Mb</span>
                                    </div> : null}
                            </div>
                            <ul className="vertical-tab">
                                {this.state.tabMenu.map((data, index) => { return this.opNavigator(data) })}
                            </ul>
                        </div>

                        <div className="popup-scroll popup-col-2">
                            {formIdentityVisible &&
                                <FormOutsourceIdentity
                                    data={this.state.rawData[this.state.selectedIndex]}
                                    type={this.state.type}
                                    onClickSave={this.updateOutsource.bind(this)}
                                />}
                            {/* {formAddressVisible && <FormOutsourceAddress type={this.state.type} />} */}
                            {/* {formFamilyVisible && <FormOutsourceFamily type={this.state.type} />} */}
                            {formFormalEducationVisible &&
                                <FormOutsourceFormalEdu
                                    type={this.state.type}
                                    data={this.state.rawData[this.state.selectedIndex]}
                                    onClickSave={this.updateOutsource.bind(this)}
                                />}
                            {/* {formInformalEducationVisible && <FormOutsourceInformalEdu type={this.state.type} />} */}
                            {formWorkExperienceVisible &&
                                <FormOutsourceWork
                                    type={this.state.type}
                                    data={this.state.rawData[this.state.selectedIndex]}
                                    onClickSave={this.updateOutsource.bind(this)}
                                />}
                            {formLanguageSkillVisible &&
                                <FormOutsourceLanguage
                                    type={this.state.type}
                                    data={this.state.rawData[this.state.selectedIndex]}
                                    onClickSave={this.updateOutsource.bind(this)}
                                />}
                            {formSkillVisible &&
                                <FormOutsourceSkill
                                    type={this.state.type}
                                    data={this.state.rawData[this.state.selectedIndex]}
                                    onClickSave={this.updateOutsource.bind(this)}
                                />}
                            {formDocumentVisible &&
                                <FormOutsourceDocument
                                    type={this.state.type}
                                    data={this.state.rawData[this.state.selectedIndex]}
                                    onClickSave={this.updateOutsource.bind(this)}
                                />}
                        </div>
                    </div>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }

    render() {
        let { type, createVisible, editVisible, viewVisible, savePopUpVisible, deletePopUpVisible } = this.state
        return (
            <div>
                {type !== "view" ?
                    <div className="col-2 content-right">
                        <button
                            type="button"
                            className="btn btn-circle background-blue"
                            style={{ marginRight: 10 }}
                            onClick={this.openCreateForm.bind(this)}
                        >
                            <i className="fa fa-1x fa-plus"></i>
                        </button>
                    </div> : null}
                <div className="padding-10px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='Employee Outsource List'
                            subtitle={"lorem ipsum dolor"}
                            data={this.state.dataTable}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>

                {createVisible && this.renderFormCreate()}
                {editVisible && this.renderFormEdit("edit")}
                {viewVisible && this.renderFormEdit("view")}

                {savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.openPopUp("save")}
                    />
                )}
                {deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.openPopUp("delete")}
                        onClickDelete={() => this.deleteOutsource(this.state.selectedIndex)}
                    />
                )}

            </div>
        )
    }
}

export default FormMasterVendorEmployee