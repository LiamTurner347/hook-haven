import express from "express";

import { pgQuery } from "../db/models/postgresModel";
import Body from "../db/models/mongoModel";

const requestRouter = express.Router();

requestRouter.all("/:id", async (req, res) => {
  const uuid = req.params.id;
  try {
    //extract requst data
    const body = JSON.stringify(req.body);
    const headers = req.headers;
    const method = req.method;

    // save body to mongo
    const newBody = new Body({ body });
    const savedBody = await newBody.save();

    // insert request data to postgres
    const result = await pgQuery(
      `INSERT INTO request (bucket_id, method, headers, url_path, mongo_id)
        SELECT
          (SELECT id FROM bucket WHERE uuid = $1),
          $2,
          $3,
          $4,
          $5
        WHERE EXISTS (SELECT 1 FROM bucket WHERE uuid = $1);`, // checks that uuid stored in the db before insert attempted
      [uuid, method, headers, req.originalUrl, savedBody._id.toString()]
    );

    // if request table updated return 200
    if (result && result.rowCount && result.rowCount > 0) {
      res.status(200).send();
      return;
    } else {
      // respond with 404 when uuid cannot find valid bucket in Postgres
      res.status(404).json({ error: "Bucket not found" });
      return;
    }
  } catch (e: unknown) {
    console.log(e);

    res.status(500).json({
      error: "An error occurred",
      details: e instanceof Error ? e.message : String(e),
    });
  }
});

export default requestRouter;
