import React from 'react'
import axios from 'axios'

class StudentService{
    static BASE_URL="http://localhost:8081"
    
    static async getCourseAndGradeWithAttendance(userId,token){
        
      try{
          const response=await axios.get(`${StudentService.BASE_URL}/students/${userId}/courses/grades`,
            {
                headers:{ Authorization: `Bearer ${token}`}
            })
         return response.data;
        }catch(error){
         throw error;
        }
     }
     static async getFacultiesByStudentId(userId,token){
        
        try{
            const response=await axios.get(`${StudentService.BASE_URL}/students/${userId}/faculties`,
              {
                  headers:{ Authorization: `Bearer ${token}`}
              })
           return response.data;
          }catch(error){
           throw error;
          }
       }
  
     

}  
export default StudentService;