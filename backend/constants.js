// Application constants and configuration
export const CONFIG = {
    // Server configuration
    DEFAULT_HOST: 'localhost',
    DEFAULT_PORT: 3000,
    
    // Database configuration
    DATABASE_FILE: 'sqlite3.db',
    
    // WebSocket configuration
    WS_PATH: '/api',
    
    // API endpoints
    ENDPOINTS: {
        USERS: '/users',
        POLLS: '/polls',
        VOTES: '/votes',
        ANSWERS: '/answers'
    },
    
    // HTTP status codes
    STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_ERROR: 500
    },
    
    // WebSocket commands
    WS_COMMANDS: {
        POLL_CREATED: 'pollCreated',
        POLL_DELETED: 'pollDeleted',
        ANSWER_CREATED: 'answerCreated',
        ADD_VOTE: 'addVote',
        DELETE_VOTE: 'deleteVote',
        SET_VOTE_ADD: 'setVoteAdd',
        SET_VOTE_DELETE: 'setVoteDelete'
    },
    
    // Validation
    VALIDATION: {
        MIN_USERNAME_LENGTH: 1,
        MAX_USERNAME_LENGTH: 50,
        MIN_QUESTION_LENGTH: 1,
        MAX_QUESTION_LENGTH: 200,
        MIN_ANSWER_LENGTH: 1,
        MAX_ANSWER_LENGTH: 100
    }
};
