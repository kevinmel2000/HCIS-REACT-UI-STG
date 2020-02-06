import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import FilledInput from '@material-ui/core/FilledInput';
import Input from '@material-ui/core/Input';

const defaultToolbarStyles = {
  iconButton: {
  },
  iconStyle: {
    color: "#fff"
  },
  whiteInput: {
    backgroundColor: "rgba(0,0,0,0.14)",
    fontSize: "12pt",
    borderBottom: "0px #fff solid !important",
    padding: "3px 10px !important",
    display: "inline-block",
    verticalAlign: "top",
    overflow: "hidden",
    borderRadius: "5px",
    marginLeft: "5px",
  }
};

class CustomToolbar extends React.Component {
  
  handleClick = () => {
    console.log("clicked on icon!");
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Input 
          className={classes.whiteInput} 
          placeholder="Search.."
          disableUnderline={true} />
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);