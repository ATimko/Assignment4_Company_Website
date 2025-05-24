// Ashley Timko || controllers/worksOn.js
const db = require('../dbConfig');

// Hours Worked Analysis: total hours per employee
// This function retrieves the total hours worked by each employee across all projects.
const getHoursWorked = (req, res) => {
    const query = `
    SELECT e.Ssn, CONCAT(e.Fname, ' ', e.Lname) AS EmployeeName, SUM(w.Hours) AS TotalHours
    FROM EMPLOYEE e
    JOIN WORKS_ON w ON e.Ssn = w.Essn
    GROUP BY e.Ssn
    ORDER BY TotalHours DESC
  `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Project Participation Metrics: projects worked on by each employee (only those with more than 1 project)
// This function retrieves the number of projects each employee has worked on,
// filtering to show only those with more than one project.
const getProjectParticipation = (req, res) => {
    const query = `
    SELECT e.Ssn, CONCAT(e.Fname, ' ', e.Lname) AS EmployeeName, COUNT(DISTINCT w.Pno) AS ProjectsCount
    FROM EMPLOYEE e
    JOIN WORKS_ON w ON e.Ssn = w.Essn
    GROUP BY e.Ssn
    HAVING ProjectsCount > 1
    ORDER BY ProjectsCount DESC
  `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Employee Workload Distribution: hours worked per project for each employee
// This function retrieves the distribution of hours worked by each employee across different projects.
const getWorkloadDistribution = (req, res) => {
    const query = `
    SELECT e.Ssn, CONCAT(e.Fname, ' ', e.Lname) AS EmployeeName, p.Pname AS Project, w.Hours
    FROM EMPLOYEE e
    JOIN WORKS_ON w ON e.Ssn = w.Essn
    JOIN PROJECT p ON w.Pno = p.Pnumber
    ORDER BY EmployeeName, Project
  `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Cross-Department Collaboration: employees working on projects outside their department
// This function retrieves employees who are working on projects in departments different from their own.
const getCrossDepartmentCollaboration = (req, res) => {
    const query = `
    SELECT DISTINCT 
      CONCAT(e.Fname, ' ', e.Lname) AS EmployeeName,
      d1.Dname AS EmployeeDept,
      p.Pname AS Project,
      d2.Dname AS ProjectDept
    FROM EMPLOYEE e
    JOIN DEPARTMENT d1 ON e.Dno = d1.Dnumber
    JOIN WORKS_ON w ON e.Ssn = w.Essn
    JOIN PROJECT p ON w.Pno = p.Pnumber
    JOIN DEPARTMENT d2 ON p.Dnum = d2.Dnumber
    WHERE d1.Dnumber <> d2.Dnumber
    ORDER BY EmployeeName
  `;
  // Execute the query to fetch cross-department collaboration data
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
// Export the functions to be used in other parts of the application
module.exports = {
    getHoursWorked,
    getProjectParticipation,
    getWorkloadDistribution,
    getCrossDepartmentCollaboration,
};
