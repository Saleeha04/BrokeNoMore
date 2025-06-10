
    const editPicBtn = document.getElementById('editPicBtn');
    const fileInput = document.getElementById('fileInput');
    const profileImage = document.getElementById('profileImage');

    editPicBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

