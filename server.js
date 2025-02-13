const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Asegúrate de tener este archivo
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Obtener todos los elementos
app.get('/items', async (req, res) => {
    try {
        const snapshot = await db.collection('items').get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo los elementos', error });
    }
});

// Agregar un nuevo elemento
app.post('/items', async (req, res) => {
    try {
        const newItem = req.body;
        const docRef = await db.collection('items').add(newItem);
        res.json({ id: docRef.id, ...newItem });
    } catch (error) {
        res.status(400).json({ message: 'Error al agregar el elemento', error });
    }
});

// Editar un elemento
app.put('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        await db.collection('items').doc(itemId).update(req.body);
        res.json({ id: itemId, ...req.body });
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el elemento', error });
    }
});

// Eliminar un elemento
app.delete('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        await db.collection('items').doc(itemId).delete();
        res.json({ message: '✅ Elemento eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el elemento', error });
    }
});

// Configuración del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});