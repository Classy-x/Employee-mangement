const express = require("express");
const employee = require("../controllers/employee.controller");

module.exports = (app) => {
  const router = express.Router();

  router.get("/employee", employee.getEmployees);

  router.get("/employee/:id", employee.getEmployeeById);

  router.post("/employee", employee.createEmployee);

  router.put("/employee/:id", employee.updateEmployee);

  router.delete("/employee/:id", employee.deleteEmployee);

  app.use("/api", router);
};
