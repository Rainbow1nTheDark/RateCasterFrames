import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to add a new score
export async function addScore(fid: number, newScore: number) {
    try {
      // Calculate the total score
      const totalScore = await prisma.scores.aggregate({
        _sum: {
          todays_score: true,
        },
        where: {
          fid,
        },
      });
  
      // Check if today's score already exists
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const existingScore = await prisma.scores.findFirst({
        where: {
          fid,
          created_at: {
            gte: today,
          },
        },
      });
  
      if (existingScore) {
        // Update today's score only if the new score is higher
        if (newScore > existingScore.todays_score) {
          const total = (totalScore._sum.todays_score || 0) + newScore - existingScore.todays_score;
          const updatedScore = await prisma.scores.update({
            where: {
              id: existingScore.id,
            },
            data: {
              todays_score: newScore,
              total_score: total,
            },
          });
          return updatedScore;
        } else {
          // Do nothing if the new score is lower
          return existingScore;
        }
      } else {
        const total = (totalScore._sum.todays_score || 0) + newScore;
        // Add new score
        const score = await prisma.scores.create({
          data: {
            fid,
            todays_score: newScore,
            total_score: total,
          },
        });
        return score;
      }
    } catch (error) {
      console.error('Error adding score:', error);
    }
  }

// Function to get all scores
export async function getAllScores() {
  try {
    const scores = await prisma.scores.findMany();
    return scores;
  } catch (error) {
    throw new Error('Failed to fetch scores');
  }
}

// Function to get score by ID
export async function getScoreById(id: number) {
  try {
    const score = await prisma.scores.findUnique({
      where: { id },
    });
    return score;
  } catch (error) {
    throw new Error('Failed to fetch score');
  }
}
// Function to get scores by fid and leaderboard position
export async function getScoresByFid(fid: number) {
    try {
      // Get all scores sorted by total_score in descending order
      const allScores = await prisma.scores.findMany({
        orderBy: {
          total_score: 'desc',
        },
      });
  
      // Find the scores for the specific user
      const userScores = allScores.filter(score => score.fid === fid);
  
      // Calculate the leaderboard position
      const leaderboardPosition = allScores.findIndex(score => score.fid === fid) + 1;
  
      return {
        userScores,
        leaderboardPosition,
      };
    } catch (error) {
      throw new Error('Failed to fetch scores by fid');
    }
}


// Function to get user's total score and leaderboard position by fid
export async function getUserTotalScoreAndLeaderboardPosition(fid: number) {
    try {
      const result = await prisma.$queryRaw<
        { total_score: number; rank: number }[]
      >`
        SELECT total_score, rank FROM (
          SELECT fid, total_score, RANK() OVER (ORDER BY total_score DESC) as rank
          FROM scores
        ) subquery
        WHERE fid = ${fid}
      `;
  
      if (result.length === 0) {
        throw new Error('User score not found');
      }
  
      const result0 = result[0];
      if (!result0) {
        throw new Error('Unexpected empty result');
      }
  
      const { total_score, rank } = result0;
  
      return {
        totalScore: total_score,
        leaderboardPosition: rank,
      };
    } catch (error) {
      console.error('Failed to fetch user total score and leaderboard position:', error);
      throw new Error('Failed to fetch user total score and leaderboard position');
    }
  }

  // Function to get the leaderboard with pagination and search functionality
  export async function getLeaderboard(page: number) {
    const PAGE_SIZE = 10;
    try {
      const leaderboard = await prisma.$queryRaw<
        { fid: number; total_score: number }[]
      >`
        SELECT fid, MAX(total_score) as total_score
        FROM scores
        GROUP BY fid
        ORDER BY total_score DESC
        LIMIT ${PAGE_SIZE}
        OFFSET ${(page - 1) * PAGE_SIZE}
      `;
  
      const totalRecordsResult = await prisma.$queryRaw<
        { count: bigint }[]
      >`
        SELECT COUNT(DISTINCT fid) as count
        FROM scores
      `;
      console.log(totalRecordsResult);
      const totalRecords = Number(totalRecordsResult[0]?.count || 0);
      const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
  
      return {
        leaderboard: leaderboard.map(entry => ({
          ...entry,
          fid: Number(entry.fid), // Ensure fid is a number
          total_score: Number(entry.total_score) // Ensure total_score is a number
        })),
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
  }

  export async function getDistinctFids() {
    try {
        const distinctFids = await prisma.scores.findMany({
            distinct: ['fid'],
            select: {
                fid: true,
            },
        });
        return distinctFids.map(entry => entry.fid); // Return an array of distinct fids
    } catch (error) {
        console.error('Failed to fetch distinct FIDs:', error);
        throw new Error('Failed to fetch distinct FIDs');
    }
}