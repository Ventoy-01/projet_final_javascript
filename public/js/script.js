function menu() {
    var navLiens = document.getElementById("liens");
    var buttonMenu = document.querySelector('.menu-button i');

    if (navLiens.classList.contains('show')) {
        navLiens.classList.remove('show');
        buttonMenu.classList.remove('fa-times');
        buttonMenu.classList.add('fa-bars');
    } else {
        navLiens.classList.add('show');
        buttonMenu.classList.remove('fa-bars');
        buttonMenu.classList.add('fa-times');
    }
}
// ================================Quantites commentaire ========================

    const check = document.getElementById('comment-title');
    const titre = document.createElement("h3")
if (check) {
    fetch('/comments')
        .then(response => response.json())
        .then(comments => {
            if (comments.length == 1) {
                titre.textContent = "Notre dernier commentaire";
                check.appendChild(titre)
            }
            else if ((comments.length > 1) && (comments.length <=10)) {
                titre.innerHTML = `Nos ${comments.length} derniers commentaires`;
                check.appendChild(titre)
            }
            else if (comments.length > 10 ) {
                titre.textContent = `Nos 10 derniers commentaires`;
                check.appendChild(titre)
            }
        });
}


// creer commentaire
document.addEventListener('DOMContentLoaded', () => {
    fetch('/comments')
        .then(response => response.json())
        .then(comments => {
            const commentList = document.getElementById('comment-list');
            comments.forEach((commentData, index) => {
                const divCommentElement = document.createElement('div');
                divCommentElement.className = 'commentaire-container';

                const commentParagraph = document.createElement('div');
                commentParagraph.className = 'commentaire1';
                const commentElement = document.createElement('p');
                commentElement.innerHTML = `<i class="fa-solid fa-quote-left"></i> ${commentData.comment} <i class="fa-solid fa-quote-right"></i>`;
                commentParagraph.appendChild(commentElement);

                const commentImage = document.createElement('div');
                commentImage.className = 'image-commentaire';
                const image = document.createElement('img');
                image.src = "./images/commentaire.png";
                const authorName = document.createElement('h5');
                authorName.innerHTML = `<pre>  ${commentData.name} </pre>`;
                const authorTitle = document.createElement('h6');
                authorTitle.textContent = "Auteur";

                commentImage.appendChild(image);
                commentImage.appendChild(authorName);
                commentImage.appendChild(authorTitle);

                if (index % 2 === 0) {
                    // Index pair, image avant le commentaire
                    divCommentElement.appendChild(commentImage);
                    divCommentElement.appendChild(commentParagraph);
                } else {
                    // Index impair, image après le commentaire
                    divCommentElement.appendChild(commentParagraph);
                    divCommentElement.appendChild(commentImage);
                }
                commentList.appendChild(divCommentElement);
            });
        });

    document.getElementById('comment-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const nameInput = document.getElementById('name-input');
        const commentInput = document.getElementById('comment-input');
        const comment = commentInput.value;
        const name = nameInput.value;

        fetch('/add-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `comment=${encodeURIComponent(comment)}&name=${encodeURIComponent(name)}`,
        })
        .then(response => {
            if (response.ok) {
                nameInput.value = '';
                commentInput.value = '';
                location.reload();
            }
        });
    });
});



// ========================= Gestion couleur commentaire ============================

const couleur = document.getElementById('comment-list');
const commentTitle = document.getElementById("comment-title");
const suggestion = document.getElementById("suggestion");
if (couleur) {
    fetch('/comments')
        .then(response => response.json())
        .then(comments => {
            if (comments.length === 0) {
                couleur.style.backgroundColor = "inherit";
                commentTitle.style.display = "none";
                suggestion.style.display = "flex";
            }
        });
}

//============================================= formulaire =========================================
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut

    // Récupérer les données du formulaire
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Envoyer les données au serveur
    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.json().then(result => ({
            ok: response.ok,
            message: result.message
        }));
    })
    .then(({ ok, message }) => {
        // Afficher une alerte en fonction du résultat
        alert(message);

        if (ok) {
            document.getElementById('contactForm').reset();
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur s\'est produite. Veuillez réessayer.');
    });
});