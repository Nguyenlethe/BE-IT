import bcrypt from 'bcryptjs'
import db from '../models/index'


function createClinic(data) {
    return new Promise( async(resolve, reject) => {
        try{
            console.log('1',data)

            
            if(!data.name || !data.descriptionMarkdown){
                resolve({ errCode: 1, errMessage: 'Missing Parameter !!!'})
            }else {

                // console.log(data)


                let dataClinic = await db.Clinic.create({
                    name: data.name, 
                    address: data.address,
                    images: data.imageBase64,
                    descriptionHtml: data.descriptionHtml,
                    descriptionMarkdown: data.descriptionMarkdown
                })
              
                resolve({
                    errCode: 0,
                    data: dataClinic
                })
            }
        }
        catch(err){
            reject(err)
        }
    })
}


function getAllClinic() {
    return new Promise( async(resolve, reject) => {
        try{
           
            let data = await db.Clinic.findAll({
                attributes: {
                    exclude: ['createdAt','updatedAt']       // Không tải lên trường pasword
                },
            })

            if(data && data.length > 0){
                data.map(item => {
                    item.images = new Buffer(item.images,'base64').toString('binary');
                    return item
                })
            }

            // console.log(data)

            resolve({
                errCode: 0,
                data: data
            })

           
        }
        catch(err){
            reject(err)
        }
    })
}




function getDetailClinicById(inputId) {
    return new Promise( async(resolve, reject) => {
        try{
            console.log('Check Id  2 ', inputId)
            if(!inputId){
                resolve({
                    errCode: -1,
                    errMessage: 'Not from id'
                })
            }else {
                let data 
                    data = await db.Clinic.findOne({
                        where: {id: inputId},
                        attributes: ['name','address','descriptionHtml','descriptionMarkdown']       // Không tải lên trường pasword
                    })

                    if(data){
                        let doctorClinic = []
                       
                            doctorClinic = await db.Doctor_info.findAll({
                                where: {clinicId: inputId},
                                attributes: ['doctorId','specialtyId']       // Không tải lên trường pasword
                            })

                            data.doctorClinic = doctorClinic
                        resolve({
                            errCode: 0,
                            data: data
                        })


                    }else{
                        resolve({
                            errCode: 1,
                            errMessage: `Not Found Data id ${inputId} a tabel Spectialty`
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
    createClinic,
    getAllClinic,
    getDetailClinicById
};