console.log("JavaScript chargé");

// Sélectionner tous les éléments qui peuvent ouvrir la modale
const modalLinks = document.querySelectorAll('.open-modal');

// Sélectionner la modale et les éléments internes (titre, contenu, etc.)
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDetails = document.getElementById('modal-details');
const closeModal = document.querySelector('.close');

// Fonction pour ouvrir la modale
modalLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Récupérer les données de la tâche à partir de l'élément cliqué
        const taskId = this.getAttribute('data-task-id');
        const taskName = this.querySelector('h5').textContent;
        const taskXp = this.getAttribute('data-task-xp');
        const taskCategory = this.getAttribute('data-task-category');

        // Mettre à jour le contenu de la modale
        modalTitle.textContent = taskName;
        modalDetails.textContent = "Détails de la tâche pour ID : " + taskId + "XP:" + taskXp + ", Catégorie:" + taskCategory;

        // Afficher la modale
        modal.style.display = "block";
    });
});

// Fermer la modale en cliquant sur le bouton de fermeture
closeModal.addEventListener('click', function () {
    modal.style.display = "none";
});