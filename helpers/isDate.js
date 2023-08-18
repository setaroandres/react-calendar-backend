const moment = require("moment/moment")

//Custom Validator para fecha
const isDate = (value) => {
  if (!value) {
    return false;
  }

  const fecha = moment(value);
  if (fecha.isValid()) {//isValid en moment
    return true;
  } else {
    return false;
  }
}

module.exports = {
  isDate
}