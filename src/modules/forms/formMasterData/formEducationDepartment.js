import React, { Component } from "react";
import API from "../../../Services/Api";
import DropDown from '../../../modules/popup/DropDown';
import * as R from 'ramda'

class FormEducationDepartment extends Component {
    constructor(props) {
        super(props)
        let { educationData } = this.props
        this.state = {
            bizparEduDepartment: [],
            educationData: educationData
        }
    }

    componentDidMount() {
        this.getBizparEduDepartment();
        console.log('edup', this.state.bizparEduDepartment)
    }

    onSelect(event) {
        const selectedIndex = event.target.options.selectedIndex;
        console.log(event.target.options[selectedIndex].getAttribute('data-key'));
    }

    async getBizparEduDepartment() {
        let payloadEduDepartment = {
            params: {
                bizparCategory: "EDUCATION_DEPARTMENT"
            },
            offset: 0,
            limit: 30
        }
        API.create('BIZPAR').getBizparByCategory(payloadEduDepartment).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparEduDepartment: res.data.data
                        })
                    }
                }
            }
        )
    }

    renderForm = () => (
        <div className="padding-15px">
            <div className="column-1">
                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Major <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <DropDown
                        title="-- please select major --"
                        onChange={(dt) => this.setState({
                            bizparKey: dt
                        })}
                        data={this.state.bizparEduDepartment}
                        type="bizpar" />
                    {/* <select
                        className="cf-select slc slc-sekunder"
                        disabled={this.props.type === "view" ? true : false}
                        style={
                            this.props.type === "view"
                                ? { backgroundColor: "#E6E6E6" }
                                : null
                        }
                        onChange={(e) => this.setState({
                            bizparKey: e.target.value

                        })} >
                        <option value="1">-- please select education --</option>
                        {this.state.bizparEduDepartment.map((data, index) => {
                            return (<option key={index} value={index}>{data.bizparKey}</option>)
                        })}
                    </select> */}
                </div>
            </div>
        </div>
    )
    renderFooter = () => (
        <div className="padding-15px">
            <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                    {this.props.type !== "view" ? (
                        <button
                            style={{ marginLeft: "15px" }}
                            className="btn btn-blue"
                            type="button"
                            onClick={() => {
                                if (R.isEmpty(this.state.bizparKey) || R.isNil(this.state.bizparKey)) return alert("Major is Required.")
                                let index = R.findIndex(R.propEq('bizparKey', this.state.bizparKey))(this.state.bizparEduDepartment)
                                this.props.onClick(this.state.bizparEduDepartment, index)
                            }}
                        >
                            <span>SAVE</span>
                        </button>
                    ) : null}
                    <button
                        style={{ marginLeft: "15px" }}
                        className="btn btn-primary"
                        type="button"
                        onClick={this.props.onClickClose}
                    >
                        <span>CLOSE</span>
                    </button>
                </div>
            </div>
        </div>

    )
    render() {
        return (
            <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Major - Search Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose} >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action="#">
                        {this.renderForm()}
                        {this.renderFooter()}
                    </form>
                </div>
            </div>
        )
    }
}
export default FormEducationDepartment