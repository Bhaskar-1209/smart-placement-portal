const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");

dotenv.config();

const companies = [
  {
    name: "Aarav Mehta",
    email: "company.tcs@spp.demo",
    password: "Company@123",
    companyName: "TCS Digital",
    website: "https://www.tcs.com",
    location: "Mumbai",
    industry: "Information Technology",
    contactPhone: "9000001001",
    jobs: [
      {
        title: "Full Stack Developer",
        package: 8,
        location: "Mumbai",
        requiredSkills: ["React", "Node.js", "MongoDB"],
        minCgpa: 7,
      },
      {
        title: "Cloud Support Engineer",
        package: 6.5,
        location: "Pune",
        requiredSkills: ["Linux", "AWS", "Networking"],
        minCgpa: 6.5,
      },
    ],
  },
  {
    name: "Neha Sharma",
    email: "company.infosys@spp.demo",
    password: "Company@123",
    companyName: "Infosys Campus",
    website: "https://www.infosys.com",
    location: "Bengaluru",
    industry: "Consulting and IT Services",
    contactPhone: "9000001002",
    jobs: [
      {
        title: "Systems Engineer",
        package: 5.5,
        location: "Bengaluru",
        requiredSkills: ["Java", "SQL", "Problem Solving"],
        minCgpa: 6,
      },
      {
        title: "Frontend Intern",
        package: 3,
        location: "Remote",
        jobType: "Internship",
        requiredSkills: ["HTML", "CSS", "React"],
        minCgpa: 6,
      },
    ],
  },
  {
    name: "Rohan Gupta",
    email: "company.wipro@spp.demo",
    password: "Company@123",
    companyName: "Wipro Next",
    website: "https://www.wipro.com",
    location: "Hyderabad",
    industry: "Technology Services",
    contactPhone: "9000001003",
    jobs: [
      {
        title: "Backend Developer",
        package: 7.2,
        location: "Hyderabad",
        requiredSkills: ["Node.js", "Express", "MongoDB"],
        minCgpa: 6.8,
      },
      {
        title: "QA Automation Engineer",
        package: 5.8,
        location: "Chennai",
        requiredSkills: ["Selenium", "JavaScript", "Testing"],
        minCgpa: 6.2,
      },
    ],
  },
  {
    name: "Priya Nair",
    email: "company.accenture@spp.demo",
    password: "Company@123",
    companyName: "Accenture India",
    website: "https://www.accenture.com",
    location: "Gurugram",
    industry: "Professional Services",
    contactPhone: "9000001004",
    jobs: [
      {
        title: "Associate Software Engineer",
        package: 6.8,
        location: "Gurugram",
        requiredSkills: ["Python", "SQL", "Git"],
        minCgpa: 6.5,
      },
      {
        title: "Data Analyst",
        package: 7.5,
        location: "Noida",
        requiredSkills: ["Excel", "Python", "Power BI"],
        minCgpa: 7,
      },
    ],
  },
  {
    name: "Karan Malhotra",
    email: "company.zoho@spp.demo",
    password: "Company@123",
    companyName: "Zoho Labs",
    website: "https://www.zoho.com",
    location: "Chennai",
    industry: "SaaS",
    contactPhone: "9000001005",
    jobs: [
      {
        title: "Product Engineer",
        package: 9,
        location: "Chennai",
        requiredSkills: ["Java", "DSA", "System Design"],
        minCgpa: 7.2,
      },
      {
        title: "UI Engineer",
        package: 7,
        location: "Chennai",
        requiredSkills: ["React", "TypeScript", "CSS"],
        minCgpa: 6.8,
      },
    ],
  },
];

const nextDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 45);
  return date;
};

const run = async () => {
  await connectDB();
  const summary = [];

  for (const item of companies) {
    let user = await User.findOne({ email: item.email }).select("+password");

    if (!user) {
      user = await User.create({
        name: item.name,
        email: item.email,
        password: item.password,
        role: "company",
      });
    }

    const company = await Company.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        companyName: item.companyName,
        website: item.website,
        location: item.location,
        industry: item.industry,
        description: `${item.companyName} is hiring fresh talent through Smart Placement Portal.`,
        contactPerson: item.name,
        contactPhone: item.contactPhone,
        isVerified: true,
      },
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    const jobIds = [];
    for (const job of item.jobs) {
      const savedJob = await Job.findOneAndUpdate(
        { company: company._id, title: job.title },
        {
          title: job.title,
          company: company._id,
          description: `${job.title} role at ${item.companyName}. Candidates should be ready for technical assessment and interview rounds.`,
          location: job.location,
          jobType: job.jobType || "Full Time",
          package: job.package,
          requiredSkills: job.requiredSkills,
          eligibility: {
            minCgpa: job.minCgpa,
            branches: ["CSE", "IT", "ECE"],
            batches: ["2025", "2026", "2027"],
          },
          deadline: nextDeadline(),
          status: "open",
        },
        { upsert: true, returnDocument: "after", runValidators: true }
      );
      jobIds.push(savedJob._id.toString());
    }

    summary.push({
      company: item.companyName,
      email: item.email,
      password: item.password,
      userId: user._id.toString(),
      companyId: company._id.toString(),
      jobIds,
    });
  }

  console.table(
    summary.map((item) => ({
      company: item.company,
      email: item.email,
      password: item.password,
      userId: item.userId,
      companyId: item.companyId,
      jobs: item.jobIds.length,
    }))
  );

  console.log(JSON.stringify(summary, null, 2));
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
