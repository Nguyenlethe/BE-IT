'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('markdowns', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        contentHtml: {
            allowNull: false,
            type: Sequelize.TEXT('Long')
        },
        contentMarkdown: {
            allowNull: false,
            type: Sequelize.TEXT('Long')
        },
        description: {
            allowNull: true,  // Co the de la null
            type: Sequelize.TEXT('Long')
        },
        doctorId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        specialtyId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        clinicId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
        });
    },
    down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('markdowns');
  }
};