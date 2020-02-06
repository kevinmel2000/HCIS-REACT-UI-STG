import React, { Component } from 'react'
import GIF from './../../assets/img/gif/done3.gif'
import GIF2 from './../../assets/img/gif/done4.gif'

class PopUp extends Component {
   render() {
        return (
          this.props.type === 'confirm' ?
          <div className={this.props.class}>
              <div className="padding-top-20px"></div>
              <div className="popup-alert background-white border-radius">
                <div className="padding-15px background-white grid grid-2x">
                  <div className="col-1">
                    <div className="txt-site txt-12 txt-bold post-center">
                      Warning
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <button className="btn btn-circle btn-grey" onClick={ this.props.onClick }>
                      <i className="fa fa-lg fa-times"></i>
                    </button>
                  </div>
                </div>
                          
                <div 
                  className="image image-middle"
                  style={{
                    backgroundImage: 'url("'+GIF2+'")'
                  }}></div>

                <div className="margin-15px txt-site txt-16 txt-main txt-center txt-bold">
                  There is an error..
                </div>
                <div className="margin-15px txt-site txt-12 txt-primary txt-center">
                  It's our faults, please check back your steps..
                </div>

                <div className="padding-15px" style={{textAlign: 'center'}}>
                  <button 
                      className="btn btn-all btn-red btn-width-all" 
                      type="button"
                      onClick={ this.props.onClick }>
                      <span>OK, GOT IT!</span>
                  </button>
                </div>
                <div className="padding-10px"></div>
              </div>
              <div className="padding-bottom-20px"></div>
          </div> :
        this.props.type === 'save' ?
          <div className={this.props.class}>
            <div className="popup-alert background-white border-radius" >
              <div className="padding-15px background-white grid grid-2x">
                <div className="col-1">
                  <div className="txt-site txt-12 txt-bold post-center">
                    Information
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button className="btn btn-circle btn-grey" onClick={ this.props.onClick }>
                    <i className="fa fa-lg fa-times"></i>
                  </button>
                </div>
              </div>
                        
              {/*<div style={{textAlign: 'center', marginTop:10, color:'green', fontSize:44}}>
                <i className="fa fa-lw fa-check-circle"/>
              </div>*/}

              <div 
                className="image image-middle"
                style={{
                  backgroundImage: 'url("'+GIF+'")'
                }}></div>

              <div className="margin-15px txt-site txt-16 txt-main txt-center txt-bold">
                Our Jobs, All Done
              </div>

              <div className="padding-15px" style={{textAlign: 'center'}}>
                <button 
                    className="btn btn-all btn-green btn-width-all" 
                    type="button"
                    onClick={ this.props.onClick }>
                    <span>OK, GOT IT!</span>
                </button>
              </div>
              <div className="padding-bottom-15px"></div>
            </div>
            <div className="padding-bottom-20px"></div>
          </div> :

        this.props.type === 'delete' ?
          <div className={this.props.class}>
              <div className="popup-alert border-radius" style={{backgroundColor:'#FF7F50'}}>
                <div className="grid grid-2x padding-15px">
                    <div className="col-1">
                      <div className="txt-site txt-12 txt-bold txt-white post-top">
                        Danger
                      </div>
                    </div>
                    <div className="col-2 content-right">
                      <button className="btn btn-circle" style={{backgroundColor:'#FF7F50', color:'white'}} onClick={ this.props.onClick }>
                          <i className="fa fa-lg fa-times"></i>
                      </button>
                    </div>
                </div>
                <div className="txt-site txt-big txt-white txt-center margin-30px">
                    <i className="fa fa-2x fa-info-circle"/>
                </div>                        
                <div className="margin-15px txt-site txt-16 txt-white txt-center txt-bold">
                  Are you sure?
                </div>
                <div className="margin-15px txt-site txt-12 txt-white txt-center">
                  This action will change data's in permanently
                </div>
                <div className="padding-15px grid grid-2x" style={{alignContent: 'center'}}>
                  <div className="col-1">
                    <button 
                        className="btn padding-5px"
                        type="button"
                        onClick={ this.props.onClickDelete }>
                        <span>YES</span>
                    </button>
                  </div>
                  <div className="col-2">
                    <button 
                        className="btn padding-5px" 
                        type="button"
                        style={{color:'#eee', backgroundColor:'#FF7F50'}}
                        onClick={ this.props.onClick }>
                        <span>CANCEL</span>
                    </button>
                  </div>
                </div>
                <div className="padding-bottom-15px"></div>
            </div>
            <div className="padding-bottom-20px"></div>
          </div> :

        this.props.type === 'simpan' ?
        <div className={this.props.class}>
            <div className="popup-alert border-radius background-white" >
              <div className="grid grid-2x background-white padding-15px">
                  <div className="col-1">
                    <div className="txt-site txt-12 txt-bold txt-black post-top">
                      Information
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <button className="btn btn-circle btn-grey" onClick={ this.props.onClick }>
                        <i className="fa fa-lg fa-times"></i>
                    </button>
                  </div>
              </div>
              <div className="txt-site txt-big txt-green txt-center margin-30px">
                  <i className="fa fa-2x fa-info-circle"/>
              </div>                        
              <div className="margin-15px txt-site txt-16 txt-black txt-center txt-bold">
                Process this data?
              </div>
              <div className="padding-15px grid grid-2x" style={{alignContent: 'center'}}>
                <div className="col-1">
                  <button 
                      className="btn padding-5px"
                      type="button"
                      onClick={ this.props.onClickSimpan }>
                      <span>YES</span>
                  </button>
                </div>
                <div className="col-2">
                  <button 
                      className="btn btn-all btn-green btn-width-all padding-5px" 
                      type="button"
                      // style={{color:'#eee', backgroundColor:'green'}}
                      onClick={ this.props.onClick }>
                      <span>CANCEL</span>
                  </button>
                </div>
              </div>
              <div className="padding-bottom-15px"></div>
          </div>
          <div className="padding-bottom-20px"></div>
        </div> :

        <div className={this.props.class}>
          <div className="popup-content-mikro background-white border-radius post-center">
            
            <div className="popup-panel grid grid-2x">
              <div className="col-1" style={{ width: "140%" }}>
                  <div className="popup-title">
                    {this.props.title}
                  </div>
              </div>
              <div className="col-2 content-right">
                  <button 
                    className="btn btn-circle btn-grey" 
                    onClick={ this.props.onClick }>
                      <i className="fa fa-lg fa-times"></i>
                  </button>
              </div>
            </div>

            <div className="padding-15px background-grey">

              <input 
                type="file" 
                id="upload-image" 
                style={{'display': 'none'}}
                onChange={this.props.onChange} />

              <input 
                type="file" 
                id="upload-image" 
                style={{'display': 'none'}}
                onChange={this.props.onChange} />

              
                <div className="upload-image">

                  <div className="u-i-info">
                    <div className="u-i-icon">
                      <i className="fa fa-lg fa-images" />
                    </div>
                    <div className="u-i-label">
                      Upload a file
                    </div>
                  </div>
                  
                  <div 
                    className="u-i-image image image-all"
                    style={{'backgroundImage': 'url('+this.props.file+')'}}>

                      <div className="u-i-btn">
                        <label htmlFor="upload-image">
                          <div className="btn btn-circle-div btn-green border-all">
                            <i className="fa fa-lg fa-plus" />
                          </div>
                        </label>
                        <button 
                          onClick={this.props.removeChange}
                          type="button"
                          className="btn btn-circle btn-red border-all">
                          <i className="fa fa-lg fa-trash-alt" />
                        </button>
                      </div>

                  </div>
                </div>
              
              
              <div className="grid margin-top-15px">
                <div className="content-right">
                  <button className="btn btn-primary"
                    onClick={ this.props.onClick }>
                    CLOSE
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
        )
    }
}

export default PopUp


