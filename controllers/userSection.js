const User = require("../models/UserModel")
const nodemailer = require("nodemailer");


/* GET /api/v1/users/:id
* PATCH /api/v1/users/:id
* DELETE /api/v1/users/:id
* GET /api/v1/admin/users
*/


const getSingleUser = async (req,res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};



const updateUser = async (req, res) => {
  const { fullname, email } = req.body;

  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fullname immediately
    if (fullname) {
      user.fullname = fullname;
    }

    // If user is trying to change email
    if (email && email !== user.email) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      user.resetCode = code;
      user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      user.pendingEmail = email; // temporary until verified
      await user.save();

      // Send verification code to new email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Change Verification",
        text: `Your verification code for changing your email is ${code}. It expires in 10 minutes.`,
      });

      return res
        .status(200)
        .json({ message: "Verification code sent to new email" });
    }

    // If only fullname was updated
    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


///  verifying change of email from updateUser endpoint
const verifyEmailChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if code matches and not expired
    if (
      user.resetCode !== code ||
      !user.resetCodeExpiry ||
      user.resetCodeExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }


    /// validation for correct id
    if (req.user.id !== id && !req.user.is_admin) {
        return res.status(403).json({ message: "Unauthorized to modify this user" })}


    // Apply the pending email
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Email updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteUser = async (req,res) => {
    const { id } = req.params
    const user = User.findOneAndDelete(id)
    try {
        if (req.user.id !== id && !req.user.is_admin) {
            return res.status(403).json({ message: "Unauthorized to modify this user" })}

        if (!user){
            return res.status(403).json({
                message: "Invalid token"
            })}

        return res.status(200).json({
            message : "User successfully deleted!",
            user: user
        })
    }catch(err){
        res.status(500).json({
            message: "Server error", 
            error : error.message
        })
    }
}


const getAllUsers = async (req,res) => {
  try{
    const users = await User.find().select("fullname email")
    return res.status(200).json({
      message : "List of all the users",
      users: users
    })
  }catch(err){
    res.status(500).json({
    message: "Server error", 
    error : error.message
  })}
}

module.exports = { getSingleUser, updateUser, verifyEmailChange, deleteUser, getAllUsers};


