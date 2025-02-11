const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB en Render
mongoose.connect('mongodb+srv://tu_usuario:tu_contraseña@tu_cluster.mongodb.net/inventario', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Conectado a MongoDB en Render');
}).catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
});

// Esquema actualizado con estructura organizada
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    thickness: String,
    size: String,
    siliconas: {
        tipo: String,
        cantidad: Number
    },
    discos: {
        tipo: String,
        cantidad: Number,
        medida: String,
        uso: String
    },
    pastas: {
        tipo: String,
        cantidad: Number
    }
});

const Item = mongoose.model('Item', itemSchema);

// Obtener todos los elementos
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo los elementos', error });
    }
});

// Agregar un nuevo elemento
app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Error al agregar el elemento', error });
    }
});

// Editar un elemento
app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el elemento', error });
    }
});

// Eliminar un elemento
app.delete('/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }
        res.json({ message: '✅ Elemento eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el elemento', error });
    }
});

// Configuración del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en https://index-pphm.onrender.com`);
});
