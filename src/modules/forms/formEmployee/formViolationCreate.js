import React, { Component } from "react"

class FormViolationCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render(){
    return(
        <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                {this.props.type === "create"
                                ? "Employee Detail - Violation - Create Form"
                                : this.props.type === "edit"
                                ? "Employee Detail - Violation - Edit Form"
                                : "Employee Detail - Violation - View Form"}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle background-blue"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <form action="#">
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="coloumn-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>SPK Number (*)</h4>
                                        </div>
                                    </div>

                                        <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" }: null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={null}
                                        onChange={null}
                                        /> 
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                     <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Violation Type (*)</h4>
                                    </div>
                                    </div>    
                                        <select
                                        className="cf-select slc slc-sekunder" 
                                        value={["LIBUR"]} 
                                        disabled={this.props.type === 'edit' ? true : 
                                        this.props.type === 'view' ? true : false}
                                        style={ this.props.type === 'view' ? 
                                        {backgroundColor: '#E6E6E6'} : this.props.type === 'edit' ? 
                                        {backgroundColor: '#E6E6E6'} : null}
                                        onChange={null}
                                         >
                                            <option value="">-- please select Violation Type --</option>
                                                {null}
                                        </select> 
                                </div>
                                <div className="margin-bottom-20px">
                                     <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Violation Category (*)</h4>
                                        </div>
                                     </div>
                                        <select
                                            className="cf-select slc slc-sekunder" 
                                            value={["LIBUR"]} 
                                            required
                                            disabled={this.props.type === 'view'} 
                                            style={ this.props.type === 'view' ? 
                                            {backgroundColor: '#E6E6E6'} : null}
                                            onChange={null}
                                        >
                                             <option value="">-- please select Violation Category --</option>
                                                {null}
                                        </select>                                    
                                </div>
                            </div>
                            <div className="coloumn-2">
                                <div className="margin-bottom-20px">
                                     <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Violation Name</h4>
                                        </div>
                                    </div>
                                        <input
                                            readOnly={this.props.type === "view" ? true : false}
                                            style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" }: null}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                            value={null}
                                            onChange={null}
                                        />                                                                        

                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Period Date (*)</h4>
                                            </div>
                                        </div>                                   
                                    </div>
                                </div>
                                <div className="grid grid-3x grid-mobile-none gap-10px">
                                    <div className="column-1">
                                        <input
                                            readOnly={this.props.type !== "create" ? true : false}
                                            style={this.props.type !== "create" ? { backgroundColor: "#E6E6E6" }: null}
                                            type="date"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                            value={["A0011"]}
                                            onChange={null}
                                        />
                                    </div>
                                    <div className="column-2">
                                        <p align="center" className="padding-15px">To</p>
                                    </div>
                                    <div className="column-3">
                                        <input
                                            readOnly={this.props.type !== "create" ? true : false}
                                            style={this.props.type !== "create" ? { backgroundColor: "#E6E6E6" }: null}
                                            type="date"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                            value={["A0011"]}
                                            onChange={null}
                                        />
                                    </div>
                                 </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                             <h4>Information</h4>
                                        </div>
                                    </div>
                                        <input
                                            readOnly={this.props.type === "view" ? true : false}
                                            style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" }: null}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                            value={null}
                                            onChange={null}
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
                                        onClick={this.props.onClickSave}
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
                 <div className="padding-bottom-20px" />
            </div>
        );
    }
}

export default FormViolationCreate;