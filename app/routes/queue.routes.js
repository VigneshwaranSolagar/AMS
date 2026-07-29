const express = require("express");

const router = express.Router();

const authenticate =
    require("../middleware/auth.middleware");

const queueModel =
    require("../models/queue.model");

/* ===================================
   Queue Statistics
=================================== */

router.get(
    "/statistics",
    authenticate,
    async (req, res) => {

        try {

            const statistics =
                await queueModel.getStatistics();

            res.json({

                success: true,

                data: statistics

            });

        }

        catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);

/* ===================================
   Queue Details
=================================== */

router.get(
    "/:id",
    authenticate,
    async (req, res) => {

        try {

            const job =
                await queueModel.getById(
                    req.params.id
                );

            if (!job) {

                return res.status(404).json({

                    success: false,

                    message: "Queue item not found."

                });

            }

            res.json({

                success: true,

                data: job

            });

        }

        catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);

/* ===================================
   Queue List
=================================== */

router.get(
    "/",
    authenticate,
    async (req, res) => {

        try {

            const jobs =
                await queueModel.getAll();

            res.json({

                success: true,

                total: jobs.length,

                data: jobs

            });

        }

        catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);

module.exports = router;