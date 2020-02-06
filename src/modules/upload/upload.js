import React, { Component, createRef } from "react"
import Dropzone from 'react-dropzone'
import LinearProgress from '@material-ui/core/LinearProgress'

const dropzoneRef = createRef()

class Upload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            file: '',
            nameFile: 'File name',
            typeFile: '',
            sizeFile: '0',
            inputVisible: true,
            previewVisible: false,
            labelUploadVisible: false,
            iconButtonUpload: 'fa fa-1x fa-upload',
            uploadProgress: false,
            percentage: '0',
            completed: '0'
        }
    }

    componentDidUpdate(prevs, next) {
        if (prevs.percentage > 0 && prevs.percentage <= 100) {
            console.log('old percentage', prevs.percentage)
            console.log('new percentage', this.state.percentage)
            if (this.state.percentage !== prevs.percentage) {
                this.setState({percentage: prevs.percentage})
            }
        }

        if (prevs.result === 'success' || prevs.result === 'error') {
            // this.updateUploadProgress.bind(this)
            if (this.state.uploadProgress === true) {
                this.setState({uploadProgress: false, percentage: '100', iconButtonUpload: 'fa fa-1x fa-check'})
            }
        }
    }

    updateUploadProgress = (e) => {
        e.preventDefault()

        console.log('success guys')
        this.setState({uploadProgress: false})
    }

    onDrop = (acceptedFiles) => {
        const formData = new FormData()
        let length = acceptedFiles[0].name.split(".").length
        let fileType = acceptedFiles[0].name.split(".")[length - 1]
        formData.append('file', acceptedFiles[0])

        // if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") 
        if (acceptedFiles)
        {
            this.setState({
                file: acceptedFiles[0],
                typeFile: fileType,
                nameFile: acceptedFiles[0].name,
                sizeFile: (acceptedFiles[0].size/1000).toFixed(0),
                previewVisible: true,
                inputVisible: false,
                uploadProgress: false,
                percentage: '0'
            })
            this.props.onHandle(acceptedFiles[0])
        } 
        else 
        {
            this.setState({
                previewVisible: false,
                inputVisible: true,
                uploadProgress: false,
                percentage: '0'
            })
            alert("Unsupported Media Type")
        }
    }

    onRemove = () => {
        this.setState({
            previewVisible: false,
            inputVisible: true,
            uploadProgress: false,
            percentage: '0'
        })
    }

    onUpload = () => {
        var strProps = this.props.acceptedFiles
        var strState = this.state.typeFile
        if (strProps.includes(strState)) { 
            this.setState({uploadProgress: true, percentage: '0'})
            this.props.onUpload()
        } else {
            alert('Unsupported File Type')
        }
    }

    render() {
        return(
            <div>
                <Dropzone ref={dropzoneRef} onDrop={this.onDrop}>
                    {({getRootProps, getInputProps}) => (
                        <div>
                            <div className="upload-file">

                                {/* label */}
                                { this.state.inputVisible 
                                ? <div {...getRootProps()} className="padding-10px" style={{cursor: 'pointer'}}>
                                    <input {...getInputProps()} />
                                    <div className="u-p-title">
                                        Drag 'n' drop some files here, or click to select files
                                    </div>
                                  </div>
                                : null }

                                {/* file */}
                                { this.state.previewVisible 
                                ? 
                                <div className="u-p-file u-p-preview">
                                    <div className="display-flex-normal">
                                        <div className="width width-35px">
                                            <button 
                                                onClick={this.state.uploadProgress === true ? null : this.onRemove}
                                                className="btn btn-small-circle btn-black" 
                                                type="button">
                                                <i className="fa fa-1x fa-times" />
                                            </button>
                                        </div>
                                        <div className="width width-full margin-left-10px">
                                            <div className="txt-site txt-12 txt-white txt-bold">
                                                { this.state.nameFile }
                                            </div>
                                            <div className="txt-site txt-11 txt-white txt-thin">
                                                { this.state.sizeFile } KB
                                            </div>
                                        </div>
                                        {/* this.state.uploadProgress === true
                                        ? (
                                            <div className="width width-100px padding-10px txt-site txt-12 txt-white txt-thin">
                                                ({this.state.percentage})%
                                            </div>
                                        ) : null  */}
                                        {this.props.type === 'upload' ? 
                                            <div className="width width-155px padding-10px txt-site txt-11 txt-white txt-thin">
                                                 Uploading {this.state.percentage}%
                                            </div> : null }

                                        <div className="width width-35px">
                                            <button 
                                                className="btn btn-small-circle btn-black" 
                                                type="button" 
                                                onClick={this.state.uploadProgress === true ? null : this.onUpload}>
                                                {/*<i className={this.state.iconButtonUpload} />*/}
                                                <i className={ this.state.uploadProgress === true
                                                    ? 'fa fa-1x fa-spinner fa-spin'
                                                    : 'fa fa-1x fa-upload' } />
                                            </button>
                                        </div>
                                    </div>
                                    {this.props.type === 'upload' ? 
                                    <div className="margin-top-15px">
                                        <LinearProgress variant="determinate" value={this.state.percentage} />
                                    </div> : null }
                                    {/* this.state.uploadProgress === true
                                    ? (
                                        <div className="margin-15px">
                                            <LinearProgress variant="determinate" value={this.state.percentage} />
                                        </div>
                                    ) : null */}
                                </div>
                                : null }

                                {/* image */}
                                {/* <div className="u-p-image u-p-preview">
                                    <div className="display-flex-normal">
                                        <div className="width width-full display-flex-normal">
                                            <button className="btn btn-small-circle btn-black">
                                                <i className="fa fa-1x fa-times" />
                                            </button>
                                        </div>
                                        <div className="width width-full display-flex-normal content-right">
                                            <button className="btn btn-small-circle btn-black">
                                                <i className="fa fa-1x fa-upload" />
                                            </button>
                                        </div>
                                    </div>
                                </div> */}

                            </div>
                        </div>
                    )}
                </Dropzone>
            </div>
        )
    }
}

export default Upload