'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Student, {
        as:'student',
        foreignKey: 'user_id'
        }
      );
      User.hasOne(models.Staff,{
        as:'staff',
        foreignKey:'user_id'
        }
      )
    }
    can(action){
      let allowedActions=[];
      if(this.role === 'staff'){
        allowedActions= [
            'add course',
            'edit course',
            'delete course',
            'view students',
            'view student profiles',
            'enroll student',
            'drop student',
            'delete student'
        ]
      }else{
        allowedActions =[ 'view self', 'enroll self', 'drop self', 'edit self']
      }
      return allowedActions.indexOf(action)!== -1
    }
    matchesStudentId(id){
      if(!this.student){
        return false;
      }
      return this.student.id === id;
    };
  };

  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    displayName:{
      type:DataTypes.VIRTUAL,
      get(){
        if (this.student) {
          return this.student.first_name;
        };
        return this.staff.first_name;
        }
      }

  }, {
    sequelize,
    modelName: 'User',
    timestamps:false,
    tableName: 'student_courses_users'
  });
  return User;
};