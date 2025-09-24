
    const API_KEY = "c14dc466c5e5446d917f730672254155";

    const modal = document.getElementById("recipeModal");
    const modalBody = document.getElementById("modalBody");
    const closeModal = document.getElementById("closeModal");
    const feedbackPopup = document.getElementById("feedbackPopup");

    closeModal.onclick = () => {
      modal.style.display = "none";
      feedbackPopup.style.display = "block"; // show rating popup after closing modal
    };

    window.onclick = (e) => { 
      if (e.target == modal) {
        modal.style.display = "none";
        feedbackPopup.style.display = "block";
      }
    };

    // Search Recipes
    document.getElementById("searchBtn").addEventListener("click", async () => {
      const input = document.getElementById("ingredientsInput").value.trim();
      const resultsSection = document.getElementById("searchResults");
      const grid = document.getElementById("recipesGrid");

      if (!input) return alert("Enter some ingredients!");

      const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(input)}&number=6&apiKey=${API_KEY}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        resultsSection.style.display = "block";
        grid.innerHTML = "";

        for (let recipe of data) {
          const card = document.createElement("div");
          card.className = "recipe";
          card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button class="btn viewBtn" data-id="${recipe.id}">View Recipe</button>
          `;
          grid.appendChild(card);
        }

        // Attach event listeners to "View Recipe" buttons
        document.querySelectorAll(".viewBtn").forEach(btn => {
          btn.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            const detailsRes = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
            const details = await detailsRes.json();

            let ingredientsList = details.extendedIngredients.map(i => `<li>${i.original}</li>`).join("");

            modalBody.innerHTML = `
              <h2>${details.title}</h2>
              <img src="${details.image}" alt="${details.title}">
              <p>⏱ ${details.readyInMinutes} min • 🍽 ${details.servings} servings</p>
              <h3>Ingredients</h3>
              <ul>${ingredientsList}</ul>
            `;

            modal.style.display = "flex";
          });
        });
      } catch (err) {
        alert("Error fetching recipes. Please try again.");
      }
    });

    // Rating popup stars
    document.querySelectorAll("#feedbackPopup .stars span").forEach(star => {
      star.addEventListener("click", () => {
        document.querySelectorAll("#feedbackPopup .stars span").forEach(s => s.classList.remove("active"));
        star.classList.add("active");
        setTimeout(() => feedbackPopup.style.display = "none", 800); // auto-hide after rating
      });
    });
  