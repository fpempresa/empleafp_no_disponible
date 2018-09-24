"use strict";


function ageCalculator(birthDate) {
    
    if (!birthDate) {
        return 0;
    }
    
    var now = new Date();
    var age = now.getFullYear() - birthDate.getFullYear();
    var m = now.getMonth() - birthDate.getMonth();
    if ((birthDate.getMonth() > now.getMonth()) || (m === 0 && now.getDate() < birthDate.getDate())) {
        //aun falta algún mes para que sea su cumpleaños
        age--;
    } else if (birthDate.getMonth() === now.getMonth()) {
        //Estamos en el mes de su cumpleaños
        if (now.getDate() < birthDate.getDate()) {
            
            age--;
        } else {
            //Acaba de ser su cumpleaños este mes
        }
        
    } else {
        //No hacemos nada pq ya ha sido su cumpleaños este año.
    }
    return age;
}

angular.module("common").value("ageCalculator",ageCalculator);