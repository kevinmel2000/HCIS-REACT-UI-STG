import React, { Component } from 'react'
//import Form from '../../components/pages/FieldForm'
import FormSearchUpload from "../../../modules/forms/formTraining/formSearchUploadScore";

import CalendarPicker from '../../../modules/popup/Calendar';

class FormScrUploadCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchVisible: false,
            file: ""
        }
    }

    dataDocument = [
        ["Document.pdf"]
    ]

    openSearchForm = () => {
        this.setState({ searchVisible: !this.state.searchVisible })
    };

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-15px">
                        <div className="card-date-picker margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Training Type<span style={{ color: "red" }}>*</span></h4>
                                </div>
                            </div>
                            <div className="double">
                            <input
                                className='input'
                                type="text"
                                placeholder=""
                            />
                            <button
                                disabled={false}

                                className={"btn btn-grey border-left btn-no-radius"}
                                type="button"
                                onClick={this.openSearchForm}
                            >
                                <i className="fa fa-lg fa-search"></i>
                            </button>
                            </div>
                        </div>

                        <div className="margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Training Name<span style={{ color: "red" }}>*</span></h4>
                                </div>
                            </div>
                            <textarea
                                readOnly={this.props.type === "view" ? true : false}
                                style={{ backgroundColor: "#E6E6E6", height: 95 }}
                                type="text"
                                className="txt txt-sekunder-color"
                                placeholder=""
                                required
                            />
                        </div>

                        <div className="margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Date<span style={{ color: "red" }}>*</span></h4>
                                </div>
                            </div>
                            <div className="display-flex-normal width width-full">
                                <CalendarPicker
                                // disabled={this.props.type === 'view' ? true : false}
                                // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                                onChange={(e) => {
                                    console.log(e)
                                }} />
                                <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                                To
                                                    </div>
                                <CalendarPicker
                                // disabled={this.props.type === 'view' ? true : false}
                                // date={this.state.employeeDataWorkExp.workExperienceEndDate}
                                onChange={(e) => {
                                    console.log(e)
                                }} />
                            </div>
                        </div>

                        {/* <div className="margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Date<span style={{ color: "red" }}>*</span> (dd-mm-yyyy)</h4>
                                </div>
                            </div>
                            <input
                                type="date"
                                readOnly
                                style={{ backgroundColor: '#E6E6E6',width:'45%', marginRight: 6 }}
                                className="txt txt-sekunder-color"
                                placeholder="" />
                            to
                              <input
                                type="date"
                                readOnly
                                style={{ backgroundColor: "#E6E6E6",width:'45%', marginLeft: 6 }}
                                className="txt txt-sekunder-color"
                                placeholder="" />
                        </div> */}
                        
                        <div className="margin-bottom-20px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>File Generate Score</h4>
                            </div>
                            <div className="padding-10px">
                            <button
                                className="btn btn-red btn-small-circle"
                                // style={{ marginRight: 5}, {style: "text-align:center" }}
                                onClick={() =>
                                    this.openEditForm()
                                }
                            >
                                <i className="fas fa-file-pdf"></i>
                            </button>
                            </div>
                        </div>

                        <div className="margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Excel Upload</h4>
                                </div>
                            </div>
                            <input
                                type="file"
                                id="upload-image-company-document"
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-blue"
                                onClick={() => this.uploadDocument(this.state.formData)}> Upload </button>
                        </div>
                    </div>

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={() => {
                                            this.props.onClickSave()
                                        }}
                                    >
                                        <span>DO IMPORT</span>
                                    </button>
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
                    {this.state.searchVisible && (
                        < FormSearchUpload
                            onClickClose={this.openSearchForm}
                        />
                    )}
                </form>

            </div>

        )
    }
}

export default FormScrUploadCreate;