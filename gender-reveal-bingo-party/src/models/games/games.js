
import db from '../db.js';

/**
 * Saves a new user to the database with a hashed password.
 * 
 * @param {string} name - The user's full name
 * @param {string} email - The user's email address
 * @param {string} hashedPassword - The bcrypt-hashed password
 * @returns {Promise<Object>} The newly created user record (without password)
 */
const createGame = async (name, email, hashedPassword) => {
    const query = `
        INSERT INTO game (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
    `;
    const result = await db.query(query, [name, email, hashedPassword]);
    return result.rows[0];
};

/**
 * Update a user's name and email
 */
const updateGame = async (id, name, email) => {
    const query = `
        UPDATE users 
        SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, name, email, updated_at
    `;
    const result = await db.query(query, [name, email, id]);
    return result.rows[0] || null;
};

/**
 * Get all faculty members in a specific department.
 * 
 * @param {number} departmentId - The ID of the department
 * @param {string} sortBy - Sort option: 'name' (default), 'department', 'title'
 * @returns {Promise<Array>} Array of faculty objects in the specified department
 */
const getGamesByUser = async (userId) => {
    
    const query = `
        SELECT id, title, creation_date, is_playable 
        FROM game
        WHERE user_id = $1
        ORDER BY creation_date
    `;
    
    const result = await db.query(query, [userId]);
    
    return result.rows.map(game => ({
        id: game.id,
        title: game.title,
        creationDate: game.creation_date,
        isPlayable: game.is_playable
    }));
};

/**
 * Wrapper functions for cleaner API - these make the code more readable at the call site.
 * Example: getFacultyById(5) is clearer than getFaculty(5, 'id')
 */
const getFacultyById = (facultyId) => getFaculty(facultyId, 'id');
const getFacultyBySlug = (facultySlug) => getFaculty(facultySlug, 'slug');

export { getGamesByUser };
