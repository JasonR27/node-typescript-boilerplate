import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main():Promise<void> {
  // Create users
  const user1 = await prisma.users.create({
    data: {
      id: 'user1',
      name: 'Alice',
      email: 'alice@example.com',
      userName: 'alice',
      passwordHash: '$2b$12$UEsk.9Pqvq3xH1znnhMc.OeQv3JKclGwuC/5hdo2VhLH1w.o72oyO',
      role: 'user',
    },
  });

  const user2 = await prisma.users.create({
    data: {
      id: 'user2',
      name: 'Bob',
      email: 'bob@example.com',
      userName: 'bob',
      passwordHash: '$2b$12$UEsk.9Pqvq3xH1znnhMc.OeQv3JKclGwuC/5hdo2VhLH1w.o72oyO',
      role: 'user',
    },
  });

  const user3 = await prisma.users.create({
    data: {
      id: 'a087582f-eaed-4c22-a562-0a9d38235a39',
      name: 'Jeison',
      email: 'bojob3999@gmail.com',
      userName: 'JeisonRoblero',
      passwordHash: '$2b$12$UEsk.9Pqvq3xH1znnhMc.OeQv3JKclGwuC/5hdo2VhLH1w.o72oyO',
      role: 'user',
    },
  });

  // Create profiles
  const profile1 = await prisma.profiles.create({
    data: {
      id: 'profile1',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user1.id,
      userName: 'aliceProfile',
      website: 'https://alice.com',
      company: 'Alice Inc.',
      authorEmail: 'alice@example.com',
      isPublic: true,
      programmingLanguages: ['JavaScript', 'TypeScript'],
    },
  });

  const profile2 = await prisma.profiles.create({
    data: {
      id: 'profile2',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user2.id,
      userName: 'bobProfile',
      website: 'https://bob.com',
      company: 'Bob Ltd.',
      authorEmail: 'bob@example.com',
      isPublic: false,
      programmingLanguages: ['Python', 'Django'],
    },
  });

  const profile3 = await prisma.profiles.create({
    data: {
      id: '450208d0-865d-4acd-a3e8-a2d1ecbd095f',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user3.id,
      userName: 'jason\'sProfile',
      website: 'https://github.com/Jasonr27',
      company: 'Freelancer',
      authorEmail: 'bojob3999@gmail.com',
      isPublic: true,
      programmingLanguages: ['JavaScript', 'TypeScript'],
    },
  });

  const profile4 = await prisma.profiles.create({
    data: {
      id: '561319e1',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user3.id,
      userName: 'jason\'sProfile',
      website: 'https://github.com/Jasonr27',
      company: 'Freelancer',
      authorEmail: 'bojob3999@gmail.com',
      isPublic: true,
      programmingLanguages: ['JavaScript', 'TypeScript'],
    },
  });

  // Create posts
  const post1 = await prisma.posts.create({
    data: {
      id: 'post1',
      userId: user1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Alice\'s First Post',
      content: 'This is the content of Alice\'s first post',
      published: true,
      viewCount: 100,
      profileId: profile1.id,
      userName: user1.userName,
    },
  });

  const post2 = await prisma.posts.create({
    data: {
      id: 'post2',
      userId: user2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Bob\'s First Post',
      content: 'This is the content of Bob\'s first post',
      published: false,
      viewCount: 50,
      profileId: profile2.id,
      userName: user2.userName,
    },
  });

  const post3 = await prisma.posts.create({
    data: {
      id: 'post3',
      userId: user3.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Jason\'s First Post',
      content: 'This is the content of Jeison\'s first post',
      published: true,
      viewCount: 100,
      profileId: profile3.id,
      userName: user3.userName,
    },
  });

  const post4 = await prisma.posts.create({
    data: {
      id: 'post4',
      userId: user3.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Jason\'s Second Post',
      content: 'This is the content of Jeison\'s second post',
      published: true,
      viewCount: 100,
      profileId: profile3.id,
      userName: user3.userName,
    },
  });

  // Create comments
  // const comment4 = 
  await prisma.comments.create({
    data: {
      id: 'comment4',
      postId: post4.id,
      profileId: profile2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      content: 'Nice post, Jason!',
      userName: profile2.userName,
    },
  });



  // const comment1 = 
  await prisma.comments.create({
    data: {
      id: 'comment1',
      postId: post1.id,
      profileId: profile2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      content: 'Nice post, Alice!',
      userName: profile2.userName,
    },
  });

  // const comment2 = 
  await prisma.comments.create({
    data: {
      id: 'comment2',
      postId: post2.id,
      profileId: profile1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      content: 'Thanks, Bob!',
      userName: profile1.userName,
    },
  });

  // const comment3 = 
  await prisma.comments.create({
    data: {
      id: '73ab0ffa-2f95-45f4-8370-9bee1a08efcf',
      postId: post3.id,
      profileId: profile2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      content: 'Nice post, Jason!',
      userName: profile2.userName,
    },
  });

  // Create likes
  // const like1 = 
  await prisma.likes.create({
    data: {
      id: 'like1',
      postId: post1.id,
      userId: user2.id,
      profileId: profile2.id,
    },
  });

  // const like2 = 
  await prisma.likes.create({
    data: {
      id: 'like2',
      postId: post2.id,
      userId: user1.id,
      profileId: profile1.id,
    },
  });

  // const like3 = 
  await prisma.likes.create({
    data: {
      id: 'b537a840-4fee-4e61-9b1c-9a3d78bc972e',
      postId: post3.id,
      userId: user3.id,
      profileId: profile3.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
