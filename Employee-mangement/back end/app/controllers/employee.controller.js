const pool = require("../config/db.config");


function formatEmployee(emp) {
  if (!emp) return null;
  const empId = emp.employee_id;

  return {
    employee_id: empId,
    id: empId,
    employeeId: empId,
    full_name: emp.full_name || "",
    fullName: emp.full_name || "",
    name: emp.full_name || "",
    email: emp.email || "",
    department: emp.department || "",
    designation: emp.designation || "",
    status: emp.status || "Active"
  };
}

function parseEmployeeId(val) {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  }
  const match = str.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  return null;
}

exports.getEmployees = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = "SELECT * FROM employee";
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(
        `(full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR department ILIKE $${paramIndex} OR designation ILIKE $${paramIndex})`
      );
      values.push(`%${search.trim()}%`);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status ILIKE $${paramIndex}`);
      values.push(status.trim());
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY employee_id ASC";

    const result = await pool.query(query, values);
    const employees = result.rows.map(formatEmployee);

    return res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching employees"
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const rawId = req.params.id;
    const employeeId = parseEmployeeId(rawId);

    if (employeeId === null) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with id: ${rawId}`
      });
    }

    const query = "SELECT * FROM employee WHERE employee_id = $1 LIMIT 1;";
    const result = await pool.query(query, [employeeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with id: ${rawId}`
      });
    }

    return res.status(200).json(formatEmployee(result.rows[0]));
  } catch (err) {
    console.error("Error fetching employee by ID:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching employee"
    });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const fullName =
      req.body.full_name || "";

    const email = req.body.email || "";
    const department = req.body.department || "";
    const designation = req.body.designation || "";
    const status = req.body.status || "Active";

    // Validations
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required"
      });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (!department || typeof department !== "string" || !department.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department is required"
      });
    }

    if (!designation || typeof designation !== "string" || !designation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Designation is required"
      });
    }

    const normalizedStatus =
      status && String(status).toLowerCase() === "inactive" ? "Inactive" : "Active";

    // Check duplicate email
    const duplicateEmailCheck = await pool.query(
      "SELECT employee_id FROM employee WHERE LOWER(email) = LOWER($1) LIMIT 1;",
      [email.trim()]
    );
    if (duplicateEmailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Employee with email "${email.trim()}" already exists.`
      });
    }

    const insertQuery = `
      INSERT INTO employee (full_name, email, department, designation, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const queryParams = [
      fullName.trim(),
      email.trim().toLowerCase(),
      department.trim(),
      designation.trim(),
      normalizedStatus
    ];

    const result = await pool.query(insertQuery, queryParams);
    const createdEmployee = formatEmployee(result.rows[0]);
    return res.status(201).json(createdEmployee);
  } catch (err) {
    console.error("Error creating employee:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating employee"
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const rawId = req.params.id;
    const employeeId = parseEmployeeId(rawId);

    if (employeeId === null) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID "${rawId}" was not found.`
      });
    }

    // Check existence
    const existing = await pool.query(
      "SELECT * FROM employee WHERE employee_id = $1 LIMIT 1;",
      [employeeId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID "${rawId}" was not found.`
      });
    }

    const current = existing.rows[0];

    const fullName = req.body.full_name || ''
    const email = req.body.email || ''
    const department = req.body.department || ''
    const designation = req.body.designation || ''
    const status = req.body.status || 'Active'

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check duplicate email with another record
    if (email.trim().toLowerCase() !== current.email.toLowerCase()) {
      const duplicateEmailCheck = await pool.query(
        "SELECT employee_id FROM employee WHERE LOWER(email) = LOWER($1) AND employee_id != $2 LIMIT 1;",
        [email.trim(), current.employee_id]
      );
      if (duplicateEmailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Another employee with email "${email.trim()}" already exists.`
        });
      }
    }

    const normalizedStatus =
      status && String(status).toLowerCase() === "inactive" ? "Inactive" : "Active";

    const updateQuery = `
      UPDATE employee
      SET full_name = $1, email = $2, department = $3, designation = $4, status = $5
      WHERE employee_id = $6
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [
      fullName.trim(),
      email.trim().toLowerCase(),
      department.trim(),
      designation.trim(),
      normalizedStatus,
      current.employee_id
    ]);

    const updatedEmployee = formatEmployee(result.rows[0]);
    return res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error("Error updating employee:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating employee"
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const rawId = req.params.id;
    const employeeId = parseEmployeeId(rawId);

    if (employeeId === null) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID "${rawId}" was not found.`
      });
    }

    const existing = await pool.query(
      "SELECT * FROM employee WHERE employee_id = $1 LIMIT 1;",
      [employeeId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID "${rawId}" was not found.`
      });
    }

    await pool.query("DELETE FROM employee WHERE employee_id = $1;", [employeeId]);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      id: employeeId,
      employee_id: employeeId
    });
  } catch (err) {
    console.error("Error deleting employee:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting employee"
    });
  }
};
