const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 8080;
const filePath = path.join(__dirname, 'comments.txt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Route pour ajouter un commentaire
app.post('/add-comment', (req, res) => {
    const { name, comment } = req.body;
    const newComment = { name, comment };
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            return res.status(500).send('Erreur lors de la lecture du fichier.');
        }
        
        const comments = data ? JSON.parse(data) : [];
        comments.push(newComment);

        fs.writeFile(filePath, JSON.stringify(comments, null, 2) + '\n', (err) => {
            if (err) {
                console.error('Erreur lors de l\'ajout du commentaire :', err);
                return res.status(500).send('Erreur lors de l\'ajout du commentaire.');
            }
            res.sendStatus(200);
        });
    });
});

// Route pour afficher les 10 plus anciens commentaires
app.get('/comments', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier :', err);
            return res.status(500).send('Erreur lors de la lecture du fichier.');
        }
        
        const comments = data ? JSON.parse(data) : [];
        const oldestComments = comments.slice(-10);
        res.json(oldestComments);
    });
});

// Route pour envoyer un e-mail
app.post('/contact', (req, res) => {
    const { name, firstname, email } = req.body;

    const mailOptions = {
        from: "ventoy1605@gmail.com",
        to: "jonasclocin01@gmail.com",
        subject: 'Confirmation d\'un nouveau client sur notre site',
        text: `Nous avons un nouveau client sur notre site web \n
        Quelques infos du client\n
        Nom : ${firstname}\n
        Prénom : ${name}\n
        email : ${email}.\n
        \nCordialement,\nL'équipe Lendor`,
    };
    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'ventoy1605@gmail.com',
            pass: 'ygrl ddvv jotd hdcg'
        },
    });
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
            return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
        }
        console.log('E-mail envoyé :', info.response);
        res.status(200).json({ message: 'E-mail envoyé avec succès.' });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
