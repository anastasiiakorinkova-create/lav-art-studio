document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let isValid = true;

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");
            const course = document.getElementById("course");
            const message = document.getElementById("message");
            const source = document.getElementById("source");
            const terms = document.getElementById("terms");
            const preferredContact = document.querySelector('input[name="preferredContact"]:checked');

            clearErrors();

            if (name.value.trim().length < 2) {
                setError(name, "nameError", "Please enter at least 2 characters");
                isValid = false;
            }

            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
            if (!emailPattern.test(email.value.trim())) {
                setError(email, "emailError", "Please enter a valid email");
                isValid = false;
            }

            const phonePattern = /^[0-9+\s]{7,}$/;
            if (!phonePattern.test(phone.value.trim())) {
                setError(phone, "phoneError", "Please enter a valid phone number");
                isValid = false;
            }

            if (course.value === "") {
                setError(course, "courseError", "Please select a course");
                isValid = false;
            }

            if (message.value.trim().length < 10) {
                setError(message, "messageError", "Message must be at least 10 characters");
                isValid = false;
            }

            if (!preferredContact) {
                document.getElementById("preferredContactError").textContent = "Please choose a contact method";
                isValid = false;
            }

            if (source.value === "") {
                setError(source, "sourceError", "Please select an option");
                isValid = false;
            }

            if (!terms.checked) {
                document.getElementById("termsError").textContent = "You must agree to the terms";
                isValid = false;
            }

            if (isValid) {
                document.getElementById("successMessage").textContent = "Form submitted successfully!";
                form.reset();
            }
        });
    }

    const tableBody = document.getElementById("coursesTableBody");

    if (tableBody) {
        fetch("data/courses.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Courses data could not be loaded.");
                }

                return response.json();
            })
            .then(data => {
                data.studio.programs.forEach(program => {
                    program.courses.forEach(course => {
                        const row = document.createElement("tr");

                        row.innerHTML = `
                            <td>${course.title}</td>
                            <td>${course.level}</td>
                            <td>${course.duration.weeks} weeks / ${course.duration.lessons} lessons</td>
                            <td>${course.teacher.name}</td>
                            <td>${course.price} €</td>
                        `;

                        tableBody.appendChild(row);
                    });
                });
            })
            .catch(() => {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="ajax-error">
                            Courses could not be loaded. Please run the project using a local server, for example VS Code Live Server or python -m http.server.
                        </td>
                    </tr>
                `;
            });
    }

    function setError(input, errorId, message) {
        input.classList.add("input-error");
        document.getElementById(errorId).textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll(".error-message").forEach(error => {
            error.textContent = "";
        });

        document.querySelectorAll("input, select, textarea").forEach(input => {
            input.classList.remove("input-error");
        });

        document.getElementById("successMessage").textContent = "";
    }
});