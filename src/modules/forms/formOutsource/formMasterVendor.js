import React, { Component } from "react";
import M from "moment";
import CalendarPicker from "../../../modules/popup/Calendar";
import FormMasterVendorEmployee from "./formMasterVendorEmployee";
import DropDown from "../../../modules/popup/DropDown";

const dataCreate = {
  "vendorAddress": '',
  "vendorDesc": '',
  "vendorEmail": '',
  "vendorExpireDate": '',
  "vendorID": '',
  "vendorName": '',
  "vendorPhone": '',
  "vendorPICName": '',
  "vendorPICphone": '',
  "vendorRegistrationDate": '',
  "vendorStatus": '',
  "vendorType": '',
  "vendorOutsourceCreationalDTO": {
    "createdBy": '',
    "createdDate": '',
  }
}

class FormMasterVendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCreate: {
        ...dataCreate,
        vendorID: 'VEN-' + M()
      },
      dataEdit: this.props.rawData ? this.props.rawData : dataCreate,
      type: props.type,
      vendorID: 'VEN-' + M()
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.setState({
        dataEdit: this.props.rawData
      })
    }
  }

  renderEdit() {
    let { type, dataEdit } = this.state;
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1" style={{ width: "140%" }}>
              <div className="display-flex-normal margin-top-10px">
                <i className="fa fa-1x fa-building"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  {/* {type === "edit" ? "Vendor Outsourcing - Edit Form" : "Vendor Outsourcing - View Form"} */}
                  Vendor Outsourcing - Detail Form
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                onClick={this.props.closeSlide}
                className="btn btn-circle btn-grey"
              >
                <i className="fa fa-lg fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>
        <form
          action="#"
          onSubmit={e => {
            e.preventDefault();
            let data = {
              ...dataEdit,
              vendorRegistrationDate: M(dataEdit.vendorRegistrationDate).format('DD-MM-YYYY'),
              vendorExpireDate: M(dataEdit.vendorExpireDate).format('DD-MM-YYYY')
            }
            this.props.onClickSave(data);
          }}
        >
          <div className="a-s-p-mid a-s-p-pad border-top">
            <div className="display-flex-normals margin-bottom-10px">
              <div className="padding-top-15px padding-bottom-15px">
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Vendor ID<span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    readOnly
                    value={dataEdit.vendorID}
                    style={{ backgroundColor: "#E6E6E6" }}
                    placeholder={"Vendor ID"}
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Vendor Type <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <DropDown title="-- please select vendor type --"
                    bizValue={dataEdit.vendorType}
                    data={this.props.bizparVendorType}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorType: e
                        }
                      })
                    }}
                    value={dataEdit.vendorType}
                    type='bizpar'
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Vendor Name<span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder={"Vendor Name"}
                    required
                    readOnly={type === "view"}
                    style={{
                      backgroundColor: type === "view" ? "#E6E6E6" : null
                    }}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorName: e.target.value
                        }
                      })
                    }}
                    value={dataEdit.vendorName}
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
                    type="text"
                    className="txt txt-sekunder-color"
                    rows={4}
                    placeholder={"Vendor Address"}
                    required
                    readOnly={type === "view"}
                    style={{
                      backgroundColor: type === "view" ? "#E6E6E6" : null
                    }}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorAddress: e.target.value
                        }
                      })
                    }}
                    value={dataEdit.vendorAddress}
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Phone Number</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder={"Phone Number"}
                    readOnly={type === "view"}
                    style={{
                      backgroundColor: type === "view" ? "#E6E6E6" : null
                    }}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorPhone: e.target.value
                        }
                      })
                    }}
                    value={dataEdit.vendorPhone}
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Email</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder={"Email"}
                    readOnly={type === "view"}
                    style={{
                      backgroundColor: type === "view" ? "#E6E6E6" : null
                    }}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorEmail: e.target.value
                        }
                      })
                    }}
                    value={dataEdit.vendorEmail}
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Registration Date<span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <CalendarPicker
                    disabled={type === "view"}
                    style={{
                      backgroundColor: type === "view" ? "#E6E6E6" : null
                    }}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorRegistrationDate: e
                        }
                      })
                    }}
                    date={dataEdit.vendorRegistrationDate}
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Expire Date<span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <CalendarPicker
                    disabled={type === "view"}
                    style={{
                      backgroundColor: type === "view" ? "#E6E6E6" : null
                    }}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorExpireDate: e
                        }
                      })
                    }}
                    date={dataEdit.vendorExpireDate}
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Status</h4>
                    </div>
                  </div>
                  <div className="margin-15px">
                    <label className="radio">
                      <input type="checkbox" checked disabled />
                      <span className="checkmark" />
                      <div className="txt-site txt-11 txt-bold txt-main">
                        <h4>Active</h4>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Description<span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <textarea
                    type="text"
                    className="txt txt-sekunder-color"
                    rows={4}
                    placeholder={"Vendor Description"}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorDesc: e.target.value
                        }
                      })
                    }}
                    value={dataEdit.vendorDesc}
                    readOnly={type === "view"}
                    style={{
                      backgroundColor: type === "view" ? "#E6E6E6" : null
                    }}
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>PIC Name</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder={"PIC name"}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorPICName: e.target.value
                        }
                      })
                    }}
                    value={dataEdit.vendorPICName}
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>PIC Phone Number</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder={"PIC phone number"}
                    onChange={(e) => {
                      this.setState({
                        dataEdit: {
                          ...dataEdit,
                          vendorPICphone: e.target.value
                        }
                      })
                    }}
                    value={dataEdit.vendorPICphone}
                  />
                </div>
                <FormMasterVendorEmployee
                  type={type}
                  vendorID={dataEdit.vendorID}
                  createdBy={this.props.createdBy}
                />
                <div className="padding-15px">
                  <div className="grid grid-2x">
                    <div className="col-1"></div>
                    <div className="col-2 content-right">
                      {type === "edit" ? (
                        <button className="btn btn-blue" type="submit">
                          <span>SAVE</span>
                        </button>
                      ) : null}
                      <button
                        style={{ marginLeft: "15px" }}
                        className="btn btn-primary"
                        type="button"
                        onClick={this.props.closeSlide.bind(this)}
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
    );
  }

  render() {
    let { type, dataCreate } = this.state;
    return (
      <div>
        {type === "create" ? (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    {"Master Vendor - Create Form"}
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.props.onClickClose}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>
              <form
                action="#"
                onSubmit={e => {
                  e.preventDefault();
                  let data = {
                    ...dataCreate,
                    vendorRegistrationDate: M(dataCreate.vendorRegistrationDate).format('DD-MM-YYYY'),
                    vendorExpireDate: M(dataCreate.vendorExpireDate).format('DD-MM-YYYY')
                  }
                  // return console.log(data)
                  this.props.onClickSave(data);
                }}
              >
                <div className="padding-15px grid grid-2x grid-mobile-none gap-20px">
                  <div className="column-1">
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Vendor ID<span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="txt txt-sekunder-color"
                        readOnly
                        style={{ backgroundColor: "#E6E6E6" }}
                        value={dataCreate.vendorID}
                        placeholder={"Vendor Reg Number"}
                      />
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Vendor Type <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <DropDown title="-- please select vendor type --" data={this.props.bizparVendorType} type='bizpar'
                        onChange={(e) => {
                          this.setState({
                            dataCreate: {
                              ...dataCreate,
                              vendorType: e
                            }
                          })
                        }}
                        value={dataCreate.vendorType}
                      />
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Vendor Name<span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder={"Vendor Name"}
                        required
                        value={dataCreate.vendorName}
                        onChange={(e) => {
                          this.setState({
                            dataCreate: {
                              ...dataCreate,
                              vendorName: e.target.value
                            }
                          })
                        }}
                      />
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Address </h4>
                        </div>
                      </div>
                      <textarea
                        type="text"
                        className="txt txt-sekunder-color"
                        rows={4}
                        placeholder={"Vendor Address"}
                        value={dataCreate.vendorAddress}
                        onChange={(e) => {
                          this.setState({
                            dataCreate: {
                              ...dataCreate,
                              vendorAddress: e.target.value
                            }
                          })
                        }}
                      />
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Status</h4>
                        </div>
                      </div>
                      <div className="margin-15px">
                        <label className="radio">
                          <input type="checkbox" checked disabled />
                          <span className="checkmark" />
                          <div className="txt-site txt-11 txt-bold txt-main">
                            <h4>Active</h4>
                          </div>
                        </label>
                      </div>
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
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder={"Phone Number"}
                        value={dataCreate.vendorPhone}
                        onChange={(e) => {
                          this.setState({
                            dataCreate: {
                              ...dataCreate,
                              vendorPhone: e.target.value
                            }
                          })
                        }}
                      />
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Email</h4>
                        </div>
                      </div>
                      <input
                        type="email"
                        className="txt txt-sekunder-color"
                        placeholder={"Email"}
                        value={dataCreate.vendorEmail}
                        onChange={(e) => {
                          this.setState({
                            dataCreate: {
                              ...dataCreate,
                              vendorEmail: e.target.value
                            }
                          })
                        }}
                      />
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="grid grid-2x grid-mobile-none gap-20px">
                        <div className="column-1">
                          <div className="margin-4px margin-bottom-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                              <h4>
                                Registration Date
                                <span style={{ color: "red" }}>*</span>
                              </h4>
                            </div>
                          </div>
                          <CalendarPicker
                            date={dataCreate.vendorRegistrationDate}
                            onChange={(e) => {
                              this.setState({
                                dataCreate: {
                                  ...dataCreate,
                                  vendorRegistrationDate: e
                                }
                              })
                            }}
                          />
                        </div>
                        <div className="column-2">
                          <div className="margin-4px margin-bottom-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                              <h4>
                                Expire Date
                                <span style={{ color: "red" }}>*</span>
                              </h4>
                            </div>
                          </div>
                          <CalendarPicker
                            date={dataCreate.vendorExpireDate}
                            onChange={(e) => {
                              this.setState({
                                dataCreate: {
                                  ...dataCreate,
                                  vendorExpireDate: e
                                }
                              })
                            }} />
                        </div>
                      </div>
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Description</h4>
                        </div>
                      </div>
                      <textarea
                        type="text"
                        className="txt txt-sekunder-color"
                        rows={4}
                        placeholder={"Vendor Description"}
                        value={dataCreate.vendorDesc}
                        onChange={(e) => {
                          this.setState({
                            dataCreate: {
                              ...dataCreate,
                              vendorDesc: e.target.value
                            }
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                  <div className="column-1">
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>PIC Name</h4>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder={"PIC name"}
                        value={dataCreate.vendorPICName}
                        onChange={(e) => {
                          this.setState({
                            dataCreate: {
                              ...dataCreate,
                              vendorPICName: e.target.value
                            }
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="column-2">
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>PIC Phone Number</h4>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder={"PIC phone number"}
                        value={dataCreate.vendorPICphone}
                        onChange={(e) => {
                          this.setState({
                            dataCreate: {
                              ...dataCreate,
                              vendorPICphone: e.target.value
                            }
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="padding-15px">
                  <div className="col-2 content-right">
                    <button
                      className="btn btn-blue margin-right-10px"
                      type="submit"
                    >
                      <span>SAVE</span>
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={this.props.onClickClose}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="margin-bottom-10px"></div>
          </div>
        ) : (
            this.renderEdit()
          )}
      </div>
    );
  }
}

export default FormMasterVendor;
