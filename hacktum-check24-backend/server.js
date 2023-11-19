const express = require("express");
const app = express();
const cors = require("cors");

const {
  patchMappedCraftsman,
  getMappedPostcode,
  getCraftsmen,
  getPostcode,
  updateCraftsman,
  getMappedCraftsman,
} = require("./craftsmen-service");

app.use(express.json());
app.use(cors());

// server error handle
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    // 500 means Internal Server Error
    console.log("The server errored when processing a request!");
    console.log(err);
  }

  res.status(status);
  res.send({
    status: status,
    message: err.message,
  });
});

app.get("/craftsmen", async (req, res) => {
  const { postalcode } = req.query;
  const page = parseInt(req.query.page) || 1;
  const pageSize = 20;
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const postcodes = await getPostcode(postalcode);
  if (postcodes.rowCount == 0) {
    return res.send({
      message: "Invalid postal code",
    });
  }

  const craftsmen = await getCraftsmen(getMappedPostcode(postcodes.rows[0]));
  const paginatedCraftsmen = craftsmen.slice(startIndex, endIndex);
  const totalPages = Math.ceil(craftsmen.length / pageSize);

  return res.send({
    craftsmen: paginatedCraftsmen.map(getMappedCraftsman),
    totalPage: totalPages,
  });
});

app.patch("/craftman/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const { maxDrivingDistance, profilePictureScore, profileDescriptionScore } =
      req.body;

    if (
      !(maxDrivingDistance || profilePictureScore || profileDescriptionScore)
    ) {
      return res
        .status(400)
        .json({ error: "At least one attribute should be provided." });
    }

    const updatedCraftsman = await updateCraftsman(id, req.body);

    res.send({
      id: id,
      updated: patchMappedCraftsman(updatedCraftsman),
    });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// start the server
const port = process.env["SERVER_PORT"] || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
