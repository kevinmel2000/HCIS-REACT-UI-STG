import React, { Component } from 'react'

const opAlert = 'app-popup app-popup-show background-transaparant-14'
const clAlert = 'app-popup background-transaparant-14'

class Pages extends Component {

  constructor () {
    super()
    this.state = {
      classDangerAlert: clAlert,
      classSuccessAlert: clAlert,
      classMessageAlert: clAlert
    }
  }

  opDangerAlert = () => {
    if (this.state.classDangerAlert === opAlert) {
      this.setState({classDangerAlert: clAlert})
    } else {
      this.setState({classDangerAlert: opAlert})
    }
  }

  opSuccessAlert = () => {
    if (this.state.classSuccessAlert === opAlert) {
      this.setState({classSuccessAlert: clAlert})
    } else {
      this.setState({classSuccessAlert: opAlert})
    }
  }

  opMessageAlert = () => {
    if (this.state.classMessageAlert === opAlert) {
      this.setState({classMessageAlert: clAlert})
    } else {
      this.setState({classMessageAlert: opAlert})
    }
  }

  render () {
    return (
      <div className="main-content">

        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px margin-left-5px margin-bottom-5px">
          Sweet Alert
        </div>

        <div>

          <button className="btn btn-red" onClick={this.opDangerAlert} style={{margin: "10px"}}>
            Danger Alert
          </button>
          <button className="btn btn-green" onClick={this.opSuccessAlert} style={{margin: "10px"}}>
            Sucess Alert
          </button>
          <button className="btn btn-sekunder" onClick={this.opMessageAlert} style={{margin: "10px"}}>
            Message Alert
          </button>
        </div>




        <div className={this.state.classDangerAlert}>

          <div className="popup-content-mikro background-red border-radius post-top shadow padding-10px">

            <div className="padding-15px background-transaparant grid grid-2x">
              <div className="col-1">
                  <div className="txt-site txt-12 txt-bold post-center">
                    Your Attention Is Required
                  </div>
              </div>
              <div className="col-2 content-right">
                  <button 
                    className="btn btn-circle background-transaparant color-white" 
                    onClick={this.opDangerAlert}>
                      <i className="fa fa-lg fa-times"></i>
                  </button>
              </div>
            </div>

            <div className="padding-15px">
              <div className="txt-site txt-small txt-white txt-center padding-top-15px padding-bottom-15px">
                <i className="fa fa-lg fa-bell" />
              </div>
            </div>

            <div className="padding-15px">
              <div className="txt-site txt-14 txt-line txt-bold txt-upp txt-white txt-center margin-bottom-5px">
                You Should Read This!
              </div>
              <div className="txt-site txt-12 txt-line txt-thin txt-white txt-center">
                A small river named Duden flows by their place and supplies it with the necessary regelialia.
              </div>
            </div>

            <div className="padding-15px"></div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1">
                  <button 
                    onClick={this.opDangerAlert}
                    className="btn background-white color-black">
                    OK, GOT IT!
                  </button>
                </div>
                <div className="col-2 content-right">
                  <button 
                    onClick={this.opDangerAlert}
                    className="btn background-transaparant color-white">
                    CLOSE
                  </button>
                </div>
              </div>
            </div>

          </div>
          
        </div>




        <div className={this.state.classSuccessAlert}>

          <div className="popup-content-mikro background-white border-radius post-top shadow padding-10px">

            <div className="padding-15px grid grid-2x">
              <div className="col-1">
                <div className="txt-site txt-12 txt-bold txt-main post-center">
                  Conratulations
                </div>
              </div>
              <div className="col-2 content-right">
                  <button 
                    className="btn btn-circle btn-grey" 
                    onClick={this.opSuccessAlert}>
                      <i className="fa fa-lg fa-times"></i>
                  </button>
              </div>
            </div>

            <div className="padding-15px">
              <div className="txt-site txt-big txt-green txt-center padding-top-15px padding-bottom-15px">
                <i className="far fa-lg fa-check-circle" />
              </div>
            </div>

            <div className="padding-15px">
              <div className="txt-site txt-14 txt-line txt-bold txt-upp txt-main txt-center margin-bottom-5px">
                GOOD JOB!
              </div>
              <div className="txt-site txt-12 txt-line txt-thin txt-primary txt-center">
                A small river named Duden flows by their place and supplies it with the necessary regelialia.
              </div>
            </div>

            <div className="padding-15px txt-site txt-center">
              <button onClick={this.opSuccessAlert} className="btn btn-pos">
                OK, GOT IT!
              </button>
            </div>

            <div className="padding-15px"></div>

          </div>
          
        </div>



        <div className={this.state.classMessageAlert}>

          <div className="popup-content-mikro background-white border-radius post-top shadow padding-10px">

            <div className="padding-15px grid grid-2x">
              <div className="col-1">
                <div className="txt-site txt-12 txt-bold txt-main post-center">
                  Message
                </div>
              </div>
              <div className="col-2 content-right">
                  <button 
                    className="btn btn-circle btn-grey" 
                    onClick={this.opMessageAlert}>
                      <i className="fa fa-lg fa-times"></i>
                  </button>
              </div>
            </div>


            <div className="padding-15px">
              <div className="txt-site txt-14 txt-line txt-bold txt-upp txt-main txt-left margin-bottom-15px">
                Title Must Be In Here
              </div>
              <div className="txt-site txt-12 txt-line txt-thin txt-primary txt-left">
                Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
              </div>
              <br />
              <div className="txt-site txt-12 txt-line txt-thin txt-primary txt-left">
                A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1">
                  <button 
                    onClick={this.opMessageAlert}
                    className="btn btn-pos">
                    SAVE
                  </button>
                </div>
                <div className="col-2 content-right">
                  <button 
                    onClick={this.opMessageAlert}
                    className="btn btn-grey">
                    CLOSE
                  </button>
                </div>
              </div>
            </div>

          </div>
          
        </div>



      </div>
    )
  }

}

export default Pages