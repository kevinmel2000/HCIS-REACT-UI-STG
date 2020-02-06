import React, { Component } from "react";

import DropDown from '../../../../modules/popup/DropDown';

class FormIdentityDO extends Component {
  render() {
    return (
      <form action="#">
        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
          <div className="column-1">
            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Agama <span style={{ color: "red" }}>*</span></h4>
                </div>
              </div>
              <DropDown
                    title="-- pilih agama --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view"}
                    data={[
                      {id: '1', title: 'Islam', value: 'Islam'}, 
                      {id: '2', title: 'Protestan', value: 'Protestan'}
                    ]} />
              {/*<div class="input-grey input-border">
                <select
                  disabled={this.props.type === "view"}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  className="cf-select slc slc-sekunder"
                >
                  <option>Islam</option>
                  <option>Protestan</option>
                </select>
              </div>*/}
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Status Pernikahan <span style={{ color: "red" }}>*</span></h4>
                </div>
              </div>
              <DropDown
                    title="-- pilih status pernikahan --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view"}
                    data={[
                      {id: '1', title: 'Lajang', value: 'Lajang'}, 
                      {id: '2', title: 'Menikah', value: 'Menikah'}
                    ]} />
              {/*<div class="input-grey input-border">
                <select
                  disabled={this.props.type === "view"}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  className="cf-select slc slc-sekunder"
                >
                  <option>Lajang</option>
                </select>
              </div>*/}
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Phone Number 1 <span style={{ color: "red" }}>*</span></h4>
                </div>
              </div>
              <input
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                class="txt txt-sekunder-color text-no-radius text-no-shadow"
                type="text"
                required
                placeholder=""
              />
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Phone Number 2</h4>
                </div>
              </div>
              <input
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                class="txt txt-sekunder-color text-no-radius text-no-shadow"
                type="text"
                required
                placeholder=""
              />
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>House Phone Number</h4>
                </div>
              </div>
              <input
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                type="text"
                required
                className="txt txt-sekunder-color"
                placeholder=""
              />
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Company Email</h4>
                </div>
              </div>
              <input
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                type="text"
                required
                className="txt txt-sekunder-color"
                placeholder=""
              />
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Personal Email 1</h4>
                </div>
              </div>
              <input
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                class="txt txt-sekunder-color text-no-radius text-no-shadow"
                type="text"
                required
                placeholder=""
              />
            </div>
            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Personal Email 2</h4>
                </div>
              </div>
              <input
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                type="text"
                required
                className="txt txt-sekunder-color"
                placeholder=""
              />
            </div>
            <div className="margin-bottom-15px">
              <div className="margin-15px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Employee Active Status <span style={{ color: "red" }}>*</span></h4>
                </div>
              </div>
              <div className="margin-15px">
                  <label className="radio">
                    <input type="checkbox" checked={""} disabled />
                    <span className="checkmark" />
                    <div className="txt-site txt-11 txt-bold txt-main">
                      <h4>Active</h4>
                    </div>
                  </label>
                </div>
            </div>
          </div>

          <div className="column-2">
            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Education Level <span style={{ color: "red" }}>*</span></h4>
                </div>
              </div>
              <DropDown
                    title="-- please select education level --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view"}
                    data={[
                      {id: '1', title: 'S1', value: 'S1'}, 
                      {id: '2', title: 'D3', value: 'D3'}
                    ]} />
              {/*<div class="input-grey input-border">
                <select
                  disabled={this.props.type === "view"}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  className="cf-select slc slc-sekunder"
                >
                  <option>S1</option>
                  <option>D3</option>
                </select>
              </div>*/}
            </div>
            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Family Card ID</h4>
                </div>
              </div>
              <input
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                type="text"
                required
                className="txt txt-sekunder-color"
                placeholder=""
              />
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Blood Type</h4>
                </div>
              </div>
              <DropDown
                    title="-- please select blood type --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view"}
                    data={[
                      {id: '1', title: 'A', value: 'A'}, 
                      {id: '2', title: 'B', value: 'B'}
                    ]} />
              {/*<div class="input-grey input-border">
                <select
                  disabled={this.props.type === "view"}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  className="cf-select slc slc-sekunder"
                >
                  <option>A</option>
                  <option>B</option>
                </select>
              </div>*/}
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Height</h4>
                </div>
              </div>
              <input
                type="text"
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                required
                className="txt txt-sekunder-color"
                placeholder=""
              />
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Weight</h4>
                </div>
              </div>
              <input
                type="text"
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                required
                className="txt txt-sekunder-color"
                placeholder=""
              />
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Cloth Size</h4>
                </div>
              </div>
              <input
                type="text"
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                required
                className="txt txt-sekunder-color"
                placeholder=""
              />
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Pants Size</h4>
                </div>
              </div>
              <input
                type="text"
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                className="txt txt-sekunder-color"
                required
                placeholder=""
              />
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Shoe Size</h4>
                </div>
              </div>
              <input
                type="text"
                readOnly={this.props.type === "view"}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                className="txt txt-sekunder-color"
                required
                placeholder=""
              />
            </div>
          </div>
        </div>

        <div className="padding-15px">
          <div className="grid grid-2x">
            <div className="col-1" />
            <div className="col-2 content-right">
              {this.props.type !== "view" ? (
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onClickSave()}
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
      </form>
    );
  }
}

export default FormIdentityDO;
