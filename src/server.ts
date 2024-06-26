import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { UserRoutes } from './routes/users.routes';

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", UserRoutes.execute())

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT} 🚀`);
    
})
