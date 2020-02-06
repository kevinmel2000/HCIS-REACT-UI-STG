import React, { Component } from "react";
import PopUp from "../../../pages/PopUpAlert";
import ResizeSlider from "../../../../modules/resize/Slider";
// import API from "../../../../Services/Api";
// import M from "moment";
import * as R from "ramda";
import { connect } from "react-redux";

import TableAllowance from "../tables/tableAllowance";
import FormAllowance from "./create/allowance/createAllowance";
import FormEditAllowance from "./edit/allowance/formEditAllowance";
import Api from "../../../../Services/Api";
import { getBizpar } from "../../../../Services/Utils";

const clSlidePage = "a-s-p-main";

class ConfAllowance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            classAppSlidePage: "app-side-page",
            classAppSlidePageMain: clSlidePage,
            savePopUpVisible: false,
            confirmPopUpVisible: false,
            createAllowance: false,
            deletePopUpVisible: false,
            editAllowance: false,
            // important for resize pane
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            rawData: [],
            data: [],
        };
    }

    componentDidMount() {
        this.getBizparType()
        this.getCNBType()
        this.getData()
    }

    getCNBType(){
        let array = []
        Api.create('CFG').getAllCnBComponentAllowance().then((res) => {
            if (res.data.code === "201") {
                res.data.data.map((item, index) => {
                    array.push({
                        bizparKey: item,
                        bizparValue: item,
                        bizparStatus: 'ACTIVE'
                    })
                })
                this.setState({ cnbType : array })
            }
        })
    }

    getData(){
        this.refs.child.getData(0, 5);
    }

    getBizparType = async () => {
        let bizparGrade = await getBizpar('CORPORATE_GRADE') 
        this.setState({
            bizparGrade, 
        }, () => console.log(bizparGrade));
    }

    onSelect = data => {
        this.setState(data)
    }

    // dataTable = [
    //     ["1", "ALLOWANCE-1", "COMPONENT-1", "COMPONENT BARU", "KEY 01", "A", "Rp.500.000", "YES"],
    //     ["2", "ALLOWANCE-2", "COMPONENT-2", "COMPONENT BARU", "KEY 02", "B", "Rp.1.500.000", "YES"],
    //     ["3", "ALLOWANCE-3", "COMPONENT-3", "COMPONENT LAMA", "KEY 03", "C", "Rp.2.500.000", "NO"],
    // ];

    opResizePane = () => {
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        });
    };

    clResizePane = () => {
        this.setState({
            editTalent: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        });
    };

    opSidePage = (menu, index) => e => {
        console.log(index)
        this.setState({
            classAppSlidePage: "app-side-page op-app-side",
            editAllowance: false,
            rawData: index
        });

        this.opResizePane();

        switch (menu) {
            case "slide-talent":
                this.setState({
                    editAllowance: true,
                    index: index
                });
                break;
            default:
                break;
        }
    };

    clSidePage = () => {
        this.setState({ classAppSlidePage: "app-side-page" });
    };

    // openCreateForm = (type = "create") => {
    //   this.clResizePane();
    //   this.setState({ createVisible: !this.state.createVisible, type });
    // };

    opPopupPage = menu => e => {
        e.preventDefault();

        this.setState({
            createAllowance: false
        });

        this.clResizePane();
        switch (menu) {
            case "create-talent":
                this.setState({
                    createAllowance: true,
                    editAllowance: false,
                    sub: "talent",
                    classAppSlidePage: "app-side-page"
                });
                break;
            default:
                break;
        }
    };

    clPopupPage = () => {
        let savePopUpVisible = this.state.savePopUpVisible
            ? !this.state.savePopUpVisible
            : false;
        this.setState({
            createAllowance: false,
            editTalent: false,
            savePopUpVisible
        });
    };

    openSavePopUp = () => {
        this.clResizePane();
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            createAllowance: false,
            editTalent: false,
            classAppSlidePage: "app-side-page"
        });
        this.getData()
    };

    openDeletePopUp = (index, type) => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, rawData: index })
    }

    openConfirmPopUp = data => {
        if (this.state.confirmPopUpVisible) this.getData();
        this.setState({
            data,
            confirmPopUpVisible: !this.state.confirmPopUpVisible
        });
    };

    async handleSubmit(data) {
        let amount =
            !R.isEmpty(data.cnbcomponentAmount) || !R.isNil(data.cnbcomponentAmount)
                ? String(data.cnbcomponentAmount).split(",").join("")
                : data.cnbcomponentAmount;
        let body = {
            "cnbcomponentAllowanceID": data.cnbcomponentAllowanceID,
            "cnbcomponentAllowanceName": data.cnbcomponentAllowanceName,
            "cnbcomponentAllowanceStatus": data.cnbcomponentAllowanceStatus,
            "cnbcomponentAllowanceDescription": data.cnbcomponentAllowanceDescription,
            "cnbcomponentAllowanceType": data.cnbcomponentAllowanceType,
            "cnbcomponentAmount": Number(amount),
            "cnbcomponentGrade": data.cnbcomponentGrade,
            "cnbcomponentKey": data.cnbcomponentKey,
            "cnbcomponentName": data.cnbcomponentName,
            "creationalSpecificationDTO": data.creationalSpecificationDTO
        }
        console.log(body)
        Api.create('CFG').postComponentAllowance(body).then((res) => {
            console.log(res, body)
            this.setState({
                confirmPopUpVisible: !this.state.confirmPopUpVisible
            })
            this.openSavePopUp();
        })

    }

    async handleUpdate(data) {
        // console.log(data)
        let amount =
            !R.isEmpty(data.cnbcomponentAmount) || !R.isNil(data.cnbcomponentAmount)
                ? String(data.cnbcomponentAmount).split(",").join("")
                : data.cnbcomponentAmount;
        let body = {
            "cnbcomponentAllowanceID": data.cnbcomponentAllowanceID,
            "cnbcomponentAllowanceName": data.cnbcomponentAllowanceName,
            "cnbcomponentAllowanceStatus": data.cnbcomponentAllowanceStatus,
            "cnbcomponentAllowanceDescription": data.cnbcomponentAllowanceDescription,
            "cnbcomponentAllowanceType": data.cnbcomponentAllowanceType,
            "cnbcomponentAmount": Number(amount),
            "cnbcomponentGrade": data.cnbcomponentGrade,
            "cnbcomponentKey": data.cnbcomponentKey,
            "cnbcomponentName": data.cnbcomponentName,
            "creationalSpecificationDTO": {
                "modifiedBy": null,
                "modifiedDate": null
            }
        }
        // console.log(body)
        Api.create('CFG').putComponentAllowance(body).then((res) => {
            console.log(res, body)
            this.setState({
                confirmPopUpVisible: !this.state.confirmPopUpVisible
            })
            this.openSavePopUp();
        })
    }

    async handleDelete(data) {
        let body = {
            "referenceID": data.cnbcomponentAllowanceID,
            "requestBy": "SYSTEM",
            "requestDate": null
        }
        console.log(body)
        Api.create('CFG').deleteComponentAllowance(body).then((res) => {
            if (res.data.code === "201") {
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible });
                this.getData()
            }
        })
    }

    render() {
        return (
            <div>
                <ResizeSlider
                    allowResize={this.state.allowResize}
                    defaultSize={this.state.defaultSize}
                    minSize={this.state.minSize}
                    maxSize={this.state.maxSize}
                    main={
                        <div>
                            <div className="a-s-p-place a-s-p-content active">
                                <div className="a-s-p-top">
                                    <div className="grid grid-2x">
                                        <div className="col-1">
                                            <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                                                <div>
                                                    <i className="color-blue fas fa-star margin-right-10px"></i>
                                                </div>
                                                <div>
                                                    <div className="txt-site txt-12 txt-bold txt-main">
                                                        C&B Component ALlowance
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="a-s-p-mid border-top">
                                    <div className="padding-10px">
                                        <div className="app-open-close margin-bottom-20px">
                                            <input
                                                type="checkbox"
                                                name="navmenu"
                                                className="app-open-close-input"
                                                id="navmenu-tl"
                                            />
                                            <div className="grid grid-2x margin-bottom-10px">
                                                <div className="col-1"></div>
                                                <div className="col-2 content-right">
                                                    <label htmlFor="navmenu-tl">
                                                        <div className="app-open-close-icon"></div>
                                                    </label>
                                                    <button
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px"
                                                        onClick={this.opPopupPage("create-talent")}
                                                    >
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                                {this.state.createAllowance && (
                                                    <FormAllowance
                                                        type="create"
                                                        cnbType={this.state.cnbType}
                                                        bizparComponent={this.state.bizparComponent}
                                                        bizparGrade={this.state.bizparGrade}
                                                        onClickSave={this.openConfirmPopUp.bind(this)}
                                                        onClickClose={this.clPopupPage.bind(this)}
                                                    />
                                                )}
                                            </div>
                                            <div className="app-open-close-content">
                                                <TableAllowance
                                                    ref="child"
                                                    table_query={this.state.table_query}
                                                    table_page={this.state.table_page}
                                                    table_limit={this.state.table_limit}
                                                    allowanceCount={this.state.allowanceCount}
                                                    dataTable={this.state.dataTable}
                                                    openSlide={this.opSidePage.bind(this)}
                                                    onDeletePopup={this.openDeletePopUp.bind(this)}
                                                    getData={this.getData.bind(this)}
                                                    onSelect={this.onSelect}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    side={
                        <div className="a-s-p-side">
                            {/* edit */}
                            {this.state.editAllowance ? (
                                <FormEditAllowance
                                    data={this.state.rawData}
                                    cnbType={this.state.cnbType}
                                    bizparGrade={this.state.bizparGrade}
                                    closeSlide={this.clResizePane}
                                    onClickSave={this.openConfirmPopUp.bind(this)}
                                />
                            ) : null}
                        </div>
                    }
                ></ResizeSlider>

                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openSavePopUp}
                    />
                )}

                {this.state.confirmPopUpVisible && (
                    <PopUp
                        type={"simpan"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openConfirmPopUp.bind(this)}
                        onClickSimpan={
                            this.state.createAllowance === true
                                ? () => this.handleSubmit(this.state.data)
                                : () => this.handleUpdate(this.state.data)
                        }
                    />
                )}

                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp}
                        onClickDelete={() => this.handleDelete(this.state.rawData)
                        }
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps, null)(ConfAllowance);
