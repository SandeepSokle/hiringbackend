const userModel = require("../Models/UserModel")
exports.createSuperAdmin = async (req, res, next) => {
    try {
        const { name, lastName, email, password, role, phoneNumber } = req.body;
        await userModel.create({
            name,
            lastName,
            email,
            password,
            role,
            phoneNumber
        })

        res.status(200).json({
            message: "Admin Created Successfully",
            success: true,
            status: 200
        })

    }
    catch (err) {

    }
}