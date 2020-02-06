import React, { Component } from 'react'
import Form from '../../../components/pages/FieldForm'

class FormLeaveAlternate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaveData: props.leaveData
        }
    }

    render() {
        let { leaveData } = this.state
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="padding-15px grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                                ALTERNATE
                            </div>
                        </div>
                    </div>
                    <div className="border-bottom padding-15px grid grid grid-mobile-none gap-20px">
                        <Form label={'Employee'} field={'input'} style={{ backgroundColor: '#E6E6E6', marginRight: 10, width: '85%' }} readOnly={true} search={true} value={leaveData ? leaveData.subtitutePerson.employeeName : ''} />
                        <Form label={'Position'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={leaveData && leaveData.subtitutePerson.position ? leaveData.subtitutePerson.position.ouposition.bizparValue : ''} />
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
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
        )
    }
}

export default FormLeaveAlternate