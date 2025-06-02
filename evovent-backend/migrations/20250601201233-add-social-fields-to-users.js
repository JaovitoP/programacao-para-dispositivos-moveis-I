'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'about', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Biografia ou descrição do produtor'
    });
    
    await queryInterface.addColumn('users', 'instagram_url', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL do perfil no Instagram'
    });
    
    await queryInterface.addColumn('users', 'facebook_url', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL do perfil no Facebook'
    });
    
    await queryInterface.addColumn('users', 'twitter_url', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL do perfil no Twitter/X'
    });
    
    await queryInterface.addColumn('users', 'linkedin_url', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL do perfil no LinkedIn'
    });
    
    await queryInterface.addColumn('users', 'tiktok_url', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL do perfil no TikTok'
    });
    
    await queryInterface.addColumn('users', 'website_url', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL do website pessoal ou da empresa'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'about');
    await queryInterface.removeColumn('users', 'instagram_url');
    await queryInterface.removeColumn('users', 'facebook_url');
    await queryInterface.removeColumn('users', 'twitter_url');
    await queryInterface.removeColumn('users', 'linkedin_url');
    await queryInterface.removeColumn('users', 'tiktok_url');
    await queryInterface.removeColumn('users', 'website_url');
  }
};