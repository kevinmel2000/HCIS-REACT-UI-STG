import React, { Component } from "react";

import DropDown from "../../../modules/popup/DropDown";

class FormMasterComponentCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { type, title } = this.props;
    if (type === "create") title = "CREATE FORM";
    if (type === "update") title = "EDIT FORM";
    if (type === "detail") title = "VIEW FORM";

    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px"></div>
        <div className="popup-content background-white border-radius">
          <div className="padding-15px background-blue grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                COMPONENT - {title}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle background-blue"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times"></i>
              </button>
            </div>
          </div>
          <form action="#">
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Component ID <span style={{ color: "red" }}>*</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    readOnly={type !== "create"}
                    style={
                      type !== "create" ? { backgroundColor: "#E6E6E6" } : {}
                    }
                    className="txt txt-sekunder-color"
                    placeholder=""
                  ></input>
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Component Name <span style={{ color: "red" }}>*</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    readOnly={type === "detail"}
                    style={
                      type === "detail" ? { backgroundColor: "#E6E6E6" } : {}
                    }
                    className="txt txt-sekunder-color"
                    placeholder=""
                  ></input>
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      FIX
                    </span>
                  </div>
                  <label className="switch green">
                    <input
                      disabled={type === "detail"}
                      style={{
                        backgroundColor: type === "detail" ? "#E6E6E6" : ""
                      }}
                      type="checkbox"
                    />
                    <span className="slider round status-on-off" />
                  </label>
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Regular
                    </span>
                  </div>
                  <label className="switch green">
                    <input
                      disabled={type === "detail"}
                      style={{
                        backgroundColor: type === "detail" ? "#E6E6E6" : ""
                      }}
                      type="checkbox"
                    />
                    <span className="slider round status-on-off" />
                  </label>
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Component Type <span style={{ color: "red" }}>*</span>
                    </span>
                  </div>
                  <DropDown
                    title="-- please select component type --"
                    onChange={dt => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{ id: "1", title: "Penerimaan", value: "bs-1" }]}
                  />
                  {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "detail" ? "#E6E6E6" : "" }}
                                        disabled={type === "detail"}>
                                        <option value="">-- please select component type --</option>
                                        <option value="">PENERIMAAN</option>
                                    </select>*/}
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Component COA
                    </span>
                  </div>
                  <DropDown
                    title="-- please select component COA --"
                    onChange={dt => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{ id: "1", title: "Medical Cash", value: "bs-1" }]}
                  />
                  {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "detail" ? "#E6E6E6" : "" }}
                                        disabled={ type === "detail"}>
                                        <option value="">-- please select component coa --</option>
                                        <option value="">Medical CASH</option>
                                    </select>*/}
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      COA Type
                    </span>
                  </div>
                  <DropDown
                    title="-- please select coa type --"
                    onChange={dt => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{ id: "1", title: "Kredit", value: "bs-1" }]}
                  />
                  {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "detail" ? "#E6E6E6" : "" }}
                                        disabled={ type === "detail"}>
                                        <option value="">-- please select coa type --</option>
                                        <option value="">KREDIT</option>
                                    </select>*/}
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Tax Type <span style={{ color: "red" }}>*</span>
                    </span>
                  </div>
                  <DropDown
                    title="-- please select tax type --"
                    onChange={dt => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{ id: "1", title: "Gross Up", value: "bs-1" }]}
                  />
                  {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "detail" ? "#E6E6E6" : "" }}
                                        disabled={type === "detail"}>
                                        <option value="">-- please select tax type --</option>
                                        <option value="">GROSS UP</option>
                                    </select>*/}
                </div>
              </div>
              <div className="column-2">
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Reference Value
                    </span>
                  </div>
                  <DropDown
                    title="-- please select reference value --"
                    onChange={dt => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{ id: "1", title: "All", value: "bs-1" }]}
                  />
                  {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "detail" ? "#E6E6E6" : "" }}
                                        disabled={type === "detail"}>
                                        <option value="">-- please select reference value --</option>
                                        <option value="">ALL</option>
                                    </select>*/}
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Payslip
                    </span>
                  </div>
                  <DropDown
                    title="-- please select payslip --"
                    onChange={dt => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{ id: "1", title: "Penerimaan", value: "bs-1" }]}
                  />
                  {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "detail" ? "#E6E6E6" : "" }}
                                        disabled={type === "detail"}>
                                        <option value="">-- please select payslip --</option>
                                        <option value="">PENERIMAAN</option>
                                    </select>*/}
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Limit
                    </span>
                  </div>
                  <DropDown
                    title="-- please select limit --"
                    onChange={dt => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{ id: "1", title: "None", value: "bs-1" }]}
                  />
                  {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "detail" ? "#E6E6E6" : "" }}
                                        disabled={type === "detail"}>
                                        <option value="">-- please select limit --</option>
                                        <option value="">NONE</option>
                                    </select>*/}
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Item 1721-A1
                    </span>
                  </div>
                  <DropDown
                    title="-- please select item 1721-A1 --"
                    onChange={dt => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[
                      {
                        id: "1",
                        title: "Tunjangan uang lembuat kerja dan sebagainuya",
                        value: "bs-1"
                      }
                    ]}
                  />
                  {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "detail" ? "#E6E6E6" : "" }}
                                        disabled={type === "detail"}>
                                        <option value="">-- please select item 1721-A1 --</option>
                                        <option value="">TUNJANGAN UANG LEMBUR DAB SEBAGAINYA</option>
                                    </select>*/}
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Sequence Number
                    </span>
                  </div>
                  <input
                    type="text"
                    style={{
                      backgroundColor: type === "detail" ? "#E6E6E6" : ""
                    }}
                    readOnly={type === "detail"}
                    className="txt txt-sekunder-color"
                    placeholder=""
                  ></input>
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      FIX
                    </span>
                  </div>
                  <label className="switch green">
                    <input
                      disabled={type === "detail"}
                      style={{
                        backgroundColor: type === "detail" ? "#E6E6E6" : ""
                      }}
                      type="checkbox"
                    />
                    <span className="slider round status-on-off" />
                  </label>
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Description
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    type="text"
                    readOnly={type === "detail"}
                    style={{
                      backgroundColor: type === "detail" ? "#E6E6E6" : ""
                    }}
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1"></div>
              <div className="col-2 content-right">
                <button
                  className="btn btn-blue"
                  type="button"
                  onClick={this.props.onClickSave}
                >
                  <span>SAVE</span>
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
        </div>
        <div className="padding-bottom-20px"></div>
      </div>
    );
  }
}

export default FormMasterComponentCreate;
