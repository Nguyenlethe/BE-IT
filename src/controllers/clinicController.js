
import clinicService from '../services/clinicService'


const createClinic = async (req, res) => {
    console.log(req.body)
    try{
        let data = await clinicService.createClinic(req.body)
        return res.status(200).json(data)
    }
    catch(err){
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server',err,
        })
    }
}



const getAllClinic = async (req, res) => {
    try{
        let data = await clinicService.getAllClinic()
        return res.status(200).json(data)
    }
    catch(err){
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server',err,
        })
    }
}



const getDetailClinicById = async (req, res) => {
    console.log('Check id vào 1:', req.query.id)
    try{
        let data = await clinicService.getDetailClinicById(req.query.id)
        return res.status(200).json(data)
    }
    catch(err){
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server',err,
        })
    }
}



export default {
    getAllClinic,
    getDetailClinicById,
    createClinic
} 