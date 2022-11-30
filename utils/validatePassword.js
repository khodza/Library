const PasswordValidate =require('password-validator');


const schemaValidator = new PasswordValidate().is().min(8,'The password should have a minimum length of 8 characters').is().max(15,'The password should have a maximum length of 15 characters').has().uppercase(1,'Password must have uppercase character').has().lowercase(1,'Password must  have lowercase character').has().digits(1,'Password must contain number').has().not().spaces(1,'Password should have spaces').is().not().oneOf(['Passw0rd', 'Password123'],'This password is too easy');

module.exports=schemaValidator