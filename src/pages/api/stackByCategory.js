import projects from "../../../public/stackdata.json";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const matchingProjects = projects.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );

    if (matchingProjects.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const imageUrls = matchingProjects.map((item) => item.imageUrl);

    return res.status(200).json({ imageUrls });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
