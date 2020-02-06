import React, { Component } from "react";

import M from 'moment'

const defaultPayload = {
  "esid": "",
  "esname": "",
  "essubcoID": "",
  "esemail": "",
  "estelpNumber": "",
  "orgLegalDocument": {
    "orgLegalDocumentID": "",
    "orgLegalDocumentURL": ""
  },
  "orgStructureTPL": {
    "orgStructureTPLID": "TP-001",
    "orgStructureTPLName": "Template A",
    "orgStructureStartDate": "01-01-2019",
    "orgStructureEndDate": "01-01-2020",
    "orgStructureTag": "Tag A",
    "orgStructureTPLStatus": "ACTIVE",
    "payload": {
      "hasChild": true,
      "children": [],
      "ougrade": [],
      "ouparentID": null,
      "oupayrollTPLID": "PT-001",
      "ouname": "",
      "ouid": "OU-001",
      "oulevel": 1,
      "oujobDesc": []
    },
    "orgStructureDefault": true
  },
  "payrollTPL": {
    "payrollTPLID": "PT-001",
    "payrollTPLName": "PayrollTPLName",
    "payrollTag": "PayrollTPLTag",
    "payrollRuleSetID": "RS-001",
    "isPayrollDefault": true,
    "payrollStartDate": "23-08-2019",
    "payrollEndDate": "23-08-2019",
    "payrollTPLStatus": "ACTIVE",
    "payrollPayload": [
        {
            "employeeStatus": "TETAP",
            "payrollTPLJSONDetails": [
                {
                    "coaCode": "COA-00002",
                    "coaCategory": "COACAT-002",
                    "payrollComponent": "PAYCOM-001",
                    "tax1721A1Type": "TAX1721A1-001",
                    "taxType": "TAXTYP-001",
                    "tplJSONDetailID": "TD-001"
                }
            ],
            "payrollTPLJSONID": "TP-002"
        }
    ]
  },
  "leaveSetup":[],
  "sppdTPL": [],
  "escreational": {
    "createdBy": "SYSTEM",
    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
    "modifiedBy": null,
    "modifiedDate": null
}
}

class FormCompany extends Component {
  constructor(props) {
    super(props);
    let { companyData } = this.props;

    this.state = {
      companyData : companyData ? companyData : defaultPayload
    };
  }

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px">
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Subco ID
                </span>
              </div>
              <input
                value={this.state.companyData.essubcoID}
                onChange={e =>
                  this.setState({
                    companyData: {
                      ...this.state.companyData,
                      essubcoID: e.target.value
                    }
                  })
                }
                type="text"
                className="txt txt-sekunder-color"
                placeholder=""
                required
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
              />
            </div>

            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Company Name
                </span>
              </div>
              <input
                value={this.state.companyData.esname}
                onChange={e =>
                  this.setState({
                    companyData: {
                      ...this.state.companyData,
                      esname: e.target.value
                    }
                  })
                }
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                type="text"
                className="txt txt-sekunder-color"
                placeholder=""
                required
              />
            </div>
            
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">Email</span>
              </div>
              <input
                value={this.state.companyData.esemail}
                onChange={e =>
                  this.setState({
                    companyData: {
                      ...this.state.companyData,
                      esemail: e.target.value
                    }
                  })
                }
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                type="text"
                className="txt txt-sekunder-color"
                placeholder=""
                required
              />
            </div>

            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Phone Number
                </span>
              </div>
              <input
                value={this.state.companyData.estelpNumber}
                onChange={e =>
                  this.setState({
                    companyData: {
                      ...this.state.companyData,
                      estelpNumber: e.target.value
                    }
                  })
                }
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                type="text"
                className="txt txt-sekunder-color"
                placeholder=""
                required
              />
            </div>

            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Company Status
                </span>
              </div>
              <label className="switch green">
                <input
                  type="checkbox"
                  checked
                  readOnly
                />
                <span className="slider round status-on-off" />
              </label>
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
                    onClick={() => {
                      let payload = this.state.companyData
                      payload = {
                        ...payload,
                        esid: payload.esid === "" ? "ES-"+M() : payload.esid,
                        orgLegalDocument: {
                          ...payload.orgLegalDocument,
                          orgLegalDocumentID: payload.orgLegalDocument.orgLegalDocumentID === "" ? "DOC-"+M() : payload.orgLegalDocument.orgLegalDocumentID
                        }
                      }
                      this.props.onClickSave(payload)}}
                  >
                    <span>SAVE</span>
                  </button>
                ) : null}
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={this.props.onClickClose}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormCompany;
