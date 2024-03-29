const { User, Thought } = require("../models");

module.exports = {
  // Get All Users - GET
  async getUsers(req, res) {
    try {
      const users = await User.find().populate("thoughts").populate("friends");
      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Get Single User - GET
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .populate("friends");
      if (!user) {
        return res.status(404).json({ message: "No User Found!" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Create User - POST
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  // Update User - PUT
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: "No User Found!" });
      }
      res.json(User);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Delete User - DELETE
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        res.status(404).json({ message: "No User Found!" });
      }

      // Delete User's Thoughts When User Deleted
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and Their Thoughts Thrown Into the Abyss!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $addToSet: {
            friends: req.params.friendId,
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async removeFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $pull: {
            friends: req.params.friendId,
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
