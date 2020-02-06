import React, { Component } from "react"
import * as R from 'ramda'
import { connect } from 'react-redux';
import DropDown from '../../../modules/popup/DropDown'

class FormMovement extends Component {
  constructor(props) {
    super(props);
    let {
      movementData,
      bizparMovementCategory,
      bizparMovementType
    } = this.props;
    this.state = {
      movementData: movementData,
      bizparMovementCategory,
      bizparMovementType,
      auth: props.auth
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.movementData !== prevProps.movementData) {
      this.setState({
        movementData: this.props.movementData
      })
    }
  }

  render() {
    let { movementData } = this.state;
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="padding-15px grid grid-mobile-none gap-15px">
            <div className="margin-bottom-15px">REQUESTOR</div>
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>NIK</h4>
                </div>
              </div>
              <input
                value={movementData.requestBy.employeeID}
                type="text"
                readOnly
                style={{ backgroundColor: "#E6E6E6" }}
                className="txt txt-sekunder-color"
                placeholder="NIK"
                required
              />
            </div>
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Employee Name</h4>
                </div>
              </div>
              <input
                value={movementData.requestBy.employeeName}
                type="text"
                readOnly
                style={{ backgroundColor: "#E6E6E6" }}
                className="txt txt-sekunder-color"
                placeholder="Employee Name"
                required
              />
            </div>
            <div className="margin-bottom-15px">
              HEADER
              &nbsp;
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Request Number</h4>
                  </div>
                </div>
                <input
                  value={movementData.movementID}
                  type="text"
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder="Request Number"
                  required
                />
              </div>
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Movement Type <span style={{ color: "red" }}>*</span></h4>
                  </div>
                  <DropDown
                    bizValue={movementData.movementType.bizparValue}
                    title="-- please select movement type --"
                    onChange={(dt) => this.setState({
                      movementData: {
                        ...this.state.movementData,
                        movementType: {
                          ...this.state.movementData.movementType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type !== "create" ? true : false}
                    data={this.props.bizparMovementType}
                    value={movementData.movementType && movementData.movementType.bizparKey} />
                </div>
              </div>
            </div>

            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Division</h4>
                </div>
              </div>
              <input
                type="text"
                readOnly
                style={{ backgroundColor: "#E6E6E6" }}
                className="txt txt-sekunder-color"
                placeholder="Division"
                required
                value={!R.isNil(movementData.requestBy) ? movementData.requestBy.positionID : ""}
              />
            </div>
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Position</h4>
                </div>
              </div>
              <input
                value={!R.isNil(movementData.requestBy) ? movementData.requestBy.positionName : ""}
                type="text"
                readOnly
                style={{ backgroundColor: "#E6E6E6" }}
                className="txt txt-sekunder-color"
                placeholder="Position"
                required
              />
            </div>
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Movement Category <span style={{ color: "red" }}>*</span></h4>
                </div>
                <DropDown
                  bizValue={movementData.movementCategory.bizparValue}
                  title="-- please select movement category --"
                  onChange={(dt) => this.setState({
                    movementData: {
                      ...this.state.movementData,
                      movementCategory: {
                        ...this.state.movementData.movementCategory,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type !== "create" ? true : false}
                  data={this.props.bizparMovementCategory}
                  value={movementData.movementCategory && movementData.movementCategory.bizparKey} />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

// export default FormMovement;
const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(FormMovement)

