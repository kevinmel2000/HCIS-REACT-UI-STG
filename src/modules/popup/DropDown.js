import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
// import onClickOutside from "react-onclickoutside"

class Pages extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ddState: 'drop-down',
      ddData: this.props.data,
      ddTitle: (this.props.title) ? this.props.title : 'Select one menu',
      ddSetKey: (this.props.setKey) ? this.props.setKey : null
    }
  }

  componentWillMount() {
    console.log('old data', this.props.data)
    this.opGetData()
  }

  opGetData = () => {
    console.log('data', this.props.data)

    if (this.props.type === 'bizpar') {
      let payload = []
      let val = this.props.value

      // console.log('bizpar', val)

      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.bizparKey) {
          stt = 'active'
          this.setState({ ddTitle: data.bizparValue })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.bizparKey,
            title: data.bizparValue,
            value: data.bizparKey,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })
      // console.log('new data', payload)

    } else if (this.props.type === 'bizparindex') {
      let payload = []
      let val = this.props.value

      // console.log('bizpar', val)

      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === index) {
          stt = 'active'
          this.setState({ ddTitle: data.bizparValue })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.bizparKey,
            title: data.bizparValue,
            value: index,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })
      // console.log('new data', payload)

    } else if (this.props.type === 'position') {
      let payload = []
      let val = this.props.value
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.ouid) {
          stt = 'active'
          this.setState({ ddTitle: data.ouposition.bizparValue })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.ouid,
            title: data.ouposition && data.ouposition.bizparValue,
            value: data.ouid,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })

    } else if (this.props.type === 'es') {
      let payload = []
      let val = this.props.value
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.esid) {
          stt = 'active'
          this.setState({ ddTitle: data.esname })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.esid,
            title: data.esname,
            value: data.esid,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })

    } else if (this.props.type === 'country') {
      let payload = []
      let val = this.props.value
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.countryID) {
          stt = 'active'
          this.setState({ ddTitle: data.countryName })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.countryID,
            title: data.countryName,
            value: data.countryID,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })

    } else if (this.props.type === 'province') {
      let payload = []
      let val = this.props.value
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.provinceID) {
          stt = 'active'
          this.setState({ ddTitle: data.provinceName })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.provinceID,
            title: data.provinceName,
            value: data.provinceID,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })

    } else if (this.props.type === 'district') {
      let payload = []
      let val = this.props.value
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.kabkotID) {
          stt = 'active'
          this.setState({ ddTitle: data.kabkotName })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.kabkotID,
            title: data.kabkotName,
            value: data.kabkotID,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })

    } else if (this.props.type === 'subdistrict') {
      let payload = []
      let val = this.props.value
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.kecamatanID) {
          stt = 'active'
          this.setState({ ddTitle: data.kecamatanName })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.kecamatanID,
            title: data.kecamatanName,
            value: data.kecamatanID,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })

    } else if (this.props.type === 'kelurahan') {
      let payload = []
      let val = this.props.value
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.kelurahanID) {
          stt = 'active'
          this.setState({ ddTitle: data.kelurahanName })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.kelurahanID,
            title: data.kelurahanName,
            value: data.kelurahanID,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })


    } else if (this.props.type === 'subzipcode') {
      let payload = []
      let val = this.props.value
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data) {
          stt = 'active'
          this.setState({ ddTitle: data })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data,
            title: data,
            value: data,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })


    } else if (this.props.type === 'institute') {
      let payload = []
      let val = this.props.value
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.instituteID) {
          stt = 'active'
          this.setState({ ddTitle: data.instituteName })
        } else {
          stt = ''
        }
        payload.push(
          {
            id: data.instituteID,
            title: data.instituteName,
            value: data.instituteID,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })

    } else if (this.props.value) {
      let payload = []
      let val = this.props.value
      let ttl = ''
      this.props.data && this.props.data.map((data, index) => {
        let stt
        if (val === data.value) {
          stt = 'active'
          ttl = data.title
        } else {
          stt = ''
          ttl = ''
        }
        payload.push(
          {
            id: data.id,
            title: data.title,
            value: data.value,
            status: stt
          }
        )
      })
      this.setState({ ddData: payload })
      this.setState({ ddTitle: ttl })
    }
  }

  opDropContent = (oldindex) => (e) => {
    e.preventDefault()

    // console.log('old data', this.state.ddData[oldindex])

    let payload = []
    let title = (oldindex === 'null') ? this.props.title : this.state.ddData[oldindex].title
    let value = (oldindex === 'null') ? '' : this.state.ddData[oldindex].value

    this.state.ddData && this.state.ddData.map((data, index) => {
      let stt
      (oldindex === index) ? stt = 'active' : stt = ''
      payload.push({
        id: data.id,
        title: data.title,
        value: data.value,
        status: stt
      })
    })

    let newData = {
      ddData: payload,
      ddTitle: title
    }

    // console.log('new data', newData)

    this.props.onChange(value)
    this.setState(newData)
    this.clDropDown()
  }

  handleClickOutside(element) {
    // console.log(element)
    const outsideclickListener = event => {
      if (!element.contains(event.target)) {
        // element.style.display = 'none'
        this.setState({ ddState: 'drop-down' })
        removeClickListener()
      }
    }

    const removeClickListener = () => {
      // this.setState({smallProfileClass: clActivePopup})
      document.removeEventListener('click', outsideclickListener)
    }

    document.addEventListener('click', outsideclickListener)
  }

  clDropDown = () => {
    this.setState({ ddState: 'drop-down' })
  }

  opDropDown = () => {
    var element = document.getElementById('app-drop-down')
    this.setState({ ddState: 'drop-down active' })
    this.handleClickOutside(element)
    this.opGetData()

    // if (this.state.ddState === 'drop-down') {
    //   this.setState({ddState: 'drop-down active'})
    // } else {
    //   this.setState({ddState: 'drop-down'})
    // }
  }

  componentDidUpdate(prevProps) {
    if (this.props.eduType !== prevProps.eduType) {
      this.setState({
        ddTitle: this.props.title
      })
    }

    if (this.props.eduLevel !== prevProps.eduLevel) {
      this.setState({
        ddTitle: this.props.title
      })
    }

    if (this.props.subZipCode !== prevProps.subZipCode) {
      let payload = []
      this.props.subZipCode && this.props.subZipCode.map((data) => {
        payload.push(
          {
            id: data,
            title: data,
            value: data,
            status: ''
          }
        )
      })
      this.setState({
        ddTitle: this.props.subZipCode === '' ? '-- please select zipcode --' : this.props.subZipCode,
        ddData: payload
      })
      // payload.push(
      //   {
      //     id: this.props.subZipCode,
      //     title: this.props.subZipCode,
      //     value: this.props.subZipCode,
      //     status: ''
      //   }
      // )
      // this.setState({
      //   ddTitle: this.props.subZipCode === '' ? '-- please select kelurahan --' : this.props.subZipCode,
      //   ddData: payload
      // })
    }

    if (this.props.address !== prevProps.address) {
      let payload = []
      this.props.address && this.props.address.map((data) => {
        payload.push(
          {
            id: data.provinceID,
            title: data.provinceName,
            value: data.provinceID,
            status: ''
          }
        )
      })
      this.setState({
        ddTitle: '-- please select ' + this.props.dropDownType + '--',
        ddData: payload
      })

    }

    if (this.props.position !== prevProps.position) {
      let payload = []
      this.props.position && this.props.position.map((data) => {
        payload.push(
          {
            id: data.bizparKey,
            title: data.bizparValue,
            value: data.bizparKey,
            status: ''
          }
        )
      })
      this.setState({
        ddTitle: this.props.position[0].bizparValue,
        // ddData: payload
      })

    }

    if (this.props.taxComponentItem !== prevProps.taxComponentItem) {
      let payload = []
      this.props.taxComponentItem && this.props.taxComponentItem.map((data) => {
        payload.push(
          {
            id: data.bizparKey,
            title: data.bizparValue,
            value: data.bizparKey,
            status: ''
          }
        )
      })
      this.setState({ ddTitle: "-- please select tax template component detail --", ddData: payload })
    }

    if (this.props.bizValue !== prevProps.bizValue) {
      this.setState({
        ddTitle: this.props.bizValue
      })
    }

    if (this.props.taxType !== prevProps.taxType) {
      this.setState({
        ddTitle: this.props.taxType ? this.props.taxType : this.props.title
      })
    }

    if (this.props.insCat !== prevProps.insCat) {
      this.setState({
        ddTitle: this.props.insCat ? this.props.insCat : this.props.title
      })
    }

    if (this.props.ptkpType !== prevProps.ptkpType) {
      this.setState({
        ddTitle: this.props.ptkpType ? this.props.ptkpType : this.props.title
      })
    }

    if (this.props.govType !== prevProps.govType) {
      this.setState({
        ddTitle: this.props.govType ? this.props.govType : this.props.title
      })
    }

    if (this.props.bizValueHolidayType !== prevProps.bizValueHolidayType) {
      this.setState({
        ddTitle: this.props.bizValueHolidayType
      })
    }

    if (this.props.travelExp !== prevProps.travelExp) {
      this.setState({
        ddTitle: this.props.travelExp
      })
    }

    if (this.props.travelExpPosition !== prevProps.travelExpPosition) {
      let payload = []
      this.props.travelExpPosition && this.props.travelExpPosition.map((data, index) => {
        payload.push(
          {
            id: data.ouid,
            title: data.ouposition && data.ouposition.bizparValue,
            value: data.ouid,
            status: ''
          }
        )
      })
      this.setState({
        ddTitle: '-- please select position --',
        ddData: payload
      })
    }

    if (this.props.travelExpPositionEdit !== prevProps.travelExpPositionEdit) {
      this.setState({
        ddTitle: this.props.travelExpPositionEdit
      })
    }

    if (this.props.leaveType !== prevProps.leaveType) {
      this.setState({
        ddTitle: this.props.leaveType
      })
    }
  }

  render() {
    return (
      <div
        className={this.state.ddState}
        id="app-drop-down"
        key={this.props.key}>
        <div className="dd-border">
          <div className="dd-selected" style={{ backgroundColor: this.props.disabled ? "#E6E6E6" : null }} onClick={this.props.disabled ? null : this.opDropDown}>
            <div className="dd-title">
              <span className="title">{this.state.ddTitle}</span>
            </div>
            <div className="dd-icon">
              <span className="icon"></span>
            </div>
          </div>
          {(this.state.ddData)
            ? <div className="dd-place">
              <ul>
                {(this.props.title)
                  ? <li
                    key={'drop-down-key'}
                    onClick={this.opDropContent('null')}>
                    {(this.props.title) ? this.props.title : 'Select one menu'}
                  </li>
                  : null}
                {/* jika set key di masukan */}
                {this.state.ddData && this.state.ddData.map((data, index) => {
                  return (
                    <li
                      key={data.id}
                      className={(data.status === 'active') ? 'selected' : ''}
                      onClick={this.opDropContent(index)}>
                      {data.title}
                    </li>
                  )
                })}

              </ul>
            </div>
            : null}

        </div>
      </div>
    )
  }

}

export default Pages