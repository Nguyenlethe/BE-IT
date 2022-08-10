
import {default as pationtService} from '../services/pationtService'



const postBookAppointment = async (req, res) => {
    console.log('Check data vào :', req.body)
    try{
        let data = await pationtService.postBookAppointment(req.body)
        return res.status(200).json(data)
    }
    catch(err){
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Err from server',err,
        })
    }
}



const postVerifyBookAppointment = async (req, res) => {
    console.log('Check data vào :', req.body)
    try{
        let data = await pationtService.postVerifyBookAppointment(req.body)
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
    postVerifyBookAppointment,
    postBookAppointment
} 