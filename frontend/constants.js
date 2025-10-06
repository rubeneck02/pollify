// Frontend constants
export const CONFIG = {
    // WebSocket configuration
    WS_PATH: '/api',
    
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
    
    // API endpoints
    ENDPOINTS: {
        USERS: '/api/users',
        POLLS: '/api/polls',
        VOTES: '/api/votes',
        ANSWERS: '/api/answers'
    },
    
    // Local storage keys
    STORAGE: {
        USER_NAME: 'name',
        USER_ID: 'id'
    },
    
    // UI constants
    UI: {
        DEBOUNCE_DELAY: 300,
        WEBSOCKET_RECONNECT_DELAY: 1000,
        POLL_UPDATE_DELAY: 1000
    }
};
