import bcrypt from 'bcryptjs'
import emaiService from '../services/emailService'
import { v4 as uuidv4 } from 'uuid';
import db from '../models/index'
const salt = bcrypt.genSaltSync(10)


let buildUrlEmail = (token,doctorId) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}



function postBookAppointment(data) {
    return new Promise( async(resolve, reject) => {
        try{
            if(!data.email){
                resolve({ errCode: 1, errMessage: 'Missing Parameter !!!'})
            }else {
                

                let token = uuidv4(); 
                await emaiService.sendSimpleEmail({...data, redirectLink: buildUrlEmail(token,data.doctorId) })

                let user = await db.User.findOrCreate({  // findOrCreate tìm thấy thì trả ra không thấy thì lấy gtri default
                    where: { email: data.email},
                    defaults: {
                      email: data.email,
                      roleId: 'R3'
                    },
                    raw : true
                });
                console.log('Check user',user )
                if(user){
                    let users = user
                    if(user.length > 0) {users = user[0]}
                    let a = await db.Booking.findOrCreate({
                        where: { patientId: users.id},
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: users.id, 
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        },
                        raw : true
                    })
                    console.log(a)
                }  
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        }
        catch(err){
            reject(err)
        }
    })
}


function postVerifyBookAppointment(data) {
    return new Promise( async(resolve, reject) => {
        try{
            console.log(data)
            if(!data.token || !data.doctorId){
                resolve({ errCode: 1, errMessage: 'Missing Parameter !!!'})
            }else {

                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId, 
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw : false // Đăt false để có thể save ở dưới  
                })

                if(appointment){
                    await appointment.update({
                        statusId: 'S2'
                    })

                    resolve({
                        errCode: 0,
                        errMessage: 'ok update successful'
                    })
                }else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated, or does not exist'
                    })
                }
            }
        }
        catch(err){
            reject(err)
        }
    })
}


export default {
    postBookAppointment,
    postVerifyBookAppointment
};