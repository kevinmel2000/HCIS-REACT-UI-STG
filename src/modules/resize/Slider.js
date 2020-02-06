import React, { Component } from 'react'
import SplitPane from 'react-split-pane'

class SplitSlider extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	// allowResize: this.props.allowResize,
        	// defaultSize: this.props.defaultSize,
        	// minSize: this.props.minSize,
        	// maxSize: this.props.maxSize
        }
    }

    render() {
    	return (
    		<SplitPane
    			split="vertical"
                defaultSize={this.props.defaultSize}
                minSize={this.props.minSize}
                maxSize={this.props.maxSize}
                allowResize={this.props.allowResize}
                primary="second"
                className="main-slider-form app-resize-page"
                style={{ height: 'calc(100vh - 50px)', backgroundColor: '#fff' }}>
    			<div className="col-1">
    				<div className="m-s-f-place a-s-p-main">
    					{this.props.main}
    				</div>
    			</div>
    			<div className="col-2">
    				<div className="m-s-f-side a-s-p-side">
    					{this.props.side}
    				</div>
    			</div>
    		</SplitPane>
    	)
    }
}

export default SplitSlider