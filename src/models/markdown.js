'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {  
      // Định danh các mối quan hệ
      Markdown.belongsTo(models.User,{foreignKey: 'doctorId', } )

    }
  };
  Markdown.init({
    contentHtml: DataTypes.TEXT('Long'),
    contentMarkdown: DataTypes.TEXT('Long'),
    description:DataTypes.TEXT('Long'),
    doctorId: DataTypes.INTEGER,
    specialtyId:  DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Markdown',
  });
  return Markdown;
};