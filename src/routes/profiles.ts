import express from 'express';
import prisma from '../lib/prisma';
import { auth } from '../middleware/auth';
import cookieParser from 'cookie-parser';
// import jwt from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY: string = process.env.SUPABASE_JWT_SECRET || 'default_secret_key';

if (!SECRET_KEY) {
  // console.log('No Secret Key');
} else {
  // console.log('login endpoint SECRET_KEY/JWT secret: ', SECRET_KEY);
}

const router = express.Router();

router.use(express.json()); // Middleware to parse JSON bodies
router.use(cookieParser()); // For parsing cookies

// Your routes
router.get('/', async (req, res) => {
  // console.log('entered get / profiles endpoint');
  const profiles = await prisma.profiles.findMany({
    include: {
      picture: {
        select: {
          avatarUrl: true,
        },
      },
      user: true,
    },
  });
  // console.log('profiles: ', profiles);
  res.status(200).json(profiles);
});

// response with all of the users profiles

router.get('/findProfilesByUser/', auth, async (req, res) => {

  const token = req.cookies.token;

  let userId;
  let userName;

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    userId = decoded.id;
    userName = decoded.name;
  });

  // console.log('main endpoint user id: ', userId);

  try {

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    const profiles = await prisma.profiles.findMany({
      where: { userId: user?.id },
      include: {
        picture: {
          select: {
            avatarUrl: true,
          },
        },
        user: true,
      },
    });


    //   res.json(profile ? [profile] : []); // Return an array, even if it contains a single profile
    //   // res.json(profile);
    // } catch (error) {
    //   res.json({ error });
    // }
    // console.log('profiles: ', profiles);
    res.status(200).json(profiles);
    // res.json(profile);
  } catch (error) {
    res.json({ error: `No Profiles for user ${userName} exist in the database` });
  }
});

// handles creating a new profile

router.post('/create', auth, async (req, res): Promise<any> => {
  // console.log('entering create profile endpoint');
  // // console.log('// console.log(req.body)', req.body);
  const token = req.cookies.token;

  // console.log('Extracted token: ', token);

  if (!token) {
    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }

  let userId;
  let authorEmail = '';

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    // Attach the decoded information to the request object
    userId = decoded.id;
    authorEmail = decoded.email; // Assuming the ID is stored in the token payload
    // console.log('decoded: ', decoded, ' ', 'decoded.id: ', decoded.id, 'decoded.email: ', decoded.email);
    // next(); // Proceed to the next middleware or route handler
  });

  // add code to check if there is a current profile, and if not add this as current

  const { username, website, programmingLanguages, company, mainOptions } = req.body.profile;

  // console.log('create endpoint req.body: ', req.body);

  // console.log('inside create post endpoint');
  // console.log('website: ', website);
  // console.log('username: ', username);
  // console.log('company: ', company);
  // console.log('mainOptions: ', mainOptions);

  if (!authorEmail) {
    // console.log('author email not found');
    return res.status(400).json({ error: 'authoremail is required' });
  } else {
    // console.log('userId found authorEmail: ', userId);
  }

  if (!userId) {
    // console.log('userId not found');
    return res.status(400).json({ error: 'User ID is required' });
  } else {
    // console.log('userId found userId: ', userId);
  }

  try {
    const userExists = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      // console.log('couldnt find user with id = userId');

      return res.status(404).json({ error: 'User not found' });
    }

    const result = await prisma.profiles.create({
      data: {
        user: { connect: { id: userId } },
        username,
        website,
        authorEmail,
        company,
        programmingLanguages,
      },
    });

    // console.log('create endpoint, profile created');
    // console.log('mainOptions: ', mainOptions);

    if (mainOptions) {
      // console.log('profile selected as main');
      await prisma.users.update({
        where: { id: userId }, data: { mainProfileId: result.id },
      });
    } else {
      // console.log('profile not selected as main');
    }

    // Ensure the cookie configuration

    return res.status(201).json({ result, redirectUrl: '/profiles/myprofiles' });
  } catch (error: any) {
    console.error('Error creating profile:', error);
    return res.status(500).json({ error: error.message });
  }
});


// response with the main profile

router.get('/main', auth, async (req, res) => {
  // console.log('entered get main profile by email endpoint');

  const token = req.cookies.token;

  let userId;

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    userId = decoded.id;
  });

  // console.log('main endpoint user id: ', userId);


  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    // console.log('main endpoint user?.id: ', user?.id);
    // console.log('main endpoint user?.mainProfileId: ', user?.mainProfileId);

    const profile = await prisma.profiles.findUnique({
      where: { id: user?.mainProfileId as string },
      include: {
        user: true,
      },
    });

    // console.log('user: ', user);
    // console.log('profile: ', profile);
    // console.log('profile: ', profile?.authorEmail);
    res.json(profile ? [profile] : []); // Return an array, even if it contains a single profile
    // res.json(profile);
  } catch (error) {
    res.json({ error });
  }
});

router.get('/current', auth, async (req, res) => {
  // console.log('entered get current profile by email endpoint');

  // console.log('current Profile email: ', authorEmail);

  const token = req.cookies.token;

  let userId;

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    userId = decoded.id;
  });

  // console.log('main endpoint user id: ', userId);


  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    // console.log('current endpoint user?.id: ', user?.id);
    // console.log('current endpoint user?.mainProfileId: ', user?.mainProfileId);

    const profile = await prisma.profiles.findUnique({
      where: { id: user?.currentProfileId as string },
      include: {
        user: true,
      },
    });

    // console.log('user: ', user);
    // console.log('profile: ', profile);
    // console.log('profile: ', profile?.authorEmail);
    res.json(profile ? [profile] : []); // Return an array, even if it contains a single profile
    // res.json(profile);
  } catch (error) {
    res.json({ error });
  }
});

// deletes a profile

router.delete('/delete', auth, async (req, res): Promise<any> => {
  console.log('entered delete profile endpoint, using query for params');
  const { profileId } = req.query;
  // const profileId = req.body.profileId;
  console.log('profileId: ', profileId);

  try {
    // const profile = 
    await prisma.profiles.delete({
      where: { id: profileId },
    });

    return res.status(201).json({ message: 'Profile deleted succesfully', redirectUrl: '/profiles/myprofiles' });

    // return res.status(200).json(profile);
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ error });
  }
});

// reselects main profile

router.put('/update/main', auth, async (req, res): Promise<any> => {
  // console.log('entered select as main');

  const { id } = req.body;
  const token = req.cookies.token;

  // console.log('smain id: ', id);

  if (!token) {
    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }

  let userId;

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    userId = decoded.id;
  });

  try {
    const userExists = await prisma.users.findUnique({
      where: { id: userId },
    });


    if (!userExists) {
      // console.log('user doesnt exist');
      return res.status(404).json({ error: 'User not found' });
    } else {
      await prisma.users.update({
        where: { id: userId },
        data: { mainProfileId: id },
      });
      return res.status(200).json({ message: 'Main profile updated successfully', redirectUrl: '/profiles/myprofile' });
    }
    // return res.status(201).json({ profile, redirectUrl: '/profiles/myprofiles' });
  } catch (error) {
    console.error('Error setting main profile:', error);
    return res.status(500).json({ error });
  }
});

router.put('/update/current/:id', auth, async (req, res): Promise<any> => {
  // console.log('entered select as current');

  const { id } = req.params;
  const token = req.cookies.token;

  // console.log('scurrent id: ', id);

  if (!token) {
    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }

  let userId;

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    userId = decoded.id;
  });

  try {
    const userExists = await prisma.users.findUnique({
      where: { id: userId },
    });


    if (!userExists) {
      // console.log('user doesnt exist');
      return res.status(404).json({ error: 'User not found' });
    } else {
      await prisma.users.update({
        where: { id: userId },
        data: { currentProfileId: id },
        
      });
      const settingsCookie = req.cookies.settings;
      let settings = settingsCookie ? JSON.parse(settingsCookie) : {};
      settings.userName = userExists.username; // Update the userName field with the current username

      res.cookie('settings', JSON.stringify(settings), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 * 10000,
      });

      return res.status(200).json({ message: 'Profile selected as current successfully', redirectUrl: '/profiles/myprofiles' });
    }
    // return res.status(201).json({ profile, redirectUrl: '/profiles/myprofiles' });
  } catch (error) {
    console.error('Error setting main profile:', error);
    return res.status(500).json({ error });
  }
});

router.put('/edit', auth, async (req, res): Promise<any> => {
  console.log('entered edit profile');
  // const { id } = req.params;
  const { profileId, content } = req.body;
  console.log('id: ', profileId, ', content: ', content);

  try {

    const profileExists = await prisma.posts.findUnique({
      where: { id: profileId },
    });

    if (!profileExists) {
      console.log('profile doesn\'t exist');
      return res.status(404).json({ error: 'profile not found' });
    } else {
      console.log('profile exists');
      await prisma.profile.update({
        where: { id: profileId },
        data: { content: content },
      });
      return res.status(200).json({ message: 'Profile updated successfully', redirectUrl: '/profiles/myprofile' });
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ error });
  }
});

export default router;