import React, { Component } from "react";

class Form extends Component {
    render() {
        return(
            <div className="margin-bottom-15px">
                <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>{this.props.label} {this.props.mandatory ? <span style={{ color: "red" }}>*</span> : null}</h4>
                    </div>
                </div>
                {this.props.field === 'input' ?
                <input
                    defaultValue={this.props.value}
                    readOnly={this.props.readOnly}
                    type={this.props.secure ? "password" : "text"} 
                    className="txt txt-sekunder-color"
                    placeholder=""
                    style={ this.props.style }
                    onChange={this.props.onChange}
                    ></input> : this.props.field === 'select' ?
                <select className="cf-select slc slc-sekunder" style={this.props.style} disabled={this.props.disabled} value={this.props.value} onChange={this.props.onChange}>
                    <option value="">{this.props.placeholder}</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                </select> : this.props.field === 'textarea' ?
                <textarea className="txt txt-sekunder-color" rows={5} style={this.props.style} value={this.props.value} readOnly={this.props.readOnly}></textarea> :
                <div className="cf-field">
                    <label className="switch green">
                        <input onChange={this.props.onChange} type="checkbox" checked={this.props.checked} readOnly={this.props.readOnly} />
                        <span className="slider round" />
                    </label>
                </div>}
                {this.props.search === true ?
                <button type="button" className={this.props.type === 'create' ? "btn btn-circle background-blue" : "btn btn-circle background-primary"} onClick={ this.props.type === 'create' ? this.props.onClickSearch : null}>
                    <i className="fa fa-lg fa-search"></i>
                </button> : null}

            </div>
        )
    }
}

export default Form