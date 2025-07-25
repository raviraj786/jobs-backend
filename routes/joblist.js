const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/jobs", async (req, res) => {
  try {
    const {
      jobtitle,
      company,
      location,
      salary,
      experience,
      jobType,
      jobProfile,
      qualification,
      skils,
      category,
      level,
      jobMode,
      industry,
      description,
      isActive,
    } = req.body;

    const job = await prisma.job.create({
      data: {
        jobtitle,
        company,
        location,
        salary,
        experience,
        jobType,
        jobProfile,
        qualification,
        skils,
        category,
        level,
        jobMode,
        industry,
        description,
        isActive,
      },
    });
    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error("Job creation error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});












router.get("/jobs", async (req, res) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const currentPage = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (currentPage - 1) * pageSize;

    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: pageSize,
        orderBy: {
          datePost: "desc",
        },
      }),
      prisma.job.count(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully.",
      currentPage,
      totalPages: Math.ceil(totalJobs / pageSize),
      totalJobs,
      jobs,
    });
  } catch (error) {
    console.error("GET /jobs Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});










router.get("/jobs/search", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { title = "", location = "" } = req.query;

  try {
    const whereClause = {
      AND: [
        title
          ? {
            OR: [
              { jobtitle: { contains: title, mode: "insensitive" } },
              { jobtitle: { startsWith: title, mode: "insensitive" } },
            ],
          }
          : {},
        location
          ? {
            OR: [
              { location: { contains: location, mode: "insensitive" } },
              { location: { startsWith: location, mode: "insensitive" } },
            ],
          }
          : {},
      ],
    };

    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: { datePost: "desc" },
      }),
      prisma.job.count({ where: whereClause }),
    ]);
    const totalpage = Math.ceil(totalJobs / limit);
    res.json({
      success: true,
      currentPage: page,
      totalpage,
      totalJobs,
      jobs,
    });
  } catch (error) {
    console.error("Search API error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while searching jobs.",
      error: error.message,
    });
  }
});




function extractNumericSalary(salaryStr) {
  if (!salaryStr) return 0;
  const nums = salaryStr.match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  return parseInt(nums[0], 10) * (salaryStr.includes("LPA") ? 100000 : 1);
}

router.get("/jobs/filter", async (req, res) => {
  try {
    const {
      location = "",
      jobType = "",
      category = "",
      jobLevel = "",
      salary = "0",
      page = 1,
      limit = 10,
    } = req.query;
    const categories = category.split(",");
    const levels = jobLevel.split(",");
    const types = jobType.split(",");
    const allJobs = await prisma.job.findMany({
      where: {
        OR: [
          {
            location: {
              contains: location,
              mode: "insensitive",
            },
          },
          {
            jobType: {
              in: types.length > 0 ? types : undefined,
              mode: "insensitive",
            },
          },
          {
            level: {
              in: levels.length > 0 ? levels : undefined,
              mode: "insensitive",
            },
          },
          {
            category: {
              in: categories.length > 0 ? categories : undefined,
              mode: "insensitive",
            },
          },
        ],
        isActive: true,
      },
      orderBy: {
        datePost: "desc",
      },
    });
    const filteredJobs = allJobs.filter((job) => {
      const num = extractNumericSalary(job.salary);
      return num >= parseInt(salary);
    });
    const start = (page - 1) * limit;
    const paginated = filteredJobs.slice(start, start + parseInt(limit));
    console.log(paginated)
    res.status(200).json({
      total: filteredJobs.length,
      page: Number(page),
      jobs: paginated,
    });
  } catch (err) {
    console.error("Job filter error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
