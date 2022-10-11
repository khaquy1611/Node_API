exports.sanitizeUser = (user) => ({
        id: user._id,
        username: user.username,
        fullName: user.fullName
    });