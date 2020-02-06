import React, { Component } from 'react'
// import OrgChart from 'react-orgchart'
// import 'react-orgchart/index.css'


class Pages extends Component {

  constructor () {
    super()
    this.state = {}
  }

  handleMove = (event) => {
    console.log(event)
  }

  back = () => {
    window.history.back()
  }

  cardMain = (name, about, job, report) => {
    var bot = ''
    if (report === '') { 
      bot = ''
    } else {
      bot = (
        <div className="co-bot">
          <div className="txt-site txt-9 txt-primary">{report}</div>
        </div>
      )
    }
    return (
      <div className="card-org">
        <div className="co-top co-grid">
          <div className="co-col-1">
            <div className="image image-45px image-center image-circle background-dark-grey"></div>
            <div className="margin-top-5px">
              <div className="txt-site txt-center txt-9 txt-bold color-post">{job}</div>
            </div>
          </div>
          <div className="co-col-2">
            <div className="margin-top-5px">
              <div className="txt-site txt-11 txt-bold txt-main">{name}</div>
            </div>
            <div className="margin-bottom-5px">
              <div className="txt-site txt-10 txt-primary">{about}</div>
            </div>
          </div>
        </div>
        {bot}
      </div>
    )
  }

  cardSpace = (title, report) => {
    var bot = ''
    if (report === '') { 
      bot = ''
    } else {
      bot = (
        <div className="co-bot">
          <div className="txt-site txt-9 txt-primary">{report}</div>
        </div>
      )
    }
    return (
      <div className="card-org">
        <div className="co-top">
          <div className="txt-site txt-11 txt-thin txt-main">{title}</div>
        </div>
        {bot}
      </div>
    )
  }

  render () {

  	return (
			<div className="main-content">

        <div className="padding-15px">

          <div className="place-tree">

            <div className="p-t-top grid grid-2x border-bottom">
              <div className="col-1">
                <div className="txt-site txt-16 txt-bold txt-main txt-top">
                  Organization Chart
                </div>
              </div>
              <div className="col-2 content-right">
                <button 
                  onClick={this.back}
                  className="btn btn-grey btn-radius">
                  <i className="fa fa-lw fa-times" /> CLOSE
                </button>
              </div>
            </div>

            <div className="tree hidden background-dark-grey">
              <ul>
                <li>
                  <label for='parent'>
                    { this.cardMain('Abigail Armstrong', 'Chiep Executive Officer', 'CEO', '4 Reports') }
                  </label>
                  <input 
                    id='parent'
                    className="tree-button"
                    type="checkbox" />

                  <ul>
                    
                    <li>
                      <label for='space-1'>
                        { this.cardSpace('Accounting & Finance', '1 Reports') }
                      </label>
                      <input 
                        id='space-1'
                        className="tree-button"
                        type="checkbox" />

                      <ul>
                        <li>
                          <label for='child-1'>
                            { this.cardMain('Charles Chapman', 'VP Finance', 'VPF', '2 Reports') }
                          </label>
                          <input 
                            id='child-1'
                            className="tree-button"
                            type="checkbox" />

                          <ul>
                            <li>
                              { this.cardMain('Veronica Vector', 'Accountant', '', '') }
                            </li>
                            <li>
                              { this.cardMain('Dustin Darbyshire', 'Accountant', '', '') }
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>

                    <li>
                      <label for='space-2'>
                        { this.cardSpace('Sales', '1 Reports') }
                      </label>
                      <input 
                        id='space-2'
                        className="tree-button"
                        type="checkbox" />

                      <ul>
                        <li>
                          <label for='child-2'>
                            { this.cardMain('Frederick Fergeson', 'VP Sales', 'VPF', '2 Reports') }
                          </label>
                          <input 
                            id='child-2'
                            className="tree-button"
                            type="checkbox" />

                          <ul>
                            <li>
                              { this.cardMain('Isabelle Isom', 'Sales Manager', '', '') }
                            </li>
                            <li>
                              { this.cardMain('Avery Anderson', 'Sales Manager', '', '') }
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>


                    <li>
                      <label for='space-3'>
                        { this.cardSpace('Engineering', '1 Reports') }
                      </label>
                      <input 
                        id='space-3'
                        className="tree-button"
                        type="checkbox" />

                      <ul>
                        <li>
                          <label for='child-3'>
                            { this.cardMain('Wilma West', 'Engineering', 'IT', '2 Reports') }
                          </label>
                          <input 
                            id='child-3'
                            className="tree-button"
                            type="checkbox" />

                          <ul>
                            <li>
                              { this.cardMain('Penelope Parker', 'Engineering', '', '') }
                            </li>
                            <li>
                              <label for='grand-child-5'>
                                { this.cardMain('William Armstrong', 'Engineering', '', '1 Reports') }
                              </label>
                              <input 
                                id='grand-child-5'
                                className="tree-button"
                                type="checkbox" />

                              <ul>
                                <li>
                                  { this.cardMain('Dopalginger', 'Assistant', '', '') }
                                </li>
                              </ul>
                            </li>
                            <li>
                              { this.cardMain('Lucke Luckless', 'Engineering', '', '') }
                            </li>
                          </ul>

                        </li>
                      </ul>
                    </li>

                    <li>
                      <label for='space-4'>
                        { this.cardSpace('Administration', '1 Reports') }
                      </label>
                      <input 
                        id='space-4'
                        className="tree-button"
                        type="checkbox" />

                      <ul>
                        <li>
                          <label for='child-4'>
                            { this.cardMain('Ophelia Oliphant', 'Office Manager', 'OM', '1 Reports') }
                          </label>
                          <input 
                            id='child-4'
                            className="tree-button"
                            type="checkbox" />

                          <ul>
                            <li>
                              { this.cardMain('David Dusseldorf', 'Office Assistant', '', '') }
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>

                  </ul>
                  
                </li>
              </ul>
            </div>

          </div>

	      </div>

	    </div>
	  )
  }

}

export default Pages