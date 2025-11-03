import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface RegisterBody {
  email: string;
  password: string;
  username: string;
}

interface LoginBody {
  email: string;
  password: string;
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body as RegisterBody;

    if (!email || !password || !username) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Registration failed.',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(400).json({
        error: '아이디 또는 비밀번호가 일치하지 않습니다.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: '아이디 또는 비밀번호가 일치하지 않습니다.',
      });
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        avatar: existingUser.avatar,
        createdAt: existingUser.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Login failed.',
    });
  }
});

export default router;
