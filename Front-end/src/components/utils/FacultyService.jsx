import React from 'react'
import axios from 'axios'

class FacultyService{
    static BASE_URL="http://localhost:8081"
    
    static async getCourseAndStudents(userId,token){
        
      try{
          const response=await axios.get(`${FacultyService.BASE_URL}/faculty/${userId}/students`,
            {
                headers:{ Authorization: `Bearer ${token}`}
            })
         return response.data;
        }catch(error){
         throw error;
        }
     } 

}  
export default FacultyService;