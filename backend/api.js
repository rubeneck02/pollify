"use strict";

import {webSocketServer} from './index.js';
import {Router} from 'express';
import { db } from './index.js';
import { CONFIG } from './constants.js';


export const router = Router();

let connectionCount = 0;

// users
router.get("/users", function(req, res) {
    res.json(db.prepare('select * from users').all());
});

// all ipv get
router.get("/users/:name", function(req, res) {
    let name = req.params.name;
    let item = db.prepare('select * from users where name=?').get(name)
    if(!item){
        item = []
    }
    res.json(item);
});


router.post("/users", function(req, res) {
    let name = req.body.name;
    
    if (!name || name.trim() === '' || name.trim().length < CONFIG.VALIDATION.MIN_USERNAME_LENGTH || name.trim().length > CONFIG.VALIDATION.MAX_USERNAME_LENGTH) {
        return res.status(CONFIG.STATUS.BAD_REQUEST).json({error: 'Username is required and must be between 1 and 50 characters'});
    }

    try {
        let info = db.prepare('insert into users(name) values(?)').run(name.trim());
        let id = info.lastInsertRowid;
        return res.status(CONFIG.STATUS.CREATED).json({'id': id});
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(CONFIG.STATUS.CONFLICT).json({error: 'Username already exists'});
        }
        return res.status(CONFIG.STATUS.INTERNAL_ERROR).json({error: 'Failed to create user'});
    }
});

// polls
router.get("/polls", function(req, res) {
    res.json(db.prepare('select * from polls').all());
});

// votes for entire poll: returns answers with their votes
router.get("/polls/:pollId/votes", function(req, res) {
    let pollId = req.params.pollId;
    const answers = db.prepare('select id, pollId, answer from answers where pollId=?').all(pollId);
    const votesByAnswer = db.prepare('select answerId, userId from votes where answerId in (select id from answers where pollId=?)').all(pollId);
    const votesMap = new Map();
    for (const v of votesByAnswer) {
        if (!votesMap.has(v.answerId)) votesMap.set(v.answerId, []);
        votesMap.get(v.answerId).push({ userId: v.userId });
    }
    const result = answers.map(a => ({ ...a, votes: votesMap.get(a.id) || [] }));
    res.json(result);
});

router.post("/polls", function(req, res) {
    let userId = req.body.userId;
    let question = req.body.question
    let info = db.prepare('insert into polls(userId, question) values(?,?)').run(userId, question);
    let id = info.lastInsertRowid;
    // broadcast to all websocket clients
    try {
            webSocketServer.clients.forEach(function each(client) {
                if (client && client.readyState === 1) {
                client.send(JSON.stringify({command: CONFIG.WS_COMMANDS.POLL_CREATED, value: {id, userId, question}}));
            }
        });
    } catch (e) {
        console.error('WS broadcast pollCreated failed', e);
    }
    return res.status(201).json({id});}
);

router.delete("/polls/:pollId", function(req, res) {
    let pollId = req.params.pollId;

    let info = db.prepare('DELETE FROM polls WHERE id = ?').run(pollId);
    if (!info.changes) {
        return res.status(404).json({ error: "No such poll" });
    }

    let answerIds = db.prepare('select id FROM answers WHERE pollId = ?').all(pollId);
    db.prepare('DELETE FROM answers WHERE pollId = ?').run(pollId);

    for(const answer of answerIds){
        db.prepare('DELETE FROM votes WHERE answerId = ?').run(answer.id);
    }
    // broadcast deletion to all websocket clients
    try {
        webSocketServer.clients.forEach(function each(client) {
            if (client && client.readyState === 1) {
                client.send(JSON.stringify({command: CONFIG.WS_COMMANDS.POLL_DELETED, value: {id: Number(pollId)}}));
            }
        });
    } catch (e) {
        console.error('WS broadcast pollDeleted failed', e);
    }
    res.json({});
});

// answers
router.get("/polls/:pollId/answers", function(req, res) {
    let pollId = req.params.pollId
    res.json(db.prepare('select * from answers where pollId=?').all(pollId));
});

router.post("/polls/:pollId/answers", function(req, res) {
    let pollId = req.params.pollId;
    let answer = req.body.answer
    let info = db.prepare('insert into answers(pollId, answer) values(?,?)').run(pollId, answer);
    let id = info.lastInsertRowid;
    // broadcast new answer for this poll (also include initial votes: empty)
    try {
        webSocketServer.clients.forEach(function each(client) {
            if (client && client.readyState === 1) {
                client.send(JSON.stringify({command: CONFIG.WS_COMMANDS.ANSWER_CREATED, value: {id: Number(id), pollId: Number(pollId), answer, votes: []}}));
            }
        });
    } catch (e) {
        console.error('WS broadcast answerCreated failed', e);
    }
    return res.status(201).json({id});}
);

// votes
router.get("/answer/:answerId/votes", function(req, res) {
    let answerId = req.params.answerId
    res.json(db.prepare('select * from votes where answerId=?').all(answerId));
});

// usernames from vote
router.get("/answer/:answerId/votes/names", function(req, res) {
    let answerId = req.params.answerId;

    const query = `
        SELECT name, votes.answerId as answerId
        FROM users
        INNER JOIN votes ON votes.userId = users.id 
        WHERE votes.answerId = ?
    `;

    const votesWithNames = db.prepare(query).all(answerId);
    res.json(votesWithNames);
});

// see if user has voted on answer
router.get("/answer/:answerId/votes/:userId", function(req, res) {
    let answerId = req.params.answerId
    let userId = req.params.userId

    res.json(db.prepare('select * from votes where answerId=? and userId=?').all(answerId, userId));
});
router.post("/answer/:answerId/votes", function(req, res) {
    let answerId = req.params.answerId
    let userId = req.body.userId
    let info = db.prepare('insert into votes(answerId, userId) values(?,?)').run(answerId, userId);
    let id = info.lastInsertRowid;
    return res.status(201).json({id});}
);

router.delete("/answer/:answerId/votes/:userId", function(req, res) {
    let info = db.prepare('delete from votes where answerId=? and userId=?').run(req.params.answerId, req.params.userId);
    if (!info.changes) {
        return res.status(404).json({error: "No such vote"});
    }
    return res.status(200).json({})
});

let votes;

// Handle WebSocket connections
webSocketServer.on('connection', (webSocket, req) => {
    // Assign an id to keep track of WebSockets for logging purposes
    webSocket.id = ++connectionCount;

    console.log('Incoming WebSocket connection', webSocket.id);

    // Handle incoming messages on this WebSocket connection
    webSocket.on('message', (data) => {
        data = JSON.parse(data);
        console.log('Incoming WebSocket data', data, 'from', webSocket.id);
        if (data.command === CONFIG.WS_COMMANDS.ADD_VOTE) {
            let vote = data.value
            webSocketServer.clients.forEach(function each(client) {
                if (client !== webSocket && client.readyState === client.OPEN) {
                    client.send(JSON.stringify({command: CONFIG.WS_COMMANDS.SET_VOTE_ADD, value: vote}));
                }
            });
        } 
        
        else if (data.command === CONFIG.WS_COMMANDS.DELETE_VOTE) {
            let vote = data.value
            webSocketServer.clients.forEach(function each(client) {
                if (client !== webSocket && client.readyState === client.OPEN) {
                    client.send(JSON.stringify({command: CONFIG.WS_COMMANDS.SET_VOTE_DELETE, value: vote}));
                }
            });
        }else {
            console.log("Invalid command", data);
        }
    });
});
