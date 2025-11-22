import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import razorpay from 'razorpay';
import transactionModel from "../models/transactionModel.js";

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      creditBalance: 50,   // Default credits
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        creditBalance: user.creditBalance,
      }
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        creditBalance: user.creditBalance,  // FIX added
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// GET USER CREDITS
const userCredits = async (req, res) => {
  try {
    const userId = req.userId;   // ⭐ FIXED — was req.body.userId

    if (!userId) {
      return res.json({ success: false, message: "User ID missing" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      credits: user.creditBalance,
      user: {
        _id: user._id,
        name: user.name,
      }
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// RAZORPAY INSTANCE
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// PAYMENT (CREATE ORDER)
const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    let credits, plan, amount;

    switch (planId) {
      case 'Basic':
        plan = 'Basic';
        credits = 100;
        amount = 10;
        break;
      case 'Advanced':
        plan = 'Advanced';
        credits = 500;
        amount = 50;
        break;
      case 'Business':
        plan = 'Business';
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: 'Plan not found' });
    }

    const date = Date.now();

    const transactionData = { userId, plan, amount, credits, date };

    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// VERIFY PAYMENT
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status !== "paid") {
      return res.json({ success: false, message: "Payment Failed" });
    }

    const transactionData = await transactionModel.findById(orderInfo.receipt);

    if (transactionData.payment) {
      return res.json({ success: false, message: "Payment Already Processed" });
    }

    const userData = await userModel.findById(transactionData.userId);

    const updatedCredits = userData.creditBalance + transactionData.credits;

    await userModel.findByIdAndUpdate(userData._id, { creditBalance: updatedCredits });

    await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

    return res.json({ success: true, message: "Credits Added" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyRazorpay
};
