

import db from '../models/index'
import {
    creacteNewUser, 
    getAllUser,  
    getUserInfoById, 
    updataUserData, 
    updataAccountUserData,
    deleteUserById
} from '../services/CRUDService'


// Chuyển trang home , gửi ALL data user cho home
const getHomePage = async(req, res) =>  {
    try{
        let data = await db.User.findAll()
        return res.render('homepage.ejs', { 
            data : JSON.stringify(data),
        })
    }catch(e){
        console.log(e)
    } 
}


// Chuyển trang about
const getAboutPage = (req, res) =>  {
    return res.render('aboutpage.ejs')
}


// Chuyển trang tạo user
const getCRUD = (req, res) =>  {
    return res.render('crud.ejs')
}

// Tạo user và gửi dl đi trả về trang tạo user
const postCRUD = async (req, res) =>  {
    const data = await req.body
    const message = await creacteNewUser(data)
    console.log(message)
    return res.render('crud.ejs')
}


// Chuyển trang hiển thị user
const displayGetCRUD = async (req, res) =>  {
    let data = await getAllUser()
    return res.render('displayCRUD.ejs',{
        dataUser : data
    })
}


// Chuyển trang edit user
const getEditCRUD = async (req, res) =>  {
    const userId = req.query.id
    const user = await getUserInfoById(userId)

    return res.render('editCRUD.ejs', {
        userData: user
    })
}


// Sau khi update user chuyển về trang xem user
const putCRUD = async (req, res) =>  {
    const data = req.body
    const listNewUser = await updataUserData(data)
    if(listNewUser){
        return res.render('displayCRUD.ejs',{
            dataUser : listNewUser
        })
    }
}

// Xóa User
const deleteCRUD = async (req, res) =>  {
    const id = req.query.id
    const data = await deleteUserById(id)
    console.log(data)
    if(data){
        return res.render('displayCRUD.ejs',{
            dataUser : data
        })
    }else{
        return res.send('Không tìm thấy user cần xóa !')
    }
}
 

// Sửa email or password 1
const changeAccountCRUD = async (req, res) =>  {
    const userId = req.query.id
    const user = await getUserInfoById(userId)
    if(user){
        return res.render('getChangeAccountCRUD.ejs', {
            userData: user
        })
    }
}


// Sửa email or password 2
const postNewAccountCRUD = async (req, res) =>  {
    const data = req.body
    const userId = req.query.id
    const userData = await updataAccountUserData(userId,data)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user : userData.newListUser ? userData.newListUser : {}
    })
}
  



export default { 
    getHomePage, 
    getAboutPage, 
    getCRUD, 
    postCRUD, 
    displayGetCRUD,
    getEditCRUD,
    putCRUD, 
    changeAccountCRUD,
    postNewAccountCRUD,
    deleteCRUD
}


 








