const db = require('../config/db');

exports.createTask = (userId, title) => {
    return db.query('INSERT INTO tasks (userId, title) VALUES(?, ?)', [userId, title]);
}

exports.getTasks = async(userId) => {
    const [rows] = await db.query('SELECT * FROM tasks WHERE userId = ?', [userId]);
    return rows;
}

exports.deleteTask = (id, userId) => {
    return db.query('DELETE FROM tasks WHERE id = ? AND userId = ?', [id, userId]);
}

exports.updateTask = async (id, userId, completed) => {
    await db.query(
        'UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?',
        [completed, id, userId]
    );

    if (completed) {

        // Save today's completion
        await db.query(
            `INSERT INTO habit_history (taskId, userId, completed_at)
             VALUES (?, ?, CURDATE())
             ON DUPLICATE KEY UPDATE completed_at = completed_at`,
            [id, userId]
        );

    } else {

        // Remove today's completion if unchecked
        await db.query(
            `DELETE FROM habit_history
             WHERE taskId = ?
             AND userId = ?
             AND completed_at = CURDATE()`,
            [id, userId]
        );

    }
}

exports.getHeatmapData = async (userId) => {
    const [rows] = await db.query(
        `SELECT
            completed_at AS date,
            COUNT(*) AS count
         FROM habit_history
         WHERE userId = ?
         GROUP BY completed_at
         ORDER BY completed_at ASC`,
        [userId]
    );

    return rows;
};

exports.getStreak = async (userId) => {

    const [rows] = await db.query(
        `SELECT DISTINCT completed_at
         FROM habit_history
         WHERE userId = ?
         ORDER BY completed_at ASC`,
        [userId]
    );

    if (rows.length === 0) {
        return {
            currentStreak: 0,
            bestStreak: 0
        };
    }

    const dates = rows.map(row => {
        const date = new Date(row.completed_at);
        date.setHours(0, 0, 0, 0);
        return date;
    });

    // Calculate Best Streak
    let bestStreak = 1;
    let streak = 1;

    for (let i = 1; i < dates.length; i++) {

        const diff =
            (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
            streak++;
            bestStreak = Math.max(bestStreak, streak);
        } else {
            streak = 1;
        }
    }

    // Calculate Current Streak
    let currentStreak = 0;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    // If today's habit isn't completed, start checking from yesterday.
    const lastDate = dates[dates.length - 1];

    if (lastDate.getTime() !== today.getTime()) {
        today.setDate(today.getDate() - 1);
    }

    for (let i = dates.length - 1; i >= 0; i--) {

        if (dates[i].getTime() === today.getTime()) {
            currentStreak++;
            today.setDate(today.getDate() - 1);
        } else if (dates[i] < today) {
            break;
        }
    }

    return {
        currentStreak,
        bestStreak
    };
};


exports.getAchievements = async (userId) => {

    // Total habit completions
    const [completionRows] = await db.query(
        `SELECT COUNT(*) AS totalCompletions
         FROM habit_history
         WHERE userId = ?`,
        [userId]
    );

    const totalCompletions = completionRows[0].totalCompletions;

    // Total active days
    const [activeDayRows] = await db.query(
        `SELECT COUNT(DISTINCT completed_at) AS activeDays
         FROM habit_history
         WHERE userId = ?`,
        [userId]
    );

    const activeDays = activeDayRows[0].activeDays;

    // Maximum habits completed in a single day
    const [bestDayRows] = await db.query(
        `SELECT COUNT(*) AS completed
         FROM habit_history
         WHERE userId = ?
         GROUP BY completed_at
         ORDER BY completed DESC
         LIMIT 1`,
        [userId]
    );

    const bestDay =
        bestDayRows.length > 0
            ? bestDayRows[0].completed
            : 0;

    // Reuse the streak function
    const streak = await exports.getStreak(userId);

    return {

        firstStep: {
            unlocked: totalCompletions >= 1
        },

        streak7: {
            unlocked: streak.currentStreak >= 7,
            progress: streak.currentStreak,
            target: 7
        },

        streak30: {
            unlocked: streak.currentStreak >= 30,
            progress: streak.currentStreak,
            target: 30
        },

        century: {
            unlocked: totalCompletions >= 100,
            progress: totalCompletions,
            target: 100
        },

        perfectDay: {
            unlocked: bestDay >= 5,
            progress: bestDay,
            target: 5
        },

        consistent: {
            unlocked: activeDays >= 30,
            progress: activeDays,
            target: 30
        }

    };
};

exports.getHistoryByDate = async (userId, date) => {

    const [rows] = await db.query(
        `SELECT
            t.id,
            t.title,
            CASE
                WHEN hh.taskId IS NOT NULL THEN 1
                ELSE 0
            END AS completed
        FROM tasks t
        LEFT JOIN habit_history hh
            ON hh.taskId = t.id
            AND hh.userId = t.userId
            AND hh.completed_at = ?
        WHERE t.userId = ?
        ORDER BY t.id`,
        [date, userId]
    );

    return rows;
};