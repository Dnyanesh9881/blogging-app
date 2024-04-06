const FollowSchema = require("../Schemas/FollowSchema");
const UserSchema = require("../Schemas/UserSchema");
const { LIMIT } = require("../constants");

const followUser = ({ followingUserId, followerUserId }) => {
  return new Promise(async (resolve, reject) => {
    const followObj = new FollowSchema({
      followerUserId,
      followingUserId,
      createDateTime: Date.now(),
    });
    try {
      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowerList = ({ followingUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await FollowSchema.aggregate([
        {
          $match: { followingUserId: followingUserId },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      //populate
      //   const followerUserDetail = await FollowSchema.find({
      //     followingUserId,
      //   }).populate("followerUserId");
      const follerUserIdList = [];
      followDb[0].data.map((user) => {
        follerUserIdList.push(user.followerUserId);
      });
      const followersDetails = await UserSchema.find({
        _id: { $in: follerUserIdList },
      });
      resolve(followersDetails.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowingList = ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await FollowSchema.aggregate([
        {
          $match: { followerUserId },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      //POPULATE
      //   const followingUserDetails = await FollowSchema.find({
      //     followerUserId,
      //   }).populate("followingUserId");

      const followingUserIdList = followDb[0].data.map(
        (user) => user.followingUserId
      );

      const followingUserDetails = await UserSchema.find({
        _id: { $in: followingUserIdList },
      });

      resolve(followingUserDetails);
    } catch (error) {
      reject(error);
    }
  });
};

const unfollowUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const unfollowDb = await FollowSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });
      resolve(unfollowDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { followUser, getFollowerList, getFollowingList, unfollowUser };
