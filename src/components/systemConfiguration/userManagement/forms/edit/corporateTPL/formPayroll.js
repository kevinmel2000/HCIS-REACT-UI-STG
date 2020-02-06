import React, { Component } from 'react'

class FormPayroll extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div>
                <form action="#">
                    <div className="margin-15px">
                        <div>
                            <div className="margin-30px">
                                <div className="image image-100px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                    <i className="icn fa fa-2x fa-user"></i>
                                </div>
                            </div>

                            <div className="txt-site txt-11 txt-bold txt-main content-center">
                                <input
                                    type="file"
                                    id="pick-image"
                                    style={{ display: "none" }}
                                    onChange={this.handleChange} />
                                <label htmlFor="pick-image">
                                    <div className="btn btn-div btn-grey-dark">
                                        <i className="fa fa-1x fa-upload margin-right-10px"></i>
                                        Pick Image
                                            </div>
                                </label>
                            </div>

                            <div className="padding-10px"></div>
                        </div>
                    </div>

                    <div className="margin-15px">
                        <div className="margin-bottom-20px">
                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                <h4>Template ID: {this.props.data.taxTPLID}</h4>
                            </div>
                            <div className="margin-5px">
                                <p className="txt-site txt-11 txt-primary">
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos corrupti rerum at, recusandae consequuntur laborum molestias totam dolorum, dolor, aperiam nisi. Est rem in, omnis quasi perspiciatis labore id soluta.
                                        </p>
                            </div>
                        </div>
                        <div className="margin-bottom-20px">
                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                <h4>Template Name</h4>
                            </div>
                            <div className="margin-5px">
                                <div className="card-date-picker">
                                    <div className="double">
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="margin-bottom-20px">
                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                <h4>Activation</h4>
                            </div>
                            <div className="margin-15px">
                                <label className="radio">
                                    <input type="checkbox" name="all-day"
                                    />
                                    <span className="checkmark" />
                                    <span className="txt-site txt-11 txt-bold txt-main">
                                        Activate Now
                                            </span>
                                </label>
                            </div>
                        </div>
                    </div>

                </form>
            </div >
        )
    }
}

export default FormPayroll