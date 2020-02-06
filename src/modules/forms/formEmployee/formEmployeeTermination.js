import React, { Component } from "react"
import { connect } from 'react-redux';
import DropDown from '../../../modules/popup/DropDown'

class formEmployeeTermination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.rawData,
      auth: props.auth
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.setState({
        data: this.props.rawData
      })
    }
  }

  render() {
    let { terminationID, terminationCategory, requestBy } = this.state.data;
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className={this.props.type !== 'create' ? "border-bottom padding-15px grid grid-mobile-none gap-15px" : "border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px"}>
            <div style={{ fontWeight: "bold", marginBottom: 10 }}> REQUESTOR </div>

            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>NIK</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={requestBy.employeeID}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Name</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={requestBy.employeeName}
                />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Division</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={requestBy && requestBy.positionID}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Position</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={requestBy && requestBy.positionName}
                />
              </div>
            </div>

            <div style={{ fontWeight: "bold", marginTop: this.props.type !== 'create' ? 20 : -10 }}>  HEADER </div>

            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Request Number</h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type !== "create" ? true : false}
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={terminationID}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Termination Type <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                  bizValue={this.state.data.terminationType.bizparValue}
                  title="-- please select termination type --"
                  onChange={(dt) => this.setState({
                    data: {
                      ...this.state.data,
                      terminationType: {
                        ...this.state.data.terminationType,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type !== "create"}
                  data={this.props.bizparTerminationType}
                  value={this.state.data.terminationType.bizparKey} />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Termination Category <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                  bizValue={terminationCategory.bizparValue}
                  title="-- please select termination category --"
                  onChange={(dt) => this.setState({
                    data: {
                      ...this.state.data,
                      terminationCategory: {
                        ...this.state.data.terminationCategory,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type !== "create"}
                  data={this.props.bizparTerminationCategory}
                  value={terminationCategory.bizparKey} />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Termination Reason <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                  bizValue={this.state.data.terminationReason.bizparValue}
                  title="-- please select termination reason --"
                  onChange={(dt) => this.setState({
                    data: {
                      ...this.state.data,
                      terminationReason: {
                        ...this.state.data.terminationReason,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type !== "create"}
                  data={this.props.bizparTerminationReason}
                  value={this.state.data.terminationReason.bizparKey} />
              </div>
            </div>
          </div>
        </form>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(formEmployeeTermination)

