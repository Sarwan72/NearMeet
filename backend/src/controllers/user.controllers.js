import User from "../models/User.js";



export async function updateUserProfile(req, res) {
    try {
        const userId = req.user.id;
        const { fullName, bio, profilePic } = req.body;

        const updateData = {};
        
        if (fullName) updateData.fullName = fullName;
        if (bio !== undefined) updateData.bio = bio;
        if (profilePic !== undefined) updateData.profilePic = profilePic;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error in updateUserProfile controller:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error in changePassword controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}



export async function deleteUserAccount(req, res) {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

     
        // Remove user from friends' friends list
        await User.updateMany(
            { friends: userId },
            { $pull: { friends: userId } }
        );

        // Finally, delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUserAccount controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


