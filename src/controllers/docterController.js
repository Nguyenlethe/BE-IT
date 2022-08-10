import doctorService from '../services/doctorService'

let getTopDocterHome = async (req, res) =>  {
    let limit = req.query.limit
    if(!limit) limit = 10
    try {
        let response = await doctorService.getTopDocterHome(+limit)
        return res.status(200).json(response)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever "
        })
    }
}

let getAllDoctors = async (req, res) =>  {
    try {
        let doctors = await doctorService.getAllDoctors()
        return res.status(200).json(doctors)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever "
        })
    }
}


let postInforDoctors = async (req, res) =>  {
    console.log("Dl vào 1 :",req.body)
    try {
        let doctors = await doctorService.postInforDoctors(req.body)
        return res.status(200).json(doctors)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever "
        })
    }
}


let getDetailDoctorsById = async (req, res) =>  {
    try {
        let info = await doctorService.getDetailDoctorsById(req.query.id)
        return res.status(200).json(info)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever "
        })
    }
}




let bulkCreateSchedule = async (req, res) =>  {
    // console.log(req.body)
    try {
        let info = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(info)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever 01"
        })
    }
}



let getScheduleByDate = async (req, res) =>  {
    console.log(req.query.doctorId, req.query.date)
    try {
        let info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever 01"
        })
    }
}




let getExtraInfoDoctorById = async (req, res) =>  {
    console.log("Id vao 1 :",req.query.doctorId)
    try {
        let info = await doctorService.getExtraInfoDoctorById(req.query.doctorId)
        return res.status(200).json(info)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever 01"
        })
    }
}



let getProfileDoctorById = async (req, res) =>  {
    console.log("Id vao 1 :",req.query.doctorId)
    try {
        let info = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json(info)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever 01"
        })
    }
}


let getListPationForDoctor = async (req, res) =>  {
    console.log("data vao :",req.query.doctorId, req.query.date)
    try {
        let info = await doctorService.getListPationForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever 01"
        })
    }
}



let sendReamedy = async (req, res) =>  {
    console.log("data vao :",req.body)
    try {
        let info = await doctorService.sendReamedy(req.body)
        return res.status(200).json(info)
    }
    catch(err) {
        console.error("Error :",err)
        return res.status(200).json({
            errCode: -1,
            message: "Error From sever 01"
        })
    }
}



export default {
    sendReamedy,
    getListPationForDoctor,
    getTopDocterHome,
    getAllDoctors,
    postInforDoctors,
    getDetailDoctorsById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById
}