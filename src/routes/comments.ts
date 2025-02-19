import express, { NextFunction } from 'express';
import prisma from '../lib/prisma';
import { auth } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { Response, Request, CommentProps } from '../../types/types';

const SECRET_KEY = process.env.SUPABASE_JWT_SECRET || 'default_secret_key';

const router = express.Router();

// router.get('/comment/:id', auth, async (req, res) => {
//   console.log('entered get comment endpoint');
//   // const { id } = req.params;
//   const { id } = req.params;
//   console.log('commentid: ', id);

//   try {
//     const commentExists = await prisma.comments.findUnique({
//       where: { id: id },
//     });

//     if (!commentExists) {
//       console.log('comment doesn\'t exist');
//       return res.status(404).json({ error: 'User not found' });
//     } else {
//       console.log('comment exists');
//       const comment = await prisma.comments.findUnique({
//         where: { id: id },
//         include: {
//           comments: true,
//         },
//       });
//       const commentData = { comment: comment, commentId: id };
//       return res.status(200).json( { commentData, message: 'Comment loaded successfully' });
//     }    
//     // return res.status(200).json(profile);
//   } catch (error) {
//     console.error('Error deleting profile:', error);
//     return res.status(500).json({ error });
//   }
// });

router.get('/comment/:id', auth, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  console.log('entered get comment endpoint');
  const { id } = req.params;
  console.log('commentid: ', id); 

  try {
    const commentExists = await prisma.comments.findUnique({
      where: { id: id },
    });

    if (!commentExists) {
      console.log('comment doesn\'t exist');
      return res.status(404).json({ error: 'comment not found' });
    } else {
      console.log('comment exists');
      const comment = await prisma.comments.findUnique({
        where: { id: id },
        include: {
          comments: true,
        },
      });
      const commentData = { comment: comment, commentId: id };
      return res.status(200).json({ commentData, message: 'Comment loaded successfully' });
    }    
  } catch (error) {
    console.error('Error getting comment:', error);
    return next(error);
  }
});

router.post('/create', auth, async (req, res) => {
  console.log('entered comments create endpoint');
  const { postId, content, img, audio, file, profileName } = req.body;
  console.log('postId: ', postId);
  console.log('content: ', content);
  const token = req.cookies.token;

  let userId;

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    userId = decoded.id;
  });

  // const user = await prisma.users.findUnique({
  //   where: {
  //     id: userId
  //   }  
  // })

  // const currentProfile

  // const profile = await prisma.profiles.findUnique({
  //   where: {
  //     id:  
  //   }  
  
  // })

  try {
    const comment = await prisma.comments.create({
      data: {
        content: content,
        profileName: profileName,
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'An error occurred while creating the comment' });
  }
});

router.post('/create/commentoncomment', auth, async (req, res) => {
  console.log('entered create comment on comment endpoint');
  const { commentId, content, img, audio, file } = req.body;
  console.log('content: ', content);
  const token = req.cookies.token;

  let userId;

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    userId = decoded.id;
  });

  try {
    console.log('entered commentoncomment try: ', commentId);

    const comment = await prisma.comments.create({
      data: {
        content,
        commentHierarchy: { connect: { id: commentId } },
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'An error occurred while creating the comment' });
  }
});


router.put('/edit/:id', auth, async (req, res): Promise<any> => {
  console.log('entered edit post');
  // const { id } = req.params;
  const { commentId, content } = req.body;
  console.log('id: ', commentId, ', content: ', content);

  try {
    const commentExists = await prisma.comments.findUnique({
      where: { id: commentId },
    });

    if (!commentExists) {
      console.log('user doesn\'t exist');
      return res.status(404).json({ error: 'User not found' });
    } else {
      console.log('comment exists');
      await prisma.comments.update({
        where: { id: commentId },
        data: { content: content },
      });
      return res.status(200).json({ message: 'Main profile updated successfully', redirectUrl: '/profiles/myprofile' });
    }    
    // return res.status(200).json(profile);
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ error });
  }
});

// deletes a profile

router.delete('/delete/:id', auth, async (req, res): Promise<any> => {
  console.log('entered delete comment endpoint');
  const { id } = req.params;
  console.log('id: ', id);

  try {
    await prisma.comments.delete({
      where: { id },
    });

    return res.status(201).json({ redirectUrl: '/profiles/myprofiles' });

    // return res.status(200).json(profile);
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ error });
  }
});

export default router;
