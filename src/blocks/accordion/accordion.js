/* =========================================================
   Responsive FAQ Accordion
   Schmidtz Digital Studio
   ========================================================= */

// Get all FAQ question buttons
const faqQuestions = document.querySelectorAll(".accordion__question");

// Loop through each question
faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    // Find the FAQ item that belongs to this question
    const currentItem = question.closest(".accordion__item");

    // Check whether this item is already open
    const isOpen = currentItem.classList.contains("active");

    // Close every FAQ item first
    document.querySelectorAll(".accordion__item").forEach((item) => {
      item.classList.remove("active");

      const button = item.querySelector(".accordion__question");
      const icon = item.querySelector(".accordion__icon");

      button.setAttribute("aria-expanded", "false");
      // icon.textContent = "+";
    });

    // If the clicked item was closed, open it
    if (!isOpen) {
      currentItem.classList.add("active");

      question.setAttribute("aria-expanded", "true");

      const icon = question.querySelector(".accordion__icon");
      // icon.textContent = "−";
    }
  });
});
