import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middlewares/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 좋아요 토글
router.post('/toggle', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: 'postId is required' });
    }

    // 이미 좋아요가 있는지 확인
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.userId!,
          postId: parseInt(postId),
        },
      },
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      res.json({ liked: false });
    } else {
      // 좋아요 추가
      await prisma.like.create({
        data: {
          userId: req.userId!,
          postId: parseInt(postId),
        },
      });
      res.json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

export default router;
