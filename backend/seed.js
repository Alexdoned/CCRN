import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import mongoose from "mongoose";
import dotenv from "dotenv";
import { Event } from "./models/Event.js";
import { Leader } from "./models/Leader.js";

dotenv.config();

const uri = process.env.MONGO_URI || process.env.MONGO_URL;

const seedDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to database for seeding.");

    // Clear existing
    await Event.deleteMany({});
    await Leader.deleteMany({});
    console.log("Cleared old database records.");

    // Seed Events
    const events = [
      {
        title: "Diocesan Youth Assembly 2026",
        description: "A gathering of all parish youths to discuss leadership, community service, and faith development. Includes workshops and a guest panel.",
        date: new Date("2026-06-15T09:00:00.000Z"),
        venue: "St. Joseph's Parish",
        imageUrl: "https://images.unsplash.com/photo-1523580494863-6f30312245d5?q=80&w=800"
      },
      {
        title: "Annual Parish Thanksgiving & Charity Fair",
        description: "Celebrate the annual thanksgiving with food, games, live music, and charity auctions supporting regional medical clinics.",
        date: new Date("2026-07-02T11:00:00.000Z"),
        venue: "St. Pual Bali",
        imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800"
      },
      {
        title: "Couples Renewal Seminar",
        description: "Nurturing marriage bonds through spiritual guidance, interactive discussions, communication workshops, and a dinner reception.",
        date: new Date("2026-08-18T14:00:00.000Z"),
        venue: "St. Peter Nukkai",
        imageUrl: "https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=800"
      }
    ];

    // Seed Leaders
    const leaders = [
      {
        name: "Rev. Father Thomas Vance",
        position: "Parish Priest / Dean",
        achievements: [
          "Established St. Mary's Community Health Clinic",
          "25+ Years of Pastoral Service & Outreach",
          "Author of 'Faith in Action: Modern Leadership'"
        ],
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800"
      },
      {
        name: "Sister Beatrice Cooper",
        position: "Director of Religious Education",
        achievements: [
          "Formed the Diocesan Youth Choir",
          "Organized 15+ Annual Parish Summer Camps",
          "Recipient of the Diocesan Service Medal"
        ],
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800"
      },
      {
        name: "Dr. Albert Henderson",
        position: "Parish Council President",
        achievements: [
          "Led Cathedral Renovation & Restoration Fundraiser",
          "Over 10 years of Parish Advisory Leadership",
          "Founded the Parish Food Bank Network"
        ],
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800"
      }
    ];

    await Event.insertMany(events);
    console.log("Successfully seeded events.");

    await Leader.insertMany(leaders);
    console.log("Successfully seeded leaders.");

    console.log("Database seeding completed!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error during database seeding:", err);
    process.exit(1);
  }
};

seedDB();
