const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('D:\\\\Department Management System\\\\department-management-system-1\\\\student request letter\\\\non - acedemic hostel form.pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(err => {
    console.error("Error reading PDF: ", err);
});
