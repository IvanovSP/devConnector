const Validator = require('validator');
const isEmpty = require('./is-empty');

const handleEmpty = data => (isEmpty(data) ? '' : data);

module.exports = ({ name, email, password, password2 }) => {
  const errors = {};
  const [
    checkedName, checkedMail, checkedPass, checkedPass2,
  ] = [name, email, password, password2].map(handleEmpty);


  if (!Validator.isLength(checkedName, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(checkedName)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isEmail(checkedMail)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(checkedMail)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isLength(checkedPass, { min: 6, max: 30 })) {
    errors.password = 'Password should be between 6 and 30 chars';
  }

  if (!Validator.equals(checkedPass, checkedPass2)) {
    errors.password = 'Password must match';
  }

  if (Validator.isEmpty(checkedPass) || Validator.isEmpty(checkedPass2)) {
    errors.password = 'Password field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};
