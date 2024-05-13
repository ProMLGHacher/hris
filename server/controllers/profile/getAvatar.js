import path from 'path'

// получить аватар пользователя
export const getAvatar = (req, res) => {
    const filename = req.params.filename;
    const avatarPath = path.join(process.cwd(), '/uploads/avatars/', filename); // Assuming avatars are stored in the 'uploads/avatars' directory

    // Send the avatar file
    res.sendFile(avatarPath);
}