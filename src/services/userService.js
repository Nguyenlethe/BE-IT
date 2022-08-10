
import {default as validate } from './vilidateCreateUser'
import bcrypt from 'bcryptjs'
import db from '../models/index'
const salt = bcrypt.genSaltSync(10) 

// API LOGIN
function handleUserLogin(email, password){
    return new Promise( async(resolve, reject) => {
        try{
            let userData = {}
            const isExist = await validate.checkUserEmail(email)
            if(isExist){
                const user = await db.User.findOne({
                    where :{ email: email}
                })
                if(user){
                    let checkPassword = bcrypt.compareSync(password,user.password)
                    if(checkPassword){
                        userData.errCode = 0,
                        userData.message = 'OK' 
                        userData.user = {
                            id: user.id,
                            email: user.email,
                            roleId:  user.roleId,    
                            fullName: `${user.firstName} ${user.lastName}`
                        }
                        resolve(userData)
                    }else{
                        userData.errCode = 3,
                        userData.message = 'wrong password!' 
                        resolve(userData)
                    }
                }else{
                    userData.errCode = 2,
                    userData.message = 'User Not Found !' 
                    resolve(userData)
                }
            }else{
                userData.errCode = 1,
                userData.message = 'Not found Email !'
                resolve(userData)
            }
        }
        catch(err){
            reject(err)
        }
    })
}

// API lấy ra All or One usser
function getAllUser(userId) {
    return new Promise( async(resolve, reject) => {
        try{
            let user = ''; 
            if(userId == 'all'){
                user = await db.User.findAll({
                    attributes : {  // không trả ra password ng dùng
                        exclude :['password']
                    },
                    raw : true
                })
            }
            if(userId && userId != 'all'){
                user = await db.User.findOne({
                    where: {id: userId}, 
                    attributes : {  
                        exclude :['password']
                    }
                })
            }
            resolve(user)
        }
        catch(err){
            reject(err)
        }
    })
}

// API tạo user
function createNewUser(data){
    return new Promise(async(resolve, reject) =>{

        try{
            // Kiểm tra định dạng email or password
            let newData = await validate.validateCreateUser(data)

            // Nếu không có nỗi
            if(!newData.check){
                // Kiểm tra Db đã tồn tại email chưa (bool)
                let checkEmail = await validate.checkUserEmail(newData.email)

                if(checkEmail){
                    resolve({
                        errCode: 1,
                        message:'Email already in use !'
                    })
                }
                
                if(checkEmail === false){
                    // format password 
                    let hashPasswordFromBcrypt = validate.hashUserPassword(newData.password)
                    
                    console.log("Check db",newData)

                    await db.User.create({ 
                        email: newData.email,
                        password: hashPasswordFromBcrypt,
                        firstName: newData.firstName,
                        lastName:  newData.lastName,
                        address: newData.address,
                        gender: newData.gender,
                        phoneNumber: newData.phoneNumber,
                        roleId: newData.roleId,
                        positionId:newData.positionId,
                        image: newData.image
                    })
                    resolve({
                        errCode: 0,
                        message:'Okkkkkk'
                    })
                }
            }else{
                resolve(newData)
            }
        }
        catch(error){
            reject("Tải user lên thất bại => " + error.message)
        }
    })
}

// API xóa user
function deleteUser(userId){
    return new Promise(async(resolve, reject) =>{
        try{
            const user = await db.User.findOne({  // Tìm kiếm 1 user
                where: {id: userId }       
            })  
            if(user){
                await db.User.destroy({  // Xóa user
                    where: {id: userId }       
                })  
                
                resolve({
                    errCode: 0,
                    message: 'Delete successful'
                })
            }else{     
                resolve({
                    errCode: 2,
                    errMessage: 'The user not found'
                })
            }
        }
        catch(error){
            reject("Xóa Lỗi : " + error.message)
        }
    })
}

// API edit
function updataUserData(data){
    return new Promise(async(resolve, reject) =>{
        console.log("Check data nhan ",data)
        try{
            if(data.id){

                const user = await db.User.findOne({  
                    where: {id: data.id }       
                })  

                if(!data.firstName|| !data.lastName|| !data.address || !data.phoneNumber || !data.gender || !data.roleId || !data.positionId){
                    resolve({
                        errCode: 1,
                        message: 'Not Found Empty  !'
                    })
                }


                console.log(data.image.type)  // Nếu gi
                console.log(user.image)  // udf


                if(user){
                    await db.User.update(
                        {       
                            firstName   :  data.firstName,
                            lastName    :  data.lastName,
                            address     :  data.address,
                            phoneNumber :  data.phoneNumber,
                            gender      :  data.gender,
                            roleId      :  data.roleId,
                            positionId  :  data.positionId,
                            image       :  data.image.type === undefined || user.image === null ? data.image : user.image
                        },
                        {where: {id: data.id }}
                    )  
                    resolve({
                        errCode: 0,
                        message: 'Update user successful !'
                    })
                }else{
                    resolve({
                        errCode: 3,
                        errMessage: 'User not found !'
                    })
                }
            }else{
                resolve({
                    errCode: 2,
                    errMessage: 'ID not found !'
                })
            }
        }
        catch(error){
            reject({
                errCode: 1,
                errMessage: 'Not found data !'
            })
        }
    })
}


// API lấy ra All or One usser
function getAllCode(typeInput) {
    console.log(typeInput)
    return new Promise( async(resolve, reject) => {
        try{
            if(!typeInput){
                resolve({
                    errCode: 1,
                    errMessage: 'Vui lòng truyền type để lấy DL'
                })
            }else{
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput}
                })
                console.log(allcode)
                res.errCode = 0,
                res.data = allcode
                resolve(res)
            }
        }
        catch(err){
            reject(err)
        }
    })
}

export default {
    handleUserLogin, 
    getAllUser, 
    createNewUser,
    deleteUser, 
    updataUserData,
    getAllCode
}