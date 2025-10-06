// client/script.js
const API_URL = 'http://localhost:3000/api';

const employeeForm = document.getElementById('employee-form');
const employeeTableBody = document.getElementById('employee-table-body');

async function fetchAndRenderEmployees() {
  try {
    const response = await fetch(`${API_URL}/employees`);
    const { data } = await response.json();

    employeeTableBody.innerHTML = ''; // Clear the table

    data.forEach(employee => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.email}</td>
        <td>${employee.position}</td>
        <td class="actions">
          <button class="edit-btn" data-id="${employee.id}">Edit</button>
          <button class="delete-btn" data-id="${employee.id}">Delete</button>
        </td>
      `;
      employeeTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
}
// 2. Handle form submission for creating/updating employees
employeeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get values from the form
  const name = document.getElementById('name-input').value;
  const email = document.getElementById('email-input').value;
  const position = document.getElementById('position-input').value;
  const employeeId = document.getElementById('employee-id').value;

  // Package the data
  const employeeData = { name, email, position };

  let response;
  if (employeeId) {
   
    // This is the block you asked for
    response = await fetch(`${API_URL}/employees/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

  } else {
    // --- CREATE (POST Request) ---
    response = await fetch(`${API_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
  }

  // Handle the response
  if (response.ok) {
    employeeForm.reset();
    document.getElementById('employee-id').value = ''; 
    fetchAndRenderEmployees();
  } else {
    console.error('Failed to save employee');
  }
});

// 3. Handle deleting an employee
employeeTableBody.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const employeeId = e.target.dataset.id;
    await fetch(`${API_URL}/employees/${employeeId}`, {
      method: 'DELETE',
    });
    fetchAndRenderEmployees(); 
  }

  // --- HANDLE EDIT ---
  if (e.target.classList.contains('edit-btn')) {
    const employeeId = e.target.dataset.id;
    
    // Find the table row that was clicked
    const row = e.target.closest('tr');
    const name = row.cells[0].textContent;
    const email = row.cells[1].textContent;
    const position = row.cells[2].textContent;

    // Populate the form with the employee's data
    document.getElementById('name-input').value = name;
    document.getElementById('email-input').value = email;
    document.getElementById('position-input').value = position;
    
    document.getElementById('employee-id').value = employeeId;
  }
});

fetchAndRenderEmployees();