import express from "express";

const app = express();

// Set static folder
app.use(express.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Handle GER requests to fetch users
app.get("/users", async (req, res) => {
  const limit = +req.query.limit || 10;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?_limit=${limit}`,
  );
  const users = await response.json();

  res.send(`
  <h1 class="text-2xl font-bold my-4">Users</h1>
  <ul>
      ${users.map((user) => `<li>${user.name}</li>`).join("")}
</ul>
	`);
});

// Handle POST request for temp conversion
app.post("/convert", (req, res) => {
  setTimeout(() => {
    const { temp } = req.body;
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celsius = (fahrenheit - 32) * (5 / 9);
    res.send(`
    <p>${fahrenheit}°F is equal to ${celsius.toFixed(2)}°C</p>
    `);
  }, 2000);
});

let counter = 0;

// Handle GET request for polling example
app.get("/poll", (req, res) => {
  counter++;
  const data = { value: counter };

  res.json(data);
});

let currentTemp = 20;

// Handle GET request for weather
app.get("/get-temperature", (req, res) => {
  currentTemp += Math.random() * 2 - 1; // Randomly increase or decrease temperature

  res.send(`${currentTemp.toFixed(1)}°C`);
});

const contacts = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Doe", email: "jane@example.com" },
  { name: "Alice Smith", email: "alice@example.com" },
  { name: "Bob Williams", email: "bob@example.com" },
  { name: "Mary Harris", email: "mary@example.com" },
  { name: "David Mitchell", email: "david@example.com" },
];

// Handle POST request for contacts search
app.post("/search", (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.json(`<tr></tr>`);
  }

  const filteredContacts = contacts.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm)
    );
  });

  setTimeout(() => {
    const searchResultHtml = filteredContacts
      .map(
        (contact) => `
			<tr>
				<td class="my-4 p-2">${contact.name}</td>
				<td class="my-4 p-2">${contact.email}</td>
			</tr>
		`,
      )
      .join("");

    res.send(searchResultHtml);
  }, 1000);
});

// Handle POST request for contacts search from jsonplaceholder
app.post("/search/api", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.json(`<tr></tr>`);
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);

  const resContacts = await response.json();

  const filteredContacts = resContacts.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm)
    );
  });

  setTimeout(() => {
    const searchResultHtml = filteredContacts
      .map(
        (contact) => `
			<tr>
				<td class="my-4 p-2">${contact.name}</td>
				<td class="my-4 p-2">${contact.email}</td>
			</tr>
		`,
      )
      .join("");

    res.send(searchResultHtml);
  }, 1000);
});

// Handle POST request for email validation
app.post("/contact/email", (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: "That email is valid",
    class: "text-green-700",
  };

  const isInvalid = {
    message: "That email is invalid",
    class: "text-red-700",
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
        >Email Address</label
      >
      <input
        name="email"
        hx-post="/contact/email"
        class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        type="email"
        id="email"
        value="${submittedEmail}"
        required
      />
      <div class="${isInvalid.class}">${isInvalid.message}</div>
    </div>
      `,
    );
  } else {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
        >Email Address</label
      >
      <input
        name="email"
        hx-post="/contact/email"
        class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        type="email"
        id="email"
        value="${submittedEmail}"
        required
      />
      <div class="${isValid.class}">${isValid.message}</div>
    </div>
      `,
    );
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
