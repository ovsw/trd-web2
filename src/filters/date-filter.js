const moment = require('moment');


module.exports = value => {
  moment.locale('ro');
  const dateObject = moment(value);
  return `${dateObject.format('Do')} ${dateObject.format('MMMM')}`; 
};