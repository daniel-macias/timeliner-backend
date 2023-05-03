const mongoose = require('mongoose');

const HttpError = require('../model/http-error');
const Timeline = require('../model/Timeline');
const User = require('../model/authModel');

//Get a Timeline by ID
const getTimelineById = async (req, res, next) => {
  const timelineId = req.params.nid;

  let timeline;
  console.log(timelineId);
  try {
    timeline = await Timeline.findById(timelineId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a timeline.',
      500
    );
    return next(error);
  }

  if (!timeline) {
    const error = new HttpError(
      'Could not find timeline for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ timeline: timeline.toObject({ getters: true }) });
};

//Find Timeline based on the user id
const getTimelinesByUserId = async (req, res, next) => {
  const userId = req.userData.userId;
  
  let userWithTimelines;
  try {
    userWithTimelines = await User.findById(userId).populate('timelines');
    console.log("AAAA", userWithTimelines);
  } catch (err) {
    const error = new HttpError(
      'Fetching timelines failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!userWithTimelines || userWithTimelines.timelines.length === 0) {
    return next(
      new HttpError('Could not find timelines for the provided user id.', 404)
    );
  }

  res.json({
    timelines: userWithTimelines.timelines.map(timeline =>
      timeline.toObject({ getters: true })
    )
  });
};




// Create a Timeline
const createTimeline = async (req, res, next) => {

  const { name, description, userId } = req.body;
 
  console.log("----------------------------------------------------------");
  console.log(req);
  console.log("----------------------------------------------------------");

  const createdTimeline = new Timeline({
    name,
    description,
    creator: userId
  });

  let user;
  try {
    user = await User.findById(userId);
    
  } catch (err) {
    const error = new HttpError(
      'Creating timeline failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdTimeline.save({ session: sess });
    user.timelines.push(createdTimeline);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating timeline failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ timeline: createdTimeline });
};

//Updates a Timeline
const updateTimeline = async (req, res, next) => {

  const { title, body } = req.body;
  const timelineId = req.params.nid;

  let timeline;
  try {
    timeline = await Timeline.findById(timelineId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update timeline.',
      500
    );
    return next(error);
  }

  if (timeline.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this timeline.', 401);
    return next(error);
  }

  timeline.title = title;
  timeline.body = body;

  try {
    await timeline.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update timeline.',
      500
    );
    return next(error);
  }

  res.status(200).json({ timeline: timeline.toObject({ getters: true }) });
};

//Deletes a Timeline
const deleteTimeline = async (req, res, next) => {
  const timelineId = req.params.nid;

  let timeline;
  try {
    timeline = await Timeline.findById(timelineId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete timeline.',
      500
    );
    return next(error);
  }

  if (!timeline) {
    const error = new HttpError('Could not find timeline for this id.', 404);
    return next(error);
  }

  if (timeline.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this timeline.',
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    console.log("AAAA", timeline.creator);
    console.log("xd");
    await timeline.remove({ session: sess });
    console.log("jajaja");
    timeline.creator.timelines.pull(timeline);
    console.log("BBBBBBB", timeline.creator);
    await timeline.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete timeline.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted timeline.' });
};

exports.getTimelineById = getTimelineById;
exports.createTimeline = createTimeline;
exports.getTimelinesByUserId = getTimelinesByUserId;
exports.updateTimeline = updateTimeline;
exports.deleteTimeline = deleteTimeline;
