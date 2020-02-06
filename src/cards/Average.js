import React, { Component } from 'react'

class Aberage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: this.props.title,
            icon: this.props.icon,
            color: this.props.color,
            value: this.props.value
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) this.setState({ value: this.props.value })
    }

    render() {
        return (
            <div className="card df-card">
                <div className="padding-10px background-white border-bottom">
                    <div className="txt-site txt-bold text-main txt-12">
                        { this.state.title }
                    </div>
                </div>

                <div className="card-mid">
                    <div 
                        style={{
                            width: '100%',
                            height: '100px',
                            lineHeight: '100px',
                            color: this.state.color
                        }}
                        className="txt-site txt-small txt-center" >
                        <i className={ this.state.icon } />
                    </div>
                    <div className="txt-site txt-center txt-bold txt-small txt-primary">
                        { this.state.value }
                    </div>
                </div>
            </div>
        )
    }
}

export default Aberage