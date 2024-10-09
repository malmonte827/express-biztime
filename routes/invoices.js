const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");
const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({ invocies: [results.rows] });
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [
            id,
        ]);
        return res.json(results.rows);
    } catch (err) {
        return next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { code_comp, amt } = req.body;
        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`,
            [code_comp, amt]
        );
        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice ${id} not found`, 404);
        }
        return res.json(results.rows);
    } catch (err) {
        return next(err);
    }
});

router.patch(`/:id`, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt, paid } = req.body;
        let paidDate = null;
        const currResults = await db.query(
            `SELECT * FROM invoices WHERE id=$1`,
            [id]
        );
        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice ${id} not found`, 404);
        }

        const currPaidDate = currResults.rows[0].paid_date;

        if (!currPaidDate && paid) {
            paidDate = new Date();
        } else if (!paid) {
            paidDate = null;
        } else {
            paidDate = currPaidDate;
        }

        const results = await db.query(
            `UPDATE invoices SET amt=$1, paid=$2, paidDate=$3 WHERE id=$4 RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, paid, paidDate, id]
        );
        return res.json(results.rows);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`DELETE invoices WHERE id=$1`, [id]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice ${id} not Found`, 404);
        }
        return res.send({ msg: DELETED });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
