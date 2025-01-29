document.addEventListener("DOMContentLoaded", function () {
    const profileCard = document.querySelector(".profile-card");

    profileCard.style.opacity = "0";
    profileCard.style.transform = "translateY(-20px)";

    setTimeout(() => {
        profileCard.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        profileCard.style.opacity = "1";
        profileCard.style.transform = "translateY(0)";
    }, 300);
});