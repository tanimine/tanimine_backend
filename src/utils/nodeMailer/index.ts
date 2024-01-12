import { createTransport } from 'nodemailer'
import verifyEmail from './verifyEmail'
import forgotPassword  from './forgotPassword'
require('dotenv').config()

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASS
  }
})

const sendMail = (to: string, subject: string, data: any, type: string) => {
  const mailOptions = {
    to,
    subject,
    html: type === 'verify-email' ? verifyEmail(data) : forgotPassword(data)
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log(info)
    }
  })
}

export { transporter, sendMail }
