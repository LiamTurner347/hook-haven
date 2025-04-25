import express from "express";

import { pgQuery } from "../db/models/postgresModel";
import Body from "../db/models/mongoModel";

import { genId } from "../utils/utils";

const webRouter = express.Router();

webRouter.post("", async (req, res) => {
  try {
    let attempts = 3;

    while (attempts > 0) {
      const id = genId();

      const result = await pgQuery(
        `
        INSERT INTO bucket (uuid)
        VALUES ($1)
        ON CONFLICT (uuid) DO NOTHING
        RETURNING uuid;
          `,
        [id]
      );

      if (!result || result.rowCount === 0) {
        attempts--;
        continue;
      }

      // Respond with new UUID
      res.json(result.rows[0].uuid);
      return;
    }
    res.status(500).send();
    return;
  } catch (e: unknown) {
    console.log(e);
    res.status(500).send();
  }
});

webRouter.get("/:id", async (req, res) => {
  const uuid = req.params.id;
  try {
    const queryResult = await pgQuery(
      `SELECT
          *
       FROM
          bucket
       JOIN
          request ON bucket.id = request.bucket_id
       WHERE
          bucket.uuid = $1
       ORDER BY
          request.request_time DESC;`,
      [uuid]
    );

    if (!queryResult) {
      res.status(404).send();
      return;
    }
    // get all mongo ids
    const mongoIds = queryResult.rows.map((row) => row["mongo_id"]);

    // query mongodb for body documents
    const bodyDocuments = await Body.find({ _id: { $in: mongoIds } });

    // reconcile mongo data with postgres data
    const requests = [];
    for (let i = 0; i < queryResult.rows.length; i++) {
      let current = queryResult.rows[i];
      let currentBody = bodyDocuments.find((b) => b.id === current["mongo_id"]);
      requests.push({
        id: current["id"],
        url: current["url"],
        method: current["method"],
        requestTime: current["request_time"],
        headers: JSON.stringify(current["headers"]),
        body: currentBody ? currentBody.body : "{}",
      });
    }

    res.json(requests);
  } catch (e: unknown) {
    res.status(500).send();
    return;
  }
});

export default webRouter;
