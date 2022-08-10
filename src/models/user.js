'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {   
      // Định danh các mối quan hệ
      User.belongsTo(models.Allcode, {foreignKey: 'positionId',targetKey: 'keyMap', as : 'positionData'})
      // 1 user thuộc nhiều Allcode  (1 - n) 
      // foreignKey là dl bảng này sẽ map với targetKey của bảng Allcode và dl chung đó được chuyền vào genderData...
      User.belongsTo(models.Allcode, {foreignKey: 'gender',targetKey: 'keyMap', as : 'genderData'})
      User.hasOne(models.Markdown,{foreignKey: 'doctorId', } )
      User.hasOne(models.Doctor_info,{foreignKey: 'doctorId', } )


      User.hasMany(models.Schedule, {foreignKey: 'id',targetKey: 'doctorId', as : 'doctorData'})

      User.hasMany(models.Booking, {foreignKey: 'patientId', as : 'patientData'})


    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName:  DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING, 
    phoneNumber: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',  
  }); 
  return User;
};