const express=require('express')
const { protect } = require('../Middleware/AuthWare')
const { sendMesage, allMessages } = require('../Controllers/MessageControllers')

const messageRouter=express.Router()
messageRouter.route('/').post(protect,sendMesage)
messageRouter.route('/:chatId').get(protect,allMessages)
module.exports=messageRouter