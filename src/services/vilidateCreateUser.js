
import bcrypt  from 'bcryptjs'; 
import db from '../models/index'
const salt = bcrypt.genSaltSync(10);

// Validate check email ,password or firstName, lastName != ''
function validateCreateUser(data) {
    return new Promise(async(resolve, reject) =>{
        try{     
            let check = {}
            var regexEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var regexPassword = /^([A-Z]){1}([\w_\.!@#$%^&*()]+){5,31}$/;

            if(regexEmail.test(data.email)){
                check.errEmail =  'OK'
            }else{
                check.errEmail =  'Email is wrong format'
            }

            if(regexPassword.test(data.password)){
                check.errPassword =  'OK'
            }else{
                check.errPassword =  'Password is wrong format'
            }

            if(data.firstName.trim() !== ''){
                check.errFirstName =  'OK'
            }else{
                check.errFirstName =  'FirstName cannot be blank'
            }

            if(data.lastName.trim() !== ''){
                check.errLastName =  'OK'
            }else{
                check.errLastName =  'LastName cannot be blank'
            }

            if(check.errEmail === 'OK' && check.errPassword === 'OK' && check.errFirstName === 'OK' && check.errLastName === 'OK'){
                resolve(data)
            }else{
                resolve({
                    check,
                    data: []
                })
            }
        }
        catch(error){
            reject("Lỗi không xác định => " + error.message)
        }
    })
}

// Check email có tồn tại db chưa trả ra bool
function checkUserEmail(email) {
    return new Promise( async(resolve, reject) => {
        try{
            const user = await db.User.findOne({
                where :{ email: email}
            })
            if(user){
                resolve(true)
            }else{
                resolve(false)
            }
        }
        catch(err){
            reject(err)
        }
    })
}


// Conver password
function hashUserPassword(password){
    let hashPassword  = bcrypt.hashSync(password, salt);
    if(hashPassword) {
        return hashPassword
    }else {
        console.log('Lỗi chuyển đổi password !!! src > services > CRUDService ')
    }
}

export default {validateCreateUser,checkUserEmail,hashUserPassword}