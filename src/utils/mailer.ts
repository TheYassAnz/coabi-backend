import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // ou un autre service de messagerie
  auth: {
    user: process.env.NODEMAILER_USER, // email d'envoi
    pass: process.env.NODEMAILER_PASS, // mot de passe ou App Password
  },
});

const sendWelcomeEmail = async (to: string, username: string) => {
  const mailOptions = {
    from: `"L'équipe COABI" <${process.env.NODEMAILER_USER}>`,
    to,
    subject: "Bienvenue chez COABI ! 🚀",
    text: `Bonjour ${username},

Bienvenue chez COABI !

Nous sommes ravis de t'accueillir dans notre communauté. Ton inscription a bien été prise en compte.

Tu peux dès à présent rejoindre un foyer avec le code d'invitation de ton foyer. (Si tu n'as pas de code, demande à un membre de ton foyer de te l'envoyer.)

Si tu as la moindre question ou besoin d'aide, notre équipe reste à ta disposition.

À très bientôt,
L'équipe COABI
`,
    html: `
            <div style="font-family: Arial, sans-serif; color: #222;">
                <h2>Bienvenue chez <span style="color: #4F46E5;">COABI</span> ! 🚀</h2>
                <p>Bonjour <strong>${username}</strong>,</p>
                <p>Nous sommes ravis de t'accueillir dans notre communauté.<br>
                Ton inscription a bien été prise en compte et tu peux dès à présent profiter de tous nos services.</p>
                <p>Tu peux dès à présent rejoindre un foyer avec le code d'invitation de ton foyer. (Si tu n'as pas de code, demande à un membre de ton foyer de te l'envoyer.)</p>
                <p>Si tu as la moindre question ou besoin d'aide, notre équipe reste à ta disposition.</p>
                <p style="margin-top: 32px;">À très bientôt,<br>
                <strong>L'équipe COABI</strong></p>
            </div>
        `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendWelcomeEmail };
