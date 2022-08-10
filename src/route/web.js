import express  from 'express';

import homecontroller  from '../controllers/homecontroller'
import userController from '../controllers/userController'
import docterController from '../controllers/docterController'
import patientController from '../controllers/patientController'
import specialtyController from '../controllers/specialtyController'
import clinicController from '../controllers/clinicController'


let router = express.Router();



function initWebRoutes(app) { 

    router.get('/', homecontroller.getHomePage)
    router.get('/about', homecontroller.getAboutPage)
    router.get('/crud', homecontroller.getCRUD)

    router.post('/post-crud', homecontroller.postCRUD)
    router.get('/get-crud', homecontroller.displayGetCRUD)
    router.get('/edit-crud', homecontroller.getEditCRUD)

    router.post('/put-crud', homecontroller.putCRUD)
    router.get('/delete-crud', homecontroller.deleteCRUD)


    // API Admin
    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/allcode', userController.getAllCodes)


    // API Doctor
    router.get('/api/top-docter-home', docterController.getTopDocterHome)
    router.get('/api/get-all-doctors', docterController.getAllDoctors)
    router.post('/api/save-infor-doctors', docterController.postInforDoctors)
    router.get('/api/detail-docter-by-id', docterController.getDetailDoctorsById)
    router.post('/api/bulk-create-schedule', docterController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', docterController.getScheduleByDate)
    router.get('/api/get-extra-info-doctor-by-id', docterController.getExtraInfoDoctorById)
    router.get('/api/get-profile-doctor-by-id', docterController.getProfileDoctorById)
    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment)
    router.post('/api/create-new-specialty', specialtyController.createSpecialty)
    router.get('/api/get-specialty', specialtyController.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)
    router.post('/api/create-new-clinic', clinicController.createClinic)
    router.get('/api/get-clinic', clinicController.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)

    router.get('/api/get-list-patient-for-doctor', docterController.getListPationForDoctor)
    router.post('/api/send-remedy', docterController.sendReamedy)








    



    // Xl cập nhật mk or email , /edit-account-crud?id=    
    router.get('/change-account-crud', homecontroller.changeAccountCRUD)
    router.post('/edit-account-crud', homecontroller.postNewAccountCRUD)


    return app.use('/', router)
}

export default initWebRoutes;
