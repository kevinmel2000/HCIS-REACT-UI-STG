import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormPayrollStructure from "./formPayrollStructure";
import PopUp from '../../../components/pages/PopUpAlert';

let ct = require("../../custom/customTable")

class FormMovementPayrollStructure extends Component {

    constructor() {
        super()
        this.state = {
            createVisible: false,
            createPopUpVisible: false,
            deletePopUpVisible: false,
            editVisible: false,
            saveClass: 'app-popup',
        }

    }

    openSavePopUp = () => {
        if ((this.state.saveClass === "app-popup app-popup-show")) {
          this.setState({saveClass: "app-popup"});
        } else {
          this.setState({ saveClass: "app-popup app-popup-show" });
        }
    };

    openCloseCreate() {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({ createVisible: !this.state.createVisible, createPopUpVisible })
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    
    options = ct.customOptions()

    columns = [
        {
            name: "BEFORE",
            options: {
            filter: false,
            customHeadRender: (columnMeta, updateDirection) => (
                <th key={columnMeta.index} style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1}}>
                <div style={{borderBottom: "1px rgba(0,0,0,0.1) solid"}}>{columnMeta.name}</div>
                <div className="grid grid-3x" style={{backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1}}>
                    <div className="col-1">
                    {"Component Name"}
                    </div>
                    <div className="col-2">
                    {"Value"}
                    </div>
                    <div className="col-3">
                    {"Date"}
                        <div className="grid grid-2x">
                            <div className="col-1">
                                {"Join"}
                            </div>
                            <div className="col-2">
                                {"End"}
                            </div>
                        </div>
                    </div>
                </div>
                </th>
            ),
            customBodyRender: (val) => (
                <div className="grid grid-3x">
                <div className="col-1">
                    {val.split("|")[0]}
                </div>
                <div className="col-2">
                    {val.split("|")[1]}
                </div>
                <div className="col-3">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            {val.split("|")[2]}
                        </div>
                        <div className="col-2">
                            {val.split("|")[3]}
                        </div>
                    </div>
                </div>
                </div>
            )}
        },
        {
            name: "AFTER",
            options: {
            filter: false,
            customHeadRender: (columnMeta, updateDirection) => (
                <th key={columnMeta.index} style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1}}>
                <div style={{borderBottom: "1px rgba(0,0,0,0.1) solid"}}>{columnMeta.name}</div>
                <div className="grid grid-3x" style={{backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1}}>
                    <div className="col-1">
                    {"Component Name"}
                    </div>
                    <div className="col-2">
                    {"Value"}
                    </div>
                    <div className="col-3">
                    {"Date"}
                        <div className="grid grid-2x">
                            <div className="col-1">
                                {"Effective"}
                            </div>
                            <div className="col-2">
                                {"End"}
                            </div>
                        </div>
                    </div>
                </div>
                </th>
            ),
            customBodyRender: (val) => (
                <div className="grid grid-3x">
                <div className="col-1">
                    {val.split("|")[0]}
                </div>
                <div className="col-2">
                    {val.split("|")[1]}
                </div>
                <div className="col-3">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            {val.split("|")[2]}
                        </div>
                        <div className="col-2">
                            {val.split("|")[3]}
                        </div>
                    </div>
                </div>
                </div>
            )}
        }
        
    ]

    render () {

        const data = [
            [
                "Basic Salary  | 100000000 | 2019/08/12 | 2019/08/12",
                "Basic Salary | 2000000000 | 2019/08/12 | 2019/08/12"
            ]
        ]

        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="padding-15px grid-mobile-none gap-10px">
                        {this.props.type !== "view" ?
                        <div className="col-2 content-right">
                            <button type="button"
                                onClick={this.openCloseCreate.bind(this)} 
                                style={{ marginRight: 5, marginLeft: "15px" }}
                                className="btn btn-blue" >
                                <span>EDIT</span>
                            </button>
                        </div> : null}
                        <div className="column-1">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                <MuiThemeProvider theme={this.getMuiTheme()}>
                                    <MUIDataTable
                                    data={data}
                                    columns={this.columns}
                                    options={this.options}
                                    />
                                </MuiThemeProvider>
                                </div>
                            </div>
                        </div>
                        {this.state.createVisible && (
                            <FormPayrollStructure
                                label="Movement Payroll Structure - Edit Form"
                                onClose={this.openCloseCreate.bind(this)}
                                onSave={this.openSavePopUp.bind(this)}
                            />
                        )}
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                            {this.props.type !== "view" ?
                                <button
                                style={{ marginLeft: "15px" }}
                                onClick={this.props.onSave}
                                className="btn btn-blue"
                                type="button">
                                <span>SAVE</span>
                                </button> : null}
                            {this.props.type === "edit" ?
                                <button
                                style={{ marginLeft: "15px" }}
                                onClick={this.props.onSave}
                                className="btn btn-blue"
                                type="button">
                                <span>PROCESS</span>
                                </button> : null}
                            <button
                                style={{ marginLeft: "15px" }}
                                className="btn btn-blue"
                                onClick={this.props.onClickClose}
                                type="button">
                                <span>CLOSE</span>
                            </button>
                            </div>
                        </div>
                    </div>
                </form>
                <PopUp type={"save"} class={this.state.saveClass} onClick={this.openSavePopUp} />
            </div>
        )
    }
    

}

export default FormMovementPayrollStructure;