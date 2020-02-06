import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import MasterdataAction from '../../../Redux/MasterdataRedux';
import { connect } from 'react-redux';
import Api from "../../../Services/Api";
// import FormEducation from "../../forms/formMasterData/formEducation";
// import API from "../../../Services/Api"
// import M from "moment"

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormEducationInstitute extends Component {
    constructor(props) {
        super(props);
        let { educationData, bizparEduLevel, bizparEduType } = this.props
        this.state = {
            dataIns: [],
            dataTableIns: [],
            selectedIndex: [],
            rawData: [],
            fetching: false,
            refreshing: false,
            formInstituteVisible: false,
            createVisible: false,
            educationData: educationData,
            bizparEduLevel, bizparEduType
        };
    }

    componentDidMount() {
       this.getDataInstitute()
    }

    async getDataInstitute() {     
        let payload = {
            "params": {
                "instituteStatus": "ACTIVE"
            },
            "offset": 0,
            "limit": 100
        }
        let response = await Api.create("MASTERDATA").getInstituteByStatus(payload)
        if (response.data && response.data.status === "S") {
            let dataTableIns = response.data.data.map((value) => {
                const { instituteID, instituteName, instituteAddress, instituteStatus } = value;
                return [
                    instituteID,
                    instituteName,
                    instituteAddress,
                    instituteStatus
                ]
            })
            this.setState({
                rawData: response.data.data,
                dataTableIns
            })
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    columns = [
        "Institute ID",
        "Institute Name",
        "Institute Address",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                className="btn btn-circle background-blue"
                                type="button"
                                onClick={
                                    () => this.props.onClick(tableMeta.rowIndex, this.state.rawData)
                                }

                            >
                                <i className="fa fa-lw fa-plus"/>
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    // addInstitute(value) {
    //     let { rawData } = this.state
    //     // console.log('value', value)
    //     // console.log('rawdata', JSON.stringify(rawData[value]))
    //     let selectedInstitute = rawData[value]

    //     let dataIns = Object.assign([], this.state.dataIns)
    //     // return console.log('selected', selectedInstitute)
    //     delete selectedInstitute.privileges
    //     dataIns.push(
    //         {
    //             ...rawData[value],
    //             // "educationConfigurationID": "EDUCON-" + Date.now(),
    //             // "educationConfigurationInstitutes": ["INSTITUTE-01", "INSTITUTE-02", selectedInstitute.instituteID],
    //             // "educationConfigurationDepartements": ["EDUDEP-001", "EDUDEP-002"],
    //             // "educationConfigurationType": '',
    //             // "educationConfigurationLevel": '',
    //             // "educationConfigurationStatus": 'ACTIVE',
    //             // "educationConfigurationCreationalSpecificationDTO": {
    //             // }
    //             "educationConfigurationInstitutes": selectedInstitute.instituteID
    //         });

    //     this.setState({
    //         dataIns,
    //         formInstituteVisible: true
    //     })
    //     // return console.log(JSON.stringify(dataIns))
    //     // console.log(JSON.stringify(dataIns))
    // }

    // openCreateForm = () => {
    //     this.setState({ createVisible: !this.state.createVisible })
    // };

    // handleSubmit = async (data) => {
    //     let dtIns = this.state.dtIns
    //     if (this.props.type === "create") {
    //         dtIns = this.state.dataIns.map((data) => {
    //             // console.log('educationConfigurationInstitutes: [', data.instituteID,']')
    //             return data.instituteID
    //         })
    //     }
    //     console.log('data', JSON.stringify(data))
    //     console.log('data Institute', JSON.stringify(dtIns))
    //     let payload = {
    //         ...data,
    //         // educationConfigurationInstitutes: ["INSTITUTE-01", "INSTITUTE-02"],
    //         educationConfigurationInstitutes: dtIns,
    //         educationConfigurationDepartements: ["EDUDEP-001", "EDUDEP-002"],
    //         educationConfigurationType: data.educationConfigurationType.bizparKey,
    //         educationConfigurationLevel: data.educationConfigurationLevel.bizparKey,
    //         educationConfigurationStatus: 'ACTIVE',
    //         educationConfigurationCreationalSpecificationDTO: {
    //             createdDate: M().format("DD-MM-YYYY HH:mm:ss")
    //         }
    //     }
    //     return console.log('payload',JSON.stringify(payload))
    //     console.log('data Institute', JSON.stringify(payload))
    //     let response = await API.create('MASTERDATA').postEducation(payload)
    //     if (response.ok && response.data.status == 'S') {
    //         this.setState({
    //             savePopUpVisible: true
    //         });
    //     } else {
    //         if (response.data && response.data.message) alert(response.data.message)
    //     }
    // }

    // handlePopUp = () => {
    //     this.props.getEducation({
    //         "limit": 20,
    //         "offset": 0,
    //         "params": {
    //             "educationConfigurationStatus": "ACTIVE"

    //         }
    //     });
    //     this.setState({
    //         savePopUpVisible: false,
    //         createVisible: false,
    //         editVisible: false
    //     })
    // }

    render() {
        // let dtIns = []
        // if (this.props.type === "create") {
        //     dtIns = this.state.dataIns.map((data) => {
        //         // console.log('educationConfigurationInstitutes: [', data.instituteID,']')
        //         return [data.instituteID]
        //     })
        // } else if (this.props.type === "edit") {
        //     dtIns = this.state.rawData[this.state.selectedIndex].educationConfigurationInstitutes.map((data) => {
        //         // console.log('dataID ', data.instituteID)
        //     })
        // }
        return (
            <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Institute - Search Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action="#">
                        <div className="padding-25px">
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title='Institute List'
                                    data={this.state.dataTableIns}
                                    columns={this.columns}
                                    options={options}

                                />
                            </MuiThemeProvider>
                        </div>

                    </form>
                    {/* {this.state.formInstituteVisible && (
                        <FormEducation
                            type={this.props.type === "create" ? "create" : "edit"}
                            dtIns={this.state.dtIns}
                            educationData={this.state.educationData}
                            dataIns={this.state.dataIns}
                            bizparEduLevel={this.state.bizparEduLevel}
                            bizparEduType={this.state.bizparEduType}
                            onClickClose={this.openCreateForm.bind(this)}
                            onClickSave={this.handleSubmit.bind(this)}
                        />
                    )} */}
                    
                </div>


            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        masterdata: state.masterdata
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getInstitute: obj => dispatch(MasterdataAction.getInstitute(obj))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormEducationInstitute);