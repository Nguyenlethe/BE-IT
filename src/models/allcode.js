'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {  
      // Định danh các mối quan hệ
      // 1 Allcode có nhiều user (1 - n) foreignKey là gtri muốn map tới bảng user
      Allcode.hasMany(models.User, { foreignKey: 'positionId', as : 'positionData' })
      Allcode.hasMany(models.User, { foreignKey: 'gender', as : 'genderData' })
      Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', as : 'timeTypeData' })

      
      Allcode.hasMany(models.Doctor_info, { foreignKey: 'priceId', as : 'priceData' })
      Allcode.hasMany(models.Doctor_info, { foreignKey: 'paymentId', as : 'paymentData' })
      Allcode.hasMany(models.Doctor_info, { foreignKey: 'provinceId', as : 'provinceData' })

      Allcode.hasMany(models.Booking, { foreignKey: 'timeType', as : 'timeData' })


    }
  };
  Allcode.init({
    keyMap: DataTypes.STRING,
    type:  DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
}; 