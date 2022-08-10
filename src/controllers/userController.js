
import userService from "../services/userService"

// Xl login 
const handleLogin = async (req, res)=> {
    let email = req.body.email
    let password = req.body.password
    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })  
    }
    let userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user : userData.user ? userData.user : {}
    })  
}  


// Xl lấy ra user
const handleGetAllUsers = async (req, res) => {
    let id = req.query.id  // lấy ra .body.id trong dl được gửi từ clien về đây qua /api/get-all-users
    // console.log(id)
    if(!id){
        return res.status(200).json({
            errCode: 1,
            message: 'id not found',
            users: []
        })
    }
    let users = await userService.getAllUser(id)
    return res.status(200).json({
        errCode: 0,
        message: 'Ok',
        users: users
    })
}

// Xl them mới
const handleCreateNewUser = async (req, res) => {
    let data = req.body
    console.log(data)
    let message = await userService.createNewUser(data)
    return res.status(200).json({message})
}

// Xl sửa user
const handleEditUser = async (req, res) => {
    const data = req.body
    console.log('data vao :',data)
    await userService.updataUserData(data)
    .then(message => res.status(200).json(message))
    .catch(message => res.status(200).json(message))
}


// Xl xóa user
const handleDeleteUser = async (req, res) => {
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            message: 'User Không tồn tại !' 
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json({message})
}


// Xl xóa user
const getAllCodes = async (req, res) => {
    try{
        // console.log(req.query.type)
        let data = await userService.getAllCode(req.query.type)
        return res.status(200).json(data)
    }
    catch(err){
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server',
            error: err
        })
    }
}


export default {
    handleLogin, 
    handleGetAllUsers, 
    handleCreateNewUser, 
    handleEditUser, 
    handleDeleteUser,
    getAllCodes
}