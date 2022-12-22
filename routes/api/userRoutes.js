const router = require('express').Router();
const { User } = require('../../models');

// Get all users, Post a new user
router.route('/')
  .get((req, res) => {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  })
  .post((req, res) => {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  });

// Get a single user, Update a user, Delete a user
router.route('/:userId')
  .get((req, res) => {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  })
  .put((req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true }
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user))
    .catch((err) => res.status(500).json(err));
  })
  .delete((req, res) => {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => 
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  });

// Add and delete a friend from a user's friend list
router.route('/:userId/friends/:friendId')
  .post((req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user))
    .catch((err) => res.status(500).json(err));
  })
  .delete((req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user))
    .catch((err) => res.status(500).json(err));
  });

module.exports = router;