import React, { Component } from 'react'

class FormBuilders extends Component {

  constructor (props) {
    super(props)
    this.state = {
      prop: this.props,
      data: this.props.data,
      receive: JSON.stringify(this.props.data, null, 2)
    }
  }

  componentDidMount () {
  	console.log(this.props.data)
  }

  IsJsonString (str) {
    try {
      JSON.parse(str);
    } catch (e) {
      // console.log(e)
      return false;
    }
    return true;
  }

  createContent = () => {

    if (this.IsJsonString(this.state.data) === false) { 

      if (this.state.data.length !== 0) { 

        var dt = []

        var data = this.state.data
        var length = data.length

        for (var i = 0; i < length; ++i) {

          if (data[i].validationRules.length > 0) {

            if (data[i].required === 'required') { 
              var required = false
            } else {
              var required = true
            }

            var message = data[i].validationRules[0].message

          } else {
            var required = false
            var message = ''
          }

          if (data[i].type === 'text' || data[i].type === 'email') {
            if (data[i].style === '1') { 
              var style = 'txt txt-sekunder'
            } else {
              var style = 'txt txt-primary'
            }
            var field = <input 
                  key={ i }
                  type={ data[i].type }
                  name={ data[i].name }
                  className={ style }
                  placeholder={ data[i].placeholder }
                  value={ data[i].value }
                  required={ required }
                  autoFocus={ data[i].autofocus }
                  onChange={ this.handleField(i) } />
          } 

          if (data[i].type === 'textarea') {
            if (data[i].style === '1') { 
              var style = 'txt txt-sekunder'
            } else {
              var style = 'txt txt-primary'  
            }
            var field = <textarea 
                  key={ i }
                  className={ style } 
                  name={ data[i].name }
                  placeholder={ data[i].placeholder }
                  required={ required }
                  autoFocus={ data[i].autofocus }
                  onChange={ this.handleField(i) }></textarea>

          } 

          if (data[i].type === 'toggle') {
            
            if (data[i].style === '1') { 
              var style = 'switch blue'
            } else if (data[i].style === '2') { 
              var style = 'switch green'
            } else {
              var style = 'switch red'
            }

            var field = <label className={ style }>
                  <input 
                    key={ i }
                    type="checkbox" 
                    name={ data[i].name }
                    required={ required } />
                  <span className="slider round" />
                </label>
          }

          dt.push(
            <div className="margin-15px" key={i}>
              <div className="txt-site txt-11 txt-bold txt-pimary margin-bottom-5px">
                { data[i].label }
              </div>
              <div>
                { field }
              </div>
              <div className="txt-site txt-10 txt-thin color-red margin-top-5px">
                { message }
              </div>
            </div>
          )
        }

        return dt

      } else {
        return (
          <div>
            please write the right json syntacs
          </div>
        )
      }

    } else {
      return (
        <div>
          please write the right json syntacs
        </div>
      )
    }

  }

  handleField = (id) => (event) => {
    event.preventDefault()

    let newState = Object.assign({}, this.state)

    let receiveJson = JSON.parse(newState.receive)
    
    receiveJson[id].value = event.target.value

    newState.receive = JSON.stringify(receiveJson, null, 2)
    newState.data[id].value = event.target.value
    this.setState(newState)
  }

  handleCode = (event) => {
    if (this.IsJsonString(event.target.value)) { 
      this.setState({
        data: JSON.parse(event.target.value)
      })
    } else {
      this.setState({
        data: []
      })
    }
    this.setState({receive: event.target.value})
  }

  handleAdd = (event) => {

    if (event.keyCode === 9) {
      event.preventDefault()

      var val = event.target.value
      var start = event.target.selectionStart
      var end = event.target.selectionEnd

      event.target.value = val.substring(0, start) + '\t' + val.substring(end)

      event.target.selectionStart = event.target.selectionEnd = start + 1

      return false
    }
  }

  render() {
    const form = <div>
        <form>

          <div className="margin-15px">
            <div className="txt-site txt-20 txt-bold txt-main">
              { this.props.title }
            </div>
          </div>

          <div className="margin-15px padding-top-5px">
            { this.createContent() }
          </div>

          <div className="margin-15px padding-top-15px">
            <div className="grid grid-2x">
                <div className="col-1"></div>
                <div className="col-2 content-right">
                  <input 
                    style={{marginRight: '10px'}}
                    type="button" 
                    value="Cancel"
                    className="btn btn-primary" />
                  <input 
                    type="submit" 
                    value="Submit"
                    className="btn btn-main-color" />
                </div>
            </div>
          </div>

      </form>
    </div>

    return (
    	<div className="padding-15px">

        { (this.props.editor === true) ? (
            <div className="grid grid-2x">
              <div className="col-1 padding-top-15px">
                <div className="padding-15px">
                  <textarea
                    className="txt txt-sekunder" 
                    value={ this.state.receive }
                    onChange={ this.handleCode }
                    onKeyDown={ this.handleAdd }
                    placeholder="Write Json Code"
                    style={{height: 'calc(100vh - 200px)', resize: "none"}} />
                </div>
              </div>
              <div className="col-2">
                <div className="padding-15px margin-15px">
                  { form }
                </div>
              </div>
            </div>
          ) : (
            <div>
              { form }
            </div>
          ) 
        }


      </div>
    )
  }

}

export default FormBuilders