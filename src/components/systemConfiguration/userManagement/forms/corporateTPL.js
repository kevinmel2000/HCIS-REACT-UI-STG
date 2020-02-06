import React, { Component } from "react";
import PopUp from "../../../pages/PopUpAlert";
import ResizeSlider from "../../../../modules/resize/Slider";
import API from "../../../../Services/Api";
import M from "moment";
import * as R from "ramda";
import { connect } from "react-redux";
import { getBizpar } from "../../../../Services/Utils";
// table
import TableCorporateStruct from "../tables/confCorporateTPL/tableCorporateStruct";
import TablePayroll from "../tables/confCorporateTPL/tablePayroll";
import TableTax from "../tables/confCorporateTPL/tableTax";
import TableGov from "../tables/confCorporateTPL/tableGovernment";
import TableCorGlobal from "../tables/confCorporateTPL/tableCorGlobal";
// create
import CreateOrg from "./create/org/createOrg";
import CreatePayroll from "./create/payroll/createPayroll";
import CreateTax from "./create/tax/createTax";
import CreateGov from "./create/gov/createGov";
import CreateGlobal from "./create/corGlobal/createGlobal";
// edit
import EditOrg from "./edit/corporateTPL/formEditOrg";
import EditPayroll from "./edit/payroll/EditPayroll";
import FormEditTax from "./edit/corporateTPL/formEditTax";
import EditGov from "./edit/corporateTPL/formEditGov";
import EditGlobal from "./edit/corporateTPL/formEditGlobal";

const dateNow = M().format("DD-MM-YYYY HH:mm:ss");

const clSlidePage = "a-s-p-main";

class ConfCorporateTPL extends Component {
  constructor(props) {
    super(props);
    let symbol = [
      { bizparKey: "<", bizparValue: "<" },
      { bizparKey: ">", bizparValue: ">" },
      { bizparKey: "<=", bizparValue: "<=" },
      { bizparKey: "=>", bizparValue: "=>" },
      { bizparKey: "~", bizparValue: "~" },
      { bizparKey: "=", bizparValue: "=" }
    ];

    this.state = {
      classAppSlidePage: "app-side-page",
      classAppSlidePageMain: clSlidePage,
      savePopUpVisible: false,
      deletePopUpVisible: false,
      createPayroll1: false,
      createPayroll2: false,
      createOrg: false,
      createGovernment: false,
      editGovernment: false,
      createCorGlobal: false,
      editCorGlobal: false,
      editPayroll: false,
      editPayroll2: false,
      editTax: false,
      editOrg: false,
      createTax: false,
      sub: "",
      // important for resize pane
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      bizparTaxType: [],
      bizparPTKP: [],
      bizparGovPolicyType: [],
      bizparInsuranceCat: [],
      bizparCorPolicyType: [],
      bizparTaxCalc: [],
      bizparPaymentMethod: [],
      bizparPaymentType: [],
      bizparSymbol: symbol,
    };
  }

  opResizePane = () => {
    console.log("open", this.state.defaultSize);
    this.setState({
      // editOrg: true,
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    });
  };

  getBizparType = async () => {
    let bizparTaxType = await getBizpar("TAX_TYPE");
    let bizparPTKP = await getBizpar("PTKP_DEPENDENTS_FAMILY_TYPE");
    let bizparGovPolicyType = await getBizpar("GOVERNMENT_POLICY_TYPE");
    let bizparInsuranceCat = await getBizpar("INSURANCE_CATEGORY");
    let bizparCorPolicyType = await getBizpar("CORPORATE_POLICY_TYPE");
    let bizparPaymentMethod = await getBizpar("CORPORATE_POLICY_PP_METHOD");
    let bizparTaxCalc = await getBizpar("CORPORATE_POLICY_TAX_CALC_METHOD");
    let bizparPaymentType = await getBizpar("CORPORATE_POLICY_PP_TYPE");
    this.setState({
      bizparTaxType,
      bizparPTKP,
      bizparGovPolicyType,
      bizparInsuranceCat,
      bizparCorPolicyType,
      bizparTaxCalc,
      bizparPaymentMethod,
      bizparPaymentType
    });
  };

  clResizePane = () => {
    console.log("close", this.state.defaultSize);
    this.setState({
      // editOrg: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    });
  };

  async getOrgByID(data){
    let res = await API.create("CFG").getCorporateOrgStructureTplById(data.orgStructureTPLId);
    this.setState({
      rawData : res.data.data,
    })
  }

  opSidePage = (menu, rawData) => e => {
    this.setState({
      classAppSlidePage: "app-side-page op-app-side",
      editPayroll: false,
      editPayroll2: false,
      editTax: false,
      editOrg: false,
      editGovernment: false,
      editCorGlobal: false
    });

    this.opResizePane();

    switch (menu) {
      case "slide-org":
        this.getOrgByID(rawData)
        this.setState({
          editOrg: true,
          sub: "org",
          rawData
        });
        break;
      case "slide-payroll":
        this.setState({
          editPayroll: true,
          sub: "payroll",
          rawData
        });
        break;
      case "slide-tax":
        this.setState({
          editTax: true,
          sub: "tax",
          rawData
        });
        break;
      case "slide-gov":
        this.setState({
          editGovernment: true,
          sub: "gov",
          rawData
        });
        break;
      case "slide-glob":
        this.setState({
          editCorGlobal: true,
          sub: "glob",
          rawData
        });
        break;
      default:
        break;
    }
  };

  clSidePage = () => {
    this.setState({ classAppSlidePage: "app-side-page" });
  };

  openSavePopUp = () => {
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      editPayroll: false,
      editTax: false,
      editOrg: false,
      editGovernment: false,
      editCorGlobal: false,
      classAppSlidePage: "app-side-page"
    });
    this.clResizePane();
  };

  closePopUpCreate = () => {
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      createTax: false,
      createPayroll1: false,
      createOrg: false,
      createGovernment: false,
      createCorGlobal: false
    });
  };

  openDeletePopUp = (rawData, index, type) => {
    console.log(JSON.stringify(type));
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index,
      rawData: rawData,
      formType: type,
      editTax: false,
      editOrg: false,
      editPayroll: false,
      editGovernment: false,
      editCorGlobal: false,
      classAppSlidePage: "app-side-page"
    });
    this.clResizePane();
  };

  opPopupPage = menu => e => {
    e.preventDefault();

    this.setState({
      createTax: false,
      createPayroll1: false,
      createOrg: false,
      createGovernment: false,
      createCorGlobal: false
    });

    this.clResizePane();
    switch (menu) {
      case "create-tax":
        this.setState({
          createTax: true,
          editPayroll: false,
          editPayroll2: false,
          editTax: false,
          editOrg: false,
          editGovernment: false,
          sub: "tax",
          classAppSlidePage: "app-side-page"
        });
        break;
      case "create-payroll":
        this.setState({
          createPayroll1: true,
          editPayroll: false,
          editPayroll2: false,
          editTax: false,
          editOrg: false,
          editGovernment: false,
          sub: "payroll",
          classAppSlidePage: "app-side-page"
        });
        break;
      case "create-org":
        this.setState({
          createOrg: true,
          editPayroll: false,
          editPayroll2: false,
          editTax: false,
          editOrg: false,
          editGovernment: false,
          sub: "org",
          classAppSlidePage: "app-side-page"
        });
        break;
      case "create-gov":
        this.setState({
          createGovernment: true,
          editPayroll: false,
          editPayroll2: false,
          editTax: false,
          editOrg: false,
          editGovernment: false,
          sub: "gov",
          classAppSlidePage: "app-side-page"
        });
        break;
      case "create-glob":
        this.setState({
          createCorGlobal: true,
          editPayroll: false,
          editPayroll2: false,
          editTax: false,
          editOrg: false,
          editGovernment: false,
          editCorGlobal: false,
          sub: "glob",
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
      createTax: false,
      createPayroll1: false,
      createOrg: false,
      createGovernment: false,
      createCorGlobal: false,
      savePopUpVisible
    });
  };

  parseChildren(value) {
    let data = Object.assign([], value);
    // console.log('data.ouchildren', data.ouchildren)
    data = data.map(value => {
      return {
        salaryStartFrom: value.salaryStartFrom,
        salaryStartTo: value.salaryStartTo,
        ouTaxTPLID: value.ouTaxTPLID.taxTPLID,
        oujobDescription: value.oujobDescription,
        ouhashChild: value.ouhashChild,
        ouchildren: this.parseChildren(value.ouchildren),
        oupayrollTaxTPLID: value.oupayrollTaxTPLID.payrollTPLID,
        ougrade: value.ougrade.bizparKey,
        oulevel: value.oulevel.bizparKey,
        ouposition: value.ouposition.bizparKey,
        ouid: value.ouid,
        ouparentID: value.ouparentID,
        ouCNBTPLID: !value.ouCNBTPLID ? "" : value.ouCNBTPLID.cnbtplid,
        ouFacilityTPLID: !value.ouFacilityTPLID
          ? ""
          : value.ouFacilityTPLID.facilityID
      };
    });
    return data;
  }

  parseChildrenAdd(input, details) {
    let data = [];
    data = Object.assign([], details);
    let index = R.findIndex(R.propEq("ouid", input.ouparentID))(details);
    if (index >= 0) {
      console.log("index found", index);
      data[index].ouchildren.push(input);
    } else {
      console.log("index not found");
    }
    data = data.map(value => {
      return {
        ouTaxTPLID:
          value.ouTaxTPLID || !R.isEmpty(value.ouTaxTPLID)
            ? value.ouTaxTPLID
            : "",
        ouchildren: this.parseChildrenAdd(input, value.ouchildren),
        ougrade:
          value.ougrade || !R.isEmpty(value.ougrade) ? value.ougrade : "",
        ouhashChild: true,
        ouid: value.ouid,
        oujobDescription: value.oujobDescription,
        oulevel:
          value.oulevel || !R.isEmpty(value.oulevel) ? value.oulevel : "",
        oupayrollTaxTPLID:
          value.oupayrollTaxTPLID || !R.isEmpty(value.oupayrollTaxTPLID)
            ? value.oupayrollTaxTPLID
            : "",
        ouparentID: value.ouparentID,
        ouposition:
          value.ouposition || !R.isEmpty(value.ouposition)
            ? value.ouposition
            : "",
        salaryStartFrom: value.salaryStartFrom,
        salaryStartTo: value.salaryStartTo,
        ouCNBTPLID:
          value.ouCNBTPLID || !R.isEmpty(value.ouCNBTPLID)
            ? value.ouCNBTPLID
            : "",
        ouFacilityTPLID:
          value.ouFacilityTPLID || !R.isEmpty(value.ouFacilityTPLID)
            ? value.ouFacilityTPLID
            : ""
      };
    });
    return data;
  }

  parseChildrenEdit(input, details) {
    let data = [];
    data = Object.assign([], details);
    let index = R.findIndex(R.propEq("ouid", input.ouid))(details);
    if (index >= 0) {
      console.log("index found", index);
      data[index] = {
        ...data[index],
        ouTaxTPLID: input.ouTaxTPLID,
        ougrade: input.ougrade,
        ouid: input.ouid,
        oujobDescription: input.oujobDescription,
        oupayrollTaxTPLID: input.oupayrollTaxTPLID,
        salaryStartFrom: input.salaryStartFrom,
        salaryStartTo: input.salaryStartTo,
        ouCNBTPLID: input.ouCNBTPLID,
        ouFacilityTPLID: input.ouFacilityTPLID
      };
    } else {
      console.log("index not found");
    }
    data = data.map(value => {
      return {
        ouTaxTPLID:
          value.ouTaxTPLID || !R.isEmpty(value.ouTaxTPLID)
            ? value.ouTaxTPLID
            : "",
        ouchildren: this.parseChildrenEdit(input, value.ouchildren),
        ougrade:
          value.ougrade || !R.isEmpty(value.ougrade) ? value.ougrade : "",
        ouhashChild: true,
        ouid: value.ouid,
        oujobDescription: value.oujobDescription,
        oulevel:
          value.oulevel || !R.isEmpty(value.oulevel) ? value.oulevel : "",
        oupayrollTaxTPLID:
          value.oupayrollTaxTPLID || !R.isEmpty(value.oupayrollTaxTPLID)
            ? value.oupayrollTaxTPLID
            : "",
        ouparentID: value.ouparentID,
        ouposition:
          value.ouposition || !R.isEmpty(value.ouposition)
            ? value.ouposition
            : "",
        salaryStartFrom: value.salaryStartFrom,
        salaryStartTo: value.salaryStartTo,
        ouCNBTPLID:
          value.ouCNBTPLID || !R.isEmpty(value.ouCNBTPLID)
            ? value.ouCNBTPLID
            : "",
        ouFacilityTPLID:
          value.ouFacilityTPLID || !R.isEmpty(value.ouFacilityTPLID)
            ? value.ouFacilityTPLID
            : ""
      };
    });
    return data;
  }

  parseChildrenDelete(input, details) {
    let data = [];
    data = Object.assign([], details);
    let index = R.findIndex(R.propEq("ouid", input.ouid))(details);
    if (index >= 0) {
      console.log("index found", index);
      data.splice(index, 1);
    } else {
      console.log("index not found");
    }
    data = data.map(value => {
      return {
        ouTaxTPLID:
          value.ouTaxTPLID || !R.isEmpty(value.ouTaxTPLID)
            ? value.ouTaxTPLID
            : "",
        ouchildren: this.parseChildrenDelete(input, value.ouchildren),
        ougrade:
          value.ougrade || !R.isEmpty(value.ougrade) ? value.ougrade : "",
        ouhashChild: true,
        ouid: value.ouid,
        oujobDescription: value.oujobDescription,
        oulevel:
          value.oulevel || !R.isEmpty(value.oulevel) ? value.oulevel : "",
        oupayrollTaxTPLID:
          value.oupayrollTaxTPLID || !R.isEmpty(value.oupayrollTaxTPLID)
            ? value.oupayrollTaxTPLID
            : "",
        ouparentID: value.ouparentID,
        ouposition:
          value.ouposition || !R.isEmpty(value.ouposition)
            ? value.ouposition
            : "",
        salaryStartFrom: value.salaryStartFrom,
        salaryStartTo: value.salaryStartTo,
        ouCNBTPLID:
          value.ouCNBTPLID || !R.isEmpty(value.ouCNBTPLID)
            ? value.ouCNBTPLID
            : "",
        ouFacilityTPLID:
          value.ouFacilityTPLID || !R.isEmpty(value.ouFacilityTPLID)
            ? value.ouFacilityTPLID
            : ""
      };
    });
    return data;
  }

  async handleSubmit(data) {
    // return console.log(data)
    let sub = this.state.sub;
    let { payload, res } = "";
    // return console.log('sub', sub)
    switch (sub) {
      case "tax":
        payload = {
          taxTPLID: data.taxTPLID,
          taxTPLName: data.taxTPLName,
          taxTPLType: data.taxTPLType.bizparKey,
          company: this.props.auth.user.companyID,
          taxTPLPhotoURL: data.taxTPLPhotoURL,
          taxTPLDetails: [],
          taxTPLStatus: data.taxTPLStatus ? "ACTIVE" : "INACTIVE",
          corporateTaxTPLCreational: {
            createdBy: this.props.auth.user.employeeID,
            createdDate: dateNow,
            modifiedBy: this.props.auth.user.employeeID,
            modifiedDate: null
          }
        };
        // return console.log(payload)
        res = await API.create("CFG").postTax(payload);
        console.log("res", res);
        if (res.data && res.data.status === "S") {
          this.openSavePopUp();
          this.getAllTax();
        }
        break;
      case "payroll":
        // return console.log('data', data)
        payload = {
          payrollTPLName: data.payrollTPLName,
          company: this.props.auth.user.companyID,
          payrollTPLCreational: {
            createdBy: this.props.auth.user.employeeID,
            createdDate: dateNow,
            modifiedBy: this.props.auth.user.employeeID,
            modifiedDate: null
          },
          payrollTPLDetails: [],
          payrollTPLID: data.payrollTPLID,
          payrollTPLPhotoURL: data.payrollTPLPhotoURL,
          payrollTPLStatus: data.payrollTPLStatus ? "ACTIVE" : "INACTIVE"
        };
        // return console.log('payload', payload)
        res = await API.create("CFG").postPayroll(payload);
        console.log("res", res);
        if (res.data && res.data.status === "S") {
          this.openSavePopUp();
          this.getAllPayroll();
        }
        break;
      case "org":
        // return console.log(data)
        let dataRefOrg = Object.assign([], data.orgStructureTPLDetails);
        dataRefOrg = dataRefOrg.map(value => {
          return {
            salaryStartFrom: value.salaryStartFrom,
            salaryStartTo: value.salaryStartTo,
            ouTaxTPLID: value.ouTaxTPLID.taxTPLID,
            oujobDescription: value.oujobDescription,
            ouhashChild: value.ouhashChild,
            ouchildren: this.parseChildren(value.ouchildren),
            oupayrollTaxTPLID: value.oupayrollTaxTPLID.payrollTPLID,
            ougrade: value.ougrade.bizparKey,
            oulevel: value.oulevel.bizparKey,
            ouposition: value.ouposition.bizparKey,
            ouid: value.ouid,
            ouparentID: value.ouparentID,
            ouCNBTPLID: !value.ouCNBTPLID ? "" : value.ouCNBTPLID.cnbtplid,
            ouFacilityTPLID: !value.ouFacilityTPLID
              ? ""
              : value.ouFacilityTPLID.facilityID
          };
        });

        payload = {
          orgStructureTPLName: data.orgStructureTPLName,
          orgStructureTPLCreational: {
            createdBy: this.props.auth.user.employeeID,
            createdDate: dateNow,
            modifiedBy: this.props.auth.user.employeeID,
            modifiedDate: null
          },
          orgStructureTPLDetails: dataRefOrg,
          orgStructureTPLID: data.orgStructureTPLID,
          orgStructureTPLPhotoURL: "",
          orgStructureTPLStatus: data.orgStructureTPLStatus
            ? "ACTIVE"
            : "INACTIVE"
        };
        console.log("payload", JSON.stringify(payload));
        res = await API.create("CFG").postOrg(payload);
        console.log("res", res);
        if (res.data && res.data.status === "S") {
          this.openSavePopUp();
          this.getAllOrg();
        }
        break;
      case "gov":
        let maxValue =
          !R.isEmpty(data.maxValue) || !R.isNil(data.maxValue)
            ? String(data.maxValue)
              .split(",")
              .join("")
            : data.maxValue;
        let value =
          !R.isEmpty(data.value) || !R.isNil(data.value)
            ? String(data.value)
              .split(",")
              .join("")
            : data.value;
        payload = {
          creationalSpecification: {
            createdBy: this.props.auth.user.employeeID,
            createdDate: dateNow,
            modifiedBy: this.props.auth.user.employeeID,
            modifiedDate: null
          },
          governmentPolicyID: data.governmentPolicyID,
          governmentPolicyItem: data.governmentPolicyItem,
          governmentPolicyStatus: data.governmentPolicyStatus
            ? "ACTIVE"
            : "INACTIVE",
          governmentPolicyType: data.governmentPolicyType,
          value: Number(value) + '-' + Number(maxValue),
          years: data.years
        };
        res = await API.create("CFG").postGovernment(payload);
        console.log(JSON.stringify(res));
        if (res.data && res.data.status === "S") {
          this.openSavePopUp();
          this.getAllGov();
        }
        break;
      case "glob":
        let cGlobVal = data.cglobalPolicyType === "POLICYTYP-002" ? JSON.stringify(data.cglobalPolicyValue) : data.cglobalPolicyValue
        payload = {
          cglobalPolicyCreationalDTO: {
            createdBy: this.props.auth.user.employeeID,
            createdDate: dateNow,
            modifiedBy: this.props.auth.user.employeeID,
            modifiedDate: null
          },
          cglobalPolicyID: data.cglobalPolicyID,
          cglobalPolicyValue: cGlobVal,
          esid: this.props.auth.user.companyID,
          cglobalPolicyType: data.cglobalPolicyType,
          cglobalPolicyStatus: data.cglobalPolicyStatus ? "ACTIVE" : "INACTIVE"
        };
        res = await API.create("CFG").postCorGlobal(payload);
        console.log(JSON.stringify(res));
        if (res.data && res.data.status === "S") {
          this.openSavePopUp();
          this.getAllCorGlobal();
        }
        break;
      default:
        break;
    }
  }

  async handleUpdate(data, type) {
    let { details, payload, res, dataTax, dataOrg, dataPay } = "";
    let sub = this.state.sub;
    switch (sub) {
      case "tax":
        dataTax = this.state.rawData;
        switch (type) {
          case "detail":
            details = Object.assign([], dataTax.taxTPLDetails);
            details = details.map(value => {
              return {
                taxComponent: value.taxComponent.bizparKey,
                taxComponentItem: value.taxComponentItem.bizparKey,
                taxComponentType: value.taxComponentType.bizparKey,
                taxSegment: value.taxSegment.bizparKey,
                taxTPLDetailID: value.taxTPLDetailID,
                taxTPLDetailStatus: value.taxTPLDetailStatus,
                isDefault: value.isDefault,
                taxTPLDetailNotes: value.taxTPLDetailNotes
              };
            });
            details.push(data);

            payload = {
              taxTPLID: dataTax.taxTPLID,
              taxTPLName: dataTax.taxTPLName,
              taxTPLType: dataTax.taxTPLType.bizparKey,
              company: this.props.auth.user.companyID,
              taxTPLPhotoURL: dataTax.taxTPLPhotoURL,
              taxTPLDetails: details,
              taxTPLStatus: dataTax.taxTPLStatus,
              corporateTaxTPLCreational: {
                createdBy: this.props.auth.user.employeeID,
                createdDate: dateNow,
                modifiedBy: this.props.auth.user.employeeID,
                modifiedDate: dateNow
              }
            };
            break;
          case "edit-detail":
            data = {
              ...data,
              taxComponent:
                data.taxComponent.bizparKey === undefined
                  ? data.taxComponent
                  : data.taxComponent.bizparKey,
              taxComponentItem:
                data.taxComponentItem.bizparKey === undefined
                  ? data.taxComponentItem
                  : data.taxComponentItem.bizparKey,
              taxComponentType:
                data.taxComponentType.bizparKey === undefined
                  ? data.taxComponentType
                  : data.taxComponentType.bizparKey,
              taxSegment:
                data.taxSegment.bizparKey === undefined
                  ? data.taxSegment
                  : data.taxSegment.bizparKey
            };

            // console.log('data', JSON.stringify(data))
            details = Object.assign([], dataTax.taxTPLDetails);
            details = details.map(value => {
              return {
                taxComponent: value.taxComponent.bizparKey,
                taxComponentItem: value.taxComponentItem.bizparKey,
                taxComponentType: value.taxComponentType.bizparKey,
                taxSegment: value.taxSegment.bizparKey,
                taxTPLDetailID: value.taxTPLDetailID,
                taxTPLDetailStatus: value.taxTPLDetailStatus,
                isDefault: value.isDefault,
                taxTPLDetailNotes: value.taxTPLDetailNotes
              };
            });

            let status = R.findIndex(
              R.propEq("taxTPLDetailID", data.taxTPLDetailID)
            )(details);
            if (status >= 0) {
              details[status] = data;
            }
            // return console.log('details', JSON.stringify(details[2]))

            payload = {
              taxTPLID: dataTax.taxTPLID,
              taxTPLName: dataTax.taxTPLName,
              taxTPLType: dataTax.taxTPLType.bizparKey,
              company: this.props.auth.user.companyID,
              taxTPLPhotoURL: dataTax.taxTPLPhotoURL,
              taxTPLDetails: details,
              taxTPLStatus: dataTax.taxTPLStatus,
              corporateTaxTPLCreational: {
                createdBy: this.props.auth.user.employeeID,
                createdDate: dataTax.corporateTaxTPLCreational.createdDate,
                modifiedBy: this.props.auth.user.employeeID,
                modifiedDate: dateNow
              }
            };

            // return console.log(payload)
            break;
          case "delete-detail":
            details = Object.assign([], dataTax.taxTPLDetails);
            details = details.map(value => {
              return {
                taxComponent: value.taxComponent.bizparKey,
                taxComponentItem: value.taxComponentItem.bizparKey,
                taxComponentType: value.taxComponentType.bizparKey,
                taxSegment: value.taxSegment.bizparKey,
                taxTPLDetailID: value.taxTPLDetailID,
                taxTPLDetailStatus: value.taxTPLDetailStatus,
                isDefault: value.isDefault,
                taxTPLDetailNotes: value.taxTPLDetailNotes
              };
            });
            // console.log('details', details)
            details.splice(data, 1);
            // return console.log('details', details)

            payload = {
              taxTPLID: dataTax.taxTPLID,
              taxTPLName: dataTax.taxTPLName,
              taxTPLType: dataTax.taxTPLType.bizparKey,
              company: this.props.auth.user.companyID,
              taxTPLPhotoURL: dataTax.taxTPLPhotoURL,
              taxTPLDetails: details,
              taxTPLStatus: dataTax.taxTPLStatus,
              corporateTaxTPLCreational: {
                createdBy: this.props.auth.user.employeeID,
                createdDate: dataTax.corporateTaxTPLCreational.createdDate,
                modifiedBy: this.props.auth.user.employeeID,
                modifiedDate: dateNow
              }
            };
            this.setState({
              deletePopUpVisible: false
            });
            break;
          default:
            // return console.log('default')
            details = Object.assign([], data.taxTPLDetails);
            details = details.map(value => {
              return {
                taxComponent: value.taxComponent.bizparKey,
                taxComponentItem: value.taxComponentItem.bizparKey,
                taxComponentType: value.taxComponentType.bizparKey,
                taxSegment: value.taxSegment.bizparKey,
                taxTPLDetailID: value.taxTPLDetailID,
                taxTPLDetailStatus: value.taxTPLDetailStatus,
                isDefault: value.isDefault,
                taxTPLDetailNotes: value.taxTPLDetailNotes
              };
            });
            // return console.log('details', JSON.stringify(details))
            payload = {
              taxTPLID: data.taxTPLID,
              taxTPLName: data.taxTPLName,
              taxTPLType: data.taxTPLType.bizparKey,
              company: this.props.auth.user.companyID,
              taxTPLPhotoURL: data.taxTPLPhotoURL,
              taxTPLDetails: details,
              taxTPLStatus: data.taxTPLStatus ? "ACTIVE" : "INACTIVE",
              corporateTaxTPLCreational: {
                modifiedBy: this.props.auth.user.employeeID,
                modifiedDate: dateNow
              }
            };
            break;
        }
        console.log(JSON.stringify(payload));
        // return console.log('payload', JSON.stringify(payload))
        res = await API.create("CFG").updateTax(payload);
        console.log("res", res);
        if (res.data && res.data.status === "S") {
          this.openSavePopUp();
          this.getAllTax();
        }
        break;
      // PAYROLL ===============================================================
      // =======================================================================
      case "payroll":
        // return console.log(data)
        dataPay = this.state.rawData;
        // return console.log('datapay', dataPay.payrollTPLDetails)
        switch (type) {
          case "detail":
            details = Object.assign([], dataPay.payrollTPLDetails);
            details = details.map(value => {
              return {
                isDefault: value.isDefault,
                isFix: value.isFix,
                isRegular: value.isRegular,
                isSpecialCalculation: value.isSpecialCalculation,
                notes: value.notes,
                payrollCoaType:
                  value.payrollCoaType === null
                    ? ""
                    : value.payrollCoaType.coaCategoryID,
                payrollComponent:
                  value.payrollComponent === null
                    ? ""
                    : value.payrollComponent.bizparKey,
                payrollComponentType:
                  value.payrollComponentType === null
                    ? ""
                    : value.payrollComponentType.bizparKey,
                payrollDetailStatus: value.payrollDetailStatus,
                payrollSegment:
                  value.payrollSegment === null
                    ? ""
                    : value.payrollSegment.bizparKey,
                payrollTPLDetailID: value.payrollTPLDetailID,
                payrollTax1721A1Type:
                  value.payrollTax1721A1Type === null
                    ? ""
                    : value.payrollTax1721A1Type.bizparKey,
                payrollTaxtype:
                  value.payrollTaxtype === null
                    ? ""
                    : value.payrollTaxtype.bizparKey,
                sequence: value.sequence,
                payrollComponentValue: value.payrollComponentValue
              };
            });
            details.push(data);
            // return console.log('detail', details)
            payload = {
              payrollTPLID: dataPay.payrollTPLID,
              payrollTPLName: dataPay.payrollTPLName,
              payrollTPLPhotoURL: dataPay.payrollTPLPhotoURL,
              payrollTPLDetails: details,
              payrollTPLStatus: dataPay.payrollTPLStatus
                ? "ACTIVE"
                : "INACTIVE",
              payrollTPLCreational: {
                modifiedBy: this.props.auth.user.employeeID,
                modifiedDate: dateNow
              }
            };
            console.log("isi", payload);
            break;
          case "edit-detail":
            data = {
              ...data,
              // "payrollCoaType": data.payrollCoaType === null || data.payrollCoaType.coaCategoryID === null || data.payrollCoaType.coaCategoryID === undefined ? '' : data.payrollCoaType,
              payrollComponentType:
                data.payrollComponentType.bizparKey === undefined
                  ? data.payrollComponentType
                  : data.payrollComponentType.bizparKey === null
                    ? ""
                    : data.payrollComponentType.bizparKey,
              payrollComponent:
                data.payrollComponent.bizparKey === undefined
                  ? data.payrollComponent
                  : data.payrollComponent.bizparKey === null
                    ? ""
                    : data.payrollComponent.bizparKey,
              payrollSegment:
                data.payrollSegment.bizparKey === undefined
                  ? data.payrollSegment
                  : data.payrollSegment.bizparKey === null
                    ? ""
                    : data.payrollSegment.bizparKey,
              payrollTax1721A1Type:
                data.payrollTax1721A1Type.bizparKey === undefined
                  ? data.payrollTax1721A1Type
                  : data.payrollTax1721A1Type.bizparKey === null
                    ? ""
                    : data.payrollTax1721A1Type.bizparKey,
              payrollTaxtype:
                data.payrollTaxtype.bizparKey === undefined
                  ? data.payrollTaxtype
                  : data.payrollTaxtype.bizparKey === null
                    ? ""
                    : data.payrollTaxtype.bizparKey
              //     // "payrollCoaType": data.payrollCoaType === null ? '' : data.payrollCoaType.coaCategoryID,
              //     "payrollSegment": data.payrollSegment === null ? '' : data.payrollSegment.bizparKey,
              //     "payrollComponent": data.payrollComponent === null ? '' : data.payrollComponent.bizparKey,
              //     "payrollTax1721A1Type": data.payrollTax1721A1Type === null ? '' : data.payrollTax1721A1Type.bizparKey,
              //     "payrollTaxtype": data.payrollTaxtype === null ? '' : data.payrollTaxtype.bizparKey,
            };

            // return console.log('data', (data))
            details = Object.assign([], dataPay.payrollTPLDetails);
            details = details.map(value => {
              return {
                isDefault: value.isDefault,
                isFix: value.isFix,
                isRegular: value.isRegular,
                isSpecialCalculation: value.isSpecialCalculation,
                notes: value.notes,
                payrollCoaType:
                  value.payrollCoaType === null
                    ? ""
                    : value.payrollCoaType.coaCategoryID,
                // "payrollCoaType": '',
                payrollComponent:
                  value.payrollComponent === null
                    ? ""
                    : value.payrollComponent.bizparKey,
                payrollComponentType:
                  value.payrollComponentType === null
                    ? ""
                    : value.payrollComponentType.bizparKey,
                payrollDetailStatus: value.payrollDetailStatus,
                payrollSegment:
                  value.payrollSegment === null
                    ? ""
                    : value.payrollSegment.bizparKey,
                payrollTPLDetailID: value.payrollTPLDetailID,
                payrollTax1721A1Type:
                  value.payrollTax1721A1Type === null
                    ? ""
                    : value.payrollTax1721A1Type.bizparKey,
                payrollTaxtype:
                  value.payrollTaxtype === null
                    ? ""
                    : value.payrollTaxtype.bizparKey,
                sequence: value.sequence,
                payrollComponentValue: value.payrollComponentValue
              };
            });
            // return console.log('details', JSON.stringify(details))
            let status = R.findIndex(
              R.propEq("payrollTPLDetailID", data.payrollTPLDetailID)
            )(details);
            if (status >= 0) {
              details[status] = data;
            }
            // return console.log('details', JSON.stringify(details))

            payload = {
              payrollTPLID: dataPay.payrollTPLID,
              payrollTPLName: dataPay.payrollTPLName,
              payrollTPLPhotoURL: dataPay.payrollTPLPhotoURL,
              payrollTPLDetails: details,
              payrollTPLStatus: dataPay.payrollTPLStatus
                ? "ACTIVE"
                : "INACTIVE",
              payrollTPLCreational: {
                modifiedBy: this.props.auth.user.employeeID,
                modifiedDate: dateNow
              }
            };

            console.log("isi", payload);
            break;
          case "delete-detail":
            details = Object.assign([], dataPay.payrollTPLDetails);
            details = details.map(value => {
              return {
                isDefault: value.isDefault,
                isFix: value.isFix,
                isRegular: value.isRegular,
                isSpecialCalculation: value.isSpecialCalculation,
                notes: value.notes,
                payrollCoaType:
                  value.payrollCoaType === null
                    ? ""
                    : value.payrollCoaType.coaCategoryID,
                // "payrollCoaType": '',
                payrollComponent:
                  value.payrollComponent === null
                    ? ""
                    : value.payrollComponent.bizparKey,
                payrollComponentType:
                  value.payrollComponentType === null
                    ? ""
                    : value.payrollComponentType.bizparKey,
                payrollDetailStatus: value.payrollDetailStatus,
                payrollSegment:
                  value.payrollSegment === null
                    ? ""
                    : value.payrollSegment.bizparKey,
                payrollTPLDetailID: value.payrollTPLDetailID,
                payrollTax1721A1Type:
                  value.payrollTax1721A1Type === null
                    ? ""
                    : value.payrollTax1721A1Type.bizparKey,
                payrollTaxtype:
                  value.payrollTaxtype === null
                    ? ""
                    : value.payrollTaxtype.bizparKey,
                sequence: value.sequence,
                payrollComponentValue: value.payrollComponentValue
              };
            });
            // console.log('details', details)
            details.splice(data, 1);
            // return console.log('details', details)

            payload = {
              payrollTPLID: dataPay.payrollTPLID,
              payrollTPLName: dataPay.payrollTPLName,
              payrollTPLPhotoURL: dataPay.payrollTPLPhotoURL,
              payrollTPLDetails: details,
              payrollTPLStatus: dataPay.payrollTPLStatus
                ? "ACTIVE"
                : "INACTIVE",
              payrollTPLCreational: {
                modifiedBy: this.props.auth.user.employeeID,
                modifiedDate: dateNow
              }
            };
            console.log("isi", JSON.stringify(payload));
            this.setState({
              deletePopUpVisible: false
            });
            break;
          default:
            // return console.log('default')
            details = Object.assign([], dataPay.payrollTPLDetails);
            details = details.map(value => {
              return {
                isDefault: value.isDefault,
                isFix: value.isFix,
                isRegular: value.isRegular,
                isSpecialCalculation: value.isSpecialCalculation,
                notes: value.notes,
                payrollCoaType:
                  value.payrollCoaType === null || value.payrollCoaType === ""
                    ? ""
                    : value.payrollCoaType.coaCategoryID,
                payrollComponent:
                  value.payrollComponent === null
                    ? ""
                    : value.payrollComponent.bizparKey,
                payrollComponentType:
                  value.payrollComponentType === null
                    ? ""
                    : value.payrollComponentType.bizparKey,
                payrollDetailStatus: value.payrollDetailStatus,
                payrollSegment:
                  value.payrollSegment === null
                    ? ""
                    : value.payrollSegment.bizparKey,
                payrollTPLDetailID: value.payrollTPLDetailID,
                payrollTax1721A1Type:
                  value.payrollTax1721A1Type === null
                    ? ""
                    : value.payrollTax1721A1Type.bizparKey,
                payrollTaxtype:
                  value.payrollTaxtype === null
                    ? ""
                    : value.payrollTaxtype.bizparKey,
                sequence: value.sequence,
                payrollComponentValue: value.payrollComponentValue
              };
            });
            // return console.log('details', JSON.stringify(details))
            payload = {
              payrollTPLID: data.payrollTPLID,
              payrollTPLName: data.payrollTPLName,
              payrollTPLPhotoURL: data.payrollTPLPhotoURL,
              payrollTPLDetails: details,
              payrollTPLStatus: data.payrollTPLStatus ? "ACTIVE" : "INACTIVE",
              payrollTPLCreational: {
                modifiedBy: this.props.auth.user.employeeID,
                modifiedDate: dateNow
              }
            };
            break;
        }
        console.log("payload", JSON.stringify(payload));
        res = await API.create("CFG").updatePayroll(payload);
        console.log("res", res);
        if (res.data && res.data.status === "S") {
          this.openSavePopUp();
          this.getAllPayroll();
        }
        break;
      case "gov":
        let maxValue =
          !R.isEmpty(data.maxValue) || !R.isNil(data.maxValue)
            ? String(data.maxValue)
              .split(",")
              .join("")
            : data.maxValue;
        let value =
          !R.isEmpty(data.value) || !R.isNil(data.value)
            ? String(data.value)
              .split(",")
              .join("")
            : data.value;
        payload = {
          creationalSpecification: {
            modifiedBy: this.props.auth.user.employeeID,
            modifiedDate: dateNow
          },
          governmentPolicyID: data.governmentPolicyID,
          governmentPolicyItem: data.governmentPolicyItem.bizparKey,
          governmentPolicyType: data.governmentPolicyType.bizparKey,
          governmentPolicyStatus: data.governmentPolicyStatus
            ? "ACTIVE"
            : "INACTIVE",

          value: data.governmentPolicyType.bizparKey === 'GOV-001' ? Number(value) : Number(value) + '-' + Number(maxValue),
          years: data.years
        };
        console.log(JSON.stringify(payload));
        res = await API.create("CFG").updateGovernment(payload);
        console.log("res", res);
        if (res.data && res.data.status === "S") {
          this.openSavePopUp();
          this.getAllGov();
        }
        break;
      case "glob":
        payload = {
          cglobalPolicyCreationalDTO: {
            createdBy: data.cglobalPolicyCreationalDTO.createdBy,
            createdDate: data.cglobalPolicyCreationalDTO.createdDate,
            modifiedBy: this.props.auth.user.employeeID,
            modifiedDate: dateNow
          },
          cglobalPolicyID: data.cglobalPolicyID,
          cglobalPolicyValue: data.cglobalPolicyValue,
          esid: this.props.auth.user.companyID,
          cglobalPolicyType: data.cglobalPolicyType.bizparKey,
          cglobalPolicyStatus: data.cglobalPolicyStatus ? "ACTIVE" : "INACTIVE"
        };
        res = await API.create("CFG").updateCorGlobal(payload);
        console.log("res", res);
        if (res.data && res.data.status === "S") {
          this.openSavePopUp();
          this.getAllCorGlobal();
        }
        break;
      // ORG STRUCT =====================================
      // ==========================================
      default:
        dataOrg = this.state.rawData;
        // let index = ''
        // return console.log('Parent', data.ouparentID)
        switch (type) {
          case "detail":
            if (data.ouparentID === "NULL") {
              details = Object.assign([], dataOrg.orgStructureTPLDetails);
              details = details.map(value => {
                return {
                  ouTaxTPLID:
                    value.ouTaxTPLID === null ? "" : value.ouTaxTPLID.taxTPLID,
                  ouchildren: value.ouchildren,
                  ougrade: value.ougrade.bizparKey,
                  ouhashChild: value.ouhashChild,
                  ouid: value.ouid,
                  oujobDescription: value.oujobDescription,
                  oulevel: value.oulevel.bizparKey,
                  oupayrollTaxTPLID:
                    value.oupayrollTaxTPLID === null
                      ? ""
                      : value.oupayrollTaxTPLID.payrollTPLID,
                  ouparentID: value.ouparentID,
                  ouposition: value.ouposition.bizparKey,
                  salaryStartFrom: value.salaryStartFrom,
                  salaryStartTo: value.salaryStartTo,
                  ouCNBTPLID: value.ouCNBTPLID.cnbtplid,
                  ouFacilityTPLID: value.ouFacilityTPLID.facilityID
                };
              });

              details.push(data);
              // return console.log('detail', details)
              payload = {
                orgStructureTPLID: dataOrg.orgStructureTPLId,
                orgStructureTPLName: dataOrg.orgStructureTPLName,
                orgStructureTPLPhotoURL: dataOrg.orgStructureTPLPhotoURL,
                orgStructureTPLDetails: details,
                orgStructureTPLStatus: "ACTIVE",
                orgStructureTPLCreational: {
                  createdBy: this.props.auth.user.employeeID,
                  createdDate: dataOrg.orgStructureTPLCreational.createdDate,
                  modifiedBy: this.props.auth.user.employeeID,
                  modifiedDate: dateNow
                }
              };
              console.log("payload", JSON.stringify(payload));
              res = await API.create("CFG").updateOrg(payload);
              console.log("res", res);
              if (res.data && res.data.status === "S") {
                this.openSavePopUp();
                this.getAllOrg();
              }
            } else {
              details = Object.assign([], dataOrg.orgStructureTPLDetails);
              details = details.map(value => {
                return {
                  ouTaxTPLID:
                    value.ouTaxTPLID === null ? "" : value.ouTaxTPLID.taxTPLID,
                  ouchildren: this.parseChildren(value.ouchildren),
                  ougrade: value.ougrade.bizparKey,
                  ouhashChild: value.ouhashChild,
                  ouid: value.ouid,
                  oujobDescription: value.oujobDescription,
                  oulevel: value.oulevel.bizparKey,
                  oupayrollTaxTPLID:
                    value.oupayrollTaxTPLID === null
                      ? ""
                      : value.oupayrollTaxTPLID.payrollTPLID,
                  ouparentID: value.ouparentID,
                  ouposition: value.ouposition.bizparKey,
                  salaryStartFrom: value.salaryStartFrom,
                  salaryStartTo: value.salaryStartTo,
                  ouCNBTPLID: !value.ouCNBTPLID
                    ? ""
                    : value.ouCNBTPLID.cnbtplid,
                  ouFacilityTPLID: !value.ouFacilityTPLID
                    ? ""
                    : value.ouFacilityTPLID.facilityID
                };
              });
              let index = R.findIndex(R.propEq("ouid", data.ouparentID))(
                dataOrg.orgStructureTPLDetails
              );
              if (index >= 0) {
                console.log(index);
                // if (dataOrg.orgStructureTPLDetails[index].ouchildren.length === 0) {

                // return console.log('detailsChildren', detailsChildren)
                details[index].ouchildren.push(data);
                payload = {
                  orgStructureTPLID: dataOrg.orgStructureTPLId,
                  orgStructureTPLName: dataOrg.orgStructureTPLName,
                  orgStructureTPLPhotoURL: dataOrg.orgStructureTPLPhotoURL,
                  // "orgStructureTPLDetails": [{ ...details[index], ouchildren: detailsChildren }],
                  orgStructureTPLDetails: details,
                  orgStructureTPLStatus: "ACTIVE",
                  orgStructureTPLCreational: {
                    createdBy: this.props.auth.user.employeeID,
                    createdDate: dataOrg.orgStructureTPLCreational.createdDate,
                    modifiedBy: this.props.auth.user.employeeID,
                    modifiedDate: dateNow
                  }
                };
                console.log("payload", JSON.stringify(payload));
                res = await API.create("CFG").updateOrg(payload);
                console.log("res", res);
                if (res.data && res.data.status === "S") {
                  this.openSavePopUp();
                  this.getAllOrg();
                }
              } else {
                // CREATE DATA CHILD-LVL1
                details = Object.assign([], details);
                details = details.map(value => {
                  console.log("fac", value.ouFacilityTPLID);
                  return {
                    ouTaxTPLID:
                      value.ouTaxTPLID || !R.isEmpty(value.ouTaxTPLID)
                        ? value.ouTaxTPLID
                        : "",
                    ouchildren: this.parseChildrenAdd(data, value.ouchildren),
                    ougrade:
                      value.ougrade || !R.isEmpty(value.ougrade)
                        ? value.ougrade
                        : "",
                    ouhashChild: true,
                    ouid: value.ouid,
                    oujobDescription: value.oujobDescription,
                    oulevel:
                      value.oulevel || !R.isEmpty(value.oulevel)
                        ? value.oulevel
                        : "",
                    oupayrollTaxTPLID:
                      value.oupayrollTaxTPLID ||
                        !R.isEmpty(value.oupayrollTaxTPLID)
                        ? value.oupayrollTaxTPLID
                        : "",
                    ouparentID: value.ouparentID,
                    ouposition:
                      value.ouposition || !R.isEmpty(value.ouposition)
                        ? value.ouposition
                        : "",
                    salaryStartFrom: value.salaryStartFrom,
                    salaryStartTo: value.salaryStartTo,
                    ouCNBTPLID:
                      value.ouCNBTPLID || !R.isEmpty(value.ouCNBTPLID)
                        ? value.ouCNBTPLID
                        : "",
                    ouFacilityTPLID:
                      value.ouFacilityTPLID || !R.isEmpty(value.ouFacilityTPLID)
                        ? value.ouFacilityTPLID
                        : ""
                  };
                });
                payload = {
                  orgStructureTPLID: dataOrg.orgStructureTPLId,
                  orgStructureTPLName: dataOrg.orgStructureTPLName,
                  orgStructureTPLPhotoURL: dataOrg.orgStructureTPLPhotoURL,
                  orgStructureTPLDetails: details,
                  orgStructureTPLStatus: "ACTIVE",
                  orgStructureTPLCreational: {
                    createdBy: this.props.auth.user.employeeID,
                    createdDate: dataOrg.orgStructureTPLCreational.createdDate,
                    modifiedBy: this.props.auth.user.employeeID,
                    modifiedDate: dateNow
                  }
                };
                console.log("payload", JSON.stringify(payload));
                res = await API.create("CFG").updateOrg(payload);
                console.log("res", res);
                if (res.data && res.data.status === "S") {
                  this.openSavePopUp();
                  this.getAllOrg();
                }
              }
            }
            break;
          case "edit-detail":
            data = {
              ...data,
              ouFacilityTPLID:
                data.ouFacilityTPLID.facilityID === undefined
                  ? data.ouFacilityTPLID
                  : data.ouFacilityTPLID.facilityID === null
                    ? ""
                    : data.ouFacilityTPLID.facilityID,
              ouCNBTPLID:
                data.ouCNBTPLID.cnbtplid === undefined
                  ? data.ouCNBTPLID
                  : data.ouCNBTPLID.cnbtplid === null
                    ? ""
                    : data.ouCNBTPLID.cnbtplid,
              // ouTaxTPLID: data.ouTaxTPLID === null ? '' : data.ouTaxTPLID.taxTPLID,
              ouTaxTPLID:
                data.ouTaxTPLID.taxTPLID === undefined
                  ? data.ouTaxTPLID
                  : data.ouTaxTPLID.taxTPLID === null
                    ? ""
                    : data.ouTaxTPLID.taxTPLID,
              ougrade:data.ougrade,
              oulevel:
                data.oulevel.bizparKey === undefined
                  ? data.oulevel
                  : data.oulevel.bizparKey === null
                    ? ""
                    : data.oulevel.bizparKey,
              oupayrollTaxTPLID:
                data.oupayrollTaxTPLID.payrollTPLID === undefined
                  ? data.oupayrollTaxTPLID
                  : data.oupayrollTaxTPLID.payrollTPLID === null
                    ? ""
                    : data.oupayrollTaxTPLID.payrollTPLID,
              ouposition:
                data.ouposition.bizparKey === undefined
                  ? data.ouposition
                  : data.ouposition.bizparKey === null
                    ? ""
                    : data.ouposition.bizparKey
            };
            // console.log('converted data', data)
            dataOrg = this.state.rawData;
            details = Object.assign([], dataOrg.orgStructureTPLDetails);
            details = details.map(value => {
              return {
                ouTaxTPLID:
                  value.ouTaxTPLID === null ? "" : value.ouTaxTPLID.taxTPLID,
                ouchildren: this.parseChildren(value.ouchildren),
                ougrade: value.ougrade === null ? "" : value.ougrade.bizparKey,
                ouhashChild: true,
                ouid: value.ouid,
                oujobDescription: value.oujobDescription,
                oulevel: value.oulevel === null ? "" : value.oulevel.bizparKey,
                oupayrollTaxTPLID:
                  value.oupayrollTaxTPLID === null
                    ? ""
                    : value.oupayrollTaxTPLID.payrollTPLID,
                ouparentID: value.ouparentID,
                ouposition:
                  value.ouposition === null ? "" : value.ouposition.bizparKey,
                salaryStartFrom: value.salaryStartFrom,
                salaryStartTo: value.salaryStartTo,
                ouCNBTPLID: value.ouCNBTPLID
                  ? value.ouCNBTPLID.cnbtplid
                  : value.ouCNBTPLID
                    ? value.ouCNBTPLID
                    : "",
                ouFacilityTPLID: value.ouFacilityTPLID
                  ? value.ouFacilityTPLID.facilityID
                  : value.ouFacilityTPLID
                    ? value.ouFacilityTPLID
                    : ""
              };
            });
            let index = R.findIndex(R.propEq("ouid", data.ouid))(
              dataOrg.orgStructureTPLDetails
            );
            if (index >= 0) {
              console.log("index found");
              details[index] = {
                ...details[index],
                ouTaxTPLID: data.ouTaxTPLID,
                ougrade: data.ougrade,
                ouid: data.ouid,
                oujobDescription: data.oujobDescription,
                oulevel: data.oulevel,
                oupayrollTaxTPLID: data.oupayrollTaxTPLID,
                ouparentID: data.ouparentID,
                ouposition: data.ouposition,
                salaryStartFrom: data.salaryStartFrom,
                salaryStartTo: data.salaryStartTo,
                ouCNBTPLID: data.ouCNBTPLID,
                ouFacilityTPLID: data.ouFacilityTPLID
              };
              // return console.log(details)
              console.log("final details", JSON.stringify(details));
              payload = {
                orgStructureTPLID: dataOrg.orgStructureTPLId,
                orgStructureTPLName: dataOrg.orgStructureTPLName,
                orgStructureTPLPhotoURL: dataOrg.orgStructureTPLPhotoURL,
                orgStructureTPLDetails: details,
                orgStructureTPLStatus: "ACTIVE",
                orgStructureTPLCreational: {
                  createdBy: this.props.auth.user.employeeID,
                  createdDate: dataOrg.orgStructureTPLCreational.createdDate,
                  modifiedBy: this.props.auth.user.employeeID,
                  modifiedDate: dateNow
                }
              };
              console.log("payload", JSON.stringify(payload));
              res = await API.create("CFG").updateOrg(payload);
              console.log("res", res);
              if (res.data && res.data.status === "S") {
                this.openSavePopUp();
                this.getAllOrg();
              }
            } else {
              details = Object.assign([], details);
              details = details.map(value => {
                return {
                  ouTaxTPLID:
                    value.ouTaxTPLID || !R.isEmpty(value.ouTaxTPLID)
                      ? value.ouTaxTPLID
                      : "",
                  ouchildren: this.parseChildrenEdit(data, value.ouchildren),
                  ougrade:
                    value.ougrade || !R.isEmpty(value.ougrade)
                      ? value.ougrade
                      : "",
                  ouhashChild: true,
                  ouid: value.ouid,
                  oujobDescription: value.oujobDescription,
                  oulevel:
                    value.oulevel || !R.isEmpty(value.oulevel)
                      ? value.oulevel
                      : "",
                  oupayrollTaxTPLID:
                    value.oupayrollTaxTPLID ||
                      !R.isEmpty(value.oupayrollTaxTPLID)
                      ? value.oupayrollTaxTPLID
                      : "",
                  ouparentID: value.ouparentID,
                  ouposition:
                    value.ouposition || !R.isEmpty(value.ouposition)
                      ? value.ouposition
                      : "",
                  salaryStartFrom: value.salaryStartFrom,
                  salaryStartTo: value.salaryStartTo,
                  ouCNBTPLID:
                    value.ouCNBTPLID || !R.isEmpty(value.ouCNBTPLID)
                      ? value.ouCNBTPLID
                      : "",
                  ouFacilityTPLID:
                    value.ouFacilityTPLID || !R.isEmpty(value.ouFacilityTPLID)
                      ? value.ouFacilityTPLID
                      : ""
                };
              });
              // return console.log(details)
              console.log("final details", JSON.stringify(details));
              payload = {
                orgStructureTPLID: dataOrg.orgStructureTPLId,
                orgStructureTPLName: dataOrg.orgStructureTPLName,
                orgStructureTPLPhotoURL: dataOrg.orgStructureTPLPhotoURL,
                orgStructureTPLDetails: details,
                orgStructureTPLStatus: "ACTIVE",
                orgStructureTPLCreational: {
                  createdBy: this.props.auth.user.employeeID,
                  createdDate: dataOrg.orgStructureTPLCreational.createdDate,
                  modifiedBy: this.props.auth.user.employeeID,
                  modifiedDate: dateNow
                }
              };
              console.log("payload", JSON.stringify(payload));
              res = await API.create("CFG").updateOrg(payload);
              console.log("res", res);
              if (res.data && res.data.status === "S") {
                this.openSavePopUp();
                this.getAllOrg();
              }
            }
            break;
          case "delete-detail":
            // return console.log(data)
            dataOrg = this.state.rawData;
            data = {
              ...data,
              ouCNBTPLID: data.ouCNBTPLID ? data.ouCNBTPLID.cnbtplid : "",
              ouFacilityTPLID: data.ouFacilityTPLID
                ? data.ouFacilityTPLID.facilityID
                : "",
              // ouTaxTPLID: data.ouTaxTPLID === null ? '' : data.ouTaxTPLID.taxTPLID,
              ouTaxTPLID:
                data.ouTaxTPLID.taxTPLID === undefined
                  ? data.ouTaxTPLID
                  : data.ouTaxTPLID.taxTPLID === null
                    ? ""
                    : data.ouTaxTPLID.taxTPLID,
              ougrade:
                data.ougrade.bizparKey === undefined
                  ? data.ougrade
                  : data.ougrade.bizparKey === null
                    ? ""
                    : data.ougrade.bizparKey,
              oulevel:
                data.oulevel.bizparKey === undefined
                  ? data.oulevel
                  : data.oulevel.bizparKey === null
                    ? ""
                    : data.oulevel.bizparKey,
              oupayrollTaxTPLID:
                data.oupayrollTaxTPLID.payrollTPLID === undefined
                  ? data.oupayrollTaxTPLID
                  : data.oupayrollTaxTPLID.payrollTPLID === null
                    ? ""
                    : data.oupayrollTaxTPLID.payrollTPLID,
              ouposition:
                data.ouposition.bizparKey === undefined
                  ? data.ouposition
                  : data.ouposition.bizparKey === null
                    ? ""
                    : data.ouposition.bizparKey
            };
            details = Object.assign([], dataOrg.orgStructureTPLDetails);
            details = details.map(value => {
              return {
                ouTaxTPLID:
                  value.ouTaxTPLID === null ? "" : value.ouTaxTPLID.taxTPLID,
                ouchildren: this.parseChildren(value.ouchildren),
                ougrade: value.ougrade === null ? "" : value.ougrade.bizparKey,
                ouhashChild: true,
                ouid: value.ouid,
                oujobDescription: value.oujobDescription,
                oulevel: value.oulevel === null ? "" : value.oulevel.bizparKey,
                oupayrollTaxTPLID:
                  value.oupayrollTaxTPLID === null
                    ? ""
                    : value.oupayrollTaxTPLID.payrollTPLID,
                ouparentID: value.ouparentID,
                ouposition:
                  value.ouposition === null ? "" : value.ouposition.bizparKey,
                salaryStartFrom: value.salaryStartFrom,
                salaryStartTo: value.salaryStartTo,
                ouCNBTPLID: value.ouCNBTPLID
                  ? value.ouCNBTPLID.cnbtplid
                  : value.ouCNBTPLID
                    ? value.ouCNBTPLID
                    : "",
                ouFacilityTPLID: value.ouFacilityTPLID
                  ? value.ouFacilityTPLID.facilityID
                  : value.ouFacilityTPLID
                    ? value.ouFacilityTPLID
                    : ""
              };
            });
            let index1 = R.findIndex(R.propEq("ouid", data.ouid))(
              dataOrg.orgStructureTPLDetails
            );
            if (index1 >= 0) {
              console.log("index found");
              details.splice(index1, 1);
              // return console.log(details)
              console.log("final details", JSON.stringify(details));
              payload = {
                orgStructureTPLID: dataOrg.orgStructureTPLId,
                orgStructureTPLName: dataOrg.orgStructureTPLName,
                orgStructureTPLPhotoURL: dataOrg.orgStructureTPLPhotoURL,
                orgStructureTPLDetails: details,
                orgStructureTPLStatus: "ACTIVE",
                orgStructureTPLCreational: {
                  createdBy: this.props.auth.user.employeeID,
                  createdDate: dataOrg.orgStructureTPLCreational.createdDate,
                  modifiedBy: this.props.auth.user.employeeID,
                  modifiedDate: dateNow
                }
              };
              console.log("payload", JSON.stringify(payload));
              res = await API.create("CFG").updateOrg(payload);
              console.log("res", res);
              if (res.data && res.data.status === "S") {
                this.openSavePopUp();
                this.getAllOrg();
              }
            } else {
              details = Object.assign([], details);
              details = details.map(value => {
                return {
                  ouTaxTPLID:
                    value.ouTaxTPLID || !R.isEmpty(value.ouTaxTPLID)
                      ? value.ouTaxTPLID
                      : "",
                  ouchildren: this.parseChildrenDelete(data, value.ouchildren),
                  ougrade:
                    value.ougrade || !R.isEmpty(value.ougrade)
                      ? value.ougrade
                      : "",
                  ouhashChild: true,
                  ouid: value.ouid,
                  oujobDescription: value.oujobDescription,
                  oulevel:
                    value.oulevel || !R.isEmpty(value.oulevel)
                      ? value.oulevel
                      : "",
                  oupayrollTaxTPLID:
                    value.oupayrollTaxTPLID ||
                      !R.isEmpty(value.oupayrollTaxTPLID)
                      ? value.oupayrollTaxTPLID
                      : "",
                  ouparentID: value.ouparentID,
                  ouposition:
                    value.ouposition || !R.isEmpty(value.ouposition)
                      ? value.ouposition
                      : "",
                  salaryStartFrom: value.salaryStartFrom,
                  salaryStartTo: value.salaryStartTo,
                  ouCNBTPLID:
                    value.ouCNBTPLID || !R.isEmpty(value.ouCNBTPLID)
                      ? value.ouCNBTPLID
                      : "",
                  ouFacilityTPLID:
                    value.ouFacilityTPLID || !R.isEmpty(value.ouFacilityTPLID)
                      ? value.ouFacilityTPLID
                      : ""
                };
              });
              console.log("final details", JSON.stringify(details));
              payload = {
                orgStructureTPLID: dataOrg.orgStructureTPLId,
                orgStructureTPLName: dataOrg.orgStructureTPLName,
                orgStructureTPLPhotoURL: dataOrg.orgStructureTPLPhotoURL,
                orgStructureTPLDetails: details,
                orgStructureTPLStatus: "ACTIVE",
                orgStructureTPLCreational: {
                  createdBy: this.props.auth.user.employeeID,
                  createdDate: dataOrg.orgStructureTPLCreational.createdDate,
                  modifiedBy: this.props.auth.user.employeeID,
                  modifiedDate: dateNow
                }
              };
              console.log("payload", JSON.stringify(payload));
              res = await API.create("CFG").updateOrg(payload);
              console.log("res", res);
              if (res.data && res.data.status === "S") {
                this.openSavePopUp();
                this.getAllOrg();
              }
            }
            break;
          default:
            details = Object.assign([], dataOrg.orgStructureTPLDetails);
            details = details.map(value => {
              let details2 = Object.assign([], value.ouchildren);
              details2 = details2.map(value => {
                let details3 = Object.assign([], value.ouchildren);
                details3 = details3.map(value => {
                  let details4 = Object.assign([], value.ouchildren);
                  details4 = details4.map(value => {
                    return {
                      ouTaxTPLID:
                        value.ouTaxTPLID === null
                          ? ""
                          : value.ouTaxTPLID.taxTPLID,
                      ouchildren: [],
                      ougrade:
                        value.ougrade === null ? "" : value.ougrade.bizparKey,
                      ouhashChild: true,
                      ouid: value.ouid,
                      oujobDescription: value.oujobDescription,
                      oulevel:
                        value.oulevel === null ? "" : value.oulevel.bizparKey,
                      oupayrollTaxTPLID:
                        value.oupayrollTaxTPLID === null
                          ? ""
                          : value.oupayrollTaxTPLID.payrollTPLID,
                      ouparentID: value.ouparentID,
                      ouposition:
                        value.ouposition === null
                          ? ""
                          : value.ouposition.bizparKey,
                      salaryStartFrom: value.salaryStartFrom,
                      salaryStartTo: value.salaryStartTo,
                      ouCNBTPLID: value.ouCNBTPLID.cnbtplid,
                      ouFacilityTPLID: value.ouFacilityTPLID.facilityID
                    };
                  });

                  return {
                    ouTaxTPLID:
                      value.ouTaxTPLID === null
                        ? ""
                        : value.ouTaxTPLID.taxTPLID,
                    ouchildren: details4,
                    ougrade:
                      value.ougrade === null ? "" : value.ougrade.bizparKey,
                    ouhashChild: true,
                    ouid: value.ouid,
                    oujobDescription: value.oujobDescription,
                    oulevel:
                      value.oulevel === null ? "" : value.oulevel.bizparKey,
                    oupayrollTaxTPLID:
                      value.oupayrollTaxTPLID === null
                        ? ""
                        : value.oupayrollTaxTPLID.payrollTPLID,
                    ouparentID: value.ouparentID,
                    ouposition:
                      value.ouposition === null
                        ? ""
                        : value.ouposition.bizparKey,
                    salaryStartFrom: value.salaryStartFrom,
                    salaryStartTo: value.salaryStartTo,
                    ouCNBTPLID: value.ouCNBTPLID.cnbtplid,
                    ouFacilityTPLID: value.ouFacilityTPLID.facilityID
                  };
                });

                return {
                  ouTaxTPLID:
                    value.ouTaxTPLID === null ? "" : value.ouTaxTPLID.taxTPLID,
                  ouchildren: details3,
                  ougrade:
                    value.ougrade === null ? "" : value.ougrade.bizparKey,
                  ouhashChild: true,
                  ouid: value.ouid,
                  oujobDescription: value.oujobDescription,
                  oulevel:
                    value.oulevel === null ? "" : value.oulevel.bizparKey,
                  oupayrollTaxTPLID:
                    value.oupayrollTaxTPLID === null
                      ? ""
                      : value.oupayrollTaxTPLID.payrollTPLID,
                  ouparentID: value.ouparentID,
                  ouposition:
                    value.ouposition === null ? "" : value.ouposition.bizparKey,
                  salaryStartFrom: value.salaryStartFrom,
                  salaryStartTo: value.salaryStartTo,
                  ouCNBTPLID: value.ouCNBTPLID.cnbtplid,
                  ouFacilityTPLID: value.ouFacilityTPLID.facilityID
                };
              });

              return {
                ouTaxTPLID:
                  value.ouTaxTPLID === null ? "" : value.ouTaxTPLID.taxTPLID,
                ouchildren: details2,
                ougrade: value.ougrade === null ? "" : value.ougrade.bizparKey,
                ouhashChild: true,
                ouid: value.ouid,
                oujobDescription: value.oujobDescription,
                oulevel: value.oulevel === null ? "" : value.oulevel.bizparKey,
                oupayrollTaxTPLID:
                  value.oupayrollTaxTPLID === null
                    ? ""
                    : value.oupayrollTaxTPLID.payrollTPLID,
                ouparentID: value.ouparentID,
                ouposition:
                  value.ouposition === null ? "" : value.ouposition.bizparKey,
                salaryStartFrom: value.salaryStartFrom,
                salaryStartTo: value.salaryStartTo,
                ouCNBTPLID: value.ouCNBTPLID.cnbtplid,
                ouFacilityTPLID: value.ouFacilityTPLID.facilityID
              };
            });

            payload = {
              orgStructureTPLID: data.orgStructureTPLId,
              orgStructureTPLName: data.orgStructureTPLName,
              orgStructureTPLPhotoURL: data.orgStructureTPLPhotoURL,
              orgStructureTPLDetails: details,
              orgStructureTPLStatus: data.orgStructureTPLStatus
                ? "ACTIVE"
                : "INACTIVE",
              orgStructureTPLCreational: {
                createdBy: this.props.auth.user.employeeID,
                createdDate: data.orgStructureTPLCreational.createdDate,
                modifiedBy: this.props.auth.user.employeeID,
                modifiedDate: dateNow
              }
            };
            console.log("payload", JSON.stringify(payload));
            res = await API.create("CFG").updateOrg(payload);
            console.log("res", res);
            if (res.data && res.data.status === "S") {
              this.openSavePopUp();
              this.getAllOrg();
            }
            break;
        }
        // return console.log('payload', JSON.stringify(payload))
        // res = await API.create('CFG').updateOrg(payload)
        // console.log('res', res)
        // if (res.data && res.data.status === 'S') {
        //     this.openSavePopUp()
        //     this.getAllOrg()
        // }
        break;
    }
  }

  handleDelete = async () => {
    // return console.log(this.state.formType)
    let { id, payload, res } = "";
    let formType = this.state.formType;
    switch (formType) {
      case "tax":
        id = this.state.rawData[this.state.selectedIndex].taxTPLID;
        payload = {
          referenceID: id,
          requestBy: "SYSTEM",
          requestDate: dateNow
        };
        // return console.log(payload)
        res = await API.create("CFG").deleteTax(payload);
        if (res.data && res.data.status === "S") {
          this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible
          });
          this.getAllTax();
        }
        break;
      case "payroll":
        id = this.state.rawData[this.state.selectedIndex].payrollTPLID;
        payload = {
          referenceID: id,
          requestBy: "SYSTEM",
          requestDate: dateNow
        };
        // return console.log(payload)
        res = await API.create("CFG").deletePayroll(payload);
        if (res.data && res.data.status === "S") {
          this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible
          });
          this.getAllPayroll();
        }
        break;
      case "gov":
        // id =
        payload = {
          referenceID: this.state.rawData[this.state.selectedIndex]
            .governmentPolicyID,
          requestBy: "SYSTEM",
          requestDate: dateNow
        };
        // return console.log(payload)
        res = await API.create("CFG").deleteGovernment(payload);
        console.log(JSON.stringify(res));
        if (res.data && res.data.status === "S") {
          this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible
          });
          this.getAllGov();
        }
        break;
      case "glob":
        payload = {
          referenceID: this.state.rawData[this.state.selectedIndex]
            .cglobalPolicyID,
          requestBy: this.props.auth.user.employeeID,
          requestDate: dateNow
        };
        res = await API.create("CFG").deleteCorGlobal(payload);
        console.log(JSON.stringify(res));
        if (res.data && res.data.status === "S") {
          this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible
          });
          this.getAllCorGlobal();
        }
        break;
      default:
        id = this.state.rawData[this.state.selectedIndex].orgStructureTPLId;
        payload = {
          referenceID: id,
          requestBy: "SYSTEM",
          requestDate: dateNow
        };
        // return console.log(payload)
        res = await API.create("CFG").deleteOrg(payload);
        if (res.data && res.data.status === "S") {
          this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible
          });
          this.getAllOrg();
        }
        break;
    }
  };

  async getAllTax() {
    let payload = {
      limit: 500,
      offset: 0,
      params: { taxTPLStatus: "ACTIVE" }
    };
    let res = await API.create("CFG").getTaxByStatus(payload);
    if (res.data && res.data.status === "S") {
      let dataTableTax = res.data.data.map(value => {
        const { taxTPLID, taxTPLName, taxTPLStatus } = value;

        let status = taxTPLStatus === "ACTIVE" ? "YES" : "NO";

        return [taxTPLID, taxTPLName, status];
      });
      this.setState({
        dataTableTax,
        rawDataTax: res.data.data
        // sub: 'tax'
      });
    }
  }

  async getAllGov() {
    let payload = {
      limit: 500,
      offset: 0,
      params: { governmentPolicyStatus: "ACTIVE" }
    };
    let res = await API.create("CFG").getGovernmentByStatus(payload);
    if (res.data && res.data.status === "S") {
      let dataTableGov = res.data.data.map((val, index) => {
        const {
          governmentPolicyType,
          governmentPolicyItem,
          governmentPolicyStatus,
          years,
          value,
          maxValue
        } = val;

        let status = governmentPolicyStatus === "ACTIVE" ? "YES" : "NO";
        let splitArray = String(value).split('-', 2)
        let value1 = splitArray[0]
        let value2 = splitArray[1]
        console.log(splitArray)
        let type =
          governmentPolicyType.bizparValue === "PTKP"
            ? new Intl.NumberFormat("ID", {
              style: "currency",
              currency: "IDR"
            }).format(value)
            :

            String(
              new Intl.NumberFormat("ID", {
                style: "currency",
                currency: "IDR"
              }).format(value1) +
              " - " +
              new Intl.NumberFormat("ID", {
                style: "currency",
                currency: "IDR"
              }).format(value2)
            );

        return [
          (index += 1),
          governmentPolicyType ? governmentPolicyType.bizparValue : " ",
          governmentPolicyItem ? governmentPolicyItem.bizparValue : "",
          years,
          type,
          status
        ];
      });
      this.setState({
        dataTableGov,
        rawDataGov: res.data.data
      });
    }
  }

  async getAllPayroll() {
    this.refs.child.getData(0, 5);
  }

  async getAllOrg() {
    let payload = {
      limit: 500,
      offset: 0,
      params: {
        orgStructureTPLStatus: "ACTIVE"
      }
    };
    let res = await API.create("CFG").getOrg(payload);
    if (res.data && res.data.status === "S") {
      console.log("res", res.data.data);
      let dataTableOrg = res.data.data.map(value => {
        if (value !== null) {
          const {
            orgStructureTPLId,
            orgStructureTPLName,
            orgStructureTPLStatus
          } = value;
          let status = orgStructureTPLStatus === "ACTIVE" ? "YES" : "NO";
          return [orgStructureTPLId, orgStructureTPLName, status];
        } else {
          return ["", "", ""];
        }
        // const { orgStructureTPLId, orgStructureTPLName, orgStructureTPLStatus } = value
        // let status = orgStructureTPLStatus === 'ACTIVE' ? 'YES' : 'NO'
        // return [
        //     orgStructureTPLId,
        //     orgStructureTPLName,
        //     status
        // ]
      });
      this.setState({
        dataTableOrg,
        rawDataOrg: res.data.data
        // sub: 'org'
      });
    }
  }

  async getAllCorGlobal() {
    let payload = {
      limit: 500,
      offset: 0,
      params: {
        cGlobalPolicyStatus: "ACTIVE"
      }
    };
    let res = await API.create("CFG").getCorGlobalByStatus(payload);
    if (res.data && res.data.status === "S") {
      console.log("res", res.data.data);
      let dataTableCorGlobal = res.data.data.map((value, index) => {
        if (value !== null) {
          const {
            cglobalPolicyID,
            cglobalPolicyType,
            cglobalPolicyStatus
          } = value;
          let status = cglobalPolicyStatus === "ACTIVE" ? "YES" : "NO";
          return [
            (index += 1),
            cglobalPolicyID,
            cglobalPolicyType.bizparKey,
            status
          ];
        } else {
          return ["", "", ""];
        }
      });
      this.setState({
        dataTableCorGlobal,
        rawDataCorGlobal: res.data.data
        // sub: 'org'
      });
    }
  }

  async getAllFacility() {
    let payload = {
      limit: 500,
      offset: 0,
      params: { facilityStatus: "ACTIVE" }
    };

    let res = await API.create("CFG").getFacilityByStatus(payload);
    if (res.data && res.data.status === "S") {
      console.log("res", res.data.data);
      this.setState({ rawDataFacility: res.data.data });
    }
  }

  async getAllCNB() {
    let payload = {
      offset: 0,
      limit: 500,
      params: {
        cNBStatus: "ACTIVE"
      }
    };

    let res = await API.create("CFG").getCNBbyStatus(payload);
    if (res.data && res.data.status === "S") {
      console.log("res", res.data.data);
      this.setState({ rawDataCNB: res.data.data });
    }
  }

  componentDidMount() {
    this.getAllTax();
    this.getAllPayroll();
    this.getAllOrg();
    this.getAllFacility();
    this.getAllCNB();
    this.getBizparType();
    this.getAllGov();
    this.getAllCorGlobal();
  }

  render() {
    console.log("suub", this.state.sub);
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
                          <i className="color-blue fa fa-1x fa-file-archive margin-right-10px"></i>
                        </div>
                        <div>
                          <div className="txt-site txt-12 txt-bold txt-main">
                            Corporate Template
                          </div>
                          <div className="txt-site txt-10 txt-thin txt-primary">
                            Corporate Template
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
                        id="navmenu-ch"
                      />
                      <div className="grid grid-2x margin-bottom-10px">
                        <div className="col-1">
                          <div className="display-flex-normal margin-top-10px">
                            <i className="fa fa-1x fa-sitemap margin-right-5px"></i>
                            <span className="txt-site txt-11 txt-main">
                              Organization Structure Template
                            </span>
                          </div>
                        </div>
                        <div className="col-2 content-right">
                          <label htmlFor="navmenu-ch">
                            <div className="app-open-close-icon"></div>
                          </label>
                          <button
                            onClick={this.opPopupPage("create-org")}
                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                          >
                            <i className="fa fa-lw fa-plus" />
                          </button>
                        </div>
                      </div>
                      <div className="app-open-close-content">
                        <TableCorporateStruct
                          dataTableOrg={this.state.dataTableOrg}
                          rawDataOrg={this.state.rawDataOrg}
                          openSlide={this.opSidePage.bind(this)}
                          onClickDelete={this.openDeletePopUp.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="app-open-close margin-top-20px">
                      <input
                        type="checkbox"
                        name="navmenu"
                        className="app-open-close-input"
                        id="navmenu-coh"
                      />
                      <div className="grid grid-2x margin-bottom-10px">
                        <div className="col-1">
                          <div className="display-flex-normal margin-top-10px">
                            <i className="fa fa-1x fa-receipt margin-right-5px"></i>
                            <span className="txt-site txt-11 txt-main">
                              Payroll Template Detail
                            </span>
                          </div>
                        </div>
                        <div className="col-2 content-right">
                          <label htmlFor="navmenu-coh">
                            <div className="app-open-close-icon"></div>
                          </label>
                          <button
                            onClick={this.opPopupPage("create-payroll")}
                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                          >
                            <i className="fa fa-lw fa-plus" />
                          </button>
                        </div>
                      </div>
                      <div className="app-open-close-content">
                        <TablePayroll
                          ref="child"
                          dataTablePayroll={this.state.dataTablePayroll}
                          rawDataPayroll={this.state.rawDataPayroll}
                          openSlide={this.opSidePage.bind(this)}
                          onClickDelete={this.openDeletePopUp.bind(this)}
                        />
                      </div>
                    </div>

                    <div className="app-open-close margin-top-20px">
                      <input
                        type="checkbox"
                        name="navmenu"
                        className="app-open-close-input"
                        id="navmenu-goh"
                      />
                      <div className="grid grid-2x margin-bottom-10px">
                        <div className="col-1">
                          <div className="display-flex-normal margin-top-10px">
                            <i className="fa fa-1x fa-file-invoice-dollar margin-right-5px"></i>
                            <span className="txt-site txt-11 txt-main">
                              Tax Template
                            </span>
                          </div>
                        </div>
                        <div className="col-2 content-right">
                          <label htmlFor="navmenu-goh">
                            <div className="app-open-close-icon"></div>
                          </label>
                          <button
                            onClick={this.opPopupPage("create-tax")}
                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                          >
                            <i className="fa fa-lw fa-plus" />
                          </button>
                        </div>
                      </div>
                      <div className="app-open-close-content">
                        <TableTax
                          dataTableTax={this.state.dataTableTax}
                          rawDataTax={this.state.rawDataTax}
                          openSlide={this.opSidePage.bind(this)}
                          onClickDelete={this.openDeletePopUp.bind(this)}
                        />
                      </div>
                    </div>

                    <div className="app-open-close margin-top-20px">
                      <input
                        type="checkbox"
                        name="navmenu"
                        className="app-open-close-input"
                        id="navmenu-poh"
                      />
                      <div className="grid grid-2x margin-bottom-10px">
                        <div className="col-1">
                          <div className="display-flex-normal margin-top-10px">
                            <i className="fas fa-landmark margin-right-5px"></i>
                            <span className="txt-site txt-11 txt-main">
                              Government Policy Template
                            </span>
                          </div>
                        </div>
                        <div className="col-2 content-right">
                          <label htmlFor="navmenu-poh">
                            <div className="app-open-close-icon"></div>
                          </label>
                          <button
                            onClick={this.opPopupPage("create-gov")}
                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                          >
                            <i className="fa fa-lw fa-plus" />
                          </button>
                        </div>
                      </div>
                      <div className="app-open-close-content">
                        <TableGov
                          dataTableGov={this.state.dataTableGov}
                          rawDataGov={this.state.rawDataGov}
                          openSlide={this.opSidePage.bind(this)}
                          onClickDelete={this.openDeletePopUp.bind(this)}
                        />
                      </div>
                    </div>

                    <div className="app-open-close margin-top-20px">
                      <input
                        type="checkbox"
                        name="navmenu"
                        className="app-open-close-input"
                        id="navmenu-gpl"
                      />
                      <div className="grid grid-2x margin-bottom-10px">
                        <div className="col-1">
                          <div className="display-flex-normal margin-top-10px">
                            <i className="fas fa-globe margin-right-5px"></i>
                            <span className="txt-site txt-11 txt-main">
                              Corporate Global Policy
                            </span>
                          </div>
                        </div>
                        <div className="col-2 content-right">
                          <label htmlFor="navmenu-gpl">
                            <div className="app-open-close-icon"></div>
                          </label>
                          <button
                            onClick={this.opPopupPage("create-glob")}
                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                          >
                            <i className="fa fa-lw fa-plus" />
                          </button>
                        </div>
                      </div>
                      <div className="app-open-close-content">
                        <TableCorGlobal
                          dataTableCorGlobal={this.state.dataTableCorGlobal}
                          rawDataCorGlobal={this.state.rawDataCorGlobal}
                          openSlide={this.opSidePage.bind(this)}
                          onClickDelete={this.openDeletePopUp.bind(this)}
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
              {this.state.editPayroll ? (
                <EditPayroll
                  rawData={this.state.rawData}
                  closeSlide={this.clResizePane}
                  onClickSave={this.handleUpdate.bind(this)}
                />
              ) : null}
              {this.state.editTax ? (
                <FormEditTax
                  bizparTaxType={this.state.bizparTaxType}
                  rawData={this.state.rawData}
                  closeSlide={this.clResizePane}
                  onClickSave={this.handleUpdate.bind(this)}
                />
              ) : null}
              {this.state.editOrg ? (
                <EditOrg
                  rawData={this.state.rawData}
                  rawDataOrg={this.state.rawDataOrg}
                  rawDataTax={this.state.rawDataTax}
                  rawDataPayroll={this.state.rawDataPayroll}
                  rawDataCNB={this.state.rawDataCNB}
                  rawDataFacility={this.state.rawDataFacility}
                  closeSlide={this.clResizePane}
                  onClickSave={this.handleUpdate.bind(this)}
                />
              ) : null}
              {this.state.editGovernment ? (
                <EditGov
                  bizparPTKP={this.state.bizparPTKP}
                  bizparGovPolicyType={this.state.bizparGovPolicyType}
                  bizparInsuranceCat={this.state.bizparInsuranceCat}
                  rawData={this.state.rawData}
                  closeSlide={this.clResizePane}
                  onClickSave={this.handleUpdate.bind(this)}
                />
              ) : null}
              {this.state.editCorGlobal ? (
                <EditGlobal
                  bizparPaymentMethod={this.state.bizparPaymentMethod}
                  bizparPaymentType={this.state.bizparPaymentType}
                  bizparCorPolicyType={this.state.bizparCorPolicyType}
                  bizparTaxCalc={this.state.bizparTaxCalc}
                  bizparSymbol={this.state.bizparSymbol}
                  rawData={this.state.rawData}
                  closeSlide={this.clResizePane}
                  onClickSave={this.handleUpdate.bind(this)}
                />
              ) : null}
            </div>
          }
        ></ResizeSlider>

        {/* create */}
        {/* PAYROLL */}
        {this.state.createOrg ? (
          <CreateOrg
            rawDataOrg={this.state.rawDataOrg}
            onClickClose={this.clPopupPage}
            onClickSave={this.handleSubmit.bind(this)}
          />
        ) : null}

        {this.state.createPayroll1 ? (
          <CreatePayroll
            onClickClose={this.clPopupPage}
            onClickSave={this.handleSubmit.bind(this)}
          />
        ) : null}

        {this.state.createTax ? (
          <CreateTax
            onClickClose={this.clPopupPage}
            onClickSave={this.handleSubmit.bind(this)}
          />
        ) : null}

        {this.state.createGovernment ? (
          <CreateGov
            bizparPTKP={this.state.bizparPTKP}
            bizparGovPolicyType={this.state.bizparGovPolicyType}
            bizparInsuranceCat={this.state.bizparInsuranceCat}
            onClickClose={this.clPopupPage}
            onClickSave={this.handleSubmit.bind(this)}
          />
        ) : null}
        {this.state.createCorGlobal ? (
          <CreateGlobal
            bizparPaymentMethod={this.state.bizparPaymentMethod}
            bizparPaymentType={this.state.bizparPaymentType}
            bizparCorPolicyType={this.state.bizparCorPolicyType}
            bizparTaxCalc={this.state.bizparTaxCalc}
            bizparSymbol={this.state.bizparSymbol}
            onClickClose={this.clPopupPage}
            onClickSave={this.handleSubmit.bind(this)}
          />
        ) : null}

        {/* notification */}
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.closePopUpCreate.bind(this)}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopUp}
            onClickDelete={this.handleDelete.bind(this)}
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

export default connect(mapStateToProps)(ConfCorporateTPL);
