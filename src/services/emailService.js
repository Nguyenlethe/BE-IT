
const nodemailer = require("nodemailer");


let sendSimpleEmail = async (reciverEmail) => {

  let result = ''
  if(reciverEmail.language === 'en'){
    result = `<p>Đặt giờ ${reciverEmail.timeString} - Ngày ${reciverEmail.date}</p>
              <a href="${reciverEmail.redirectLink}">Click Để Xác Nhận</a>`
  }
  if(reciverEmail.language === 'vi'){
    result = `<p>Book time ${reciverEmail.timeString} - day ${reciverEmail.date}</p>
    <a href="${reciverEmail.redirectLink}">Click Để Xác Nhận</a>`
  }

     let transporter = nodemailer.createTransport({
       host: "smtp.gmail.com",
       port: 587,
       secure: false, // true for 465, false for other ports
       auth: {
         user: process.env.EMAIL_APP, // generated ethereal user
         pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
       },
     });
    
     
     
     let info = await transporter.sendMail({
       from: '"Fred Foo 👻" <webk12hht@gmail.com>', // Tên Người Gửi
       to: reciverEmail.email,  // Gửi đến ai ?
       subject: "Thông tin đặt lịch khám bệnh ✔", // Tiêu đề email
       text: "Hello world?", // plain text body
       html: `${result}`, // html body
     });
}





// Email Hoa down
let sendAttachment = async(data) => {
 

  console.log(data)

  let result = ''
  if(data.language === 'en'){
    result = `<p>.......</p>`
  }
  if(data.language === 'vi'){
    result = `<p>.......</p>`
  }




     let transporter = nodemailer.createTransport({
       host: "smtp.gmail.com",
       port: 587,
       secure: false, // true for 465, false for other ports
       auth: {
         user: process.env.EMAIL_APP, // generated ethereal user
         pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
       },
     });
    
     
     let info = await transporter.sendMail({
       from: '"Fred Foo 👻" <webk12hht@gmail.com>', // Tên Người Gửi
       to: data.email,  // Gửi đến ai ?
       subject: "Thông tin Ket qua lịch khám bệnh ✔", // Tiêu đề email
       text: "Hello world?", // plain text body
       html: `${result}`, // html body
       attachments: [
        {   // encoded string as an attachment
          filename: 'cat.jpg',
          content: data.imgaeBase64.split("base64,")[1],
          encoding: 'base64'
        }
      ]
     });



} 



export default {
  sendAttachment,
  sendSimpleEmail
}