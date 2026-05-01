import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MODEL_NAME = process.env.MODEL_NAME || 'model1';

app.use(cors());
app.use(express.json());

// API Gateway proxy for connecting external modules
app.use('/api/:model', async (req, res) => {
  try {
    const { model } = req.params;
    const targetUrl = process.env[`${model.toUpperCase()}_API_URL`] || `http://localhost:${PORT}/api/${model}`;

    const response = await axios({
      method: req.method,
      url: `${targetUrl}${req.url.replace(`/api/${model}`, '')}`,
      data: req.body,
      headers: {
        ...req.headers,
        host: undefined,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message || 'Gateway error',
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', model: MODEL_NAME });
});

app.listen(PORT, () => {
  console.log(`API Gateway (${MODEL_NAME}) running on port ${PORT}`);
});
