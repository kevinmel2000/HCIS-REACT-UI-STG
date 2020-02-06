import React, { Component } from 'react'
import Form from '../../components/pages/FieldForm'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import uuid from "uuid"
import M from 'moment'
import * as R from 'ramda'
import DropDown from '../../modules/popup/DropDown'
import Loader from 'react-loader-spinner'

var ct = require("../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class formUserManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            payloadChangePassword: {
                "userID": this.props.dataUser ? this.props.dataUser.userID : "",
                "oldPassword": "",
                "confirmNewPassword": "",
                "newPassword": "",
                "modifiedAt": M().format("DD-MM-YYYY HH:mm:ss"),
                "modifiedBy": props.user.employeeID
            },
            payloadUser: {
                "userID": uuid.v1(),
                "employee": "",
                "userName": "",
                "password": "",
                "userDesc": "",
                "userStatus": "ACTIVE",
                "userCreationalDTO": {
                    "createdBy": props.user.employeeID,
                    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                    "modifiedBy": props.user.employeeID,
                    "modifiedDate": null
                },
                "listUserRole": []
            },
            showOldPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
            passwordVisible: false,
            urlImage: null,
            selectedDataUser: this.props.selectedDataUser,
            dataEmp: this.props.dataEmp,
            type: this.props.type,
            dataRole: [],
            loading: false,
        }
    }

    async componentDidMount() {
        this.setState({ loading: true })
        if (this.props.selectedDataUser) this.props.getTableRole(this.props.selectedDataUser.listUserRole)
        let { selectedDataUser } = this.props
        if (selectedDataUser) {
            let urlImage = await this.getImage(selectedDataUser.employee.employeeID)
            setTimeout(() => {
                if (urlImage) this.setState({ urlImage, loading: false })
            }, 300);
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.selectedDataUser) {
            if (this.props.selectedDataUser.userID !== prevProps.selectedDataUser.userID) {
                let { selectedDataUser } = this.props
                let urlImage = await this.getImage(selectedDataUser.employee.employeeID)
                this.props.getTableRole(selectedDataUser.listUserRole)
                this.setState({
                    urlImage, selectedDataUser
                })
            }
            if (this.props.type !== prevProps.type) {
                let { selectedDataUser } = this.props
                let urlImage = await this.getImage(selectedDataUser.employee.employeeID)
                this.props.getTableRole(selectedDataUser.listUserRole)
                this.setState({
                    urlImage, selectedDataUser
                })
            }
        }
    }

    columnRole = [
        'Role',
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                onClick={() => this.props.roleButton(tableMeta.rowIndex)}
                                className="btn btn-red btn-small-circle">
                                <i className="fa fa-lw fa-times" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    columnsUser = [
        'Role',
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                // onClick={() => this.addRoleHandler(tableMeta.rowIndex)}
                                className={this.props.searchType === 'employee' ? "btn btn-red btn-small-circle" : "btn btn-blue btn-small-circle"}
                                // style={this.props.searchType === 'employee' ? { backgroundColor: 'transparent', color: 'red', fontSize: 20} : { backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}
                                onClick={this.props.type === "create" ? () => this.props.roleUpdateButton(tableMeta.rowIndex) : () => this.props.roleUpdateButton(tableMeta.rowIndex, "updateRole")}
                            // onClick={this.props.type === 'create' ? () => console.log(this.props.type) :  console.log(this.props.type)}
                            >
                                <i className={this.props.searchType === 'employee' ? "fa fa-lw fa-times" : "fa fa-lw fa-plus"} />                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    columnsDetail = ["Role"]

    async getImage(employeeID) {
        let response = await fetch(
            process.env.REACT_APP_HCIS_BE_API + "emcmd/api/employee.photo.get/" +
            employeeID,
            {
                headers: {
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
                }
            }
        );
        response = await response.blob();
        if (response.size > 0) { 
            response = URL.createObjectURL(response);
            return response
        } else {
            return null
        }
    }

    renderUser() {
        let { dataEmp, type, selectedDataUser } = this.props
        // let { urlImage } = this.state
        // let { payloadUser } = this.state
        let payload = {}
        let image = this.props.img
        let email = ''
        let emailCompany = ''
        if (selectedDataUser !== null) {
            email = selectedDataUser && selectedDataUser.employee && !R.isNil(selectedDataUser.employee.employeeEmails) ? selectedDataUser.employee.employeeEmails : ""
            let indexCompany = R.findIndex(R.propEq('employeeEmailType', "COMPANY"))(email)
            if (indexCompany >= 0) emailCompany = email[indexCompany].employeeEmail
        }

        let empEmail = dataEmp && !R.isNil(dataEmp.employeeEmails) ? dataEmp.employeeEmails : ""
        let indexCompany = R.findIndex(R.propEq('employeeEmailType', "COMPANY"))(empEmail)
        if (indexCompany >= 0) emailCompany = empEmail[indexCompany].employeeEmail

        switch (type) {
            case "update":
                payload = {
                    userID: selectedDataUser ? selectedDataUser.userID : "",
                    employeeID: selectedDataUser && selectedDataUser.employee ? selectedDataUser.employee.employeeID : "",
                    employee: selectedDataUser && selectedDataUser.employee ? selectedDataUser.employee.employeeName : "",
                    email: selectedDataUser && selectedDataUser.employee && selectedDataUser.employee.employeeEmails ? emailCompany : "",
                    username: selectedDataUser ? selectedDataUser.userName : "",
                    password: selectedDataUser ? selectedDataUser.password : "",
                    usertype: selectedDataUser ? selectedDataUser.userDesc : "",
                    userstatus: selectedDataUser ? selectedDataUser.userStatus : "",
                    listuserrole: selectedDataUser ? selectedDataUser.listUserRole : ""
                }
                break;
            case "create":
                payload = {
                    employee: dataEmp ? dataEmp.employeeName : "",
                    email: dataEmp ? emailCompany : "",
                    username: "",
                    usertype: "",
                    userstatus: "ACTIVE"
                }
                break;
            case "detail":
                payload = {
                    employee: selectedDataUser.employee.employeeName,
                    email: emailCompany,
                    username: selectedDataUser.userName,
                    password: selectedDataUser.password,
                    usertype: selectedDataUser.userDesc,
                    userstatus: selectedDataUser.userStatus,
                    listuserrole: selectedDataUser.listUserRole
                }
                break;
            default:
                break
        }
        return (
            <div className={this.props.className}>
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === 'create' ? 'User - Create Form' : this.props.type === 'update' ? 'User - Update Form' : 'User - Detail Form'}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle btn-grey" onClick={this.props.onClick}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <form action="#">
                        <div className="border-bottom padding-15px grid grid-3x grid-mobile-none gap-20px">
                            <div className="column-1 margin-top-20px">
                                <div className="image image-200px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                    {image ? (
                                        <img width="100%" height="100%" src={image} alt="img" />
                                    ) : <i className="icn fa fa-2x fa-user"></i>}
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <Form
                                        label={'Employee'}
                                        mandatory={true}
                                        field={'input'}
                                        value={payload.employee}
                                        style={{ backgroundColor: '#E6E6E6', width: 'calc(100% - 80px)', marginRight: '5px' }}
                                        readOnly={true}
                                        search={true}
                                        type={this.props.type}
                                        onClickSearch={this.props.onClickSearch} />
                                    <Form
                                        label={'Email'}
                                        field={'input'}
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        readOnly={true}
                                        value={payload.email} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <Form
                                        label={'Username'}
                                        mandatory={true}
                                        onChange={(e) => this.setState({ payloadUser: { ...this.state.payloadUser, userName: e.target.value } })}
                                        field={'input'}
                                        value={payload.username}
                                        readOnly={this.props.type !== 'create'}
                                        style={{ backgroundColor: this.props.type === 'create' ? '#fff' : '#E6E6E6' }}
                                    />
                                </div>
                            </div>
                            <div className="column-3">
                                <div className="margin-bottom-20px">
                                    {this.props.type !== 'update' ?
                                        <div className="card-date-picker">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Password <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <div className="double">
                                                <input
                                                    type={this.state.passwordVisible ? "text" : "password"}
                                                    className="input"
                                                    required
                                                    readOnly={this.props.type === 'detail'}
                                                    onChange={(e) => this.setState({
                                                        payloadUser: {
                                                            ...this.state.payloadUser,
                                                            password: e.target.value
                                                        }
                                                    })}
                                                    style={{ padding: "15px", backgroundColor: this.props.type === 'create' ? '#fff' : '#E6E6E6' }}
                                                    value={payload.password}
                                                />
                                                {this.props.type === "create" ?
                                                    <button
                                                        type="button"
                                                        className="btn btn-grey border-left btn-no-radius"
                                                        onClick={this.props.type === "create" ? () => this.setState({ passwordVisible: !this.state.passwordVisible }) : null}
                                                    >
                                                        <i className={this.state.passwordVisible ? "fa fa-lg fa-eye-slash" : "fa fa-lg fa-eye"} />
                                                    </button> : null}
                                            </div>
                                        </div> : null}
                                    {this.props.type === "create" ?
                                        <div className="margin-bottom-15px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>{"User Type"} <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <DropDown
                                                title="-- please select user type --"
                                                onChange={dt =>
                                                    this.setState({
                                                        payloadUser: {
                                                            ...this.state.payloadUser,
                                                            userDesc: dt
                                                        }
                                                    }
                                                    )
                                                }
                                                disabled={type === 'create' ? false : true}
                                                data={[
                                                    { id: '1', title: 'ADMIN', value: 'ADMIN' },
                                                    { id: '2', title: 'USER', value: 'USER' }
                                                ]}
                                                bizValue={payload.employee}
                                                value={payload.employee}
                                            />
                                        </div> : <Form label={'User Type'} mandatory={true} field={'select'} value={payload.usertype} disabled={this.props.type !== 'create'} style={{ backgroundColor: this.props.type === 'create' ? '#fff' : '#E6E6E6' }} placeholder={'-- please select user type --'} />}
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Status <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" checked={payload.userstatus === "ACTIVE" ? true : false} disabled />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    Active
                                            </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="padding-15px">
                            {this.props.type !== 'detail' ?
                                <div className="margin-bottom-15px grid grid-2x">
                                    <div className="col-1"></div>
                                    <div className="col-2 content-right">
                                        <button
                                            type="button"
                                            className="btn btn-circle btn-blue"
                                            style={{ marginRight: 5 }}
                                            onClick={this.props.onClickRole}>
                                            <i className='fa fa-1x fa-plus'></i>
                                        </button>
                                    </div>
                                </div> : null}
                            <div>
                                <MuiThemeProvider theme={getMuiTheme()}>
                                    <MUIDataTable
                                        title={<span> Role List <span style={{ color: "red" }}>*</span></span>}
                                        subtitle={"lorem ipsum dolor"}
                                        data={this.props.dataRole}
                                        columns={this.props.type !== "detail" ? this.columnRole : this.columnsDetail}
                                        options={options}
                                    />
                                </MuiThemeProvider>
                            </div>
                        </div>
                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1"></div>
                                <div className="col-2 content-right">
                                    {type === 'update' ?
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={() => {
                                                if (this.props.dataRole.length === 0 && payload.listuserrole.length === 0) return alert("Role is required")
                                                this.props.onClickUpdate(payload)
                                            }}>
                                            <span>SAVE</span>
                                        </button> : null}
                                    {type !== 'detail' ?
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={() => {
                                                if (type === "create") {
                                                    let payloadCreate = this.state.payloadUser
                                                    payloadCreate = {
                                                        ...payloadCreate,
                                                        employee: !R.isNil(this.props.dataEmp) ? this.props.dataEmp.employeeID : ""
                                                    }
                                                    if (R.isEmpty(payloadCreate.employee)) return alert("Employee is required")
                                                    if (R.isEmpty(payloadCreate.userName)) return alert("Username is required")
                                                    if (R.isEmpty(payloadCreate.password)) return alert("Password is required")
                                                    if (R.isEmpty(payloadCreate.userDesc)) return alert("User Type is required")
                                                    if (this.props.dataRole.length === 0) return alert("Role is required")
                                                    this.props.onClickButton(payloadCreate)
                                                } else this.props.onClickButton()
                                            }}>

                                            <span>{this.props.type === 'create' ? 'SAVE' : this.props.type === 'update' ? 'CHANGE PASSWORD' : null}</span>
                                        </button> : null}
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={this.props.onClick}>
                                        <span>CLOSE</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="padding-bottom-20px"></div>
            </div>
        )
    }

    showPassword = (type) => {
        switch (type) {
            case "old":
                this.setState({ showOldPassword: !this.state.showOldPassword })
                break
            case "new":
                this.setState({ showNewPassword: !this.state.showNewPassword })
                break
            case "confirm":
                this.setState({ showConfirmPassword: !this.state.showConfirmPassword })
                break
            default:
                break
        }
    }

    renderChangePassword() {
        return (
            <div className={this.props.classNameChange}>
                <div className="padding-top-20px"></div>
                <div className="popup-content-small background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Change Password
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle btn-grey" onClick={this.props.onClickChange}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        this.props.onClickSave(this.state.payloadChangePassword)
                    }}>
                        <div className="border-bottom padding-15px grid grid grid-mobile-none gap-20px">
                            <div className="column-1">
                                <div className="card-date-picker">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Old Password <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <div className="double">
                                        <input
                                            type={this.state.showOldPassword ? "text" : "password"}
                                            className="input"
                                            required
                                            onChange={(e) => this.setState({
                                                payloadChangePassword: {
                                                    ...this.state.payloadChangePassword,
                                                    oldPassword: e.target.value,
                                                    userID: this.props.dataUser.userID
                                                }
                                            })}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-grey border-left btn-no-radius"
                                            onClick={this.showPassword.bind(this, "old")}
                                        >
                                            <i className={this.state.showOldPassword ? "fa fa-lg fa-eye-slash" : "fa fa-lg fa-eye"} />
                                        </button>
                                    </div>
                                </div>

                                <div className="card-date-picker">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>New Password <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <div className="double">
                                        <input
                                            type={this.state.showNewPassword ? "text" : "password"}
                                            className="input"
                                            required
                                            onChange={(e) => this.setState({
                                                payloadChangePassword: {
                                                    ...this.state.payloadChangePassword,
                                                    newPassword: e.target.value
                                                }
                                            })}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-grey border-left btn-no-radius"
                                            onClick={this.showPassword.bind(this, "new")}
                                        >
                                            <i className={this.state.showNewPassword ? "fa fa-lg fa-eye-slash" : "fa fa-lg fa-eye"} />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-date-picker">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Confirm New Password <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <div className="double">
                                        <input
                                            type={this.state.showConfirmPassword ? "text" : "password"}
                                            className="input"
                                            required
                                            onChange={(e) => this.setState({
                                                payloadChangePassword: {
                                                    ...this.state.payloadChangePassword,
                                                    confirmNewPassword: e.target.value
                                                }
                                            })}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-grey border-left btn-no-radius"
                                            onClick={this.showPassword.bind(this, "confirm")}
                                        >
                                            <i className={this.state.showConfirmPassword ? "fa fa-lg fa-eye-slash" : "fa fa-lg fa-eye"} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1"></div>
                                <div className="col-2 content-right">
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="submit">
                                        <span>SAVE</span>
                                    </button>
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={this.props.onClickChange}>
                                        <span>CLOSE</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="padding-bottom-20px"></div>
            </div>
        )

    }

    renderUserEdit() {
        let { dataEmp, type, selectedDataUser } = this.props
        let { urlImage } = this.state
        // let {payloadUser} = this.state
        let payload = {}

        let email = ''
        let emailCompany = ''
        let dataRole = this.props.dataRole
        if (selectedDataUser !== null) {
            email = selectedDataUser && selectedDataUser.employee && !R.isNil(selectedDataUser.employee.employeeEmails) ? selectedDataUser.employee.employeeEmails : ""
            let indexCompany = R.findIndex(R.propEq('employeeEmailType', "COMPANY"))(email)
            if (indexCompany >= 0) emailCompany = email[indexCompany].employeeEmail
        }

        let empEmail = dataEmp && !R.isNil(dataEmp.employeeEmails) ? dataEmp.employeeEmails : ""
        let indexCompany = R.findIndex(R.propEq('employeeEmailType', "COMPANY"))(empEmail)
        if (indexCompany >= 0) emailCompany = empEmail[indexCompany].employeeEmail
        switch (type) {
            case "update":
                payload = {
                    userID: selectedDataUser ? selectedDataUser.userID : "",
                    employeeID: selectedDataUser && selectedDataUser.employee ? selectedDataUser.employee.employeeID : "",
                    employee: selectedDataUser && selectedDataUser.employee ? selectedDataUser.employee.employeeName : "",
                    email: selectedDataUser && selectedDataUser.employee && selectedDataUser.employee.employeeEmails ? emailCompany : "",
                    username: selectedDataUser ? selectedDataUser.userName : "",
                    password: selectedDataUser ? selectedDataUser.password : "",
                    usertype: selectedDataUser ? selectedDataUser.userDesc : "",
                    userstatus: selectedDataUser ? selectedDataUser.userStatus : "",
                    listuserrole: selectedDataUser ? selectedDataUser.listUserRole : ""
                }
                // dataRole = this.props.getTableRole(listUserRole)
                break;
            case "detail":
                payload = {
                    employee: selectedDataUser.employee.employeeName,
                    email: emailCompany,
                    username: selectedDataUser.userName,
                    password: selectedDataUser.password,
                    usertype: selectedDataUser.userDesc,
                    userstatus: selectedDataUser.userStatus,
                    listuserrole: selectedDataUser.listUserRole
                }
                break;
            default:
                break
        }
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className='grid grid-2x'>
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-users"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    User - Update Form
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
                <form action="#">
                    <div className='a-s-p-mid a-s-p-pad border-top'>
                        <div className="border-bottom padding-15px">
                            <div className=" image image-200px image-circle background-white border-all margin-bottom-20px" style={{ margin: 'auto' }}>
                                {this.state.loading && (
                                    <Loader
                                        type="ThreeDots"
                                        style={{ display: 'flex', justifyContent: 'center', marginTop: 45 }}
                                        color={"#somecolor"}
                                        height={100}
                                        width={80}
                                        loading={this.state.loading} />
                                )}
                                {urlImage ? <img width="100%" height="100%" src={urlImage} alt="" /> : this.state.loading === true ? <i /> : <i className="icn fa fa-2x fa-user"></i>}
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Employee <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={payload.employee}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Email <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={payload.email}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Username <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={payload.username}
                                />
                            </div>
                            {this.props.type !== 'update' ?
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Password <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="password"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={payload.password}
                                    />
                                </div> : null}

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>{"User Type"} <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <DropDown
                                    title={payload.usertype ? payload.usertype : 'please select user type'}
                                    disabled
                                    bizValue={payload.usertype ? payload.usertype : '-'}
                                // data={[
                                //     { id: '1', title: 'Admin', value: 'ADMIN' },
                                //     { id: '2', title: 'User', value: 'USER' }
                                // ]}
                                />
                            </div>
                            {/* <div className="width width-350px" style={{ alignItems: 'center', textAlign: 'center' }}> */}
                            {/* {urlImage ? <img width="200" height="200" style={{ marginRight: 10, borderRadius: '100%' }} src={urlImage} alt="img" /> : <i className="far fa-lg fa-user-circle" style={{ fontSize: 200, color: '#15AABF', marginTop: 50 }}></i>} */}
                            {/* </div> */}
                            <div className="display-flex-normal">
                                <div className="margin-bottom-20px">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Status <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" checked={payload.userstatus === "ACTIVE" ? true : false} disabled />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    Active
                                            </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="padding-15px">
                            {this.props.type !== 'detail' ?
                                <div className="margin-bottom-15px grid grid-2x">
                                    <div className="col-1"></div>
                                    <div className="col-2 content-right">
                                        <button type="button" className="btn btn-circle background-blue" style={{ marginRight: 5 }} onClick={this.props.onClickRole}>
                                            <i className='fa fa-1x fa-plus'></i>
                                        </button>
                                    </div>
                                </div> : null}
                            <div>
                                <MuiThemeProvider theme={getMuiTheme()}>
                                    <MUIDataTable
                                        title={<span> Role List <span style={{ color: "red" }}>*</span></span>}
                                        subtitle={"lorem ipsum dolor"}
                                        data={dataRole}
                                        columns={this.props.type !== "detail" ? this.columnRole : this.columnsDetail}
                                        options={options}
                                    />
                                </MuiThemeProvider>
                            </div>
                        </div>
                        <div className="padding-15px border-top">
                            <div className="grid grid-3x">
                                <div className="col-1 content-left">
                                    {type === 'update' ?
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={() => {
                                                if (this.props.dataRole.length === 0 && payload.listuserrole.length === 0) return alert("Role is required")
                                                this.props.onClickUpdate(payload)
                                            }}>
                                            <span>SAVE</span>
                                        </button> : null}
                                </div>
                                <div className="col-2 content-center">
                                    {type !== 'detail' ?
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={() => {
                                                if (type === "create") {
                                                    let payloadCreate = this.state.payloadUser
                                                    payloadCreate = {
                                                        ...payloadCreate,
                                                        employee: !R.isNil(this.props.dataEmp) ? this.props.dataEmp.employeeID : ""
                                                    }
                                                    if (R.isEmpty(payloadCreate.employee)) return alert("Employee is required")
                                                    if (R.isEmpty(payloadCreate.userName)) return alert("Username is required")
                                                    if (R.isEmpty(payloadCreate.password)) return alert("Password is required")
                                                    if (R.isEmpty(payloadCreate.userDesc)) return alert("User Type is required")
                                                    if (this.props.dataRole.length === 0) return alert("Role is required")
                                                    this.props.onClickButton(payloadCreate)
                                                } else this.props.onClickButton()
                                            }}>

                                            <span>{this.props.type === 'create' ? 'SAVE' : this.props.type === 'update' ? 'CHANGE PASSWORD' : null}</span>
                                        </button> : null}

                                </div>
                                <div className='col-3 content-right'>
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={this.props.closeSlide}>
                                        <span>CLOSE</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        )
    }

    render() {
        return (
            this.props.formType === 'user' ?
                this.renderUser() :
                this.props.formType === 'userEdit' ?
                    this.renderUserEdit() :
                    this.props.formType === 'change' ?
                        this.renderChangePassword() :
                        <div className={this.props.classNameSearch}>
                            <div className="padding-top-20px"></div>
                            <div className="popup-content background-white border-radius">
                                <div className="popup-panel grid grid-2x">
                                    <div className="col-1">
                                        <div className="popup-title">
                                            {this.props.searchType === 'employee' ? 'Employee - Search Form' : 'Role - Search Form'}
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-grey btn-circle"
                                            type="button"
                                            onClick={this.props.onClickSearch}>
                                            <i className="fa fa-lg fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="padding-15px border-bottom">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title={this.props.searchType === 'employee' ? 'Employee List' : 'Role List'}
                                            data={this.props.searchType === 'employee' ? this.props.dataEmployee : this.props.dataUser}
                                            columns={this.props.searchType === 'employee' ? this.props.columnsEmployee : this.columnsUser}
                                            options={options}
                                        />
                                    </MuiThemeProvider>
                                </div>
                                <div className="padding-15px">
                                    <div className="grid grid-2x">
                                        <div className="col-1"></div>
                                        <div className="col-2 content-right">
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={this.props.onClickSearch}>
                                                <span>CLOSE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="padding-bottom-20px"></div>
                        </div>

        )
    }
}

export default formUserManagement