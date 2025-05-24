// Ashley Timko || controllers/department.js
const db = require('../dbConfig');

// This function retrieves all departments from the database and sends them as a JSON response.
// It includes department number and name.
const getAllDepartments = (req, res) => {
    const query = 'SELECT Dnumber, Dname FROM DEPARTMENT';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err);
            res.status(500).send({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
};

// Get detailed information about a specific department
// including employee count, average salary, total salary, and project count
const getDepartmentDetails = (req, res) => {
    const { Dnumber } = req.query;
    const query = `
        SELECT 
            D.Dname AS DepartmentName,
            COUNT(E.SSN) AS EmployeeCount,
            AVG(E.Salary) AS AvgSalary,
            SUM(E.Salary) AS TotalSalary,
            COUNT(DISTINCT P.Pnumber) AS ProjectCount
        FROM DEPARTMENT D
        LEFT JOIN EMPLOYEE E ON D.Dnumber = E.Dno
        LEFT JOIN PROJECT P ON D.Dnumber = P.Dnum
        WHERE D.Dnumber = ?
        GROUP BY D.Dname
    `;
    // Validate input
    db.query(query, [Dnumber], (err, results) => {
        if (err) {
            console.error('Error fetching department details:', err);
            res.status(500).send({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
};
// Export the functions to be used in other parts of the application
// This allows the functions to be imported in server.js or other modules.
module.exports = {
    getAllDepartments,
    getDepartmentDetails,
};