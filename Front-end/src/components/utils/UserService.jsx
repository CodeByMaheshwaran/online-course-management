import React from 'react'
import axios from 'axios'

class UserService{
    static BASE_URL="http://localhost:8081"
    static async login(username,password,role){
       try{
         const response=await axios.post(`${UserService.BASE_URL}/auth/login`,{username,password,role})
        return response.data;
       }catch(error){
        throw error;
       }
    }

    static async register(userData,token) {
      try {
            
          const response = await axios.post(`${UserService.BASE_URL}/admin/register`, userData,
            {
              headers:{ Authorization: `Bearer ${token}`}
          }
          );
           
          return response.data;
      } catch (error) {
          throw error;
      }
  }

  static async uploadPhoto(formData,token) {
    
      try {
          const response = await axios.post(`${UserService.BASE_URL}/profile-photo/upload`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data', 
                   'Authorization': `Bearer ${token}`
                 
              },
          });
          
          return response.data;
      } catch (error) {
          throw error.response?.data || error; // Return error message from response
      }
  }



     static async getAllUsers(token){
        try{  
          const response=await axios.get(`${UserService.BASE_URL}/admin/get-all-users`,
            {
                headers:{ Authorization: `Bearer ${token}`}
            })
         return response.data;
        }catch(error){
         throw error;
        }
     }
     static async getYourProfile(token){
        
      try{
          const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`,
            {
                headers:{ Authorization: `Bearer ${token}`}
            })
         return response.data;
        }catch(error){
         throw error;
        }
     }
     static async getUserById(userId,token){
        
      try{
        
          const response=await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`,
            {
                headers:{ Authorization: `Bearer ${token}`}
            })
         return response.data;
        }catch(error){
         throw error;
        }
     }
     static async deleteUser(userId,token){
        try{
          const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`,
            {
                headers:{ Authorization: `Bearer ${token}`}
            })
         return response.data;
        }catch(error){
         throw error;
        }

     }
     static async updateUser(userId,userData,token){
      
        try{
          const response = await axios.put(`${UserService.BASE_URL}/admin-faculty/update/${userId}`,userData,
            {
                headers:{ Authorization: `Bearer ${token}`}
            })
         return response.data;
        }catch(error){
         throw error;
        } 
     }

     static async getEnrollmentTrends(token){
      try{
        const response = await axios.get(`${UserService.BASE_URL}/enrollment/enrollment-trends`,
          {
              headers:{ Authorization: `Bearer ${token}`}
          })
       return response.data;
      }catch(error){
       throw error;
      }
   }

    /** AUTHENTICATION CHECKER **/

    static logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }
    static isAuthenticated(){
        const token=localStorage.getItem('token');
      return !!token  
    }
    static isAdmin(){
        const role=localStorage.getItem('role');
      return role=== 'ADMINISTRATOR' 
    }
    static isUser(){
        const role=localStorage.getItem('role');
      return role=== 'USER' 
    }
    static adminOnly(){
     return this.isAuthenticated() && this.isAdmin();   
    }
    static getRole() {
      return localStorage.getItem('role');
    }

}  
export default UserService;