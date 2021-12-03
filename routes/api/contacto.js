var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");

// Envia un mensaje de contacto
router.post("/", async (req, res, next) => {
  try {
    const mail = {
      from: req.body.email,
      to: "cristo.ottis@gmail.com",
      subject: "Mensaje de contacto de la web Pensadero",
      html: `Se contactó con el mail ${req.body.email} y dejo el siguiente mensaje: <br> ${req.body.mensaje}`,
    };

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transport.sendMail(mail, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.json({ mensaje: "Mensaje enviado con exito." });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
