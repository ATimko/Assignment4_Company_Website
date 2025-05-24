// Ashley Timko || controllers/project.js
const db = require('../dbConfig');

// Get all projects for the dropdown
// This function retrieves all projects from the database and sends them as a JSON response.
// It includes project name, location, number, department name, manager's first and last name,
// manager's start date, assigned employees count, total hours worked, allocation status, and project status.
const getAllProjects = (req, res) => {
    const query = `
        SELECT 
            P.Pname AS ProjectName,
            P.Plocation AS Location,
            P.Pnumber AS ProjectNumber,
            D.Dname AS DepartmentName,
            E.Fname AS ManagerFirstName,
            E.Lname AS ManagerLastName,
            D.Mgr_start_date AS ManagerStartDate,
            COUNT(DISTINCT W.Essn) AS AssignedEmployees,
            SUM(W.Hours) AS TotalHours,
            CASE
                WHEN SUM(W.Hours) >= 50 THEN 'Well Allocated'
                WHEN SUM(W.Hours) BETWEEN 1 AND 49 THEN 'Under Allocated'
                ELSE 'No Allocation'
                END AS AllocationStatus,
            CASE
                WHEN SUM(W.Hours) > 0 THEN 'In Progress'
                ELSE 'Not Started'
            END AS Status
        FROM PROJECT P
        JOIN DEPARTMENT D ON P.Dnum = D.Dnumber
        JOIN EMPLOYEE E ON D.Mgr_ssn = E.Ssn
        LEFT JOIN WORKS_ON W ON P.Pnumber = W.Pno
        GROUP BY 
            P.Pname, P.Plocation, P.Pnumber, 
            D.Dname, D.Mgr_start_date, 
            E.Fname, E.Lname
        ORDER BY TotalHours DESC;
    `;
    // Execute the query to fetch project data
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching projects:', err);
            res.status(500).send({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
};
// Export the function to be used in other parts of the application
module.exports = {
    getAllProjects,
};