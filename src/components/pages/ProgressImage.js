import React, { Component } from 'react'
import Img from 'react-image'


class Pages extends Component {

  constructor () {
    super()
    this.state = {}
  }

  render () {
		return (
			<div className="main-content">

        <div>
        	
        	<div className="grid grid-2x">
	          <div className="col-1">
	            <div className="txt-site txt-18 txt-bold txt-main margin-left-5px margin-top-5px">
	              Image Loader
	            </div>
	          </div>
	          <div className="col-2 content-right"></div>
	        </div>

	        <div className="display-flex">

	        	<div className="card df-card">
	        		<div className="image image-full background-grey">
		        		<Img 
			        		src="https://pinchofyum.com/wp-content/uploads/Cashew-Coffee-Recipe.jpg"
			        		className="img"
			        		loader={
			        			<div className="icn">
			        				<i className="color-green post-center fa fa-lg fa-circle-notch fa-spin" /> <span className="txt-site txt-main txt-12 txt-thin">Loading Image</span>
			        			</div>
			        		}
			        		unloader={
			        			<div className="icn">
			        				<i className="color-green post-center fa fa-lg fa-circle-notch fa-spin" /> <span className="txt-site txt-main txt-12 txt-thin">Try Again</span>
			        			</div>
			        		} />
			       	</div>
	        	</div>

	        	<div className="card df-card">
	        		<div className="image image-full background-grey">
		        		<Img 
			        		src="https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/cc_iStock-478639870_16x9.jpg"
			        		className="img"
			        		loader={
			        			<div className="icn">
			        				<i className="color-green post-center fa fa-lg fa-circle-notch fa-spin" /> <span className="txt-site txt-main txt-12 txt-thin">Loading Image</span>
			        			</div>
			        		}
			        		unloader={
			        			<div className="icn">
			        				<i className="color-green post-center fa fa-lg fa-circle-notch fa-spin" /> <span className="txt-site txt-main txt-12 txt-thin">Try Again</span>
			        			</div>
			        		} />
			       	</div>
	        	</div>

	        	<div className="card df-card">
	        		<div className="image image-full background-grey">
		        		<Img 
			        		src="https://www.spotangels.com/blog/wp-content/uploads/2019/04/997d-Parking-Residential-On-street.jpg"
			        		className="img"
			        		loader={
			        			<div className="icn">
			        				<i className="color-green post-center fa fa-lg fa-circle-notch fa-spin" /> <span className="txt-site txt-main txt-12 txt-thin">Loading Image</span>
			        			</div>
			        		}
			        		unloader={
			        			<div className="icn">
			        				<i className="color-green post-center fa fa-lg fa-circle-notch fa-spin" /> <span className="txt-site txt-main txt-12 txt-thin">Try Again</span>
			        			</div>
			        		} />
			       	</div>
	        	</div>

	        </div>

        </div>

      </div>

    )
	}

}

export default Pages