
import {default as validate } from './vilidateCreateUser'
import db from '../models/index'
import bcrypt  from 'bcryptjs'; 



// Tạo mới user NODE JS
function creacteNewUser(dataRough) {
    return new Promise( async(resolve, reject) =>{
        try{
            let data = await validate.validateCreateUser(dataRough)
            console.log(data);
            // Nếu không có nỗi
            if(!data.check){
                // Kiểm tra Db đã tồn tại email chưa (bool)
                let checkEmail = await validate.checkUserEmail(data.email)

                    if(checkEmail){
                        resolve({
                            errCode: 1,
                            message:'Email already in use !'
                        })
                    }
                let hashPasswordFromBcrypt = validate.hashUserPassword(data.password)

                if(hashPasswordFromBcrypt){
                    await db.User.create({ 
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        firstName: data.firstName,
                        lastName:  data.lastName,
                        address: data.address,
                        gender: data.gender,
                        phoneNumber: data.phoneNumber,
                        roleId: data.roleId
                    })
                    resolve('Tải user lên thành công !!!')
                }
            }else{
                resolve(data)
            }
        }
        catch(error){
            reject("Tải user lên thất bạissss => " + error.message)
        }
    })
}

// Lấy dl user từ db
function getAllUser(){
    return new Promise(async(resolve, reject) => {
        try{
            const listUser = await db.User.findAll({
                raw : true,  // Chỉ lấy ra các {} là dữ liệu của chúng ta 
            })  // Nhận all các bản nghi có trong db.User
            resolve(listUser)
        }
        catch(e){
            reject(e)
        }
    }) 
}

// Lấy ra 1 user
function getUserInfoById(idUser){
    return new Promise(async(resolve, reject) => {
        try{
            const user = await db.User.findOne({  // Tìm kiếm 1 user
               where: {id: idUser },              // Điều kiện tìm kiếm
               raw : true,
            })  
            if(user){
                console.log('Tìm thấy một người dùng !')
                resolve(user)
            }else {
                console.log("ID người dùng không tồn tại !")
                resolve({})
            }
        }
        catch(e){
            reject(e)
        }
    })
}

// Cập nhật user
function updataUserData(data){
    return new Promise(async(resolve, reject) => {
        try{
            const user = await db.User.findOne({  
                where: {id: data.id }       
            })  
            if(user){
                await db.User.update(
                    {       
                        firstName   :  data.firstName,
                        lastName    :  data.lastName,
                        address     :  data.address,
                        phoneNumber :  data.phoneNumber,
                        gender      :  data.gender,
                        roleId      :  data.roleId 
                    },
                    {where: {id: data.id }}
                )  
                const listNewUser = await db.User.findAll({
                    raw : true,  
                }) 
                resolve(listNewUser)
            }else{
                resolve('Không tìm thấy user')
            }
        }
        catch(e){
            reject(e)
        }
    })
}

// Cập nhật mật khẩu or email
function updataAccountUserData(idUser, data){
    return new Promise(async(resolve, reject) => {
        try{
            let userData = {}
            const user = await db.User.findOne({  
               where: {id: idUser },              
               raw : true,
            })  
            if(user){
                var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
                var valid = emailRegex.test(data.email);
                if(!valid){
                    userData.errCode = 1,
                    userData.message = 'wrong email format' 
                    resolve(userData)
                }
                let checkPassword = bcrypt.compareSync(data.password,user.password)
                const newPassword = validate.hashUserPassword(data.newPassword)
                if(checkPassword){ 
                    if(valid){
                        const user = await db.User.findOne({  
                            where: {id: idUser }       
                        })  

                        await db.User.update(
                            {   email: data.email,
                                password: newPassword
                            },
                            {where: {id: idUser }}
                        )  

                        const listUser = await db.User.findAll({
                            raw : true,  
                        })  
                        userData.errCode = 0,
                        userData.message = 'Ok' 
                        userData.newListUser = listUser
                        resolve(userData)
                    }else{
                        userData.errCode = 3,
                        userData.message = 'wrong format email !' 
                        resolve(userData)
                    }
                }else{
                    userData.errCode = 2,
                    userData.message = 'wrong password !' 
                    resolve(userData)
                }
            }else{
                userData.errCode = 1,
                userData.message = 'User not found !' 
                resolve(userData)
            }
        }
        catch(e){
            reject(e)
        }
    })
}


// Lấy xóa user
function deleteUserById(idUser){
    return new Promise(async(resolve, reject) => {
        try{ 
            const user = await db.User.findOne({  // Tìm kiếm 1 user
                where: {id: idUser }       
            })  
            if(user){
                await db.User.destroy({  // Xóa user
                    where: {id: idUser }       
                })  
                const listNewUser = await db.User.findAll({
                    raw : true,  
                }) 
                resolve(listNewUser)
            }else{    
                console.log('User name không tồn tại !')
                resolve(null)
            }
        }
        catch(e){
            reject(e)
        }
    })
}

export { creacteNewUser, getAllUser, getUserInfoById, updataUserData, updataAccountUserData, deleteUserById};