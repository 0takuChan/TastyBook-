const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Prisma error:', error); 
    res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงผู้ใช้' });
  }
});


app.post('/api/users', async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { username, email },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'มีข้อผิดพลาดในการสมัครสมาชิก' });
  }
});


app.get('/api/users/:username/:email', async (req, res) => {
  const { username, email } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });


    if (user && user.username === username) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'ไม่พบผู้ใช้ที่มีชื่อผู้ใช้และอีเมลนี้' });
    }
  } catch (error) {
    res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
});


app.get('/api/users/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'ไม่พบผู้ใช้ที่มีอีเมลนี้' });
    }
  } catch (error) {
    res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
});


app.post('/api/menus', async (req, res) => {
  const { name, ingredients, steps, creatorId, typeId } = req.body;
  
  console.log('📥 ข้อมูลที่รับมา:', req.body);

 
  if (!name || !ingredients || !steps || !creatorId || !typeId) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบ กรุณาตรวจสอบอีกครั้ง' });
  }

  try {
    const menu = await prisma.menuBook.create({
      data: { name, ingredients, steps, creatorId, typeId: parseInt(typeId) },
    });
    res.json(menu);
  } catch (error) {
    console.error('ข้อผิดพลาด:', error);
    res.status(500).json({ error: 'มีข้อผิดพลาดในการสร้างเมนู' });
  }
});


app.get('/api/menus', async (req, res) => {
  const creatorId = parseInt(req.query.creatorId);

  try {
    const where = creatorId ? { creatorId } : {};

    const menus = await prisma.menuBook.findMany({
      where,
      include: { creator: true, type: true },
    });

    const total = await prisma.menuBook.count({ where });

    res.json({ menus, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
});


app.get('/api/types', async (req, res) => {
  try {
    const types = await prisma.typeBook.findMany();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงประเภทเมนู' });
  }
});

app.put('/api/menus/:id', async (req, res) => {
  const { id } = req.params;
  const { name, ingredients, steps, typeId } = req.body;
  try {
    const menu = await prisma.menuBook.update({
      where: { id: parseInt(id) },
      data: { name, ingredients, steps, typeId },
    });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'มีข้อผิดพลาดในการอัพเดตเมนู' });
  }
});


app.delete('/api/menus/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.menuBook.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'ลบเมนูสำเร็จ' });
  } catch (error) {
    res.status(500).json({ error: 'มีข้อผิดพลาดในการลบเมนู' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('เซิร์ฟเวอร์รันที่พอร์ต', PORT);
});
