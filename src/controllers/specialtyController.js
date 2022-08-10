
import {default as specialtyServices} from '../services/specialtyServices'



const createSpecialty = async (req, res) => {
    console.log('Check data vào :', req.body)
    try{
        let data = await specialtyServices.createSpecialty(req.body)
        return res.status(200).json(data)
    }
    catch(err){
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server',err,
        })
    }
}



const getAllSpecialty = async (req, res) => {
    try{
        let data = await specialtyServices.getAllSpecialty()
        return res.status(200).json(data)
    }
    catch(err){
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server',err,
        })
    }
}

const getDetailSpecialtyById = async (req, res) => {
    let id = req.query.id
    let location = req.query.location

    console.log(id,location)
    try{
        let data = await specialtyServices.getDetailSpecialtyById(id,location)
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
    getDetailSpecialtyById,
    createSpecialty,
    getAllSpecialty
} 