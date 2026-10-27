import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: "Category parameter is required" });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "data.json");
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (category.toLowerCase() === "all") {
      return res.status(200).json(jsonData);
    }
    const categoriesArray = category
      .split(",")
      .map((cat) => cat.trim().toLowerCase());

    const filteredData = jsonData.filter((item) => {
      const itemCategories = item.category
        .split(",")
        .map((cat) => cat.trim().toLowerCase());

      return categoriesArray.some((cat) => itemCategories.includes(cat));
    });

    if (filteredData.length === 0) {
      return res
        .status(404)
        .json({ error: `No data found for categories: ${category}` });
    }

    return res.status(200).json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
