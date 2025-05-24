const express = require("express");
const cors = require("cors");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_KEY,
});

const sentFrom = new Sender(process.env.MAILERSEND_DOMAIN, "TimBERNIC");

app.get("/", (req, res) => {
  try {
    return res.status(200).json("bienvenue!!");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/request/mail", async (req, res) => {
  try {
    const { name, lastName, email, text } = req.body;

    const recipients = [new Recipient(email, `${name}${lastName}`)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("This is a Subject")
      .setHtml("<p>" + text + "</p>")
      .setText(text);

    const result = await mailerSend.email.send(emailParams);
    console.log(result);

    return res.status(202).json({ message: "Email Envoyé :" + result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.all(/.*/, (req, res) => {
  try {
    return res.status(400).json("Not Found");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});
app.listen(3000, () => {
  console.log("serveur tripAdvisor is started! 💌💌");
});
