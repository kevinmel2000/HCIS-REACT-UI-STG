import React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarSelectStyles = {
  iconButton: {
    marginRight: "24px",
    top: "50%",
    display: "inline-block",
    position: "relative",
    transform: "translateY(-50%)",
  },
  Button: {
    marginRight: "24px",
    top: "50%",
    display: "inline-block",
    position: "relative",
    transform: "translateY(-50%)",
    borderRadius: "5px",
  },
  icon: {
    color: "#555",
  },
  text: {
    color: "#555",
    fontSize: "11pt",
  }
};

class CustomToolbarSelect extends React.Component {

  handleClick = () => {
    console.log("click!", this.props.selectedRows); // a user can do something with these selectedRow values
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={"custom-toolbar-select"}>
        <Tooltip title={"icon 2"}>
          <IconButton className={classes.Button} onClick={this.handleClick}>
            <SaveIcon className={classes.icon} />
            <span className={classes.text}>PROCESS</span>
          </IconButton>
        </Tooltip>
        <Tooltip title={"icon 1"}>
          <IconButton className={classes.iconButton} onClick={this.handleClick}>
            <DeleteIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      </div>
    );
  }

}

export default withStyles(defaultToolbarSelectStyles, { name: "CustomToolbarSelect" })(CustomToolbarSelect);