import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();

const elasticClient = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: { rejectUnauthorized: false }, // only if self-signed, optional for cloud
  sniffOnStart: false,
  sniffInterval: false,
  sniffOnConnectionFault: false,
});

export default elasticClient;
