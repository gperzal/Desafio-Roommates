import express from 'express';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
