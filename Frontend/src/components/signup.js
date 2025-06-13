document.querySelector('.signup-form').addEventListener('submit',(e)=>{
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirm-password').value.trim();

    if (username.length < 3) {
        alert("Username should be at least 3 letters.");
        return;
    }

    if (email.length < 5) {
        alert("Please enter a valid email.");
        return;
    }

    if (password.length < 5) {
        alert("Password should be at least 5 letters.");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    // Now we can check if email is already registered
    fetch('/check-email?email=' + encodeURIComponent(email))
      .then((res) => res.json()) 
      .then((data) => {
        if (data.exists) {
          alert("This email is already registered.");
        } else {
          // If not, proceed to submit
          fetch('/signup', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
          })
            .then((res) => res.json()) 
            .then((result) => {
              if (result.success) {
                alert("Signup successful!");
                window.location.href = "/login.html";
              } else {
                alert("Signup failed.");
              }
            })
            .catch((err) => console.error(err));

        }
      })
      .catch((err) => console.error(err));

});

/*// Signup route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (password.length < 5) {
    return res.json({ success: false, error: "Password is too short!" });
  }

  // Check if email already exists
 	const existing = await User.findOne({ email });
  if (existing) {
    return res.json({ success: false, error: "Email already registered!" });
  }

  // Hash password and save
 	const hashed = await bcrypt.hash(password, 10);
 	const newUser = new User({ username, email, password: hashed });
 	await newUser.save();

  res.json({ success: true });
});

// Check if email already exists
app.get('/check-email', async (req, res) => {
  const email = req.query.email;

  if (!email) return res.json({ exists: false });

  const existing = await User.findOne({ email });
  res.json({ exists: !!existing });
});
*/ 