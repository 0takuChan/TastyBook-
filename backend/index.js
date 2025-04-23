const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');  // เพิ่มการใช้ JWT
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // ดึง token จาก header Authorization
  if (!token) {
    return res.status(401).json({ error: 'ไม่พบ token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'ไม่สามารถยืนยันตัวตนได้' });
    }
    req.user = user;  // เก็บข้อมูลผู้ใช้ที่ได้รับจากการตรวจสอบ token
    next();
  });
};

app.get('/api/users/current', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'ไม่พบข้อมูลผู้ใช้ใน token' });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, // req.user.id มาจาก payload ของ token
    });

    if (!user) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }

    res.json(user); // ส่งข้อมูลผู้ใช้กลับ
  } catch (error) {
    console.error('Error fetching user:', error);  // เพิ่มการ log ข้อผิดพลาดที่เกิดขึ้นในขณะดึงข้อมูลผู้ใช้
    res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
});

// เพิ่ม API อื่นๆ ตามเดิม
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('🛑 Prisma error:', error); // ← log error จริงๆ ออกมา
    res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงผู้ใช้' });
  }
});

// สร้างผู้ใช้ (สมัครสมาชิก)
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

// ดึงข้อมูลผู้ใช้
app.get('/api/users/:username/:email', async (req, res) => {
  const { username, email } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ตรวจสอบ username และ email
    if (user && user.username === username) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'ไม่พบผู้ใช้ที่มีชื่อผู้ใช้และอีเมลนี้' });
    }
  } catch (error) {
    res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
});

// ดึงข้อมูลผู้ใช้ตามอีเมล
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

// สร้างเมนู
app.post('/api/menus', async (req, res) => {
  const { name, ingredients, steps, creatorId, typeId } = req.body;
  
  console.log('📥 ข้อมูลที่รับมา:', req.body);

  // ตรวจสอบว่ามีข้อมูลครบไหม
  if (!name || !ingredients || !steps || !creatorId || !typeId) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบ กรุณาตรวจสอบอีกครั้ง' });
  }

  try {
    const menu = await prisma.menuBook.create({
      data: { name, ingredients, steps, creatorId, typeId: parseInt(typeId) },
    });
    res.json(menu);
  } catch (error) {
    console.error('❌ ข้อผิดพลาด:', error);
    res.status(500).json({ error: 'มีข้อผิดพลาดในการสร้างเมนู' });
  }
});

// ดึงเมนูทั้งหมด (พร้อม Pagination)
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

// ดึงประเภทเมนู
app.get('/api/types', async (req, res) => {
  try {
    const types = await prisma.typeBook.findMany();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงประเภทเมนู' });
  }
});

// อัพเดตเมนู
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

// ลบเมนู
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
