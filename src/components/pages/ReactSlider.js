import React, { Component } from 'react'
import SplitPaneSecond from 'react-split-pane'

class Pages extends Component {

    constructor () {
      super()
      this.state = {
        tabMenu: [
            'Applicant Data',
            'Formal Education',
            'Informal Education',
            'Work Experience',
            'Language Skill',
            'Organization Experience'
          ]
      }
    }

    opNavigator = (title) => {
        let cl = title === this.state.activeTab ? 'c-n-icon active' : 'c-n-icon'
        return (
            <li key={title} 
                className={cl} 
                onClick={this.opContent(title)}>
                <div className="col-1 color-green">
                    <i className="fa fa-lw fa-hashtag" />
                </div>
                <div className="col-2">
                    {title}
                </div>
            </li>
        );
    };

    opContent = (title) => {
        console.log(title)
    }

    render () {
		return (
            // <div className="main-content">
            //     <h1>Ahuy</h1>
            // </div>
            <SplitPaneSecond 
                split="vertical" 
                defaultSize={40} 
                minSize={40}
                maxSize={400}
                primary="first" 
                className="main-slider"
                style={{height: 'calc(100vh - 50px)'}}>
                <div className="col-1 background-white">
                    <ul className="vertical-tab" style={{width: '400px'}}>
                        {this.state.tabMenu.map((data, index) => { 
                            return this.opNavigator(data) 
                        } )}
                    </ul>
                </div>
                <div className="col-2 padding-15px">
                    <h1>Content</h1>
                </div>
            </SplitPaneSecond>
        )
    }

}

export default Pages