import bcrypt from 'bcryptjs'
import db from '../models/index'
const salt = bcrypt.genSaltSync(10)






function createSpecialty(data) {
    return new Promise( async(resolve, reject) => {
        try{
            console.log(data)
            if(!data.name || !data.imageBase64){  // Luoi khong validate
                resolve({ errCode: 1, errMessage: 'Missing Parameter !!!'})
            }else {

                let res = await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHtml: data.descriptionHtml,
                    descriptionMarkdown: data.descriptionMarkdown
                })

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


function getAllSpecialty() {
    return new Promise( async(resolve, reject) => {
        try{
            let data = await db.Specialty.findAll({
                attributes: {
                    exclude: ['createdAt','updatedAt']       // Không tải lên trường pasword
                },
            })

            if(data && data.length > 0){
                data.map(item => {
                 
                    item.image = new Buffer(item.image,'base64').toString('binary');
            
                    return item
                })
            }

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




function getDetailSpecialtyById(id,location) {
    return new Promise( async(resolve, reject) => {
        try{
            console.log('Check Id  2 ', id)
            if(!id || !location){
                resolve({
                    errCode: -1,
                    errMessage: 'Not from id'
                })
            }else {
                let data 
                    data = await db.Specialty.findOne({
                        where: {id: id},
                        attributes: ['descriptionHtml','descriptionMarkdown']       // Không tải lên trường pasword
                        
                    })

                    if(data){
                        let doctorSpecialty = []
                        if(location === 'All'){
                            doctorSpecialty = await db.Doctor_info.findAll({
                                where: {specialtyId: id},
                                attributes: ['doctorId','specialtyId']       // Không tải lên trường pasword
                            })
                        }else {
                            doctorSpecialty = await db.Doctor_info.findAll({
                                where: {specialtyId: id, provinceId: location},
                                attributes: ['doctorId','specialtyId']       // Không tải lên trường pasword
                            })
                        }
        
                        data.doctorSpecialty = doctorSpecialty

                        resolve({
                            errCode: 0,
                            data: data
                        })


                    }else{
                        resolve({
                            errCode: 1,
                            errMessage: `Not Found Data id ${id} a tabel Spectialty`
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
    getDetailSpecialtyById,
    createSpecialty,
    getAllSpecialty
};