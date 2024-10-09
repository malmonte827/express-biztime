const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const slugify = require("slugify")

router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json(results.rows);
    } catch (err) {
        return next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const code = slugify(name, {lower: true})
        const results = await db.query(
            `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`,
            [code, name, description]
        );
        return res.json(results.rows)
    } catch (err) {
        return next(err);
    }
});

router.patch("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const results = await db.query(
            `UPDATE companies SET name=$1, description=$2 WHERE id=$3 RETURNING *`,
            [name, description, id]
        );
        if (results.rows.length === 0) {
            throw new ExpressError(`Company ${id} not found`, 404);
        }
        return res.json(results.rows);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`DELETE FROM companies WHERE id=$1`, [
            id,]);
            if(results.rows.length===0){
                throw new ExpressError(`Company ${id} not found`, 404)
            }
        return res.send({ status: `deleted` });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
