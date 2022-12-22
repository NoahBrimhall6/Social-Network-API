const router = require('express').Router();
const { Thought, Reaction, User } = require('../../models');

// Get all thoughts, Post a thought
router.route('/')
  .get((req, res) => {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  })
  .post((req, res) => {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { username: req.body.username },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => 
        !user
          ? res.status(404).json( { message: 'Thought created, but found no user with that username'} )
          : res.json('Created the thought!')
      )
      .catch((err) => res.status(500).json(err));
  });

// Get a single thought, Update a thought, Remove a thought
router.route('/:thoughtId')
  .get((req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) => 
      !thought
        ? res.status(404).json({ message: 'No thought found wiht that ID' })
        : res.json(thought)
      )
      .catch((err) => res.status(500).json(err))
  })
  .put((req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then((thought) => {
      !thought
        ? res.status(404).json({ message: 'No thought with this ID' })
        : res.json(thought)
    })
    .catch((err) => res.status(500).json(err));
  })
  .delete((req, res) => {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) => 
        !thought
          ? res.status(404).json({ message: 'No thought found with this ID' })
          : User.findOneAndUpdate(
              { username: req.body.username },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) => 
        !user
          ? res.status(404).json({ message: 'Thought deleted but no user was found with that username'})
          : res.json({ message: 'Thought successfully deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  });

// Create a reaction for a thought
router.route('/:thoughtId/reactions')
  .post((req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought found with this ID'})
        : res.json(thought)
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  });

// Remove a reactions from a thought
router.route('/:thoughtId/reactions/:reactionId')
  .delete((req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
    )
    .then((thought) => 
      !thought
        ? res.status(404).json({ message: 'No thought found with that ID'})
        : res.json(thought)
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  });

  module.exports = router;