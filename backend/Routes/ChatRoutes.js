const express=require('express');

const { protect } = require('../Middleware/AuthWare');
const { accessChats, fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup } = require('../Controllers/ChatControllers');

const chatRouter=express.Router();
chatRouter.route('/').post(protect,accessChats)
.get(protect,fetchChats);
chatRouter.post("/group",protect,createGroup)
chatRouter.put("/rename",protect,renameGroup)
chatRouter.put("/addToGrpup",protect,addToGroup)
chatRouter.put("/groupRemove",protect,removeFromGroup)
module.exports=chatRouter