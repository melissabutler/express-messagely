const express = require("express")
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensureLoggedIn, async(req, res, next) => {
    try {const username = req.user.username;
    let msg = await Message.get(req.params.id);
    if (msg.to_user.username !== username && msg.from_user.username !== username){
        throw new ExpressError('Cannot read this message', 401)
    }
    return res.json({message});
} catch(e){
    return next(e);
}
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async(res, req, next) => {
    try {
        let msg = await Message.create({
            from_username: req.user.username,
            to_username: req.params.to_username,
            body: req.body
        })
        return res.json({message: msg})
    } catch(e) {
        return next(e);
    }
})
/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read', ensureLoggedIn, async(req, res, next) =>{
    try {
        let username = req.user.username;
        let msg = await Message.get(req.params.id);
        
        if(msg.to_user.username !== username){
            throw new ExpressError("Cannot set this message to read", 401)
        }
        let message = await Message.markRead(req.params.id);
        return res.json({message})
    } catch(e){
        return next(e);
    }
})

module.exports = router;