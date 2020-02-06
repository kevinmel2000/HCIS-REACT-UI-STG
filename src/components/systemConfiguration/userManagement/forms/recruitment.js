import React, { Component } from 'react'

const clSlidePage = 'a-s-p-main'

class Recruitment extends Component {
	constructor(props) {
        super(props)
        this.state = {
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
        }
    }

    render() {
    	return(
            <div className={this.state.classAppSlidePage}>
                <div className={this.state.classAppSlidePageMain}>
                    <div className="a-s-p-place a-s-p-content active" id="tabcontent-2">
                        <h1 className="padding-15px">Recruitment</h1>
                    </div>
                </div>
                <div className="a-s-p-side"></div>
            </div>
    	)
    }
}

export default Recruitment