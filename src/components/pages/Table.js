import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables"
import InlineEditing from '../../modules/forms/InlineEditing'

var ct = require("../../modules/custom/customTable")

class Pages extends Component {

  constructor () {
    super()
    this.state = {
      clEditAble: '',
      editAble: false,
    }
  }

  opEditAble = () => {
    if (this.state.editAble === false) { 
      this.setState({
        clEditAble: 'edit-able',
        editAble: true, 
      })
    } else {
      this.setState({
        clEditAble: '',
        editAble: false, 
      })
    }
  }

  opDeleteAble = () => {
    alert('delete');
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions()

  columns = [
    "No", 
    "Name", 
    "Company", 
    "City", 
    "State",
    {
      name: "Action",
      options: {
        customBodyRender: () => {
          return (
            <div>
              <button 
                className="btn btn-red btn-small-circle"
                onClick={ this.opDeleteAble }>
                <i className="fa fa-lw fa-trash-alt" />
              </button>
            </div>
          )
        }
      }
    }
  ]

  render () {

    const data = [
      [
        "1", 
        <InlineEditing 
          text={'Joe James'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'Test Corp'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'Yonkers'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'NY'} 
          api={'https://example.com/api'} />,
      ],
      [
        "2", 
        <InlineEditing 
          text={'John Walsh'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'Test Corp'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'Hartford'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'CT'} 
          api={'https://example.com/api'} />,
      ],
      [
        "3", 
        <InlineEditing 
          text={'Bob Herm'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'Test Corp'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'Tampa'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'FL'} 
          api={'https://example.com/api'} />,
      ],
      [
        "4", 
        <InlineEditing 
          text={'James Houston'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'Test Corp'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'Dallas'} 
          api={'https://example.com/api'} />,
        <InlineEditing 
          text={'TX'} 
          api={'https://example.com/api'} />,
      ],
    ]

    return (
      <div className="main-content">

        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px margin-left-5px margin-bottom-5px">
          Smart Tables
        </div>

        <div className="padding-5px">

          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={"Table"}
              data={data}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>

        </div>

      </div>
    )
  }

}

export default Pages