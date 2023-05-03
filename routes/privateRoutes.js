const express = require('express');
//const { getPrivateData } = require('../controllers/private'); //Aqui luego hay que cambiarlo por el home
const timelineController = require('../controllers/timeline-controller');
const { checkUser } = require("../middlewares/authMiddleware");

//const checkAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(checkUser);

//router.get("/", getPrivateData); //Esto solo se agrega para tener algo que mostrar en el path de / en el get

router.get('/timelines/:nid', timelineController.getTimelineById);

router.get('/user/', timelineController.getTimelinesByUserId);

router.route("/timelines").post(timelineController.createTimeline);

router.route("/timelines/:nid").patch(timelineController.updateTimeline);
  
router.delete('/timelines/:nid', timelineController.deleteTimeline);


module.exports = router;
