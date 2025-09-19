import {createTransport, sendMailOptions} from "nodemailer";

export const sendEmail = async(data: sendMailOptions) => {
    const transporter = createTransport({
        host: "smtp.ethereal.email",
        service: "gmail",
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"E-commerce💬" <${process.env.EMAIL}>`,
        ...data
    });
}