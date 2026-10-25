/* =========================================================
   Responsive FAQ Accordion
   Schmidtz Digital Studio
   ========================================================= */

// Get all FAQ question buttons

const accordions = document.querySelectorAll(".accordion__list");

accordions.forEach((accordion) => {
	const faqQuestions = accordion.querySelectorAll(".accordion__question");

	faqQuestions.forEach((question) => {
		question.addEventListener("click", () => {
			const currentItem = question.closest(".accordion__item");
			const isOpen = currentItem.classList.contains("active");

			// Close items only within the current accordion
			accordion.querySelectorAll(".accordion__item").forEach((item) => {
				item.classList.remove("active");

				const button = item.querySelector(".accordion__question");
				button.setAttribute("aria-expanded", "false");
			});

			// Open clicked item if it was closed
			if (!isOpen) {
				currentItem.classList.add("active");
				question.setAttribute("aria-expanded", "true");
			}
		});
	});
});

