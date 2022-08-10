
import db from '../models/index'
import _ from 'lodash'
require('dotenv').config()
import {default as emaiService} from './emailService'

const MAX_NUMBER_SCHEDULES = process.env.MAX_NUMBER_SCHEDULES

function getTopDocterHome(limitInput) {
    return new Promise( async(resolve, reject) => {
        try{    
            // let a = await db.Allcode.findAll()
            // console.log(a)
            let users = await db.User.findAll({
                limit: limitInput,
                where: {roleId: 'R2'},
                order: [['createdAt', 'DESC']],          // Lấy những người mới tạo lên trước 
                attributes: {
                    exclude: ['password']       // Không tải lên trường pasword
                },
                include : [
                    // lấy ra "valueEn", "valueVi" as vào positionData...
                    { model: db.Allcode, as: 'positionData', attributes: ["valueEn", "valueVi"]},
                    { model: db.Allcode, as: 'genderData', attributes: ["valueEn", "valueVi"]}
                ],
                raw : true,
                nest: true  // Hỗ trợ gộp value vào 1 {} nếu trùng key
            })
            resolve({
                errCode: 0,
                data: users
            })
        }
        catch(err){
            reject(err)
        }
    })
}

function getAllDoctors() {
    return new Promise( async(resolve, reject) => {
        try{    
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password','image','roleId','positionId','updatedAt']       // Không tải lên trường pasword
                },
                raw : true
            })

            // console.log(doctors)
            resolve({
                errCode: 0,
                data: doctors
            })
        }
        catch(err){
            reject(err)
        }
    })
}

function postInforDoctors(data) {

    console.log("Check Data Xuong DB 2 :",data)

    return new Promise( async(resolve, reject) => {
        try{    

            let user = await db.User.findOne({
                where: {id : data.id }
            })

            let doctorInfo = await db.Doctor_info.findOne({
                where: {doctorId :data.id },
                raw :false
            })

            // Luoi khong validate dau nha
            if(!data.id || !data.contentMarkdown  || !data.contentHtml || !data.action){
                resolve({
                    errCode: 1,
                    errMessage: 'Not Found Id doctors'
                })
            }else {

                console.log(user, doctorInfo)

                if(user && doctorInfo == null){
                    if(data.action === 'CREATE'){
                        let doctors = await db.Markdown.create({
                            contentHtml: data.contentHtml,
                            contentMarkdown: data.contentMarkdown,
                            description: data.description,
                            doctorId: data.id,

                        })

                        let doctorInfo = await db.Doctor_info.create({
                            doctorId: data.id,
                            addressClinic: data.addressClinic,
                            nameClinic: data.nameClinic,
                            note: data.note,
                            clinicId: data.clinicId,
                            priceId: data.selectedPrice,
                            provinceId: data.selectedProvince,
                            paymentId: data.selectedPayment,
                            specialtyId: data.specaltyId
                        })

                        resolve({
                            errCode: 0,
                            data: doctors,doctorInfo
                        })
                    }

                    if(data.action === 'EDIT'){
                        let doctors = await db.Markdown.update(
                            {
                                contentHtml: data.contentHtml,
                                contentMarkdown: data.contentMarkdown,
                                description: data.description,
                                doctorId: data.id
                            },
                            {where: {doctorId: data.id}}
                        )
                        let doctorInfo = await db.Doctor_info.create({
                            doctorId: data.id,
                            addressClinic: data.addressClinic,
                            nameClinic: data.nameClinic,
                            note: data.note,
                            clinicId: data.clinicId,
                            priceId: data.selectedPrice,
                            provinceId: data.selectedProvince,
                            paymentId: data.selectedPayment,
                            specialtyId: data.specaltyId
                        })
                        resolve({
                            errCode: 0,
                            data: doctors,doctorInfo
                        })
                    }
                }
                if(user && doctorInfo != null){
                    console.log("Check id :",data.specaltyId )
                    if(data.action === 'CREATE'){
                        let doctors = await db.Markdown.create({
                            contentHtml: data.contentHtml,
                            contentMarkdown: data.contentMarkdown,
                            description: data.description,
                            doctorId: data.id,
                        })

                        let doctorInfo = await db.Doctor_info.update({
                            addressClinic: data.addressClinic,
                            nameClinic: data.nameClinic,
                            note: data.note,
                            specialtyId: data.specaltyId,
                            clinicId: data.clinicId,
                            priceId: data.selectedPrice,
                            provinceId: data.selectedProvince,
                            paymentId: data.selectedPayment ,
                            },{where: {doctorId: data.id}},
                            
                        )
                        resolve({
                            errCode: 0,
                            data: doctors,doctorInfo
                        })
                    }
                    if(data.action === 'EDIT'){
                        let doctors = await db.Markdown.update(
                            {
                                contentHtml: data.contentHtml,
                                contentMarkdown: data.contentMarkdown,
                                description: data.description,
                                doctorId: data.id
                            },
                            {where: {doctorId: data.id}}
                        )

                        let doctorInfo = await db.Doctor_info.update(
                            {
                                addressClinic: data.addressClinic,
                                nameClinic: data.nameClinic,
                                note: data.note,
                                clinicId: data.clinicId,
                                specialtyId: data.specaltyId,
                                priceId: data.selectedPrice,
                                provinceId: data.selectedProvince,
                                paymentId: data.selectedPayment ,
                            },
                            {where: {doctorId: data.id}}
                        )

                        resolve({
                            errCode: 0,
                            data: doctors,doctorInfo
                        })

                    }
                }   
            }
        }
        catch(err){
            reject(err)
        }
    })
}

function getDetailDoctorsById(id) {
    console.log("Check iD :",id)
    return new Promise( async(resolve, reject) => {
        try{    
            if(!id){
                resolve({
                    errCode: 1,
                    errMessage: 'Not Found Id doctors'
                })
            }else {
                let data = await db.User.findOne({
                    where: {id: id},
                    attributes: {
                        exclude: ['password','createdAt','updatedAt']       // Không tải lên trường pasword
                    },
                    include: [
                        // attributes chỉ lấy ra 3 bọn trong mảng
                        { model: db.Markdown, attributes: ['contentHtml','contentMarkdown', 'description']},
                        { model: db.Allcode, as: 'positionData', attributes: ["valueEn", "valueVi"]},

                        { model: db.Doctor_info, 
                            attributes:{ exclude: ['id','doctorId','createdAt','updatedAt'] },
                            include: [
                                { model: db.Allcode, as: 'provinceData', attributes: ["valueEn", "valueVi"]},
                                { model: db.Allcode, as: 'paymentData', attributes: ["valueEn", "valueVi"]},
                                { model: db.Allcode, as: 'priceData', attributes: ["valueEn", "valueVi"]},

                            ]
                        },
                    ],
                    raw : true,
                    nest: true 
                })
                if(data.image){
                    data.image = new Buffer(data.image,'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch(err){
            reject(err)
        }
    })
}

// truyền nhiều Dl vào bảng
function bulkCreateSchedule(data) {
    return new Promise( async(resolve, reject) => {
        try{    
            if(!data.arrSchedule && data.arrSchedule.length <= 0){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
                console.log("Data Error ",data)
            }

            let schedule = data.arrSchedule
            let id = ''
            let date = ''
            if(schedule && schedule.length > 0){
                schedule = schedule.map((item,index) => {
                    id = item.doctorId ? item.doctorId : ''
                    date = item.date ? item.date : ''
                    item.maxNumber = MAX_NUMBER_SCHEDULES
                    return item
                })
            }
        
            if(id != '' && date != '') {
                // Lấy ra các dữ liệu tư db có trùng doctorId
                let exsting = await db.Schedule.findAll({
                    where: {doctorId: id}
                })  
                if(exsting){
                    let dl = []
                    if(exsting.length > 0){
                        console.log("Check Dl Vào 1 :",schedule)

                        schedule.map((item) => {
                            let checkTrue = 0
                            exsting.map((dataDb) => {
                                if(item.date == dataDb.date && item.timeType !== dataDb.timeType){
                                    checkTrue = checkTrue + 1
                                }
                                if(item.date != dataDb.date){
                                    checkTrue = checkTrue + 1
                                }
                                if(exsting.length == checkTrue ){
                                    checkTrue = 0
                                    dl.push(item)
                                }
                            })
                        })

                        await db.Schedule.bulkCreate(dl)  // SD BulkCreate để truyền nhiều Dl vào bảng
                        resolve({
                            errCode: 0,
                            errMessage: 'Ok'
                        })
                    }else {
                        await db.Schedule.bulkCreate(schedule) 
                        resolve({
                            errCode: 0,
                            errMessage: 'Ok'
                        })
                    }
                }
            }
        }
        catch(err){
            reject(err)
        }
    })
}


function getScheduleByDate(id ,date) {

    console.log("Check Dl vào :",id, date)
    return new Promise( async(resolve, reject) => {
        try{    
            if(!id || !date){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            }else {

                let data = await db.Schedule.findAll({

                    where: {doctorId: id,date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ["valueEn", "valueVi"]},
                        { model: db.User, as: 'doctorData', attributes: ["firstName", "lastName"]},
                    ],
                    attributes: {
                        exclude: ['password','createdAt','updatedAt']       // Không tải lên trường pasword
                    },
                    raw : true,
                    nest: true
                })
                
                if(!data){
                    resolve({
                        errCode: 2,
                        errMessage: 'Not Found DoctorId Db !'
                    })
                }

                resolve({
                    errCode: 0,
                    data: data
                })
            }

           
        }
        catch(err){
            reject(err)
        }
    })
}

function getExtraInfoDoctorById(id ) {
    console.log("Check iD vào 2 :",id)
    return new Promise( async(resolve, reject) => {
        try{    
            if(!id){
                resolve({
                    errCode: 1,
                    errMessage:"Not Found Id Doctor"
                })
            }else{
                console.log("Check iD vào 3 :",id)
                let data = await db.Doctor_info.findOne({
                    where: {doctorId: id},
                    attributes: {
                        exclude: ['password','doctorId','id','createdAt','updatedAt']       
                    },
                    include: [
                        { model: db.Allcode, as: 'provinceData', attributes: ["valueEn", "valueVi"]},
                        { model: db.Allcode, as: 'paymentData', attributes: ["valueEn", "valueVi"]},
                        { model: db.Allcode, as: 'priceData', attributes: ["valueEn", "valueVi"]},
                    ],
                    raw : true,
                    nest: true 
                })
                if(!data) data = {}
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: data
                })
            }
        }
        catch(err){
            reject(err)
        }
    })
}


function getProfileDoctorById(id ) {
    console.log("Check iD vào 2 :",id)
    return new Promise( async(resolve, reject) => {
        try{    
            if(!id){
                resolve({
                    errCode: 1,
                    errMessage:"Not Found Id Doctor"
                })
            }else{
                console.log("Check iD vào 3 :",id)


                let data = await db.User.findOne({
                    where: {id: id},
                    attributes: {
                        exclude: ['password','createdAt','updatedAt']       // Không tải lên trường pasword
                    },
                    include: [
                        // attributes chỉ lấy ra 3 bọn trong mảng
                        { model: db.Markdown, attributes: [ 'description']},
                        { model: db.Allcode, as: 'positionData', attributes: ["valueEn", "valueVi"]},

                        { model: db.Doctor_info, 
                            attributes:{ exclude: ['id','doctorId','createdAt','updatedAt'] },
                            include: [
                                { model: db.Allcode, as: 'provinceData', attributes: ["valueEn", "valueVi"]},
                                { model: db.Allcode, as: 'paymentData', attributes: ["valueEn", "valueVi"]},
                                { model: db.Allcode, as: 'priceData', attributes: ["valueEn", "valueVi"]},

                            ]
                        },
                    ],
                    raw : true,
                    nest: true 
                })
                if(data.image){
                    data.image = new Buffer(data.image,'base64').toString('binary');
                }

                // console.log(data)
                resolve({
                    errCode: 0,
                    data: data
                })


            }
        }
        catch(err){
            reject(err)
        }
    })
}


function getListPationForDoctor(id,date ) {
    console.log("Check iD vào 2 :",id,date)
    return new Promise( async(resolve, reject) => {
        try{    
            if(!id || !date){
                resolve({
                    errCode: 1,
                    errMessage:"Not Found Id Doctor"
                })
            }else{

                let res = await db.Booking.findAll({ 
                    where: {statusId: 'S2', doctorId: id, date: date},
                    include: [
                        { model: db.User, as: 'patientData', attributes: ['firstName','lastName','address', 'email','gender'],
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ["valueEn", "valueVi"]}
                        ]},
                        { model: db.Allcode, as: 'timeData', attributes: ['valueVi','valueEn']}
                    ],
                    raw : true,
                    nest: true 
                })
               
                console.log(res)
                resolve({
                    errCode: 0,
                    data: res
                })
            }
        }
        catch(err){
            reject(err)
        }
    })
}






function sendReamedy(data) {
    return new Promise( async(resolve, reject) => {
        try{    
            // update patient
            let apotient = await db.Booking.findOne({
                where:{
                    doctorId: data.doctorId, 
                    patientId: data.patientId, 
                    statusId: 'S2', 
                    timeType: data.timeType
                },
                raw: false
            })

            if(apotient){
                apotient.statusId = 'S3'
                await apotient.save()
            }

            // Send gmail
            let res = await emaiService.sendAttachment(data)

            console.log(res)
            
            resolve({
                errCode: 0,
                errMessage: 'Ok'
            })
            
        }
        catch(err){
            reject(err)
        }
    })
}






export default { 
    sendReamedy,
    getListPationForDoctor,
    getProfileDoctorById,
    getTopDocterHome, 
    getAllDoctors ,
    postInforDoctors,
    getDetailDoctorsById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoDoctorById
}
