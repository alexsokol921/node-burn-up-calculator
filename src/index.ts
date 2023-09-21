import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './errorMiddleware';
import routes from './routes/routes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
