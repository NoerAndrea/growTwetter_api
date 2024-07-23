import express from "express";
import cors from "cors";
import "dotenv/config";
import { UserRoutes } from "./routes/users.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { TweetRoutes } from "./routes/tweet.routes";
import { LikeRoutes } from "./routes/like.routes";
import { FeedRoutes } from "./routes/feed.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", UserRoutes.execute());
app.use("/auth", AuthRoutes.execute());
app.use("/tweet", TweetRoutes.execute());
app.use("/tweet", FeedRoutes.execute());
app.use("/like", LikeRoutes.execute());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
