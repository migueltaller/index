const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/inventario', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Conectado a MongoDB');
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
        tipo: String,  // Ej: Polímero, Acrílica, Color
        cantidad: Number
    },
    discos: {
        tipo: String,  // Ej: Corte, Desbaste
        cantidad: Number,
        medida: String,
        uso: String   // Ej: Granito, Porcelánico, Mármol
    },
    pastas: {
        tipo: String,  // Ej: Pulido, Envejecido
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
const port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://192.168.0.186:${port}`);
});
