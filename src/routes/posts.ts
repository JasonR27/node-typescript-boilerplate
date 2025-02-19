import express from 'express';
import prisma from '../lib/prisma';
import { auth } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const SECRET_KEY: string = process.env.SUPABASE_JWT_SECRET || 'default_secret_key';

if (!SECRET_KEY) {
  console.log('No Secret Key');
} else {
  console.log('login endpoint SECRET_KEY/JWT secret: ', SECRET_KEY);
}

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('entered get posts / endpoint')
  const posts = await prisma.posts.findMany({
    include: {
      comments: {
        include: {
          likes: true, // Include likes for each comment
          comments: true, // Include comments for each comment
        },
      },
      profile: {
        select: {
          authorEmail: true,
          picture: { select: { avatarUrl: true } },
        },
      },
      likes: { select: { id: true } },
    },
  });
  res.status(200).json(posts);
});

router.get('/profile/current', auth, async (req, res) => {
  
  const token = req.cookies.token;

  let userId;
  // let authorEmail = '';

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    // Attach the decoded information to the request object
    userId = decoded.id;
    // authorEmail = decoded.email; // Assuming the ID is stored in the token payload
    // console.log('decoded: ', decoded, ' ', 'decoded.id: ', decoded.id, 'decoded.email: ', decoded.email);
    // next(); // Proceed to the next middleware or route handler
  });

  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  // console.log('userId: ', userId);
  // console.log('user: ', user?.email);

  const currentProfile = await prisma.profiles.findUnique({
    where: { id: user?.currentProfileId as string },
  });

  const posts = await prisma.posts.findMany({
    
    where: { profileId: currentProfile?.id },
    include: {
      comments: {
        include: {
          likes: true, // Include likes for each comment
          comments: true, // Include comments for each comment
        },
      },
      profile: {
        select: {
          authorEmail: true,
          picture: { select: { avatarUrl: true } },
        },
      },
      likes: { select: { id: true } },
    },
  });

  res.status(200).json(posts);
});

router.post('/create', auth, async (req, res): Promise<any> => {
  const { title, content, profileName } = req.body; // Ensure userId is included in the request body
  console.log('title: ', title, 'content :', content, 'profileName :', profileName)
  const token = req.cookies.token;

  let userId;
  // let authorEmail = ''; 

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    // Attach the decoded information to the request object
    userId = decoded.id;
    // authorEmail = decoded.email; // Assuming the ID is stored in the token payload
    console.log('decoded: ', decoded, ' ', 'decoded.id: ', decoded.id, 'decoded.email: ', decoded.email);
    // next(); // Proceed to the next middleware or route handler
  });

  try {

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    const currentProfile = await prisma.profiles.findUnique({
      where: { id: user?.currentProfileId as string },
    });

    const profileId = currentProfile?.id;

    const result = await prisma.posts.create({
      data: {
        title,
        viewCount: 0,
        content,
        profileName,
        profile: {
          connect: { id: profileId },
        },
        user: {
          connect: { id: userId }, // Connect the post to the user
        },
      },
    });

    // res.status(200).json(result);
    return res.status(201).json({ redirectUrl: '/profiles/currentprofile/myposts' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.posts.findFirst({
      where: {
        id: id, // No need to convert to String
      },
      include: {
        profile: {
          select: {
            user:true,
            authorEmail: true,
            picture: { select: { avatarUrl: true } },
          },
        },
        likes: { select: { id: true } },
      },
    });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: `Post with ID ${id} does not exist in the database` });
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'An error occurred while fetching the post' });
  }
});

router.delete('/delete/:id', auth, async (req, res): Promise<any> => {

  const { postId } = req.query;

  try {
    const post = await prisma.posts.delete({
      where: { id: postId },
    });

    return res.status(201).json({ post, redirectUrl: '/profiles/currentprofile/myposts' });

    // return res.status(200).json(profile);
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ error });
  }
});

router.put('/edit/:id', auth, async (req, res): Promise<any> => {
  console.log('entered edit post');
  // const { id } = req.params;
  const { postId, content } = req.body;
  console.log('id: ', postId, ', content: ', content);

  try {
    
    const postExists = await prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      console.log('user doesn\'t exist');
      return res.status(404).json({ error: 'User not found' });
    } else {
      console.log('post exists');
      await prisma.posts.update({
        where: { id: postId },
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


export default router;
