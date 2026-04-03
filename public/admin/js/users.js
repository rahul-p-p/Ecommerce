const BASE_URL = "http://localhost:3000/api/admin";

const table = document.getElementById("userTable");

async function fetchUsers() {
  try {
    const res = await fetch(`${BASE_URL}/users`);
    const users = await res.json();

    table.innerHTML = "";

    users.forEach(user => {
      table.innerHTML += `
        <tr>
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error fetching users:", err);
  }
}

async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE"
  });

  fetchUsers(); // refresh
}

fetchUsers();